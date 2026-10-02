import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://otkczodeibqlipcnvqs.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90a2N6b2RlaWJxbGlwY25udnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MDA5NDQsImV4cCI6MjEwNjI3Njk0NH0.9mZswsFjdsb6yCv5tk2UuLejJVpJZoggw1ydGHlN6z8'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'البريد وكلمة المرور مطلوبان' }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    // التحقق من وجود المستخدم
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (checkError) {
      return NextResponse.json({ success: false, message: 'خطأ: ' + checkError.message }, { status: 500 })
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ success: false, message: 'البريد مستخدم بالفعل' })
    }

    // إنشاء المستخدم
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        full_name: fullName,
        email: email,
        phone: phone || '',
        password_hash: password,
        role: 'customer'
      }])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ success: false, message: 'خطأ: ' + insertError.message }, { status: 500 })
    }

    // إنشاء الاشتراك
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
    return NextResponse.json({ success: false, message: 'خطأ: ' + error.message }, { status: 500 })
  }
}
