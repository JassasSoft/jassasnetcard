import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'هذا المسار قديم. استخدم صفحة التسجيل في المنصة.'
    },
    { status: 410 }
  )
}
