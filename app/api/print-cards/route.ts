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

export async function POST(request: Request) {
  try {
    // هوية المستخدم تأتي من جلسة Supabase، وليس من جسم الطلب.
    const userClient = await createUserClient()
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser()

    if (authError || !user) {
      return jsonResponse(
        { success: false, message: 'يرجى تسجيل الدخول أولاً.' },
        401
      )
    }

    let body: unknown

    try {
      body = await request.json()
    } catch {
      return jsonResponse(
        { success: false, message: 'صيغة الطلب غير صالحة.' },
        400
      )
    }

    if (
      !body ||
      typeof body !== 'object' ||
      !('cards' in body) ||
      !Array.isArray(body.cards)
    ) {
      return jsonResponse(
        { success: false, message: 'قائمة الكروت غير صالحة.' },
        400
      )
    }

    const rawCards = body.cards

    if (rawCards.length < 1 || rawCards.length > 10000) {
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
      if (!item || typeof item !== 'object') {
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

    // المفتاح السري يستخدم على الخادم فقط.
    // لا نقبل user_id أو device_id من المتصفح.
    const supabaseServer = getSupabaseServer()
    const { data, error } = await supabaseServer.rpc(
      'create_printed_cards_batch',
      {
        p_user_id: user.id,
        p_cards: cards,
        p_device_id: null,
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
        'عدد الكروت يجب أن يكون بين 1 و10000':
          'الكمية يجب أن تكون بين 1 و10000 كرت.',
        'جهاز MikroTik غير موجود أو لا يتبع لهذا الحساب':
          'جهاز MikroTik المحدد غير صالح.',
      }

      const safeMessage = safeMessages[error.message]

      return jsonResponse(
        {
          success: false,
          message:
            safeMessage || 'تعذر حفظ الكروت. لم يتم تأكيد نجاح العملية.',
        },
        safeMessage ? 400 : 500
      )
    }

    const result = data as {
      success?: boolean
      saved_count?: number
      cards_remaining?: number
    } | null

    if (
      !result ||
      result.success !== true ||
      result.saved_count !== cards.length
    ) {
      return jsonResponse(
        { success: false, message: 'تعذر تأكيد حفظ الدفعة.' },
        500
      )
    }

    return jsonResponse({
      success: true,
      saved_count: result.saved_count,
      cards_remaining: result.cards_remaining,
      message: 'تم حفظ الكروت وخصم الرصيد بنجاح.',
    })
  } catch {
    return jsonResponse(
      { success: false, message: 'حدث خطأ داخلي أثناء حفظ الكروت.' },
      500
    )
  }
}
