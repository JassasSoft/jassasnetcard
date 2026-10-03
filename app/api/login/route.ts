import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dccjryybmmnqmvuqriky.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjY2pyeXlibW1ucW12dXFyaWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMTU3NjgsImV4cCI6MjEwNjU5MTc2OH0.v-OcU2DMyvCPrAtqk5c-bkiZ8DzQOnQqH7rXSb-TuRQ'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${username},full_name.eq.${username}`)
      .limit(1)

    if (error) {
      console.error('❌ Login error:', error)
      return NextResponse.json({ success: false, message: 'خطأ: ' + error.message }, { status: 500 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ success: false, message: 'بيانات الدخول غير صحيحة' })
    }

    const user = users[0]

    if (user.password_hash !== password) {
      return NextResponse.json({ success: false, message: 'بيانات الدخول غير صحيحة' })
    }

    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)

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

  } catch (error: any) {
    console.error('❌ Login error:', error)
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
