import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const commands: string = body.commands || ''

    if (!commands) {
      return NextResponse.json({
        success: false,
        message: 'لا توجد أوامر'
      })
    }

    console.log('📡 الأوامر المستلمة:', commands)

    const commandList = commands.split('\n').filter((cmd: string) => cmd.trim())

    console.log(`✅ تم استلام ${commandList.length} أمر`)

    return NextResponse.json({
      success: true,
      message: `تم إرسال ${commandList.length} أمر بنجاح`,
      commands: commandList
    })

  } catch (error) {
    console.error('❌ خطأ:', error)
    return NextResponse.json({
      success: false,
      message: 'خطأ في الخادم'
    }, { status: 500 })
  }
}
