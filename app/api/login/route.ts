import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'هذا المسار قديم. استخدم تسجيل الدخول الآمن من واجهة المنصة.'
    },
    { status: 410 }
  )
}
