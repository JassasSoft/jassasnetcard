import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dccjryybmmnqmvuqriky.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjY2pyeXlibW1ucW12dXFyaWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMTU3NjgsImV4cCI6MjEwNjU5MTc2OH0.v-OcU2DMyvCPrAtqk5c-bkiZ8DzQOnQqH7rXSb-TuRQ'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'البريد وكلمة المرور مطلوبان' }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (checkError) {
      console.error('❌ Check error:', checkError)
      return NextResponse.json({ success: false, message: 'خطأ: ' + checkError.message }, { status: 500 })
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ success: false, message: 'البريد مستخدم بالفعل' })
    }

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
      console.error(' Insert error:', insertError)
      return NextResponse.json({ success: false, message: 'خطأ: ' + insertError.message }, { status: 500 })
    }

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

  } catch (error: any) {
    console.error('❌ Registration error:', error)
    return NextResponse.json({ success: false, message: 'خطأ: ' + error.message }, { status: 500 })
  }
}
