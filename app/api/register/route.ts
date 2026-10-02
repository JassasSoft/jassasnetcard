import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'البريد وكلمة المرور مطلوبان' })
    }

    // التحقق من وجود المستخدم
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'البريد مستخدم بالفعل' })
    }

    // إنشاء المستخدم
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        full_name: fullName,
        email: email,
        phone: phone,
        password_hash: password,
        role: 'customer'
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, message: 'خطأ في إنشاء المستخدم' })
    }

    // إنشاء اشتراك تجريبي مع 500 كرت
    await supabase
      .from('subscriptions')
      .insert([{
        user_id: newUser.id,
        plan_type: 'trial',
        status: 'active',
        cards_remaining: 500,
        total_cards_printed: 0
      }])

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
        plan: 'trial',
        cardsRemaining: 500
      },
      message: 'تم التسجيل بنجاح! لديك 500 كرت مجاني'
    })

  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
