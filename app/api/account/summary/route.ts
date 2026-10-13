import { NextResponse } from 'next/server'
import { createClient as createUserClient } from '@/lib/supabase/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const userClient = await createUserClient()
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'يرجى تسجيل الدخول أولًا.' },
        {
          status: 401,
          headers: { 'Cache-Control': 'private, no-store' },
        }
      )
    }

    const { data: subscriptions, error: subscriptionError } =
      await supabaseServer
        .from('subscriptions')
        .select(
          'plan_type,status,cards_remaining,total_cards_printed,start_date,end_date,created_at'
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

    if (subscriptionError) {
      console.error(
        'Account summary subscription query failed:',
        subscriptionError.code
      )

      return NextResponse.json(
        { success: false, message: 'تعذر تحميل بيانات الاشتراك.' },
        {
          status: 500,
          headers: { 'Cache-Control': 'private, no-store' },
        }
      )
    }

    const subscription = subscriptions?.[0]

    if (!subscription) {
      return NextResponse.json(
        { success: false, message: 'لا يوجد اشتراك مرتبط بهذا الحساب.' },
        {
          status: 404,
          headers: { 'Cache-Control': 'private, no-store' },
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email ?? '',
          fullName:
            user.user_metadata?.full_name ||
            user.email?.split('@')[0] ||
            'المستخدم',
        },
        subscription,
      },
      {
        headers: { 'Cache-Control': 'private, no-store' },
      }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ داخلي أثناء تحميل الحساب.' },
      {
        status: 500,
        headers: { 'Cache-Control': 'private, no-store' },
      }
    )
  }
}
