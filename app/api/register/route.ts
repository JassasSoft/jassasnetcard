import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// استخدم الـ URL اللي فيه n واحدة (زي المفتاح)
const SUPABASE_URL = 'https://otkczodeibqlipcnvqs.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90a2N6b2RlaWJxbGlwY25udnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MDA5NDQsImV4cCI6MjEwNjI3Njk0NH0.9mZswsFjdsb6yCv5tk2UuLejJVpJZoggw1ydGHlN6z8'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'البريد وكلمة المرور مطلوبان' })
    }

    console.log('🔑 Starting registration for:', email)
    console.log(' Using URL:', SUPABASE_URL)
    console.log('🔑 Key length:', SUPABASE_KEY.length)

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (checkError) {
      console.error('❌ Check error:', checkError)
      return NextResponse.json({ success: false, message: 'خطأ: ' + checkError.message })
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ success: false, message: 'البريد مستخدم بالفعل' })
    }

    console.log('✅ No existing user found, creating new user...')

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
      console.error('❌ Insert error:', insertError)
      return NextResponse.json({ success: false, message: 'خطأ: ' + insertError.message })
    }

    console.log('✅ User created successfully:', newUser.id)

    const { error: subError } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: newUser.id,
        plan_type: 'trial',
        status: 'active',
        cards_remaining: 500,
        total_cards_printed: 0
      }])

    if (subError) {
      console.error('️ Subscription error:', subError)
    } else {
      console.log('✅ Subscription created successfully')
    }

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
    console.error('❌ Registration error:', error)
    return NextResponse.json({ success: false, message: 'خطأ: ' + error.message }, { status: 500 })
  }
}
