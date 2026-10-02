import { NextResponse } from 'next/server'

const SUPABASE_URL = 'https://otkczodeibqlipcnvqs.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90a2N6b2RlaWJxbGlwY25udnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MDA5NDQsImV4cCI6MjEwNjI3Njk0NH0.9mZswsFjdsb6yCv5tk2UuLejJVpJZoggw1ydGHlN6z8'

export async function POST(request: Request) {
  console.log(' Registration attempt started')
  console.log(' Supabase URL:', SUPABASE_URL)
  console.log('🔑 Key length:', SUPABASE_KEY ? SUPABASE_KEY.length : 'undefined')
  
  try {
    const body = await request.json()
    console.log('📦 Request body:', body)
    
    const { fullName, email, phone, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'البريد وكلمة المرور مطلوبان' }, { status: 400 })
    }

    // اختبار الاتصال بـ Supabase
    console.log('🌐 Testing connection to Supabase...')
    
    const testUrl = `${SUPABASE_URL}/rest/v1/users?select=count&limit=1`
    console.log('📡 Testing URL:', testUrl)
    
    const testRes = await fetch(testUrl, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📊 Test response status:', testRes.status)
    console.log('📊 Test response OK:', testRes.ok)
    
    if (!testRes.ok) {
      const errorText = await testRes.text()
      console.error('❌ Test failed:', testRes.status, errorText)
      return NextResponse.json({ 
        success: false, 
        message: `فشل الاتصال بـ Supabase: ${testRes.status} - ${errorText.substring(0, 100)}` 
      }, { status: 500 })
    }
    
    console.log('✅ Connection test passed!')

    // التحقق من وجود المستخدم
    const checkUrl = `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id`
    const checkRes = await fetch(checkUrl, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!checkRes.ok) {
      const errorText = await checkRes.text()
      console.error('❌ Check failed:', errorText)
      return NextResponse.json({ success: false, message: 'خطأ في التحقق: ' + errorText }, { status: 500 })
    }
    
    const existingUsers = await checkRes.json()
    console.log('📋 Existing users:', existingUsers)

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ success: false, message: 'البريد مستخدم بالفعل' })
    }

    // إنشاء المستخدم
    const insertUrl = `${SUPABASE_URL}/rest/v1/users`
    const insertRes = await fetch(insertUrl, {
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
      console.error('❌ Insert failed:', err)
      return NextResponse.json({ success: false, message: 'خطأ في إنشاء المستخدم: ' + err }, { status: 500 })
    }

    const newUser = (await insertRes.json())[0]
    console.log('✅ User created:', newUser)

    // إنشاء الاشتراك
    const subUrl = `${SUPABASE_URL}/rest/v1/subscriptions`
    const subRes = await fetch(subUrl, {
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
      console.error('⚠️ Subscription creation failed:', await subRes.text())
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
    console.error('💥 Fatal error:', error)
    return NextResponse.json({ 
      success: false, 
      message: `خطأ فادح: ${error.message}. تأكد من اتصال الإنترنت وإعدادات Supabase.` 
    }, { status: 500 })
  }
}
