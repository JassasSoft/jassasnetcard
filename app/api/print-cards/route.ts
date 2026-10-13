import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'إنشاء الكروت محفوظ مؤقتًا حتى اكتمال تأمين الحفظ والرصيد.',
    },
    { status: 503 }
  )
}
