"use client"
import { useState, useEffect } from 'react'

export default function PrintCardsPage() {
  const [user, setUser] = useState<any>(null)
  const [printedCards, setPrintedCards] = useState<any[]>([])
  const [activeSection, setActiveSection] = useState('basic')

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
    qrSize: 50,
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
        qrSize: formData.qrSize,
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
        fontFamily: 'Arial, Tahoma, sans-serif'
      })
    }
    setPrintedCards(cards)
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
              <svg width="${card.qrSize}" height="${card.qrSize}" viewBox="0 0 50 50">
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
              <div style="font-size: 8px; color: ${card.labelColor}; margin-bottom: 3px;"> البيانات</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.dataPackage}</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 8px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor}; margin-bottom: 3px;"> السعر</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.price}</div>
            </div>
          </div>
          ${card.distributor ? `<div style="text-align: center; margin-top: 8px; font-size: 10px; color: ${card.labelColor}; background: rgba(255,255,255,0.1); padding: 4px; border-radius: 6px;">الموزع: ${card.distributor}</div>` : ''}
          ${card.rechargeText ? `<div style="background: linear-gradient(135deg, #00ff00, #00cc00); color: #fff; padding: 5px; border-radius: 8px; text-align: center; margin-top: 6px; font-size: 10px; font-weight: bold; border: 1px solid #00ff00;">⚡ ${card.rechargeText}</div>` : ''}
          ${card.specialOffer ? `<div style="background: rgba(255,215,0,0.2); color: #FFD700; padding: 5px; border-radius: 8px; text-align: center; margin-top: 6px; font-size: 10px; border: 1px solid #FFD700;">🎁 ${card.specialOffer}</div>` : ''}
        </div>
      `
    })
    printWindow.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>كروت ${formData.networkName}</title><style>@page { size: A4; margin: 8mm; } * { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: Arial, Tahoma, sans-serif; background: #fff; padding: 10px; } .cards-grid { display: grid; grid-template-columns: repeat(${formData.colsCount || 3}, 1fr); gap: 8px; } .card { page-break-inside: avoid; } @media print { body { padding: 0; } .no-print { display: none !important; } }</style></head><body><div class="no-print" style="background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; padding: 25px; text-align: center; margin-bottom: 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"><h2 style="margin-bottom: 15px; font-size: 22px;">🖨️ لتصدير PDF</h2><p style="margin-bottom: 15px; font-size: 16px;">اضغط Ctrl+P ثم اختر "حفظ كـ PDF"</p><button onclick="window.print()" style="padding: 15px 35px; background: linear-gradient(135deg, #00ffff, #00bfff); color: #0f172a; border: none; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer; margin: 10px; box-shadow: 0 5px 20px rgba(0,255,255,0.3);">️ طباعة / حفظ PDF</button><button onclick="window.close()" style="padding: 15px 35px; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; border: none; border-radius: 12px; font-size: 18px; font-weight: bold; cursor: pointer; margin: 10px; box-shadow: 0 5px 20px rgba(239,68,68,0.3);">إغلاق</button></div><div class="cards-grid">${cardsHTML}</div></body></html>`)
    printWindow.document.close()
  }

  if (!user) {
    return <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><div style={{ textAlign: 'center' }}><div style={{ width: '60px', height: '60px', border: '5px solid #00ffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div><p style={{ fontSize: '18px' }}>جاري التحميل...</p></div><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>
  }

  const InputRow = ({ label, children, icon = '' }: { label: string, children: any, icon?: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.2)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00ffff'; e.currentTarget.style.background = 'rgba(0,0,0,0.4)' }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,255,255,0.2)'; e.currentTarget.style.background = 'rgba(0,0,0,0.3)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
        {children}
      </div>
      <div style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon && <span>{icon}</span>}
        {label}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2d3748 100%)', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        {/* الشعار */}
        <div style={{ textAlign: 'center', marginBottom: '25px', padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(102,126,234,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ fontSize: '40px' }}>📶</div>
            <div>
              <h1 style={{ color: '#FFD700', fontSize: '32px', margin: '0 0 3px 0', fontWeight: 'bold', textShadow: '0 3px 10px rgba(0,0,0,0.5)' }}>Jassas Net Card</h1>
              <p style={{ color: '#fff', fontSize: '13px', margin: 0, opacity: 0.9 }}>نظام إدارة شبكات المايكروتك الاحترافي</p>
            </div>
          </div>
        </div>

        {/* الأقسام */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '12px', flexWrap: 'wrap' }}>
          {[
            { id: 'basic', icon: '⚙️', label: 'الأساسية' },
            { id: 'numbers', icon: '🔢', label: 'الأرقام' },
            { id: 'design', icon: '🎨', label: 'التصميم' },
            { id: 'extra', icon: '', label: 'إضافي' }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                flex: '1 1 calc(50% - 4px)',
                padding: '12px',
                background: activeSection === section.id ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'transparent',
                color: activeSection === section.id ? '#0f172a' : '#e2e8f0',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: activeSection === section.id ? 'bold' : 'normal',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.3s',
                minWidth: '120px'
              }}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* المحتوى */}
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(0,255,255,0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
          
          {activeSection === 'basic' && (
            <>
              <h2 style={{ color: '#00ffff', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>⚙️</span> الإعدادات الأساسية
              </h2>
              
              <InputRow label="البروفايل" icon="👤">
                <select value={formData.profile} onChange={(e) => setFormData({...formData, profile: e.target.value})} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }}>
                  <option value="DEFAULT">DEFAULT</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="BASIC">BASIC</option>
                </select>
              </InputRow>

              <InputRow label="الصلاحية" icon="✓">
                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                  <input type="number" value={formData.validity} onChange={(e) => setFormData({...formData, validity: e.target.value})} min="1" style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
                  <select value={formData.validityType} onChange={(e) => setFormData({...formData, validityType: e.target.value})} style={{ flex: 2, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                    <option value="no-expiry">بدون مدة</option>
                    <option value="hour">ساعة</option>
                    <option value="day">يوم</option>
                    <option value="week">أسبوع</option>
                    <option value="month">شهر</option>
                  </select>
                </div>
              </InputRow>

              <InputRow label="مدة المستخدم" icon="⏱️">
                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                  <input type="number" value={formData.userDuration} onChange={(e) => setFormData({...formData, userDuration: e.target.value})} min="1" style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
                  <select value={formData.userDurationType} onChange={(e) => setFormData({...formData, userDurationType: e.target.value})} style={{ flex: 2, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                    <option value="no-expiry">بدون مدة</option>
                    <option value="hour">ساعة</option>
                    <option value="day">يوم</option>
                    <option value="week">أسبوع</option>
                    <option value="month">شهر</option>
                  </select>
                </div>
              </InputRow>

              <InputRow label="باقة البيانات" icon="💾">
                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                  <select value={formData.dataPackage} onChange={(e) => setFormData({...formData, dataPackage: e.target.value})} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                    <option value="unlimited">بدون حد</option>
                    <option value="limited">محدد</option>
                  </select>
                  {formData.dataPackage === 'limited' && (
                    <>
                      <input type="number" value={formData.dataAmount} onChange={(e) => setFormData({...formData, dataAmount: e.target.value})} min="1" style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
                      <select value={formData.dataUnit} onChange={(e) => setFormData({...formData, dataUnit: e.target.value})} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                        <option value="MB">MB</option>
                        <option value="GB">GB</option>
                      </select>
                    </>
                  )}
                </div>
              </InputRow>

              <InputRow label="اسم الشبكة" icon="🌐">
                <input type="text" value={formData.networkName} onChange={(e) => setFormData({...formData, networkName: e.target.value})} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
              </InputRow>

              <InputRow label="وقت الكرت" icon="⏰">
                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                  <input type="number" value={formData.cardTime} onChange={(e) => setFormData({...formData, cardTime: e.target.value})} min="1" style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
                  <select value={formData.cardTimeType} onChange={(e) => setFormData({...formData, cardTimeType: e.target.value})} style={{ flex: 2, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                    <option value="hour">ساعة</option>
                    <option value="day">يوم</option>
                    <option value="week">أسبوع</option>
                    <option value="month">شهر</option>
                  </select>
                </div>
              </InputRow>

              <InputRow label="سعر الكرت" icon="💰">
                <input type="number" value={formData.cardPrice} onChange={(e) => setFormData({...formData, cardPrice: e.target.value})} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
              </InputRow>

              <InputRow label="الموزع" icon="">
                <input type="text" value={formData.distributor} onChange={(e) => setFormData({...formData, distributor: e.target.value})} placeholder="عبدالرحمن" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
              </InputRow>
            </>
          )}

          {activeSection === 'numbers' && (
            <>
              <h2 style={{ color: '#00ffff', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🔢</span> إعدادات الأرقام
              </h2>

              <InputRow label="بداية اسم المستخدم" icon="🔢">
                <input type="text" value={formData.usernamePrefix} onChange={(e) => setFormData({...formData, usernamePrefix: e.target.value.replace(/[^0-9]/g, '')})} placeholder="86" maxLength="5" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
              </InputRow>

              <InputRow label={`عدد الأرقام: ${formData.usernameLength}`} icon="">
                <input type="range" min="6" max="20" value={formData.usernameLength} onChange={(e) => setFormData({...formData, usernameLength: parseInt(e.target.value)})} style={{ flex: 1 }} />
              </InputRow>

              <div style={{ padding: '12px', background: 'rgba(0,255,255,0.1)', borderRadius: '10px', color: '#00ffff', fontSize: '14px', textAlign: 'center', marginBottom: '15px', border: '1px solid rgba(0,255,255,0.2)' }}>
                 مثال: <strong style={{ fontFamily: 'monospace', fontSize: '16px' }}>{generateUsername(formData.usernamePrefix, formData.usernameLength)}</strong>
              </div>

              <InputRow label="لون اسم المستخدم" icon="🎨">
                <input type="color" value={formData.usernameColor} onChange={(e) => setFormData({...formData, usernameColor: e.target.value})} style={{ flex: 1, height: '45px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
              </InputRow>

              <InputRow label="عدد الكروت" icon="📦">
                <input type="number" value={formData.cardsCount} onChange={(e) => setFormData({...formData, cardsCount: parseInt(e.target.value) || 100})} min="1" max="10000" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
              </InputRow>

              <InputRow label="عدد الأعمدة" icon="">
                <input type="number" value={formData.colsCount} onChange={(e) => setFormData({...formData, colsCount: parseInt(e.target.value) || 3})} min="1" max="10" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
              </InputRow>
            </>
          )}

          {activeSection === 'design' && (
            <>
              <h2 style={{ color: '#00ffff', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🎨</span> تصميم الكرت
              </h2>

              <InputRow label="نوع التصميم" icon="🎭">
                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                  <button onClick={() => setFormData({...formData, cardStyle: 'plain'})} style={{ flex: 1, padding: '12px', background: formData.cardStyle === 'plain' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(0,0,0,0.5)', color: formData.cardStyle === 'plain' ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>عادي</button>
                  <button onClick={() => setFormData({...formData, cardStyle: 'colored'})} style={{ flex: 1, padding: '12px', background: formData.cardStyle === 'colored' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(0,0,0,0.5)', color: formData.cardStyle === 'colored' ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>ملون</button>
                </div>
              </InputRow>

              {formData.cardStyle === 'colored' && (
                <InputRow label="نظام الألوان" icon="🌈">
                  <select value={formData.colorScheme} onChange={(e) => setFormData({...formData, colorScheme: e.target.value})} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                    {Object.keys(colorSchemes).map((key: string) => (
                      <option key={key} value={key}>
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
                      </option>
                    ))}
                  </select>
                </InputRow>
              )}

              <InputRow label="التأثير" icon="✨">
                <select value={formData.cardEffect} onChange={(e) => setFormData({...formData, cardEffect: e.target.value})} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                  <option value="plain">عادي</option>
                  <option value="gradient">مدرج</option>
                  <option value="3d">3D</option>
                  <option value="shadow">مظل</option>
                  <option value="glow">موهج</option>
                </select>
              </InputRow>

              <InputRow label="شكل الكرت" icon="📱">
                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                  <button onClick={() => setFormData({...formData, cardShape: 'rectangle'})} style={{ flex: 1, padding: '10px', background: formData.cardShape === 'rectangle' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(0,0,0,0.5)', color: formData.cardShape === 'rectangle' ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مستطيل</button>
                  <button onClick={() => setFormData({...formData, cardShape: 'square'})} style={{ flex: 1, padding: '10px', background: formData.cardShape === 'square' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(0,0,0,0.5)', color: formData.cardShape === 'square' ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مربع</button>
                  <button onClick={() => setFormData({...formData, cardShape: 'rounded'})} style={{ flex: 1, padding: '10px', background: formData.cardShape === 'rounded' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(0,0,0,0.5)', color: formData.cardShape === 'rounded' ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مدور</button>
                </div>
              </InputRow>

              <InputRow label="نوع الإطار" icon="框">
                <select value={formData.borderStyle} onChange={(e) => setFormData({...formData, borderStyle: e.target.value})} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                  <option value="solid">متصل ━</option>
                  <option value="dashed">متقطع ┄</option>
                  <option value="dotted">منقط ┈</option>
                </select>
              </InputRow>

              <InputRow label={`سمك الإطار: ${formData.borderWidth}px`} icon="">
                <input type="range" min="1" max="8" value={formData.borderWidth} onChange={(e) => setFormData({...formData, borderWidth: parseInt(e.target.value)})} style={{ flex: 1 }} />
              </InputRow>
            </>
          )}

          {activeSection === 'extra' && (
            <>
              <h2 style={{ color: '#00ffff', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>➕</span> خيارات إضافية
              </h2>

              <InputRow label="QR Code" icon="📱">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <input type="checkbox" checked={formData.enableQR} onChange={(e) => setFormData({...formData, enableQR: e.target.checked})} style={{ width: '22px', height: '22px', cursor: 'pointer' }} />
                  <span style={{ color: '#e2e8f0', fontSize: '14px' }}>تفعيل</span>
                </div>
              </InputRow>

              {formData.enableQR && (
                <InputRow label={`حجم QR: ${formData.qrSize}px`} icon="📐">
                  <input type="range" min="40" max="80" value={formData.qrSize} onChange={(e) => setFormData({...formData, qrSize: parseInt(e.target.value)})} style={{ flex: 1 }} />
                </InputRow>
              )}

              <InputRow label="نص الشحن" icon="⚡">
                <input type="text" value={formData.rechargeText} onChange={(e) => setFormData({...formData, rechargeText: e.target.value})} placeholder="بنكك، تحويل، يوجد شحن..." style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
              </InputRow>

              <InputRow label="عرض خاص" icon="🎁">
                <textarea value={formData.specialOffer} onChange={(e) => setFormData({...formData, specialOffer: e.target.value})} rows="2" placeholder="للتواصل: 0123456789" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '14px', resize: 'vertical', textAlign: 'center' }} />
              </InputRow>
            </>
          )}

          {/* أزرار الإنشاء */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '25px' }}>
            <button onClick={generateCards} style={{ padding: '18px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '17px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 25px rgba(0,255,255,0.4)', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              🖨️ إنشاء الكروت
            </button>
            <button onClick={exportToPDF} disabled={printedCards.length === 0} style={{ padding: '18px', background: printedCards.length > 0 ? 'linear-gradient(135deg, #ff6b6b, #ee5a6f)' : '#666', color: '#fff', fontSize: '17px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: printedCards.length > 0 ? 'pointer' : 'not-allowed', boxShadow: printedCards.length > 0 ? '0 8px 25px rgba(238,90,111,0.4)' : 'none', transition: 'all 0.3s' }} onMouseEnter={(e) => { if (printedCards.length > 0) e.currentTarget.style.transform = 'translateY(-3px)' }} onMouseLeave={(e) => { if (printedCards.length > 0) e.currentTarget.style.transform = 'translateY(0)' }}>
              📄 تصدير PDF
            </button>
          </div>
        </div>

        {/* معاينة الكروت */}
        {printedCards.length > 0 && (
          <div style={{ marginTop: '25px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(0,255,255,0.2)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color: '#00ffff', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold' }}>📋 الكروت المُنشأة ({printedCards.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
              {printedCards.slice(0, 6).map((card: any, index: number) => (
                <div key={index} style={{ background: card.colors.bg, borderRadius: '15px', border: `${card.borderWidth}px ${card.borderStyle} ${card.colors.accent}`, padding: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', minHeight: '220px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '10px', textAlign: 'center', border: `2px solid ${card.colors.accent}` }}>
                      <div style={{ fontSize: '10px', color: card.colors.text, opacity: 0.9 }}>🌐 الشبكة</div>
                      <div style={{ fontSize: '18px', color: card.networkColor, fontWeight: 'bold' }}>{card.network}</div>
                    </div>
                    {card.qrEnabled && (
                      <div style={{ background: '#fff', padding: '3px', borderRadius: '6px', marginLeft: '8px', border: `2px solid ${card.colors.accent}` }}>
                        <QRCode cardNumber={card.username} size={card.qrSize} />
                      </div>
                    )}
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '10px', margin: '10px 0', border: `2px dashed ${card.colors.accent}`, textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: card.labelColor, marginBottom: '5px' }}> اسم المستخدم</div>
                    <div style={{ fontSize: '20px', color: card.usernameColor, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px' }}>{card.username}</div>
                    <div style={{ fontSize: '9px', color: card.labelColor, margin: '8px 0 5px 0' }}>🔑 كلمة المرور</div>
                    <div style={{ fontSize: '16px', color: card.cardNumberColor, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px' }}>{card.password}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '8px', textAlign: 'center', border: `1px solid ${card.colors.accent}` }}>
                      <div style={{ fontSize: '8px', color: card.labelColor }}>⏱️ المدة</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor }}>{card.validity}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '8px', textAlign: 'center', border: `1px solid ${card.colors.accent}` }}>
                      <div style={{ fontSize: '8px', color: card.labelColor }}> الوقت</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor }}>{card.cardTime}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '8px', textAlign: 'center', border: `1px solid ${card.colors.accent}` }}>
                      <div style={{ fontSize: '8px', color: card.labelColor }}>💾 البيانات</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor }}>{card.dataPackage}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '8px', textAlign: 'center', border: `1px solid ${card.colors.accent}` }}>
                      <div style={{ fontSize: '8px', color: card.labelColor }}>💰 السعر</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor }}>{card.price}</div>
                    </div>
                  </div>
                  {card.rechargeText && <div style={{ background: 'linear-gradient(135deg, #00ff00, #00cc00)', color: '#fff', padding: '5px', borderRadius: '8px', textAlign: 'center', marginTop: '8px', fontSize: '10px', fontWeight: 'bold' }}>⚡ {card.rechargeText}</div>}
                  {card.specialOffer && <div style={{ background: 'rgba(255,215,0,0.2)', color: '#FFD700', padding: '5px', borderRadius: '8px', textAlign: 'center', marginTop: '8px', fontSize: '10px' }}>🎁 {card.specialOffer}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
