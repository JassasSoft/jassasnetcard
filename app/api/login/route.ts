import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'جميع الحقول مطلوبة' })
    }

    // البحث عن المستخدم
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', username)
      .single()

    if (error || !user) {
      return NextResponse.json({ success: false, message: 'بيانات الدخول غير صحيحة' })
    }

    // التحقق من كلمة المرور
    if (user.password_hash !== password) {
      return NextResponse.json({ success: false, message: 'بيانات الدخول غير صحيحة' })
    }

    // جلب الاشتراك
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

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
