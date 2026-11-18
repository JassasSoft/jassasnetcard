import { NextResponse } from 'next/server'
import { createClient as createUserClient } from '@/lib/supabase/server'
import { getSupabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 30

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  })
}

export async function GET(request: Request) {
  try {
    const userClient = await createUserClient()
    const { data: { user }, error: authError } = await userClient.auth.getUser()

    if (authError || !user) {
      return jsonResponse({ success: false, message: 'يرجى تسجيل الدخول أولاً.' }, 401)
    }

    const url = new URL(request.url)
    const requestedPage = Number(url.searchParams.get('page') || '1')
    const page = Number.isSafeInteger(requestedPage)
      ? Math.min(1_000_000, Math.max(1, requestedPage))
      : 1
    const search = (url.searchParams.get('q') || '').replace(/[^0-9]/g, '').slice(0, 32)
    // A dedicated server-only client is used. Every query is still scoped to the
    // authenticated user's UUID; never accept a user_id from the browser.
    const supabase = getSupabaseServer()
    let countQuery = supabase
      .from('printed_cards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    if (search) countQuery = countQuery.ilike('card_code', `%${search}%`)

    const { count, error: countError } = await countQuery
    if (countError) {
      console.error('Card vault count query failed:', countError.code)
      return jsonResponse({ success: false, message: 'تعذر تحميل عدد الكروت المحفوظة.' }, 500)
    }

    const total = count ?? 0
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const from = (safePage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let cardsQuery = supabase
      .from('printed_cards')
      .select('id,card_code,card_value,duration,printed_at,batch_id')
      .eq('user_id', user.id)
      .order('printed_at', { ascending: false })
      .range(from, to)
    if (search) cardsQuery = cardsQuery.ilike('card_code', `%${search}%`)

    const { data, error } = await cardsQuery
    if (error) {
      console.error('Card vault query failed:', error.code)
      return jsonResponse({ success: false, message: 'تعذر تحميل محفوظات الكروت.' }, 500)
    }

    return jsonResponse({
      success: true,
      cards: data ?? [],
      pagination: {
        page: safePage,
        page_size: PAGE_SIZE,
        total,
        total_pages: totalPages,
      },
    })
  } catch (error) {
    console.error('Card vault API error:', error instanceof Error ? error.message : 'unknown')
    return jsonResponse({ success: false, message: 'حدث خطأ أثناء تحميل محفوظات الكروت.' }, 500)
  }
}
