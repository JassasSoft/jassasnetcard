import { NextResponse } from 'next/server'

// المفاتيح مكتوبة مباشرة - لا تعتمد على environment variables
const SUPABASE_URL = 'https://otkczodeibqlipcnvbrbz.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90a2N6b2RlaWJxbGlwY25udnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MDA5NDQsImV4cCI6MjEwNjI3Njk0NH0.9mZswsFjdsb6yCv5tk2UuLejJVpJZoggw1ydGHlN6z8'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'البريد وكلمة المرور مطلوبان' })
    }

    console.log('🔑 Using Supabase URL:', SUPABASE_URL)
    console.log('🔑 Key length:', SUPABASE_KEY.length)

    // التحقق من وجود المستخدم
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    const existingUsers = await checkRes.json()

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ success: false, message: 'البريد مستخدم بالفعل' })
    }

    // إنشاء المستخدم
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        phone: phone || '',
        password_hash: password,
        role: 'customer'
      })
    })

    if (!insertRes.ok) {
      const err = await insertRes.text()
      console.error('Insert error:', err)
      return NextResponse.json({ success: false, message: 'خطأ في إنشاء المستخدم: ' + err })
    }

    const newUser = (await insertRes.json())[0]
    console.log('✅ User created:', newUser.id)

    // إنشاء الاشتراك
    const subRes = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: newUser.id,
        plan_type: 'trial',
        status: 'active',
        cards_remaining: 500,
        total_cards_printed: 0
      })
    })

    if (!subRes.ok) {
      console.error('Subscription error:', await subRes.text())
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
    console.error('Registration error:', error)
    return NextResponse.json({ success: false, message: 'خطأ في الخادم: ' + error }, { status: 500 })
  }
}
