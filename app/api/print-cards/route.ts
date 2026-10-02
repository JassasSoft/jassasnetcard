import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { userId, cardValue, duration, quantity } = await request.json()

    if (!userId || !quantity) {
      return NextResponse.json({ success: false, message: 'بيانات غير مكتملة' })
    }

    // التحقق من الرصيد
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('cards_remaining')
      .eq('user_id', userId)
      .single()

    if (!subscription || subscription.cards_remaining < quantity) {
      return NextResponse.json({ success: false, message: 'رصيد غير كافٍ' })
    }

    // خصم الكروت
    await supabase
      .from('subscriptions')
      .update({
        cards_remaining: subscription.cards_remaining - quantity,
        total_cards_printed: (subscription.total_cards_printed || 0) + quantity
      })
      .eq('user_id', userId)

    // إنشاء كروت
    const cards = []
    for (let i = 0; i < quantity; i++) {
      const cardCode = 'JNC-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      cards.push({
        user_id: userId,
        card_code: cardCode,
        card_value: cardValue || '100',
        duration: duration || '1 ساعة'
      })
    }

    await supabase.from('printed_cards').insert(cards)

    return NextResponse.json({
      success: true,
      message: `تم طباعة ${quantity} كرت بنجاح`,
      cards: cards,
      remainingCards: subscription.cards_remaining - quantity
    })

  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 })
  }
}
