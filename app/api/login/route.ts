import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otkczodeibqlipcnvbrbz.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'جميع الحقول مطلوبة' })
    }

    // البحث عن المستخدم
    const res = await fetch(`${SUPABASE_URL}/rest/v1/users?or=(email.eq.${encodeURIComponent(username)},full_name.eq.${encodeURIComponent(username)})&select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    const users = await res.json()

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'بيانات الدخول غير صحيحة' })
    }

    const user = users[0]

    if (user.password_hash !== password) {
      return NextResponse.json({ success: false, message: 'بيانات الدخول غير صحيحة' })
    }

    // جلب الاشتراك
    const subRes = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${user.id}&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    const subscriptions = await subRes.json()
    const subscription = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        plan: subscription?.plan_type || 'trial',
        cardsRemaining: subscription?.cards_remaining || 0
      },
      message: 'تم تسجيل الدخول بنجاح'
    })

  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
