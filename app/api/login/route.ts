import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (username === 'admin' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        user: { full_name: 'المدير', role: 'admin' }
      })
    }

    return NextResponse.json({
      success: false,
      message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'خطأ في الخادم'
    }, { status: 500 })
  }
}
