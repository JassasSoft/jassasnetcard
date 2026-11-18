import { NextResponse } from 'next/server'
import { createClient as createUserClient } from '@/lib/supabase/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  })
}

async function getAuthenticatedUser() {
  const userClient = await createUserClient()
  const { data: { user }, error } = await userClient.auth.getUser()
  if (error || !user) return null
  return user
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return jsonResponse(
        { success: false, message: 'يرجى تسجيل الدخول أولاً.' },
        401
      )
    }

    const supabase = getSupabaseServer()
    const batchId = new URL(request.url).searchParams.get('batch_id')

    if (batchId) {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(batchId)) {
        return jsonResponse(
          { success: false, message: 'معرّف الدفعة غير صالح.' },
          400
        )
      }

      const { data: batch, error: batchError } = await supabase
        .from('printed_card_batches')
        .select('id,card_count,saved_count,created_at,cards_remaining,print_snapshot')
        .eq('id', batchId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (batchError) {
        console.error('Card batch detail query failed:', batchError.code)
        return jsonResponse(
          { success: false, message: 'تعذر تحميل تفاصيل الدفعة.' },
          500
        )
      }

      if (!batch) {
        return jsonResponse(
          { success: false, message: 'الدفعة غير موجودة أو لا تملك صلاحية الوصول إليها.' },
          404
        )
      }

      return jsonResponse({ success: true, batch })
    }

    const { data, error } = await supabase
      .from('printed_card_batches')
      .select('id,card_count,saved_count,created_at,cards_remaining')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) {
      console.error('Card batch history query failed:', error.code)
      return jsonResponse(
        { success: false, message: 'تعذر تحميل سجل الدفعات.' },
        500
      )
    }

    return jsonResponse({
      success: true,
      batches: data ?? [],
    })
  } catch (error) {
    console.error('Card batch history API error:', error)
    return jsonResponse(
      { success: false, message: 'حدث خطأ أثناء تحميل سجل الدفعات.' },
      500
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return jsonResponse(
        { success: false, message: 'يرجى تسجيل الدخول أولاً.' },
        401
      )
    }

    const rawBody = await request.text()

    if (!rawBody || rawBody.length > 2_000_000) {
      return jsonResponse(
        { success: false, message: 'حجم الطلب غير صالح أو أكبر من المسموح.' },
        413
      )
    }

    let body: Record<string, unknown>

    try {
      const parsed: unknown = JSON.parse(rawBody)

      if (
        !parsed ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed)
      ) {
        throw new Error('Invalid request body')
      }

      body = parsed as Record<string, unknown>
    } catch {
      return jsonResponse(
        { success: false, message: 'صيغة الطلب غير صالحة.' },
        400
      )
    }

    const rawKey = body.idempotency_key

    if (
      typeof rawKey !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawKey)
    ) {
      return jsonResponse(
        { success: false, message: 'مفتاح الدفعة غير صالح. أنشئ دفعة جديدة.' },
        400
      )
    }

    const rawCards = body.cards

    if (!Array.isArray(rawCards) || rawCards.length < 1 || rawCards.length > 10000) {
      return jsonResponse(
        { success: false, message: 'الكمية يجب أن تكون بين 1 و10000 كرت.' },
        400
      )
    }

    const cards: Array<{
      card_code: string
      card_value: string
      duration: string
    }> = []

    const usedCodes = new Set<string>()

    for (const item of rawCards) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return jsonResponse(
          { success: false, message: 'بيانات أحد الكروت غير صالحة.' },
          400
        )
      }

      const card = item as Record<string, unknown>
      const code = card.card_code
      const value = card.card_value
      const duration = card.duration

      if (
        typeof code !== 'string' ||
        !/^[0-9]{1,32}$/.test(code) ||
        typeof value !== 'string' ||
        value.length < 1 ||
        value.length > 200 ||
        typeof duration !== 'string' ||
        duration.length < 1 ||
        duration.length > 200
      ) {
        return jsonResponse(
          { success: false, message: 'بيانات أحد الكروت غير صالحة.' },
          400
        )
      }

      if (usedCodes.has(code)) {
        return jsonResponse(
          { success: false, message: 'توجد أرقام مكررة داخل الدفعة.' },
          400
        )
      }

      usedCodes.add(code)
      cards.push({
        card_code: code,
        card_value: value,
        duration,
      })
    }

    // التحقق من نسخة التصميم
    const rawSnapshot = body.print_snapshot

    if (
      !rawSnapshot ||
      typeof rawSnapshot !== 'object' ||
      Array.isArray(rawSnapshot)
    ) {
      return jsonResponse(
        { success: false, message: 'نسخة تصميم الكروت غير موجودة.' },
        400
      )
    }

    const snapshot = rawSnapshot as Record<string, unknown>

    if (
      snapshot.version !== 1 ||
      !snapshot.template ||
      typeof snapshot.template !== 'object' ||
      Array.isArray(snapshot.template) ||
      !snapshot.settings ||
      typeof snapshot.settings !== 'object' ||
      Array.isArray(snapshot.settings) ||
      !Array.isArray(snapshot.usernames) ||
      snapshot.usernames.length !== cards.length
    ) {
      return jsonResponse(
        { success: false, message: 'بيانات نسخة التصميم غير مكتملة.' },
        400
      )
    }

    const usernames = snapshot.usernames

    for (let i = 0; i < cards.length; i++) {
      if (
        typeof usernames[i] !== 'string' ||
        usernames[i] !== cards[i].card_code
      ) {
        return jsonResponse(
          { success: false, message: 'أرقام التصميم لا تطابق أرقام الكروت.' },
          400
        )
      }
    }

    const printSnapshot = {
      version: 1,
      template: snapshot.template,
      usernames,
      settings: snapshot.settings,
    }

    if (JSON.stringify(printSnapshot).length > 524288) {
      return jsonResponse(
        { success: false, message: 'حجم نسخة التصميم أكبر من الحد المسموح.' },
        413
      )
    }

    const supabase = getSupabaseServer()

    // الحفظ والخصم وحفظ نسخة التصميم عبر الدالة الجديدة
    const { data, error } = await supabase.rpc(
      'create_printed_cards_batch',
      {
        p_user_id: user.id,
        p_cards: cards,
        p_idempotency_key: rawKey,
        p_device_id: null,
        p_print_snapshot: printSnapshot,
      }
    )

    if (error) {
      console.error('Card batch save failed:', error.code)

      if (error.code === '23505') {
        return jsonResponse(
          {
            success: false,
            message: 'بعض أرقام الكروت موجودة مسبقاً. أنشئ دفعة جديدة.',
          },
          409
        )
      }

      const safeMessages: Record<string, string> = {
        'رصيد الكروت غير كافٍ': 'رصيدك لا يكفي لهذه الكمية.',
        'لا يوجد اشتراك نشط صالح': 'لا يوجد اشتراك نشط أو أن الاشتراك منتهي.',
        'توجد أرقام مكررة داخل الدفعة': 'توجد أرقام مكررة داخل الدفعة.',
        'بيانات أحد الكروت غير صالحة': 'بيانات أحد الكروت غير صالحة.',
        'عدد الكروت يجب أن يكون بين 1 و10000': 'الكمية يجب أن تكون بين 1 و10000 كرت.',
        'مفتاح الدفعة مستخدم مع بيانات مختلفة': 'مفتاح الدفعة مرتبط ببيانات مختلفة.',
        'مفتاح الدفعة مرتبط بتصميم مختلف': 'مفتاح الدفعة مرتبط بتصميم مختلف.',
        'نسخة تصميم الكروت غير صالحة': 'نسخة تصميم الكروت غير صالحة.',
        'عدد أرقام التصميم لا يطابق عدد الكروت': 'عدد أرقام التصميم لا يطابق عدد الكروت.',
        'أرقام التصميم لا تطابق أرقام الكروت': 'أرقام التصميم لا تطابق أرقام الكروت.',
        'حجم نسخة التصميم أكبر من الحد المسموح': 'حجم التصميم أكبر من الحد المسموح.',
      }

      const safeMessage = safeMessages[error.message]

      return jsonResponse(
        {
          success: false,
          message: safeMessage || 'تعذر حفظ الكروت. لم يتم تأكيد نجاح العملية.',
        },
        error.message.includes('مختلف')
          ? 409
          : safeMessage
            ? 400
            : 500
      )
    }

    const result = data as {
      success?: boolean
      saved_count?: number
      cards_remaining?: number
      batch_id?: string
      replayed?: boolean
    } | null

    if (
      !result ||
      result.success !== true ||
      result.saved_count !== cards.length ||
      typeof result.batch_id !== 'string'
    ) {
      return jsonResponse(
        { success: false, message: 'تعذر تأكيد حفظ الدفعة.' },
        500
      )
    }

    const cardsRemaining =
      result.cards_remaining !== null &&
      result.cards_remaining !== undefined &&
      Number.isFinite(Number(result.cards_remaining))
        ? Number(result.cards_remaining)
        : null

    return jsonResponse({
      success: true,
      saved_count: result.saved_count,
      cards_remaining: cardsRemaining,
      batch_id: result.batch_id,
      replayed: result.replayed === true,
      message: result.replayed
        ? 'تم تأكيد الدفعة المحفوظة سابقاً دون خصم جديد.'
        : 'تم حفظ الكروت والتصميم وخصم الرصيد بنجاح.',
    })
  } catch (error) {
    console.error('Unexpected card batch API error:', error)

    return jsonResponse(
      { success: false, message: 'حدث خطأ داخلي أثناء حفظ الكروت.' },
      500
    )
  }
}
