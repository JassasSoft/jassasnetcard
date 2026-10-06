# تحديث صفحة طباعة الكروت بالشعار الأصلي
code = '''"use client"
import { useState, useEffect } from 'react'

export default function PrintCardsPage() {
  const [user, setUser] = useState(null)
  const [printedCards, setPrintedCards] = useState([])
  const [showPreview, setShowPreview] = useState(true)

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
    usernameLength: 8,
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

  const colorSchemes = {
    'blue-gold': { bg: '#1e3c72', accent: '#d4af37', text: '#ffffff' },
    'purple-silver': { bg: '#667eea', accent: '#c0c0c0', text: '#ffffff' },
    'green-gold': { bg: '#134e5e', accent: '#ffd700', text: '#ffffff' },
    'red-black': { bg: '#cb2d3e', accent: '#ff4444', text: '#ffffff' },
    'orange-dark': { bg: '#f12711', accent: '#f5af19', text: '#ffffff' },
    'blue-green': { bg: '#0066cc', accent: '#00cc66', text: '#ffffff' },
    'pure-blue': { bg: '#0047AB', accent: '#4169E1', text: '#ffffff' },
    'pure-green': { bg: '#228B22', accent: '#32CD32', text: '#ffffff' },
    'black-gold': { bg: '#1a1a1a', accent: '#FFD700', text: '#FFD700' },
    'white-blue': { bg: '#f0f4f8', accent: '#0066cc', text: '#0066cc' }
  }

  const fontFamilies = {
    'default': 'Segoe UI, Tahoma, Arial, sans-serif',
    'arabic': 'Arial, Tahoma, sans-serif',
    'mono': 'Courier New, monospace',
    'serif': 'Georgia, serif',
    'sans': 'Helvetica, Arial, sans-serif'
  }

  const timeLabels = { hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }
  const validityLabels = { 'no-expiry': 'بدون مدة', hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }

  const generateUsername = (prefix, length) => {
    const chars = '0123456789'
    let result = prefix.replace(/[^0-9]/g, '')
    const remaining = Math.max(1, length - result.length)
    for (let i = 0; i < remaining; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generatePassword = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generateRealQR = (cardNumber) => {
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

  const QRCode = ({ cardNumber, size = 50 }) => {
    const pattern = generateRealQR(cardNumber)
    const cellSize = size / 25
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: '#fff', padding: '2px', borderRadius: '4px', display: 'block' }}>
        {pattern.map((row, rowIdx) => row.map((cell, colIdx) => cell === 1 ? (
          <rect key={`${rowIdx}-${colIdx}`} x={colIdx * cellSize} y={rowIdx * cellSize} width={cellSize + 0.3} height={cellSize + 0.3} fill="#000" />
        ) : null))}
      </svg>
    )
  }

  const generateCards = () => {
    const cards = []
    const qty = parseInt(formData.cardsCount) || 100
    const colors = formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme] : { bg: '#ffffff', accent: '#333333', text: '#000000' }

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

  const getCardStyle = (card) => {
    const c = card.colors
    let bg = c.bg
    if (card.cardStyle === 'colored' && card.cardEffect === 'gradient') {
      bg = 'linear-gradient(135deg, ' + c.bg + ' 0%, ' + c.accent + ' 100%)'
    }
    let radius = '12px'
    if (card.cardShape === 'square') radius = '8px'
    if (card.cardShape === 'rounded') radius = '20px'
    let shadow = '0 8px 24px rgba(0,0,0,0.3)'
    let border = card.borderWidth + 'px ' + card.borderStyle + ' ' + card.borderColor
    let extraStyle = {}
    if (card.cardEffect === '3d') {
      shadow = '0 15px 40px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,255,255,0.3)'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    } else if (card.cardEffect === 'shadow') {
      shadow = '0 20px 50px rgba(0,0,0,0.6)'
    } else if (card.cardEffect === 'glow') {
      shadow = '0 0 20px ' + c.accent + '88, 0 0 40px ' + c.accent + '44'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    }
    return {
      background: bg,
      boxShadow: shadow,
      borderRadius: radius,
      border: border,
      color: c.text,
      padding: '12px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: card.fontFamily,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
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
    printedCards.forEach((card) => {
      const c = card.colors
      let bg = c.bg
      if (card.cardStyle === 'colored' && card.cardEffect === 'gradient') {
        bg = 'linear-gradient(135deg, ' + c.bg + ' 0%, ' + c.accent + ' 100%)'
      }
      let radius = '10px'
      if (card.cardShape === 'square') radius = '6px'
      if (card.cardShape === 'rounded') radius = '18px'
      cardsHTML += `
        <div class="card" style="background: ${bg}; border-radius: ${radius}; border: ${card.borderWidth}px ${card.borderStyle} ${card.borderColor}; padding: 10px; margin: 5px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1; text-align: center; padding: 5px;">
              <div style="font-size: 9px; color: ${card.labelColor};">الشبكة</div>
              <div style="font-size: ${card.networkFontSize}px; color: ${card.networkColor}; font-weight: bold;">${card.network}</div>
            </div>
            ${card.qrEnabled ? `<div style="background: #fff; padding: 2px; border-radius: 4px; margin-right: 8px;">
              <svg width="50" height="50" viewBox="0 0 50 50">
                ${generateRealQR(card.username).map((row, rowIdx) => row.map((cell, colIdx) => cell === 1 ? `<rect x="${colIdx * 2}" y="${rowIdx * 2}" width="2" height="2" fill="#000"/>` : '').join('')).join('')}
              </svg>
            </div>` : ''}
          </div>
          <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 8px; margin: 8px 0; border: 2px dashed ${c.accent}; text-align: center;">
            <div style="font-size: 9px; color: ${card.labelColor};">اسم المستخدم</div>
            <div style="font-size: ${card.cardNumberFontSize}px; color: ${card.usernameColor}; font-weight: bold; font-family: monospace; letter-spacing: 2px;">${card.username}</div>
            <div style="font-size: 9px; color: ${card.labelColor}; margin-top: 5px;">كلمة المرور</div>
            <div style="font-size: ${card.cardNumberFontSize - 2}px; color: ${card.cardNumberColor}; font-weight: bold; font-family: monospace;">${card.password}</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: ${card.infoFontSize}px;">
            <div style="background: rgba(0,0,0,0.2); padding: 4px; border-radius: 6px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor};">الصلاحية</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.validity}</div>
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 4px; border-radius: 6px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor};">الوقت</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.cardTime}</div>
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 4px; border-radius: 6px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor};">البيانات</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.dataPackage}</div>
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 4px; border-radius: 6px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor};">السعر</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.price}</div>
            </div>
          </div>
          ${card.distributor ? `<div style="text-align: center; margin-top: 5px; font-size: 10px; color: ${card.labelColor};">الموزع: ${card.distributor}</div>` : ''}
          ${card.rechargeText ? `<div style="background: #00cc00; color: #fff; padding: 4px; border-radius: 6px; text-align: center; margin-top: 5px; font-size: 10px; font-weight: bold;"> ${card.rechargeText}</div>` : ''}
          ${card.specialOffer ? `<div style="background: rgba(255,255,0,0.2); color: #ffff00; padding: 4px; border-radius: 6px; text-align: center; margin-top: 5px; font-size: 10px;">🎁 ${card.specialOffer}</div>` : ''}
        </div>
      `
    })
    printWindow.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>كروت ${formData.networkName}</title><style>@page { size: A4; margin: 10mm; } * { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: Arial, Tahoma, sans-serif; background: #fff; padding: 10px; } .cards-grid { display: grid; grid-template-columns: repeat(${formData.colsCount || 3}, 1fr); gap: 8px; } .card { page-break-inside: avoid; } @media print { body { padding: 0; } .no-print { display: none !important; } }</style></head><body><div class="no-print" style="background: #0f172a; color: #fff; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 10px;"><h2>🖨️ لتصدير PDF: اضغط Ctrl+P ثم اختر "حفظ كـ PDF"</h2><button onclick="window.print()" style="padding: 15px 30px; background: #00ffff; color: #0f172a; border: none; border-radius: 10px; font-size: 18px; font-weight: bold; cursor: pointer; margin: 10px;">🖨️ طباعة / حفظ PDF</button><button onclick="window.close()" style="padding: 15px 30px; background: #ef4444; color: #fff; border: none; border-radius: 10px; font-size: 18px; font-weight: bold; cursor: pointer; margin: 10px;">إغلاق</button></div><div class="cards-grid">${cardsHTML}</div></body></html>`)
    printWindow.document.close()
  }

  if (!user) {
    return <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><p>جاري التحميل...</p></div>
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
    colors: formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme] : { bg: '#ffffff', accent: '#333333', text: '#000000' },
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* الشعار الأصلي - Jassas Net Card */}
        <div style={{ textAlign: 'center', marginBottom: '30px', padding: '20px', background: 'linear-gradient(135deg, #1e3c72 0%, #d4af37 100%)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(212,175,55,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{ fontSize: '40px' }}>📶</div>
            <div>
              <h1 style={{ color: '#FFD700', fontSize: '36px', margin: '0 0 5px 0', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Jassas Net Card</h1>
              <p style={{ color: '#fff', fontSize: '14px', margin: 0 }}>نظام إدارة شبكات المايكروتك</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,215,0,0.2)', padding: '5px 15px', borderRadius: '20px', color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}>⚡ سرعة عالية</span>
            <span style={{ background: 'rgba(255,215,0,0.2)', padding: '5px 15px', borderRadius: '20px', color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}>️ استقرار دائم</span>
            <span style={{ background: 'rgba(255,215,0,0.2)', padding: '5px 15px', borderRadius: '20px', color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}>🌐 تغطية واسعة</span>
            <span style={{ background: 'rgba(255,215,0,0.2)', padding: '5px 15px', borderRadius: '20px', color: '#FFD700', fontSize: '12px', fontWeight: 'bold' }}>♾️ غير محدود</span>
          </div>
        </div>

        {/* المعاينة المباشرة في الأعلى */}
        {showPreview && (
          <div style={{ marginBottom: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(0,255,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ color: '#00ffff', margin: 0, fontSize: '22px' }}>👁️ معاينة الكرت (مباشرة)</h2>
              <button onClick={() => setShowPreview(false)} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
              <div style={getCardStyle(previewCard)}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '24px', opacity: '0.05', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0 }}>JassasNetCard</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: '8px' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', borderRadius: '10px', padding: '8px 12px', textAlign: 'center', border: previewCard.borderWidth + 'px ' + previewCard.borderStyle + ' ' + previewCard.borderColor, marginRight: (previewCard.qrEnabled || previewCard.rechargeText) ? '8px' : '0', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, marginBottom: '3px' }}>🌐 الشبكة</div>
                    <h3 style={{ margin: 0, fontSize: previewCard.networkFontSize + 'px', color: previewCard.networkColor, fontWeight: 'bold', lineHeight: 1.2, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{previewCard.network}</h3>
                  </div>
                  {(previewCard.qrEnabled || previewCard.rechargeText) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexShrink: 0 }}>
                      {previewCard.qrEnabled && (
                        <div style={{ background: '#fff', borderRadius: '8px', padding: '3px', boxShadow: '0 3px 10px rgba(0,0,0,0.3)', border: '2px solid ' + previewCard.colors.accent }}>
                          <QRCode cardNumber={previewCard.username} size={50} />
                        </div>
                      )}
                      {previewCard.rechargeText && (
                        <div style={{ background: 'linear-gradient(135deg, #00ff00, #00cc00)', borderRadius: '8px', padding: '5px 8px', boxShadow: '0 3px 10px rgba(0,255,0,0.4)', border: '1px solid #00ff00' }}>
                          <div style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}> {previewCard.rechargeText}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(5px)', borderRadius: '10px', padding: '10px', position: 'relative', zIndex: 1, border: '2px dashed ' + previewCard.colors.accent, marginBottom: '8px', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.3)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '4px' }}>👤 اسم المستخدم</div>
                  <div style={{ fontSize: previewCard.cardNumberFontSize + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '3px', color: previewCard.usernameColor, textShadow: '0 2px 4px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>{previewCard.username}</div>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '4px', marginTop: '8px' }}>🔑 كلمة المرور</div>
                  <div style={{ fontSize: (previewCard.cardNumberFontSize - 2) + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '2px', color: previewCard.cardNumberColor, textShadow: '0 2px 4px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>{previewCard.password}</div>
                </div>
                <div style={{ fontSize: previewCard.infoFontSize + 'px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8 }}>الصلاحية</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.validity}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8 }}>الوقت</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.cardTime}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8 }}>البيانات</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.dataPackage}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8 }}>السعر</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.price}</div>
                  </div>
                </div>
                {previewCard.distributor && <div style={{ textAlign: 'center', marginTop: '5px', fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, position: 'relative', zIndex: 1 }}>الموزع: {previewCard.distributor}</div>}
                {previewCard.specialOffer && <div style={{ marginTop: '5px', padding: '5px', background: 'rgba(255,255,0,0.15)', borderRadius: '6px', fontSize: previewCard.labelFontSize + 'px', textAlign: 'center', position: 'relative', zIndex: 1, color: '#ffff00', border: '1px solid rgba(255,255,0,0.4)' }}>🎁 {previewCard.specialOffer}</div>}
              </div>
            </div>
          </div>
        )}

        {/* إعدادات الكرت */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(0,255,255,0.2)' }}>
          <h2 style={{ color: '#00ffff', marginBottom: '20px', fontSize: '24px' }}>⚙️ إعدادات الكرت</h2>

          {/* البروفايل */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>البروفايل</label>
            <select value={formData.profile} onChange={(e) => setFormData({...formData, profile: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
              <option value="DEFAULT">DEFAULT</option>
              <option value="PREMIUM">PREMIUM</option>
              <option value="BASIC">BASIC</option>
            </select>
          </div>

          {/* الصلاحية */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الصلاحية</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
              <input type="number" value={formData.validity} onChange={(e) => setFormData({...formData, validity: e.target.value})} min="1" style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }} />
              <select value={formData.validityType} onChange={(e) => setFormData({...formData, validityType: e.target.value})} style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                <option value="no-expiry">بدون مدة</option>
                <option value="hour">ساعة</option>
                <option value="day">يوم</option>
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
              </select>
            </div>
          </div>

          {/* مدة المستخدم */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>مدة المستخدم</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
              <input type="number" value={formData.userDuration} onChange={(e) => setFormData({...formData, userDuration: e.target.value})} min="1" style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }} />
              <select value={formData.userDurationType} onChange={(e) => setFormData({...formData, userDurationType: e.target.value})} style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                <option value="no-expiry">بدون مدة</option>
                <option value="hour">ساعة</option>
                <option value="day">يوم</option>
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
              </select>
            </div>
          </div>

          {/* باقة البيانات */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>باقة البيانات</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <select value={formData.dataPackage} onChange={(e) => setFormData({...formData, dataPackage: e.target.value})} style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                <option value="unlimited">بدون حد</option>
                <option value="limited">محدد</option>
              </select>
              {formData.dataPackage === 'limited' && (
                <>
                  <input type="number" value={formData.dataAmount} onChange={(e) => setFormData({...formData, dataAmount: e.target.value})} min="1" style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }} />
                  <select value={formData.dataUnit} onChange={(e) => setFormData({...formData, dataUnit: e.target.value})} style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                    <option value="MB">ميجا (MB)</option>
                    <option value="GB">جيجا (GB)</option>
                  </select>
                </>
              )}
            </div>
          </div>

          {/* اسم الشبكة */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اسم الشبكة</label>
            <input type="text" value={formData.networkName} onChange={(e) => setFormData({...formData, networkName: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          {/* وقت الكرت */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>وقت الكرت</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
              <input type="number" value={formData.cardTime} onChange={(e) => setFormData({...formData, cardTime: e.target.value})} min="1" style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }} />
              <select value={formData.cardTimeType} onChange={(e) => setFormData({...formData, cardTimeType: e.target.value})} style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                <option value="hour">ساعة</option>
                <option value="day">يوم</option>
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
              </select>
            </div>
          </div>

          {/* سعر الكرت */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>سعر الكرت</label>
            <input type="number" value={formData.cardPrice} onChange={(e) => setFormData({...formData, cardPrice: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          {/* الموزع */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الموزع (اختياري)</label>
            <input type="text" value={formData.distributor} onChange={(e) => setFormData({...formData, distributor: e.target.value})} placeholder="مثال: عبدالرحمن" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          {/* لون اسم المستخدم */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>لون اسم المستخدم</label>
            <input type="color" value={formData.usernameColor} onChange={(e) => setFormData({...formData, usernameColor: e.target.value})} style={{ width: '100%', height: '50px', border: 'none', borderRadius: '12px', cursor: 'pointer' }} />
          </div>

          {/* عدد أرقام اسم المستخدم */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>عدد أرقام اسم المستخدم: {formData.usernameLength}</label>
            <input type="range" min="6" max="20" value={formData.usernameLength} onChange={(e) => setFormData({...formData, usernameLength: parseInt(e.target.value)})} style={{ width: '100%' }} />
            <div style={{ marginTop: '5px', padding: '8px', background: 'rgba(0,255,255,0.1)', borderRadius: '8px', color: '#00ffff', fontSize: '13px', textAlign: 'center' }}>
              💡 مثال: {generateUsername(formData.usernamePrefix, formData.usernameLength)}
            </div>
          </div>

          {/* بداية اسم المستخدم */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>بداية اسم المستخدم (أرقام فقط)</label>
            <input type="text" value={formData.usernamePrefix} onChange={(e) => setFormData({...formData, usernamePrefix: e.target.value.replace(/[^0-9]/g, '')})} placeholder="مثال: 86" maxLength="5" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          {/* عدد الكروت */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>عدد الكروت</label>
            <input type="number" value={formData.cardsCount} onChange={(e) => setFormData({...formData, cardsCount: parseInt(e.target.value) || 100})} min="1" max="10000" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          {/* عدد الصفوف والأعمدة */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>عدد الصفوف</label>
              <input type="number" value={formData.rowsCount} onChange={(e) => setFormData({...formData, rowsCount: parseInt(e.target.value) || 5})} min="1" max="20" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>عدد الأعمدة</label>
              <input type="number" value={formData.colsCount} onChange={(e) => setFormData({...formData, colsCount: parseInt(e.target.value) || 3})} min="1" max="10" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* خيارات إضافية */}
          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.2)' }}>
            <h3 style={{ color: '#00ffff', margin: '0 0 15px 0', fontSize: '16px' }}>⚙️ خيارات إضافية</h3>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <input type="checkbox" checked={formData.enableQR} onChange={(e) => setFormData({...formData, enableQR: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                <label style={{ color: '#e2e8f0', fontWeight: 'bold' }}>تفعيل QR Code</label>
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}> نص الشحن (اختياري - اكتب أي شيء)</label>
              <input type="text" value={formData.rechargeText} onChange={(e) => setFormData({...formData, rechargeText: e.target.value})} placeholder="مثال: بنكك، تحويل، يوجد شحن، إلخ..." style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>💡 اتركه فارغاً إذا لا تريد إظهاره</div>
            </div>
            <div>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🎁 عرض خاص (اختياري)</label>
              <textarea value={formData.specialOffer} onChange={(e) => setFormData({...formData, specialOffer: e.target.value})} rows="2" placeholder="مثال: للتواصل: 0123456789" style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* تصميم الكرت */}
          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.2)' }}>
            <h3 style={{ color: '#00ffff', margin: '0 0 15px 0', fontSize: '16px' }}>🎨 تصميم الكرت</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نوع التصميم</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => setFormData({...formData, cardStyle: 'plain'})} style={{ padding: '12px', background: formData.cardStyle === 'plain' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardStyle === 'plain' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>عادي</button>
                <button onClick={() => setFormData({...formData, cardStyle: 'colored'})} style={{ padding: '12px', background: formData.cardStyle === 'colored' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardStyle === 'colored' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>ملون</button>
              </div>
            </div>
            {formData.cardStyle === 'colored' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نظام الألوان</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {Object.entries(colorSchemes).map(([key, val]) => (
                    <button key={key} onClick={() => setFormData({...formData, colorScheme: key})} style={{ padding: '10px', background: 'linear-gradient(135deg, ' + val.bg + ', ' + val.accent + ')', border: formData.colorScheme === key ? '3px solid #fff' : '2px solid transparent', borderRadius: '10px', color: '#fff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
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
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>التأثير</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['plain', 'gradient', '3d', 'shadow', 'glow'].map(effect => (
                  <button key={effect} onClick={() => setFormData({...formData, cardEffect: effect})} style={{ padding: '12px', background: formData.cardEffect === effect ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardEffect === effect ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {effect === 'plain' && 'عادي'}
                    {effect === 'gradient' && 'مدرج'}
                    {effect === '3d' && '3D'}
                    {effect === 'shadow' && 'مظل'}
                    {effect === 'glow' && 'موهج'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>شكل الكرت</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <button onClick={() => setFormData({...formData, cardShape: 'rectangle'})} style={{ padding: '12px', background: formData.cardShape === 'rectangle' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardShape === 'rectangle' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مستطيل</button>
                <button onClick={() => setFormData({...formData, cardShape: 'square'})} style={{ padding: '12px', background: formData.cardShape === 'square' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardShape === 'square' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مربع</button>
                <button onClick={() => setFormData({...formData, cardShape: 'rounded'})} style={{ padding: '12px', background: formData.cardShape === 'rounded' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardShape === 'rounded' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مدور</button>
              </div>
            </div>
          </div>

          {/* أزرار الإنشاء */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <button onClick={generateCards} style={{ padding: '18px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,255,255,0.4)' }}>
              🖨️ إنشاء الكروت
            </button>
            <button onClick={exportToPDF} disabled={printedCards.length === 0} style={{ padding: '18px', background: printedCards.length > 0 ? 'linear-gradient(135deg, #ff6b6b, #ee5a6f)' : '#666', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: printedCards.length > 0 ? 'pointer' : 'not-allowed', boxShadow: printedCards.length > 0 ? '0 5px 20px rgba(238,90,111,0.4)' : 'none' }}>
              📄 تصدير PDF
            </button>
          </div>
        </div>

        {/* عرض الكروت المطبوعة */}
        {printedCards.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ color: '#00ffff', marginBottom: '20px' }}> الكروت المُنشأة ({printedCards.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              {printedCards.slice(0, 6).map((card, index) => (
                <div key={index} style={getCardStyle(card)}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '24px', opacity: '0.05', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0 }}>JassasNetCard</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: '8px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', borderRadius: '10px', padding: '8px 12px', textAlign: 'center', border: card.borderWidth + 'px ' + card.borderStyle + ' ' + card.borderColor, marginRight: (card.qrEnabled || card.rechargeText) ? '8px' : '0', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, marginBottom: '3px' }}> الشبكة</div>
                      <h3 style={{ margin: 0, fontSize: card.networkFontSize + 'px', color: card.networkColor, fontWeight: 'bold', lineHeight: 1.2, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{card.network}</h3>
                    </div>
                    {(card.qrEnabled || card.rechargeText) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexShrink: 0 }}>
                        {card.qrEnabled && (
                          <div style={{ background: '#fff', borderRadius: '8px', padding: '3px', boxShadow: '0 3px 10px rgba(0,0,0,0.3)', border: '2px solid ' + card.colors.accent }}>
                            <QRCode cardNumber={card.username} size={50} />
                          </div>
                        )}
                        {card.rechargeText && (
                          <div style={{ background: 'linear-gradient(135deg, #00ff00, #00cc00)', borderRadius: '8px', padding: '5px 8px', boxShadow: '0 3px 10px rgba(0,255,0,0.4)', border: '1px solid #00ff00' }}>
                            <div style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}> {card.rechargeText}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(5px)', borderRadius: '10px', padding: '10px', position: 'relative', zIndex: 1, border: '2px dashed ' + card.colors.accent, marginBottom: '8px', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '4px' }}> اسم المستخدم</div>
                    <div style={{ fontSize: card.cardNumberFontSize + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '3px', color: card.usernameColor, textShadow: '0 2px 4px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>{card.username}</div>
                    <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '4px', marginTop: '8px' }}>🔑 كلمة المرور</div>
                    <div style={{ fontSize: (card.cardNumberFontSize - 2) + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '2px', color: card.cardNumberColor, textShadow: '0 2px 4px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>{card.password}</div>
                  </div>
                  <div style={{ fontSize: card.infoFontSize + 'px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8 }}>الصلاحية</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.validity}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8 }}>الوقت</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.cardTime}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8 }}>البيانات</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.dataPackage}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8 }}>السعر</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.price}</div>
                    </div>
                  </div>
                  {card.distributor && <div style={{ textAlign: 'center', marginTop: '5px', fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, position: 'relative', zIndex: 1 }}>الموزع: {card.distributor}</div>}
                  {card.specialOffer && <div style={{ marginTop: '5px', padding: '5px', background: 'rgba(255,255,0,0.15)', borderRadius: '6px', fontSize: card.labelFontSize + 'px', textAlign: 'center', position: 'relative', zIndex: 1, color: '#ffff00', border: '1px solid rgba(255,255,0,0.4)' }}>🎁 {card.specialOffer}</div>}
                </div>
              ))}
            </div>
            {printedCards.length > 6 && (
              <button onClick={() => {}} style={{ width: '100%', padding: '15px', background: 'rgba(0,255,255,0.1)', color: '#00ffff', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                عرض كل الكروت ({printedCards.length}) - استخدم تصدير PDF لرؤية الكل
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

print('✅ تم استعادة الشعار الأصلي Jassas Net Card!')
