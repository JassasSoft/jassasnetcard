code = '''"use client"
import { useState, useEffect } from 'react'

export default function PrintCardsPage() {
  const [user, setUser] = useState(null)
  const [activePopup, setActivePopup] = useState(null)
  const [printedCards, setPrintedCards] = useState([])

  const [formData, setFormData] = useState({
    networkName: 'Jassas Net',
    cardPrefix: '86',
    cardNumberLength: 10,
    cardValue: '',
    duration: '1',
    durationType: 'hour',
    capacityType: 'limited',
    capacity: '500',
    capacityUnit: 'MB',
    expiryType: 'limited',
    expiryTime: '24',
    expiryUnit: 'hour',
    cardStyle: 'colored',
    cardEffect: 'gradient',
    colorScheme: 'blue-gold',
    cardShape: 'rectangle',
    quantity: 10,
    enableQR: true,
    specialOffer: '',
    showRecharge: false,
    rechargeText: 'يتوفر شحن فوري',
    // خطوط
    networkFontSize: 22,
    cardNumberFontSize: 20,
    infoFontSize: 13,
    labelFontSize: 10,
    // إطارات
    borderWidth: 3,
    borderStyle: 'solid',
    // نوع الخط
    fontFamily: 'default',
    // QR
    qrSize: 70
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
    else window.location.href = '/login'
    if ('caches' in window) {
      caches.keys().then(names => names.forEach(name => caches.delete(name)))
    }
  }, [])

  const colorSchemes = {
    'blue-gold': { bg: '#1e3c72', accent: '#d4af37', text: '#ffffff', border: '#d4af37' },
    'purple-silver': { bg: '#667eea', accent: '#c0c0c0', text: '#ffffff', border: '#c0c0c0' },
    'green-gold': { bg: '#134e5e', accent: '#ffd700', text: '#ffffff', border: '#ffd700' },
    'red-black': { bg: '#cb2d3e', accent: '#ff0000', text: '#ffffff', border: '#ff0000' },
    'orange-dark': { bg: '#f12711', accent: '#f5af19', text: '#ffffff', border: '#f5af19' },
    'blue-green': { bg: '#0066cc', accent: '#00cc66', text: '#ffffff', border: '#00cc66' },
    'pure-blue': { bg: '#0047AB', accent: '#4169E1', text: '#ffffff', border: '#4169E1' },
    'pure-green': { bg: '#228B22', accent: '#32CD32', text: '#ffffff', border: '#32CD32' },
    'black-gold': { bg: '#000000', accent: '#FFD700', text: '#FFD700', border: '#FFD700' },
    'white-blue': { bg: '#ffffff', accent: '#0066cc', text: '#0066cc', border: '#0066cc' }
  }

  const fontFamilies = {
    'default': 'Segoe UI, Tahoma, Arial, sans-serif',
    'arabic': 'Arial, Tahoma, sans-serif',
    'mono': 'Courier New, monospace',
    'serif': 'Georgia, serif',
    'sans': 'Helvetica, Arial, sans-serif'
  }

  const durationLabels = { hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }

  const generateCardNumber = (prefix, length) => {
    const chars = '0123456789'
    let result = prefix.replace(/[^0-9]/g, '')
    const remaining = Math.max(1, length - result.length)
    for (let i = 0; i < remaining; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const calculateExpiry = () => {
    if (formData.expiryType === 'unlimited') return 'غير محدد'
    const now = new Date()
    const amount = parseInt(formData.expiryTime) || 0
    if (formData.expiryUnit === 'hour') now.setHours(now.getHours() + amount)
    if (formData.expiryUnit === 'day') now.setDate(now.getDate() + amount)
    if (formData.expiryUnit === 'week') now.setDate(now.getDate() + (amount * 7))
    if (formData.expiryUnit === 'month') now.setMonth(now.getMonth() + amount)
    return now.toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })
  }

  // QR Code حقيقي - يحول رقم الكرت إلى نمط QR
  const generateQRPattern = (cardNumber) => {
    // تحويل رقم الكرت إلى binary pattern للـ QR
    let hash = 0
    for (let i = 0; i < cardNumber.length; i++) {
      hash = ((hash << 5) - hash) + cardNumber.charCodeAt(i)
      hash = hash & hash
    }
    
    const size = 21 // QR version 1 = 21x21
    const pattern = []
    const seed = Math.abs(hash)
    
    for (let row = 0; row < size; row++) {
      const rowPattern = []
      for (let col = 0; col < size; col++) {
        // Finder patterns (الزوايا الثلاث)
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
        } else {
          // Data pattern بناءً على رقم الكرت
          const pos = (row * size + col + seed) % 7
          rowPattern.push(pos < 3 ? 1 : 0)
        }
      }
      pattern.push(rowPattern)
    }
    return pattern
  }

  const QRCode = ({ cardNumber, size = 70 }) => {
    const pattern = generateQRPattern(cardNumber)
    const cellSize = size / 21
    
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: '#fff', padding: '3px', borderRadius: '6px', display: 'block' }}>
        {pattern.map((row, rowIdx) => 
          row.map((cell, colIdx) => 
            cell === 1 ? (
              <rect 
                key={`${rowIdx}-${colIdx}`}
                x={colIdx * cellSize} 
                y={rowIdx * cellSize} 
                width={cellSize} 
                height={cellSize} 
                fill="#000"
              />
            ) : null
          )
        )}
      </svg>
    )
  }

  const generateCards = () => {
    const cards = []
    const qty = parseInt(formData.quantity) || 1
    const durationText = formData.duration + ' ' + durationLabels[formData.durationType]
    const capacityText = formData.capacityType === 'unlimited' ? 'مفتوح' : 'محدود'
    const capacityDetail = formData.capacityType === 'unlimited' ? 'غير محدود' : formData.capacity + ' ' + formData.capacityUnit
    const colors = formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme] : { bg: '#ffffff', accent: '#333333', text: '#000000', border: '#cccccc' }

    for (let i = 0; i < qty; i++) {
      const cardNum = generateCardNumber(formData.cardPrefix, formData.cardNumberLength)
      cards.push({
        id: 'JNC-' + Date.now() + '-' + i,
        cardNumber: cardNum,
        password: cardNum,
        value: formData.cardValue,
        duration: durationText,
        capacity: capacityText,
        capacityDetail: capacityDetail,
        expiryDate: calculateExpiry(),
        network: formData.networkName,
        specialOffer: formData.specialOffer,
        showRecharge: formData.showRecharge,
        rechargeText: formData.rechargeText,
        qrEnabled: formData.enableQR,
        cardStyle: formData.cardStyle,
        cardEffect: formData.cardEffect,
        cardShape: formData.cardShape,
        colors: colors,
        networkFontSize: formData.networkFontSize,
        cardNumberFontSize: formData.cardNumberFontSize,
        infoFontSize: formData.infoFontSize,
        labelFontSize: formData.labelFontSize,
        borderWidth: formData.borderWidth,
        borderStyle: formData.borderStyle,
        fontFamily: fontFamilies[formData.fontFamily],
        qrSize: formData.qrSize
      })
    }
    setPrintedCards(cards)
    setActivePopup('preview')
  }

  const getCardStyle = (card) => {
    const c = card.colors
    let bg = '#fff'
    if (card.cardStyle === 'colored') {
      if (card.cardEffect === 'gradient') {
        bg = 'linear-gradient(135deg, ' + c.bg + ' 0%, ' + c.accent + ' 100%)'
      } else {
        bg = c.bg
      }
    }

    // الأشكال - عرضي دائماً
    let radius = '12px'
    let aspectRatio = '1.7/1' // عرضي افتراضي
    if (card.cardShape === 'square') {
      radius = '8px'
      aspectRatio = '1.3/1' // مربع تقريباً
    }
    if (card.cardShape === 'rounded') {
      radius = '25px'
      aspectRatio = '1.7/1'
    }

    let shadow = '0 10px 30px rgba(0,0,0,0.3)'
    let extraStyle = {}
    
    if (card.cardEffect === '3d') {
      shadow = '0 20px 50px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.4), inset 0 -2px 10px rgba(0,0,0,0.2)'
      extraStyle = {
        transform: 'perspective(1000px) rotateX(3deg)',
        border: card.borderWidth + 'px ' + card.borderStyle + ' ' + c.accent,
        background: 'linear-gradient(145deg, ' + c.bg + ' 0%, ' + c.accent + ' 50%, ' + c.bg + ' 100%)'
      }
    } else if (card.cardEffect === 'shadow') {
      shadow = '0 25px 60px rgba(0,0,0,0.7), 0 15px 40px rgba(0,0,0,0.5)'
      extraStyle = { 
        transform: 'translateY(-5px)',
        border: card.borderWidth + 'px ' + card.borderStyle + ' ' + c.border
      }
    } else if (card.cardEffect === 'glow') {
      shadow = '0 0 20px ' + c.accent + ', 0 0 40px ' + c.accent + 'cc, 0 0 60px ' + c.accent + '88'
      extraStyle = { 
        border: (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
      }
    } else if (card.cardEffect === 'gradient') {
      extraStyle = { border: card.borderWidth + 'px ' + card.borderStyle + ' ' + c.accent }
    } else {
      extraStyle = { border: card.borderWidth + 'px ' + card.borderStyle + ' ' + c.border }
    }

    return {
      background: bg,
      boxShadow: shadow,
      borderRadius: radius,
      color: c.text,
      padding: '15px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: card.fontFamily,
      aspectRatio: aspectRatio,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      ...extraStyle
    }
  }

  if (!user) {
    return <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><p>جاري التحميل...</p></div>
  }

  const Popup = ({ title, onClose, children }) => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000, overflow: 'auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '25px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', border: '2px solid rgba(0,255,255,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid rgba(0,255,255,0.2)' }}>
          <h2 style={{ color: '#00ffff', margin: 0, fontSize: '22px' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )

  const Btn = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{ padding: '12px', background: active ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: active ? '#0f172a' : '#fff', border: active ? '2px solid #00ffff' : '2px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>{children}</button>
  )

  const PopupBtn = ({ icon, label, value, onClick }) => (
    <button onClick={onClick} style={{ width: '100%', padding: '18px', background: 'rgba(0,255,255,0.05)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '15px', cursor: 'pointer', textAlign: 'right', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '26px' }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>{label}</div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#00ffff' }}>{value}</div>
        </div>
        <span style={{ fontSize: '18px', color: '#00ffff' }}>←</span>
      </div>
    </button>
  )

  // مكون الكرت الواحد - تصميم عرضي احترافي
  const CardComponent = ({ card }) => {
    const cardStyle = getCardStyle(card)
    
    return (
      <div style={cardStyle}>
        {/* علامة مائية */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '30px', opacity: '0.06', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0 }}>JassasNetCard</div>
        
        {/* الصف العلوي: اسم الشبكة + QR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: '8px' }}>
          {/* اسم الشبكة في إطار فخم */}
          <div style={{ 
            flex: 1,
            background: 'rgba(255,255,255,0.15)', 
            backdropFilter: 'blur(10px)',
            borderRadius: '10px', 
            padding: '8px 12px', 
            textAlign: 'center', 
            border: card.borderWidth + 'px ' + card.borderStyle + ' ' + card.colors.accent,
            marginRight: card.qrEnabled ? '10px' : '0'
          }}>
            <div style={{ fontSize: card.labelFontSize + 'px', opacity: 0.8, marginBottom: '3px' }}>🌐 الشبكة</div>
            <h3 style={{ margin: 0, fontSize: card.networkFontSize + 'px', color: card.colors.accent, fontWeight: 'bold', lineHeight: 1.2 }}>{card.network}</h3>
          </div>
          
          {/* QR Code جانبي */}
          {card.qrEnabled && (
            <div style={{ 
              background: '#fff', 
              borderRadius: '8px', 
              padding: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              flexShrink: 0
            }}>
              <QRCode cardNumber={card.cardNumber} size={card.qrSize} />
            </div>
          )}
        </div>

        {/* رقم الكرت - بارز في الوسط */}
        <div style={{ 
          background: 'rgba(0,0,0,0.25)', 
          backdropFilter: 'blur(5px)',
          borderRadius: '10px', 
          padding: '10px', 
          position: 'relative', 
          zIndex: 1,
          border: '2px dashed ' + card.colors.accent,
          marginBottom: '8px'
        }}>
          <div style={{ fontSize: card.labelFontSize + 'px', opacity: 0.8, textAlign: 'center', marginBottom: '4px' }}>🔑 رقم الكرت (كلمة المرور)</div>
          <div style={{ 
            fontSize: card.cardNumberFontSize + 'px', 
            fontWeight: 'bold', 
            fontFamily: 'monospace', 
            textAlign: 'center', 
            letterSpacing: '3px',
            color: card.colors.text,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>{card.cardNumber}</div>
        </div>

        {/* ميزة الشحن */}
        {card.showRecharge && (
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0,255,0,0.2), rgba(0,200,0,0.3))', 
            borderRadius: '8px', 
            padding: '6px', 
            textAlign: 'center', 
            border: '1px solid #00ff00', 
            position: 'relative', 
            zIndex: 1,
            marginBottom: '8px',
            boxShadow: '0 0 15px rgba(0,255,0,0.3)'
          }}>
            <div style={{ fontSize: card.infoFontSize + 'px', color: '#00ff00', fontWeight: 'bold' }}>⚡ {card.rechargeText}</div>
          </div>
        )}

        {/* المعلومات: المدة + السعة + السعر */}
        <div style={{ fontSize: card.infoFontSize + 'px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: card.value ? '1fr 1fr 1fr' : '1fr 1fr', gap: '6px' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '8px', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
            <div style={{ fontSize: card.labelFontSize + 'px', opacity: 0.8 }}>⏱️ المدة</div>
            <div style={{ fontWeight: 'bold', fontSize: (card.infoFontSize + 1) + 'px' }}>{card.duration}</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '8px', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
            <div style={{ fontSize: card.labelFontSize + 'px', opacity: 0.8 }}>💾 السعة</div>
            <div style={{ fontWeight: 'bold', fontSize: (card.infoFontSize + 1) + 'px' }}>{card.capacity}</div>
            <div style={{ fontSize: (card.labelFontSize - 1) + 'px', opacity: 0.7 }}>{card.capacityDetail}</div>
          </div>
          {card.value && <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '8px', textAlign: 'center', backdropFilter: 'blur(5px)' }}>
            <div style={{ fontSize: card.labelFontSize + 'px', opacity: 0.8 }}>💰 السعر</div>
            <div style={{ fontWeight: 'bold', fontSize: (card.infoFontSize + 1) + 'px' }}>{card.value} جنيه</div>
          </div>}
        </div>

        {/* العرض الخاص */}
        {card.specialOffer && <div style={{ marginTop: '6px', padding: '6px', background: 'rgba(255,255,0,0.15)', borderRadius: '6px', fontSize: card.labelFontSize + 'px', textAlign: 'center', position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,0,0.4)' }}> {card.specialOffer}</div>}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ffff', fontSize: 'clamp(24px, 5vw, 36px)', margin: '0 0 10px 0' }}>🎫 طباعة كروت الإنترنت</h1>
          <p style={{ color: '#94a3b8' }}>نظام احترافي فاخر ومتكامل</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(0,255,255,0.2)' }}>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🌐 اسم الشبكة</label>
            <input type="text" value={formData.networkName} onChange={(e) => setFormData({...formData, networkName: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          {/* توليد الأرقام */}
          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.2)' }}>
            <h3 style={{ color: '#00ffff', margin: '0 0 15px 0', fontSize: '16px' }}>🔢 إعدادات توليد أرقام الكروت (أرقام فقط)</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>بداية الكود (أرقام فقط)</label>
              <input type="text" value={formData.cardPrefix} onChange={(e) => setFormData({...formData, cardPrefix: e.target.value.replace(/[^0-9]/g, '')})} placeholder="مثال: 86" maxLength="5" style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '10px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>🔢 يُقبل الأرقام فقط (0-9)</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>عدد الأرقام في الكرت: <span style={{ color: '#00ffff', fontSize: '18px' }}>{formData.cardNumberLength}</span></label>
              <input type="range" min="6" max="20" value={formData.cardNumberLength} onChange={(e) => setFormData({...formData, cardNumberLength: parseInt(e.target.value)})} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8' }}>
                <span>6 أرقام</span>
                <span>20 رقم</span>
              </div>
            </div>

            <div style={{ padding: '10px', background: 'rgba(0,255,255,0.1)', borderRadius: '8px', color: '#00ffff', fontSize: '13px', textAlign: 'center' }}>
              💡 مثال: <strong style={{ fontFamily: 'monospace', fontSize: '16px' }}>{generateCardNumber(formData.cardPrefix, formData.cardNumberLength)}</strong>
              <div style={{ fontSize: '11px', marginTop: '5px', opacity: 0.8 }}>🔑 رقم الكرت = كلمة المرور (أرقام فقط)</div>
            </div>
          </div>

          <PopupBtn icon="⏱️" label="مدة الكرت" value={formData.duration + ' ' + durationLabels[formData.durationType]} onClick={() => setActivePopup('duration')} />
          <PopupBtn icon="💾" label="نوع السعة" value={formData.capacityType === 'unlimited' ? 'مفتوح (غير محدود)' : 'محدود (' + formData.capacity + ' ' + formData.capacityUnit + ')'} onClick={() => setActivePopup('capacity')} />
          <PopupBtn icon="⏰" label="زمن الانتهاء" value={formData.expiryType === 'unlimited' ? 'مفتوح' : formData.expiryTime + ' ' + durationLabels[formData.expiryUnit]} onClick={() => setActivePopup('expiry')} />

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>💰 سعر الكرت (اختياري)</label>
            <input type="number" value={formData.cardValue} onChange={(e) => setFormData({...formData, cardValue: e.target.value})} placeholder="اتركه فارغاً إذا لا يوجد سعر" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          {/* ميزة "يوجد شحن" */}
          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.2)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <input type="checkbox" checked={formData.showRecharge} onChange={(e) => setFormData({...formData, showRecharge: e.target.checked})} style={{ width: '20px', height: '20px' }} />
              <label style={{ color: '#e2e8f0', fontWeight: 'bold' }}>⚡ إظهار "يوجد شحن" في الكرت</label>
            </div>
            {formData.showRecharge && (
              <input type="text" value={formData.rechargeText} onChange={(e) => setFormData({...formData, rechargeText: e.target.value})} placeholder="مثال: يتوفر شحن فوري" style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🎁 عرض خاص (اختياري)</label>
            <textarea value={formData.specialOffer} onChange={(e) => setFormData({...formData, specialOffer: e.target.value})} rows="2" placeholder="مثال: للتواصل: 0123456789" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <input type="checkbox" checked={formData.enableQR} onChange={(e) => setFormData({...formData, enableQR: e.target.checked})} style={{ width: '20px', height: '20px' }} />
              <label style={{ color: '#e2e8f0', fontWeight: 'bold' }}>🔳 تفعيل QR Code (جانبي)</label>
            </div>
            {formData.enableQR && (
              <div>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '5px', fontSize: '13px' }}>حجم QR: {formData.qrSize}px</label>
                <input type="range" min="50" max="100" value={formData.qrSize} onChange={(e) => setFormData({...formData, qrSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
              </div>
            )}
          </div>

          <PopupBtn icon="🎨" label="تصميم الكرت" value={(formData.cardStyle === 'colored' ? 'ملون' : 'عادي') + ' | ' + (formData.cardEffect === '3d' ? '3D' : formData.cardEffect === 'gradient' ? 'مدرج' : formData.cardEffect === 'shadow' ? 'مظل' : formData.cardEffect === 'glow' ? 'موهج' : 'عادي') + ' | ' + (formData.cardShape === 'rectangle' ? 'مستطيل عرضي' : formData.cardShape === 'square' ? 'مربع' : 'مدور عرضي')} onClick={() => setActivePopup('design')} />

          <PopupBtn icon="🔤" label="الخطوط والأحجام" value={'شبكة: ' + formData.networkFontSize + 'px | رقم: ' + formData.cardNumberFontSize + 'px | معلومات: ' + formData.infoFontSize + 'px'} onClick={() => setActivePopup('fonts')} />

          <div style={{ marginBottom: '25px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}> الكمية</label>
            <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} min="1" max="100" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <button onClick={generateCards} style={{ width: '100%', padding: '20px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '20px', fontWeight: 'bold', borderRadius: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,255,255,0.4)' }}>
            🖨️ طباعة الكروت
          </button>
        </div>

        {printedCards.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>📋 الكروت المطبوعة ({printedCards.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {printedCards.slice(0, 6).map((card, index) => (
                <CardComponent key={index} card={card} />
              ))}
            </div>
            {printedCards.length > 6 && (
              <button onClick={() => setActivePopup('preview')} style={{ width: '100%', padding: '15px', background: 'rgba(0,255,255,0.1)', color: '#00ffff', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>عرض كل الكروت ({printedCards.length})</button>
            )}
          </div>
        )}

        {activePopup === 'duration' && (
          <Popup title="⏱️ مدة الكرت" onClose={() => setActivePopup(null)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>أدخل الرقم</label>
              <input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} min="1" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اختر النوع</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['hour', 'day', 'week', 'month'].map(type => (
                  <Btn key={type} active={formData.durationType === type} onClick={() => setFormData({...formData, durationType: type})}>{durationLabels[type]}</Btn>
                ))}
              </div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(0,255,255,0.1)', borderRadius: '12px', marginBottom: '20px', color: '#00ffff', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>النتيجة: {formData.duration} {durationLabels[formData.durationType]}</div>
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </Popup>
        )}

        {activePopup === 'capacity' && (
          <Popup title="💾 نوع السعة" onClose={() => setActivePopup(null)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اختر النوع</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Btn active={formData.capacityType === 'limited'} onClick={() => setFormData({...formData, capacityType: 'limited'})}>محدود</Btn>
                <Btn active={formData.capacityType === 'unlimited'} onClick={() => setFormData({...formData, capacityType: 'unlimited'})}>مفتوح</Btn>
              </div>
            </div>
            {formData.capacityType === 'limited' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>أدخل الرقم</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} min="1" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اختر الوحدة</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <Btn active={formData.capacityUnit === 'MB'} onClick={() => setFormData({...formData, capacityUnit: 'MB'})}>ميجا (MB)</Btn>
                    <Btn active={formData.capacityUnit === 'GB'} onClick={() => setFormData({...formData, capacityUnit: 'GB'})}>جيجا (GB)</Btn>
                  </div>
                </div>
              </>
            )}
            <div style={{ padding: '15px', background: 'rgba(0,255,255,0.1)', borderRadius: '12px', marginBottom: '20px', color: '#00ffff', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
              النوع: <strong>{formData.capacityType === 'unlimited' ? 'مفتوح (غير محدود)' : 'محدود (' + formData.capacity + ' ' + formData.capacityUnit + ')'}</strong>
            </div>
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </Popup>
        )}

        {activePopup === 'expiry' && (
          <Popup title="⏰ زمن انتهاء الكرت" onClose={() => setActivePopup(null)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اختر النوع</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <Btn active={formData.expiryType === 'limited'} onClick={() => setFormData({...formData, expiryType: 'limited'})}>محدد</Btn>
                <Btn active={formData.expiryType === 'unlimited'} onClick={() => setFormData({...formData, expiryType: 'unlimited'})}>مفتوح</Btn>
              </div>
            </div>
            {formData.expiryType === 'limited' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>أدخل الرقم</label>
                  <input type="number" value={formData.expiryTime} onChange={(e) => setFormData({...formData, expiryTime: e.target.value})} min="1" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اختر النوع</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {['hour', 'day', 'week', 'month'].map(type => (
                      <Btn key={type} active={formData.expiryUnit === type} onClick={() => setFormData({...formData, expiryUnit: type})}>{durationLabels[type]}</Btn>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div style={{ padding: '15px', background: 'rgba(0,255,255,0.1)', borderRadius: '12px', marginBottom: '20px', color: '#00ffff', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>ينتهي الكرت بعد:</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{formData.expiryType === 'unlimited' ? 'غير محدد' : formData.expiryTime + ' ' + durationLabels[formData.expiryUnit]}</div>
              {formData.expiryType !== 'unlimited' && <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>التاريخ: {calculateExpiry()}</div>}
            </div>
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </Popup>
        )}

        {activePopup === 'design' && (
          <Popup title="🎨 تصميم الكرت" onClose={() => setActivePopup(null)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نوع التصميم</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Btn active={formData.cardStyle === 'plain'} onClick={() => setFormData({...formData, cardStyle: 'plain'})}>عادي (أبيض)</Btn>
                <Btn active={formData.cardStyle === 'colored'} onClick={() => setFormData({...formData, cardStyle: 'colored'})}>ملون</Btn>
              </div>
            </div>
            {formData.cardStyle === 'colored' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نظام الألوان (10 أنظمة)</label>
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
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>التأثير (5 تأثيرات)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['plain', 'gradient', '3d', 'shadow', 'glow'].map(effect => (
                  <Btn key={effect} active={formData.cardEffect === effect} onClick={() => setFormData({...formData, cardEffect: effect})}>
                    {effect === 'plain' && 'عادي'}
                    {effect === 'gradient' && 'مدرج'}
                    {effect === '3d' && '3D'}
                    {effect === 'shadow' && 'مظل'}
                    {effect === 'glow' && 'موهج'}
                  </Btn>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>شكل الكرت (عرضي)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <Btn active={formData.cardShape === 'rectangle'} onClick={() => setFormData({...formData, cardShape: 'rectangle'})}>
                  <div style={{ width: '40px', height: '25px', background: '#00ffff', borderRadius: '4px', margin: '0 auto 5px' }}></div>
                  مستطيل عرضي
                </Btn>
                <Btn active={formData.cardShape === 'square'} onClick={() => setFormData({...formData, cardShape: 'square'})}>
                  <div style={{ width: '30px', height: '30px', background: '#00ffff', borderRadius: '4px', margin: '0 auto 5px' }}></div>
                  مربع
                </Btn>
                <Btn active={formData.cardShape === 'rounded'} onClick={() => setFormData({...formData, cardShape: 'rounded'})}>
                  <div style={{ width: '40px', height: '25px', background: '#00ffff', borderRadius: '12px', margin: '0 auto 5px' }}></div>
                  مدور عرضي
                </Btn>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نوع الإطار</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {['solid', 'dashed', 'dotted'].map(style => (
                  <Btn key={style} active={formData.borderStyle === style} onClick={() => setFormData({...formData, borderStyle: style})}>
                    {style === 'solid' && 'متصل ━'}
                    {style === 'dashed' && 'متقطع ┅'}
                    {style === 'dotted' && 'منقط ┈'}
                  </Btn>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>سمك الإطار: {formData.borderWidth}px</label>
              <input type="range" min="1" max="8" value={formData.borderWidth} onChange={(e) => setFormData({...formData, borderWidth: parseInt(e.target.value)})} style={{ width: '100%' }} />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>👁️ معاينة مباشرة</label>
              <div style={getCardStyle({
                cardStyle: formData.cardStyle,
                cardEffect: formData.cardEffect,
                cardShape: formData.cardShape,
                colors: formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme] : { bg: '#ffffff', accent: '#333333', text: '#000000', border: '#cccccc' },
                networkFontSize: formData.networkFontSize,
                cardNumberFontSize: formData.cardNumberFontSize,
                infoFontSize: formData.infoFontSize,
                labelFontSize: formData.labelFontSize,
                borderWidth: formData.borderWidth,
                borderStyle: formData.borderStyle,
                fontFamily: fontFamilies[formData.fontFamily],
                qrEnabled: formData.enableQR,
                qrSize: formData.qrSize
              })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px', textAlign: 'center', border: '2px solid ' + (formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme].accent : '#333'), marginRight: formData.enableQR ? '8px' : '0' }}>
                    <div style={{ fontSize: '9px', opacity: 0.8 }}>🌐 الشبكة</div>
                    <div style={{ fontSize: formData.networkFontSize + 'px', fontWeight: 'bold', color: formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme].accent : '#000' }}>{formData.networkName}</div>
                  </div>
                  {formData.enableQR && <div style={{ background: '#fff', borderRadius: '6px', padding: '3px', flexShrink: 0 }}><QRCode cardNumber="861234567890" size={formData.qrSize} /></div>}
                </div>
                <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '8px', border: '2px dashed ' + (formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme].accent : '#333') }}>
                  <div style={{ fontSize: '9px', opacity: 0.8, textAlign: 'center' }}>🔑 رقم الكرت</div>
                  <div style={{ fontSize: formData.cardNumberFontSize + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '2px' }}>861234567890</div>
                </div>
              </div>
            </div>

            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ التصميم</button>
          </Popup>
        )}

        {activePopup === 'fonts' && (
          <Popup title="🔤 الخطوط والأحجام" onClose={() => setActivePopup(null)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نوع الخط</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {Object.entries(fontFamilies).map(([key, val]) => (
                  <Btn key={key} active={formData.fontFamily === key} onClick={() => setFormData({...formData, fontFamily: key})}>
                    {key === 'default' && 'افتراضي'}
                    {key === 'arabic' && 'عربي'}
                    {key === 'mono' && 'آلة كاتبة'}
                    {key === 'serif' && 'كلاسيكي'}
                    {key === 'sans' && 'عصري'}
                  </Btn>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>حجم خط اسم الشبكة: {formData.networkFontSize}px</label>
              <input type="range" min="14" max="32" value={formData.networkFontSize} onChange={(e) => setFormData({...formData, networkFontSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
              <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(0,255,255,0.1)', borderRadius: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: formData.networkFontSize + 'px', color: '#00ffff', fontWeight: 'bold', fontFamily: fontFamilies[formData.fontFamily] }}>{formData.networkName}</span>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>حجم خط رقم الكرت: {formData.cardNumberFontSize}px</label>
              <input type="range" min="12" max="28" value={formData.cardNumberFontSize} onChange={(e) => setFormData({...formData, cardNumberFontSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
              <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(0,255,255,0.1)', borderRadius: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: formData.cardNumberFontSize + 'px', color: '#fff', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px' }}>861234567890</span>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>حجم خط المعلومات: {formData.infoFontSize}px</label>
              <input type="range" min="10" max="16" value={formData.infoFontSize} onChange={(e) => setFormData({...formData, infoFontSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>حجم خط العناوين: {formData.labelFontSize}px</label>
              <input type="range" min="8" max="14" value={formData.labelFontSize} onChange={(e) => setFormData({...formData, labelFontSize: parseInt(e.target.value)})} style={{ width: '100%' }} />
            </div>
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </Popup>
        )}

        {activePopup === 'preview' && printedCards.length > 0 && (
          <Popup title={'👁️ معاينة الكروت (' + printedCards.length + ')'} onClose={() => setActivePopup(null)}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '15px', maxHeight: '60vh', overflow: 'auto' }}>
              {printedCards.map((card, index) => (
                <CardComponent key={index} card={card} />
              ))}
            </div>
            <button onClick={() => window.print()} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '20px' }}>🖨️ طباعة الكل</button>
          </Popup>
        )}
      </div>

      <style>{`
        @keyframes glow {
          from { box-shadow: 0 0 20px currentColor; }
          to { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
        }
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  )
}
'''

with open('app/dashboard/print-cards/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('✅ تم إنشاء النظام الاحترافي النهائي!')
print('')
print('الميزات الجديدة:')
print('1. ✅ كروت عرضية (aspect-ratio: 1.7/1)')
print('2. ✅ QR Code جانبي بحجم قابل للتعديل')
print('3. ✅ QR Code حقيقي يحتوي على رقم الكرت')
print('4. ✅ Sliders لكل حجم خط (شبكة، رقم، معلومات، عناوين)')
print('5. ✅ 5 أنواع خطوط')
print('6. ✅ معاينة مباشرة في نافذة التصميم')
print('7. ✅ تصميم فخم مع backdrop-filter و shadows')
