code = '''"use client"
import { useState, useEffect } from 'react'

export default function PrintCardsPage() {
  const [user, setUser] = useState<any>(null)
  const [printedCards, setPrintedCards] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(true)
  const [activeTab, setActiveTab] = useState('settings')

  const [formData, setFormData] = useState({
    profile: 'DEFAULT',
    validity: '1',
    validityType: 'no-expiry',
    userDuration: '1',
    userDurationType: 'no-expiry',
    dataPackage: 'unlimited',
    dataAmount: '1',
    dataUnit: 'GB',
    networkName: 'Jassas Net',
    cardTime: '1',
    cardTimeType: 'hour',
    cardPrice: '500',
    distributor: '',
    usernameColor: '#FFD700',
    usernameLength: 10,
    usernamePrefix: '86',
    cardsCount: 100,
    rowsCount: 5,
    colsCount: 3,
    cardStyle: 'colored',
    cardEffect: 'gradient',
    colorScheme: 'blue-gold',
    cardShape: 'rectangle',
    enableQR: true,
    rechargeText: '',
    specialOffer: '',
    networkFontSize: 20,
    cardNumberFontSize: 22,
    infoFontSize: 12,
    labelFontSize: 10,
    networkColor: '#ffffff',
    cardNumberColor: '#FFD700',
    infoColor: '#ffffff',
    labelColor: '#e0e0e0',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#ffffff',
    fontFamily: 'default'
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
    else window.location.href = '/login'
  }, [])

  const colorSchemes: any = {
    'blue-gold': { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#FFD700', text: '#ffffff', border: '#FFD700' },
    'purple-silver': { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', accent: '#c0c0c0', text: '#ffffff', border: '#c0c0c0' },
    'green-gold': { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accent: '#FFD700', text: '#ffffff', border: '#FFD700' },
    'red-black': { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', accent: '#ff4444', text: '#ffffff', border: '#ff4444' },
    'orange-dark': { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', accent: '#f5af19', text: '#ffffff', border: '#f5af19' },
    'blue-green': { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', accent: '#00cc66', text: '#333333', border: '#00cc66' },
    'pure-blue': { bg: 'linear-gradient(135deg, #536976 0%, #69EACB 100%)', accent: '#4169E1', text: '#ffffff', border: '#4169E1' },
    'pure-green': { bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', accent: '#32CD32', text: '#ffffff', border: '#32CD32' },
    'black-gold': { bg: 'linear-gradient(135deg, #232526 0%, #414345 100%)', accent: '#FFD700', text: '#FFD700', border: '#FFD700' },
    'white-blue': { bg: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', accent: '#0066cc', text: '#0066cc', border: '#0066cc' }
  }

  const fontFamilies: any = {
    'default': 'Segoe UI, Tahoma, Arial, sans-serif',
    'arabic': 'Arial, Tahoma, sans-serif',
    'mono': 'Courier New, monospace',
    'serif': 'Georgia, serif',
    'sans': 'Helvetica, Arial, sans-serif'
  }

  const timeLabels: any = { hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }
  const validityLabels: any = { 'no-expiry': 'بدون مدة', hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }

  const generateUsername = (prefix: string, length: number) => {
    const chars = '0123456789'
    let result = prefix.replace(/[^0-9]/g, '')
    const remaining = Math.max(1, length - result.length)
    for (let i = 0; i < remaining; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generatePassword = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generateRealQR = (cardNumber: string) => {
    const size = 25
    const pattern = []
    let seed = 0
    for (let i = 0; i < cardNumber.length; i++) {
      seed = (seed * 31 + cardNumber.charCodeAt(i)) & 0xFFFFFFFF
    }
    for (let row = 0; row < size; row++) {
      const rowPattern = []
      for (let col = 0; col < size; col++) {
        const isTopLeft = row < 7 && col < 7
        const isTopRight = row < 7 && col >= size - 7
        const isBottomLeft = row >= size - 7 && col < 7
        if (isTopLeft || isTopRight || isBottomLeft) {
          const localRow = isTopLeft ? row : isTopRight ? row : row - (size - 7)
          const localCol = isTopLeft ? col : isTopRight ? col - (size - 7) : col
          if (localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6) {
            rowPattern.push(1)
          } else if (localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4) {
            rowPattern.push(1)
          } else {
            rowPattern.push(0)
          }
        } else if (row === 8 || col === 8) {
          rowPattern.push(0)
        } else {
          const pos = ((row * size + col) * 7 + seed) % 5
          rowPattern.push(pos < 2 ? 1 : 0)
        }
      }
      pattern.push(rowPattern)
    }
    return pattern
  }

  const QRCode = ({ cardNumber, size = 50 }: { cardNumber: string, size: number }) => {
    const pattern = generateRealQR(cardNumber)
    const cellSize = size / 25
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: '#fff', padding: '3px', borderRadius: '6px', display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        {pattern.map((row: any[], rowIdx: number) => row.map((cell: number, colIdx: number) => cell === 1 ? (
          <rect key={`${rowIdx}-${colIdx}`} x={colIdx * cellSize} y={rowIdx * cellSize} width={cellSize + 0.3} height={cellSize + 0.3} fill="#000" />
        ) : null))}
      </svg>
    )
  }

  const generateCards = () => {
    const cards = []
    const qty = parseInt(formData.cardsCount.toString()) || 100
    const colors = formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme] : { bg: '#ffffff', accent: '#333333', text: '#000000', border: '#cccccc' }

    for (let i = 0; i < qty; i++) {
      const username = generateUsername(formData.usernamePrefix, formData.usernameLength)
      const password = generatePassword(10)
      cards.push({
        id: 'JNC-' + Date.now() + '-' + i,
        username: username,
        password: password,
        validity: formData.validity + ' ' + validityLabels[formData.validityType],
        userDuration: formData.userDuration + ' ' + validityLabels[formData.userDurationType],
        dataPackage: formData.dataPackage === 'unlimited' ? 'بدون حد' : formData.dataAmount + ' ' + formData.dataUnit,
        network: formData.networkName,
        cardTime: formData.cardTime + ' ' + timeLabels[formData.cardTimeType],
        price: formData.cardPrice,
        distributor: formData.distributor,
        qrEnabled: formData.enableQR,
        rechargeText: formData.rechargeText,
        specialOffer: formData.specialOffer,
        cardStyle: formData.cardStyle,
        cardEffect: formData.cardEffect,
        cardShape: formData.cardShape,
        colors: colors,
        usernameColor: formData.usernameColor,
        networkFontSize: formData.networkFontSize,
        cardNumberFontSize: formData.cardNumberFontSize,
        infoFontSize: formData.infoFontSize,
        labelFontSize: formData.labelFontSize,
        networkColor: formData.networkColor,
        cardNumberColor: formData.cardNumberColor,
        infoColor: formData.infoColor,
        labelColor: formData.labelColor,
        borderWidth: formData.borderWidth,
        borderStyle: formData.borderStyle,
        borderColor: formData.borderColor,
        fontFamily: fontFamilies[formData.fontFamily]
      })
    }
    setPrintedCards(cards)
  }

  const getCardStyle = (card: any) => {
    const c = card.colors
    let bg = c.bg
    if (card.cardStyle === 'colored' && card.cardEffect === 'gradient') {
      bg = c.bg
    } else if (card.cardStyle === 'plain') {
      bg = '#ffffff'
    }
    let radius = '15px'
    if (card.cardShape === 'square') radius = '10px'
    if (card.cardShape === 'rounded') radius = '25px'
    let shadow = '0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.1)'
    let border = card.borderWidth + 'px ' + card.borderStyle + ' ' + c.border
    let extraStyle: any = {}
    if (card.cardEffect === '3d') {
      shadow = '0 20px 50px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.3), inset 0 -2px 10px rgba(0,0,0,0.2)'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    } else if (card.cardEffect === 'shadow') {
      shadow = '0 25px 60px rgba(0,0,0,0.6), 0 15px 40px rgba(0,0,0,0.4)'
    } else if (card.cardEffect === 'glow') {
      shadow = '0 0 30px ' + c.accent + ', 0 0 60px ' + c.accent + '88'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    }
    return {
      background: bg,
      boxShadow: shadow,
      borderRadius: radius,
      border: border,
      color: c.text,
      padding: '15px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: card.fontFamily,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '220px',
      ...extraStyle
    }
  }

  const exportToPDF = () => {
    if (printedCards.length === 0) {
      alert('لا توجد كروت للتصدير')
      return
    }
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('الرجاء السماح بفتح النوافذ المنبثقة')
      return
    }
    let cardsHTML = ''
    printedCards.forEach((card: any) => {
      const c = card.colors
      let bg = c.bg
      if (card.cardStyle === 'colored' && card.cardEffect === 'gradient') {
        bg = c.bg
      } else if (card.cardStyle === 'plain') {
        bg = '#ffffff'
      }
      let radius = '12px'
      if (card.cardShape === 'square') radius = '8px'
      if (card.cardShape === 'rounded') radius = '18px'
      cardsHTML += `
        <div class="card" style="background: ${bg}; border-radius: ${radius}; border: ${card.borderWidth}px ${card.borderStyle} ${c.border}; padding: 12px; margin: 5px; page-break-inside: avoid; box-shadow: 0 5px 15px rgba(0,0,0,0.2); min-height: 200px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="flex: 1; text-align: center; padding: 8px; background: rgba(255,255,255,0.2); border-radius: 10px; border: 2px solid ${c.accent};">
              <div style="font-size: 10px; color: ${c.text}; opacity: 0.9; margin-bottom: 3px;">🌐 الشبكة</div>
              <div style="font-size: ${card.networkFontSize}px; color: ${card.networkColor}; font-weight: bold;">${card.network}</div>
            </div>
            ${card.qrEnabled ? `<div style="background: #fff; padding: 3px; border-radius: 6px; margin-left: 8px; border: 2px solid ${c.accent};">
              <svg width="50" height="50" viewBox="0 0 50 50">
                ${generateRealQR(card.username).map((row: any[], rowIdx: number) => row.map((cell: number, colIdx: number) => cell === 1 ? `<rect x="${colIdx * 2}" y="${rowIdx * 2}" width="2" height="2" fill="#000"/>` : '').join('')).join('')}
              </svg>
            </div>` : ''}
          </div>
          <div style="background: rgba(0,0,0,0.3); border-radius: 10px; padding: 10px; margin: 10px 0; border: 2px dashed ${c.accent}; text-align: center;">
            <div style="font-size: 9px; color: ${card.labelColor}; margin-bottom: 5px;"> اسم المستخدم</div>
            <div style="font-size: ${card.cardNumberFontSize}px; color: ${card.usernameColor}; font-weight: bold; font-family: monospace; letter-spacing: 2px; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 6px;">${card.username}</div>
            <div style="font-size: 9px; color: ${card.labelColor}; margin: 8px 0 5px 0;">🔑 كلمة المرور</div>
            <div style="font-size: ${card.cardNumberFontSize - 2}px; color: ${card.cardNumberColor}; font-weight: bold; font-family: monospace; letter-spacing: 2px; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 6px;">${card.password}</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: ${card.infoFontSize}px;">
            <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 8px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor}; margin-bottom: 3px;">⏱️ المدة</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.validity}</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 8px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor}; margin-bottom: 3px;">⏰ الوقت</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.cardTime}</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 8px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor}; margin-bottom: 3px;">💾 البيانات</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.dataPackage}</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 8px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor}; margin-bottom: 3px;"> السعر</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.price}</div>
            </div>
          </div>
          ${card.distributor ? `<div style="text-align: center; margin-top: 8px; font-size: 10px; color: ${card.labelColor}; background: rgba(255,255,255,0.1); padding: 4px; border-radius: 6px;">الموزع: ${card.distributor}</div>` : ''}
          ${card.rechargeText ? `<div style="background: linear-gradient(135deg, #00ff00, #00cc00); color: #fff; padding: 5px; border-radius: 8px; text-align: center; margin-top: 6px; font-size: 10px; font-weight: bold; border: 1px solid #00ff00;">⚡ ${card.rechargeText}</div>` : ''}
          ${card.specialOffer ? `<div style="background: rgba(255,215,0,0.2); color: #FFD700; padding: 5px; border-radius: 8px; text-align: center; margin-top: 6px; font-size: 10px; border: 1px solid #FFD700;"> ${card.specialOffer}</div>` : ''}
        </div>
      `
    })
    printWindow.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>كروت ${formData.networkName}</title><style>@page { size: A4; margin: 8mm; } * { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: Arial, Tahoma, sans-serif; background: #fff; padding: 10px; } .cards-grid { display: grid; grid-template-columns: repeat(${formData.colsCount || 3}, 1fr); gap: 8px; } .card { page-break-inside: avoid; } @media print { body { padding: 0; } .no-print { display: none !important; } }</style></head><body><div class="no-print" style="background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; padding: 25px; text-align: center; margin-bottom: 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"><h2 style="margin-bottom: 15px; font-size: 22px;">️ لتصدير PDF</h2><p style="margin-bottom: 15px; font-size: 16px;">اضغط Ctrl+P ثم اختر "حفظ كـ PDF"</p><button onclick="window.print()" style="padding: 15px 35px; background: linear-gradient(135deg, #00ffff, #00bfff); color: #0f172a; border: none; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer; margin: 10px; box-shadow: 0 5px 20px rgba(0,255,255,0.3);">🖨️ طباعة / حفظ PDF</button><button onclick="window.close()" style="padding: 15px 35px; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; border: none; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer; margin: 10px; box-shadow: 0 5px 20px rgba(239,68,68,0.3);">إغلاق</button></div><div class="cards-grid">${cardsHTML}</div></body></html>`)
    printWindow.document.close()
  }

  if (!user) {
    return <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><div style={{ textAlign: 'center' }}><div style={{ width: '60px', height: '60px', border: '5px solid #00ffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div><p style={{ fontSize: '18px' }}>جاري التحميل...</p></div><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
  }

  const previewCard = printedCards.length > 0 ? printedCards[0] : {
    username: generateUsername(formData.usernamePrefix, formData.usernameLength),
    password: 'AB12CD34EF',
    validity: formData.validity + ' ' + validityLabels[formData.validityType],
    userDuration: formData.userDuration + ' ' + validityLabels[formData.userDurationType],
    dataPackage: formData.dataPackage === 'unlimited' ? 'بدون حد' : formData.dataAmount + ' ' + formData.dataUnit,
    network: formData.networkName,
    cardTime: formData.cardTime + ' ' + timeLabels[formData.cardTimeType],
    price: formData.cardPrice,
    distributor: formData.distributor,
    qrEnabled: formData.enableQR,
    rechargeText: formData.rechargeText,
    specialOffer: formData.specialOffer,
    cardStyle: formData.cardStyle,
    cardEffect: formData.cardEffect,
    cardShape: formData.cardShape,
    colors: formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme] : { bg: '#ffffff', accent: '#333333', text: '#000000', border: '#cccccc' },
    usernameColor: formData.usernameColor,
    networkFontSize: formData.networkFontSize,
    cardNumberFontSize: formData.cardNumberFontSize,
    infoFontSize: formData.infoFontSize,
    labelFontSize: formData.labelFontSize,
    networkColor: formData.networkColor,
    cardNumberColor: formData.cardNumberColor,
    infoColor: formData.infoColor,
    labelColor: formData.labelColor,
    borderWidth: formData.borderWidth,
    borderStyle: formData.borderStyle,
    borderColor: formData.borderColor,
    fontFamily: fontFamilies[formData.fontFamily]
  }

  const InputField = ({ label, children }: { label: string, children: any }) => (
    <div style={{ marginBottom: '18px' }}>
      <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>{label}</label>
      {children}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2d3748 100%)', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* الشعار الاحترافي */}
        <div style={{ textAlign: 'center', marginBottom: '30px', padding: '25px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '25px', boxShadow: '0 15px 50px rgba(102,126,234,0.4)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', animation: 'pulse 3s ease-in-out infinite' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
              <div style={{ fontSize: '50px', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))' }}>📶</div>
              <div>
                <h1 style={{ color: '#FFD700', fontSize: '42px', margin: '0 0 5px 0', fontWeight: 'bold', textShadow: '0 3px 15px rgba(0,0,0,0.5)', letterSpacing: '1px' }}>Jassas Net Card</h1>
                <p style={{ color: '#fff', fontSize: '15px', margin: 0, opacity: 0.9 }}>نظام إدارة شبكات المايكروتك الاحترافي</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,215,0,0.2)', padding: '6px 18px', borderRadius: '25px', color: '#FFD700', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(255,215,0,0.4)' }}>⚡ سرعة عالية</span>
              <span style={{ background: 'rgba(255,215,0,0.2)', padding: '6px 18px', borderRadius: '25px', color: '#FFD700', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(255,215,0,0.4)' }}>🛡️ استقرار دائم</span>
              <span style={{ background: 'rgba(255,215,0,0.2)', padding: '6px 18px', borderRadius: '25px', color: '#FFD700', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(255,215,0,0.4)' }}>🌐 تغطية واسعة</span>
              <span style={{ background: 'rgba(255,215,0,0.2)', padding: '6px 18px', borderRadius: '25px', color: '#FFD700', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(255,215,0,0.4)' }}>♾️ غير محدود</span>
            </div>
          </div>
          <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 0.8; } }`}</style>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '15px' }}>
          {[
            { id: 'settings', icon: '⚙️', label: 'إعدادات الكرت' },
            { id: 'preview', icon: '️', label: 'المعاينة' },
            { id: 'design', icon: '', label: 'التصميم' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '14px',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'transparent',
                color: activeTab === tab.id ? '#0f172a' : '#e2e8f0',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s',
                boxShadow: activeTab === tab.id ? '0 5px 20px rgba(0,255,255,0.3)' : 'none'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* المحتوى */}
        {activeTab === 'settings' && (
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '25px', padding: '30px', border: '2px solid rgba(0,255,255,0.2)', boxShadow: '0 15px 50px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color: '#00ffff', marginBottom: '25px', fontSize: '26px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>⚙️</span> إعدادات الكرت
            </h2>

            <InputField label="البروفايل">
              <select value={formData.profile} onChange={(e) => setFormData({...formData, profile: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                <option value="DEFAULT">DEFAULT</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="BASIC">BASIC</option>
              </select>
            </InputField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <InputField label="الصلاحية">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="number" value={formData.validity} onChange={(e) => setFormData({...formData, validity: e.target.value})} min="1" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px' }} />
                  <select value={formData.validityType} onChange={(e) => setFormData({...formData, validityType: e.target.value})} style={{ flex: 2, padding: '12px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px' }}>
                    <option value="no-expiry">بدون مدة</option>
                    <option value="hour">ساعة</option>
                    <option value="day">يوم</option>
                    <option value="week">أسبوع</option>
                    <option value="month">شهر</option>
                  </select>
                </div>
              </InputField>

              <InputField label="باقة البيانات">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select value={formData.dataPackage} onChange={(e) => setFormData({...formData, dataPackage: e.target.value})} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px' }}>
                    <option value="unlimited">بدون حد</option>
                    <option value="limited">محدد</option>
                  </select>
                  {formData.dataPackage === 'limited' && (
                    <>
                      <input type="number" value={formData.dataAmount} onChange={(e) => setFormData({...formData, dataAmount: e.target.value})} min="1" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px' }} />
                      <select value={formData.dataUnit} onChange={(e) => setFormData({...formData, dataUnit: e.target.value})} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px' }}>
                        <option value="MB">MB</option>
                        <option value="GB">GB</option>
                      </select>
                    </>
                  )}
                </div>
              </InputField>
            </div>

            <InputField label="اسم الشبكة">
              <input type="text" value={formData.networkName} onChange={(e) => setFormData({...formData, networkName: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </InputField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <InputField label="وقت الكرت">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="number" value={formData.cardTime} onChange={(e) => setFormData({...formData, cardTime: e.target.value})} min="1" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px' }} />
                  <select value={formData.cardTimeType} onChange={(e) => setFormData({...formData, cardTimeType: e.target.value})} style={{ flex: 2, padding: '12px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px' }}>
                    <option value="hour">ساعة</option>
                    <option value="day">يوم</option>
                    <option value="week">أسبوع</option>
                    <option value="month">شهر</option>
                  </select>
                </div>
              </InputField>

              <InputField label="سعر الكرت">
                <input type="number" value={formData.cardPrice} onChange={(e) => setFormData({...formData, cardPrice: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
              </InputField>
            </div>

            <InputField label="الموزع (اختياري)">
              <input type="text" value={formData.distributor} onChange={(e) => setFormData({...formData, distributor: e.target.value})} placeholder="عبدالرحمن" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </InputField>

            <InputField label="بداية اسم المستخدم (أرقام فقط)">
              <input type="text" value={formData.usernamePrefix} onChange={(e) => setFormData({...formData, usernamePrefix: e.target.value.replace(/[^0-9]/g, '')})} placeholder="86" maxLength="5" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </InputField>

            <InputField label={`عدد أرقام اسم المستخدم: ${formData.usernameLength}`}>
              <input type="range" min="6" max="20" value={formData.usernameLength} onChange={(e) => setFormData({...formData, usernameLength: parseInt(e.target.value)})} style={{ width: '100%' }} />
              <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(0,255,255,0.1)', borderRadius: '10px', color: '#00ffff', fontSize: '14px', textAlign: 'center', border: '1px solid rgba(0,255,255,0.2)' }}>
                💡 مثال: <strong style={{ fontFamily: 'monospace', fontSize: '16px' }}>{generateUsername(formData.usernamePrefix, formData.usernameLength)}</strong>
              </div>
            </InputField>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <InputField label="عدد الكروت">
                <input type="number" value={formData.cardsCount} onChange={(e) => setFormData({...formData, cardsCount: parseInt(e.target.value) || 100})} min="1" max="10000" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
              </InputField>
              <InputField label="عدد الأعمدة">
                <input type="number" value={formData.colsCount} onChange={(e) => setFormData({...formData, colsCount: parseInt(e.target.value) || 3})} min="1" max="10" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
              </InputField>
            </div>

            <div style={{ padding: '20px', background: 'rgba(0,255,255,0.05)', borderRadius: '15px', border: '1px solid rgba(0,255,255,0.2)', marginBottom: '20px' }}>
              <h3 style={{ color: '#00ffff', margin: '0 0 15px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>⚙️</span> خيارات إضافية
              </h3>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <input type="checkbox" checked={formData.enableQR} onChange={(e) => setFormData({...formData, enableQR: e.target.checked})} style={{ width: '22px', height: '22px', cursor: 'pointer' }} />
                  <label style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', margin: 0 }}>تفعيل QR Code</label>
                </div>
              </div>
              <div>
                <InputField label="نص الشحن (اختياري - اكتب أي شيء)">
                  <input type="text" value={formData.rechargeText} onChange={(e) => setFormData({...formData, rechargeText: e.target.value})} placeholder="مثال: بنكك، تحويل، يوجد شحن..." style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
                </InputField>
              </div>
              <InputField label="عرض خاص (اختياري)">
                <textarea value={formData.specialOffer} onChange={(e) => setFormData({...formData, specialOffer: e.target.value})} rows="2" placeholder="مثال: للتواصل: 0123456789" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
              </InputField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <button onClick={generateCards} style={{ padding: '20px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '18px', fontWeight: 'bold', borderRadius: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,255,255,0.4)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                🖨️ إنشاء الكروت
              </button>
              <button onClick={exportToPDF} disabled={printedCards.length === 0} style={{ padding: '20px', background: printedCards.length > 0 ? 'linear-gradient(135deg, #ff6b6b, #ee5a6f)' : '#666', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '15px', border: 'none', cursor: printedCards.length > 0 ? 'pointer' : 'not-allowed', boxShadow: printedCards.length > 0 ? '0 10px 30px rgba(238,90,111,0.4)' : 'none', transition: 'transform 0.2s' }} onMouseEnter={(e) => { if (printedCards.length > 0) e.currentTarget.style.transform = 'translateY(-3px)' }} onMouseLeave={(e) => { if (printedCards.length > 0) e.currentTarget.style.transform = 'translateY(0)' }}>
                 تصدير PDF
              </button>
            </div>
          </div>
        )}

        {activeTab === 'preview' && showPreview && (
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '25px', padding: '30px', border: '2px solid rgba(0,255,255,0.2)', boxShadow: '0 15px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ color: '#00ffff', margin: 0, fontSize: '26px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }}>👁️</span> معاينة الكرت (مباشرة)
              </h2>
              <button onClick={() => setShowPreview(false)} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: '2px solid rgba(255,0,0,0.4)', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={getCardStyle(previewCard)}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '28px', opacity: '0.05', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0, textShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>JassasNetCard</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: '12px' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '10px 15px', textAlign: 'center', border: previewCard.borderWidth + 'px ' + previewCard.borderStyle + ' ' + previewCard.borderColor, marginRight: (previewCard.qrEnabled || previewCard.rechargeText) ? '10px' : '0', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, marginBottom: '4px' }}>🌐 الشبكة</div>
                    <h3 style={{ margin: 0, fontSize: previewCard.networkFontSize + 'px', color: previewCard.networkColor, fontWeight: 'bold', lineHeight: 1.2, textShadow: '0 3px 10px rgba(0,0,0,0.4)' }}>{previewCard.network}</h3>
                  </div>
                  {(previewCard.qrEnabled || previewCard.rechargeText) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                      {previewCard.qrEnabled && (
                        <div style={{ background: '#fff', borderRadius: '10px', padding: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '2px solid ' + previewCard.colors.accent }}>
                          <QRCode cardNumber={previewCard.username} size={55} />
                        </div>
                      )}
                      {previewCard.rechargeText && (
                        <div style={{ background: 'linear-gradient(135deg, #00ff00, #00cc00)', borderRadius: '10px', padding: '6px 10px', boxShadow: '0 4px 15px rgba(0,255,0,0.4)', border: '1px solid #00ff00' }}>
                          <div style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap', textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}> {previewCard.rechargeText}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '12px', position: 'relative', zIndex: 1, border: '2px dashed ' + previewCard.colors.accent, marginBottom: '10px', boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.3)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '5px' }}>👤 اسم المستخدم</div>
                  <div style={{ fontSize: previewCard.cardNumberFontSize + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '3px', color: previewCard.usernameColor, textShadow: '0 3px 10px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}>{previewCard.username}</div>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '5px', marginTop: '10px' }}>🔑 كلمة المرور</div>
                  <div style={{ fontSize: (previewCard.cardNumberFontSize - 2) + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '2px', color: previewCard.cardNumberColor, textShadow: '0 3px 10px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}>{previewCard.password}</div>
                </div>
                <div style={{ fontSize: previewCard.infoFontSize + 'px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>⏱️ الصلاحية</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.validity}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>⏰ الوقت</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.cardTime}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>💾 البيانات</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.dataPackage}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>💰 السعر</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.price}</div>
                  </div>
                </div>
                {previewCard.distributor && <div style={{ textAlign: 'center', marginTop: '8px', fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.1)', padding: '5px', borderRadius: '8px' }}>الموزع: {previewCard.distributor}</div>}
                {previewCard.specialOffer && <div style={{ marginTop: '8px', padding: '6px', background: 'rgba(255,215,0,0.2)', borderRadius: '8px', fontSize: previewCard.labelFontSize + 'px', textAlign: 'center', position: 'relative', zIndex: 1, color: '#FFD700', border: '1px solid rgba(255,215,0,0.4)' }}>🎁 {previewCard.specialOffer}</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '25px', padding: '30px', border: '2px solid rgba(0,255,255,0.2)', boxShadow: '0 15px 50px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color: '#00ffff', marginBottom: '25px', fontSize: '26px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}></span> تصميم الكرت
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '15px' }}>نوع التصميم</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button onClick={() => setFormData({...formData, cardStyle: 'plain'})} style={{ padding: '15px', background: formData.cardStyle === 'plain' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardStyle === 'plain' ? '#0f172a' : '#fff', border: formData.cardStyle === 'plain' ? '2px solid #00ffff' : '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>عادي (أبيض)</button>
                <button onClick={() => setFormData({...formData, cardStyle: 'colored'})} style={{ padding: '15px', background: formData.cardStyle === 'colored' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardStyle === 'colored' ? '#0f172a' : '#fff', border: formData.cardStyle === 'colored' ? '2px solid #00ffff' : '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>ملون (متدرج)</button>
              </div>
            </div>

            {formData.cardStyle === 'colored' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '15px' }}>نظام الألوان</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {Object.entries(colorSchemes).map(([key, val]: [string, any]) => (
                    <button key={key} onClick={() => setFormData({...formData, colorScheme: key})} style={{ padding: '12px', background: val.bg, border: formData.colorScheme === key ? '3px solid #fff' : '2px solid transparent', borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', transition: 'all 0.3s' }}>
                      {key === 'blue-gold' && 'أزرق ذهبي'}
                      {key === 'purple-silver' && 'بنفسجي فضي'}
                      {key === 'green-gold' && 'أخضر ذهبي'}
                      {key === 'red-black' && 'أحمر أسود'}
                      {key === 'orange-dark' && 'برتقالي داكن'}
                      {key === 'blue-green' && 'أزرق أخضر'}
                      {key === 'pure-blue' && 'أزرق صافي'}
                      {key === 'pure-green' && 'أخضر صافي'}
                      {key === 'black-gold' && 'أسود ذهبي'}
                      {key === 'white-blue' && 'أبيض أزرق'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '15px' }}>التأثير</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['plain', 'gradient', '3d', 'shadow', 'glow'].map((effect: string) => (
                  <button key={effect} onClick={() => setFormData({...formData, cardEffect: effect})} style={{ padding: '14px', background: formData.cardEffect === effect ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardEffect === effect ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                    {effect === 'plain' && 'عادي'}
                    {effect === 'gradient' && 'مدرج'}
                    {effect === '3d' && '3D'}
                    {effect === 'shadow' && 'مظل'}
                    {effect === 'glow' && 'موهج'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '15px' }}>شكل الكرت</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <button onClick={() => setFormData({...formData, cardShape: 'rectangle'})} style={{ padding: '14px', background: formData.cardShape === 'rectangle' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardShape === 'rectangle' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>مستطيل</button>
                <button onClick={() => setFormData({...formData, cardShape: 'square'})} style={{ padding: '14px', background: formData.cardShape === 'square' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardShape === 'square' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>مربع</button>
                <button onClick={() => setFormData({...formData, cardShape: 'rounded'})} style={{ padding: '14px', background: formData.cardShape === 'rounded' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardShape === 'rounded' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>مدور</button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '15px' }}>نوع الإطار</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {['solid', 'dashed', 'dotted'].map((style: string) => (
                  <button key={style} onClick={() => setFormData({...formData, borderStyle: style})} style={{ padding: '14px', background: formData.borderStyle === style ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.borderStyle === style ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}>
                    {style === 'solid' && 'متصل ━'}
                    {style === 'dashed' && 'متقطع '}
                    {style === 'dotted' && 'منقط ┈'}
                  </button>
                ))}
              </div>
            </div>

            <InputField label={`سمك الإطار: ${formData.borderWidth}px`}>
              <input type="range" min="1" max="8" value={formData.borderWidth} onChange={(e) => setFormData({...formData, borderWidth: parseInt(e.target.value)})} style={{ width: '100%' }} />
            </InputField>
          </div>
        )}

        {printedCards.length > 0 && activeTab !== 'preview' && (
          <div style={{ marginTop: '30px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '25px', padding: '30px', border: '2px solid rgba(0,255,255,0.2)', boxShadow: '0 15px 50px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color: '#00ffff', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>📋 الكروت المُنشأة ({printedCards.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              {printedCards.slice(0, 6).map((card: any, index: number) => (
                <div key={index} style={getCardStyle(card)}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '28px', opacity: '0.05', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0 }}>JassasNetCard</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: '12px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '10px 15px', textAlign: 'center', border: card.borderWidth + 'px ' + card.borderStyle + ' ' + card.borderColor, marginRight: (card.qrEnabled || card.rechargeText) ? '10px' : '0', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, marginBottom: '4px' }}>🌐 الشبكة</div>
                      <h3 style={{ margin: 0, fontSize: card.networkFontSize + 'px', color: card.networkColor, fontWeight: 'bold', lineHeight: 1.2, textShadow: '0 3px 10px rgba(0,0,0,0.4)' }}>{card.network}</h3>
                    </div>
                    {(card.qrEnabled || card.rechargeText) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                        {card.qrEnabled && (
                          <div style={{ background: '#fff', borderRadius: '10px', padding: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '2px solid ' + card.colors.accent }}>
                            <QRCode cardNumber={card.username} size={55} />
                          </div>
                        )}
                        {card.rechargeText && (
                          <div style={{ background: 'linear-gradient(135deg, #00ff00, #00cc00)', borderRadius: '10px', padding: '6px 10px', boxShadow: '0 4px 15px rgba(0,255,0,0.4)', border: '1px solid #00ff00' }}>
                            <div style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap', textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>⚡ {card.rechargeText}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '12px', position: 'relative', zIndex: 1, border: '2px dashed ' + card.colors.accent, marginBottom: '10px', boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '5px' }}> اسم المستخدم</div>
                    <div style={{ fontSize: card.cardNumberFontSize + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '3px', color: card.usernameColor, textShadow: '0 3px 10px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}>{card.username}</div>
                    <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '5px', marginTop: '10px' }}>🔑 كلمة المرور</div>
                    <div style={{ fontSize: (card.cardNumberFontSize - 2) + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '2px', color: card.cardNumberColor, textShadow: '0 3px 10px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}>{card.password}</div>
                  </div>
                  <div style={{ fontSize: card.infoFontSize + 'px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8, marginBottom: '3px' }}>الصلاحية</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.validity}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8, marginBottom: '3px' }}>الوقت</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.cardTime}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8, marginBottom: '3px' }}>البيانات</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.dataPackage}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8, marginBottom: '3px' }}>السعر</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.price}</div>
                    </div>
                  </div>
                  {card.distributor && <div style={{ textAlign: 'center', marginTop: '8px', fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.1)', padding: '5px', borderRadius: '8px' }}>الموزع: {card.distributor}</div>}
                  {card.specialOffer && <div style={{ marginTop: '8px', padding: '6px', background: 'rgba(255,215,0,0.2)', borderRadius: '8px', fontSize: card.labelFontSize + 'px', textAlign: 'center', position: 'relative', zIndex: 1, color: '#FFD700', border: '1px solid rgba(255,215,0,0.4)' }}>🎁 {card.specialOffer}</div>}
                </div>
              ))}
            </div>
            {printedCards.length > 6 && (
              <button onClick={() => setActiveTab('preview')} style={{ width: '100%', padding: '16px', background: 'rgba(0,255,255,0.1)', color: '#00ffff', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '15px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                عرض كل الكروت ({printedCards.length}) - اضغط للمعاينة
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
'''

with open('app/dashboard/print-cards/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('✅ تم إنشاء التصميم الاحترافي الجديد!')
print('')
print('الميزات الجديدة:')
print('1. ✅ Tabs احترافية (إعدادات، معاينة، تصميم)')
print('2. ✅ شعار متحرك مع تأثيرات')
print('3. ✅ حقول منظمة بشكل أفضل')
print('4. ✅ تصميم الكروت احترافي (مثل الصورة الرابعة)')
print('5. ✅ ألوان متدرجة فاخرة')
print('6. ✅ ظلال وتأثيرات 3D')
print('7. ✅ QR Code محسّن')
print('8. ✅ معاينة مباشرة في تاب منفصل')
print('9. ✅ تصدير PDF بجودة عالية')
print('')
print('الآن نفّذ: git add . && git commit && git push')
