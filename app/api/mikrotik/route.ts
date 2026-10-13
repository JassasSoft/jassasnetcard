import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'أوامر MikroTik متوقفة مؤقتًا حتى اكتمال التحقق من الهوية والصلاحيات.',
    },
    { status: 503 }
  )
}
