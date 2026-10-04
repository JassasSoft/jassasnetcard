code = r'''"use client"
import { useState, useEffect, useRef } from 'react'

export default function PrintCardsPage() {
  const [user, setUser] = useState(null)
  const [activePopup, setActivePopup] = useState(null)
  const [printedCards, setPrintedCards] = useState([])
  const inputRef = useRef(null)

  const [formData, setFormData] = useState({
    networkName: 'Jassas Net',
    cardPrefix: '86',
    cardNumberLength: 12,
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
    specialOffer: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
    else window.location.href = '/login'
  }, [])

  useEffect(() => {
    if (inputRef.current && activePopup) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [activePopup, formData.duration, formData.capacity, formData.expiryTime, formData.cardNumberLength])

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

  const durationLabels = { hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }

  const generateCardNumber = (prefix, length) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = prefix
    const remaining = Math.max(1, length - prefix.length)
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

  const generateCards = () => {
    const cards = []
    const qty = parseInt(formData.quantity) || 1
    const durationText = formData.duration + ' ' + durationLabels[formData.durationType]
    const capacityText = formData.capacityType === 'unlimited' ? 'غير محدود' : formData.capacity + ' ' + formData.capacityUnit
    const colors = formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme] : { bg: '#ffffff', accent: '#333333', text: '#000000', border: '#cccccc' }

    for (let i = 0; i < qty; i++) {
      cards.push({
        id: 'JNC-' + Date.now() + '-' + i,
        cardNumber: generateCardNumber(formData.cardPrefix, formData.cardNumberLength),
        password: Math.random().toString(36).substr(2, 10).toUpperCase(),
        value: formData.cardValue,
        duration: durationText,
        capacity: capacityText,
        expiryDate: calculateExpiry(),
        network: formData.networkName,
        specialOffer: formData.specialOffer,
        qrEnabled: formData.enableQR,
        cardStyle: formData.cardStyle,
        cardEffect: formData.cardEffect,
        cardShape: formData.cardShape,
        colors: colors
      })
    }
    setPrintedCards(cards)
    setActivePopup('preview')
  }

  const getCardStyle = (card) => {
    const c = card.colors
    let background = card.cardStyle === 'colored'
      ? (card.cardEffect === 'gradient' ? 'linear-gradient(135deg, ' + c.bg + ' 0%, ' + c.accent + ' 100%)' : c.bg)
      : '#fff'
    
    let boxShadow = '0 10px 30px rgba(0,0,0,0.3)'
    let transform = 'none'
    let borderStyle = '3px solid ' + c.border
    
    if (card.cardEffect === '3d') {
      boxShadow = '0 20px 50px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.4), inset 0 -2px 10px rgba(0,0,0,0.2)'
      transform = 'perspective(1000px) rotateX(5deg) rotateY(-5deg)'
      borderStyle = '4px solid ' + c.accent
    }
    if (card.cardEffect === 'shadow') {
      boxShadow = '0 25px 60px rgba(0,0,0,0.7), 0 15px 40px rgba(0,0,0,0.5)'
      transform = 'translateY(-5px)'
    }
    if (card.cardEffect === 'glow') {
      boxShadow = '0 0 40px ' + c.accent + ', 0 0 80px ' + c.accent + '80, 0 0 120px ' + c.accent + '40'
      borderStyle = '3px solid ' + c.accent
    }
    
    let borderRadius = '15px'
    if (card.cardShape === 'square') borderRadius = '8px'
    if (card.cardShape === 'rounded') borderRadius = '30px'
    
    return { 
      background, 
      boxShadow, 
      border: borderStyle, 
      borderRadius, 
      color: c.text, 
      padding: '20px', 
      position: 'relative', 
      overflow: 'hidden',
      transform,
      transition: 'all 0.3s ease'
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
          <button onClick={onClose} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}></button>
        </div>
        {children}
      </div>
    </div>
  )

  const PopupButton = ({ icon, label, value, onClick, color = '#00ffff' }) => (
    <button onClick={onClick} style={{ width: '100%', padding: '20px', background: 'rgba(0,255,255,0.05)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '15px', cursor: 'pointer', textAlign: 'right', marginBottom: '15px', transition: 'all 0.3s' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,255,0.15)'; e.currentTarget.style.transform = 'translateX(-5px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,255,255,0.05)'; e.currentTarget.style.transform = 'translateX(0)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '5px' }}>{label}</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color }}>{value}</div>
        </div>
        <span style={{ fontSize: '20px', color: '#00ffff' }}>←</span>
      </div>
    </button>
  )

  const Btn = ({ active, onClick, children, style }) => (
    <button onClick={onClick} style={{ padding: '15px', background: active ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: active ? '#0f172a' : '#fff', border: active ? '2px solid #00ffff' : '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', ...style }}>{children}</button>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ffff', fontSize: 'clamp(24px, 5vw, 36px)', margin: '0 0 10px 0' }}>🎫 طباعة كروت الإنترنت</h1>
          <p style={{ color: '#94a3b8' }}>نظام احترافي فاخر ومتكامل</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(0,255,255,0.2)' }}>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}> اسم الشبكة</label>
            <input type="text" value={formData.networkName} onChange={(e) => setFormData({...formData, networkName: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🔢 بداية رقم الكرت</label>
            <input type="text" value={formData.cardPrefix} onChange={(e) => setFormData({...formData, cardPrefix: e.target.value})} placeholder="مثال: 86" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}> عدد أرقام الكرت: {formData.cardNumberLength}</label>
            <input type="number" value={formData.cardNumberLength} onChange={(e) => setFormData({...formData, cardNumberLength: parseInt(e.target.value) || 12})} min="6" max="20" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(0,255,255,0.1)', borderRadius: '8px', color: '#00ffff', fontSize: '13px' }}>💡 مثال: {generateCardNumber(formData.cardPrefix, formData.cardNumberLength)}</div>
          </div>

          <PopupButton icon="⏱️" label="مدة الكرت" value={formData.duration + ' ' + durationLabels[formData.durationType]} onClick={() => setActivePopup('duration')} />
          <PopupButton icon="💾" label="سعة الكرت" value={formData.capacityType === 'unlimited' ? 'غير محدود' : formData.capacity + ' ' + formData.capacityUnit} onClick={() => setActivePopup('capacity')} />
          <PopupButton icon="⏰" label="زمن الانتهاء" value={formData.expiryType === 'unlimited' ? 'مفتوح' : formData.expiryTime + ' ' + durationLabels[formData.expiryUnit]} onClick={() => setActivePopup('expiry')} />

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>💰 سعر الكرت (اختياري)</label>
            <input type="number" value={formData.cardValue} onChange={(e) => setFormData({...formData, cardValue: e.target.value})} placeholder="اتركه فارغاً إذا لا يوجد سعر" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🎁 عرض خاص (اختياري)</label>
            <textarea value={formData.specialOffer} onChange={(e) => setFormData({...formData, specialOffer: e.target.value})} rows="2" placeholder="مثال: للتواصل: 0123456789" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="checkbox" checked={formData.enableQR} onChange={(e) => setFormData({...formData, enableQR: e.target.checked})} style={{ width: '20px', height: '20px' }} />
              <label style={{ color: '#e2e8f0', fontWeight: 'bold' }}>🔳 تفعيل QR Code</label>
            </div>
          </div>

          <PopupButton icon="🎨" label="تصميم الكرت" value={(formData.cardStyle === 'colored' ? 'ملون' : 'عادي') + ' | ' + (formData.cardEffect === '3d' ? '3D' : formData.cardEffect === 'gradient' ? 'مدرج' : formData.cardEffect === 'shadow' ? 'مظل' : formData.cardEffect === 'glow' ? 'موهج' : 'عادي')} onClick={() => setActivePopup('design')} />

          <div style={{ marginBottom: '25px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>📦 الكمية</label>
            <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} min="1" max="100" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <button onClick={generateCards} style={{ width: '100%', padding: '20px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '20px', fontWeight: 'bold', borderRadius: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,255,255,0.4)' }}>
            🖨️ طباعة الكروت
          </button>
        </div>

        {printedCards.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>📋 الكروت المطبوعة ({printedCards.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {printedCards.slice(0, 6).map((card, index) => (
                <div key={index} style={getCardStyle(card)}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '40px', opacity: '0.08', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none' }}>JassasNetCard</div>
                  <div style={{ background: card.cardStyle === 'colored' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '12px', marginBottom: '12px', textAlign: 'center', border: '2px solid ' + card.colors.accent, position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '5px' }}> الشبكة</div>
                    <h3 style={{ margin: 0, fontSize: '20px', color: card.colors.accent, fontWeight: 'bold' }}>{card.network}</h3>
                  </div>
                  <div style={{ background: card.cardStyle === 'colored' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', borderRadius: '10px', padding: '12px', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>🔑 رقم الكرت:</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '1px', textAlign: 'center', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginTop: '5px' }}>{card.cardNumber}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '10px' }}> كلمة المرور:</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', padding: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginTop: '5px' }}>{card.password}</div>
                  </div>
                  <div style={{ fontSize: '11px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}><div style={{ fontSize: '10px', opacity: 0.8 }}>⏱️ المدة</div><div style={{ fontWeight: 'bold' }}>{card.duration}</div></div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}><div style={{ fontSize: '10px', opacity: 0.8 }}>💾 السعة</div><div style={{ fontWeight: 'bold' }}>{card.capacity}</div></div>
                    {card.value && <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px', textAlign: 'center', gridColumn: '1 / -1' }}><div style={{ fontSize: '10px', opacity: 0.8 }}> السعر</div><div style={{ fontWeight: 'bold' }}>{card.value} جنيه</div></div>}
                  </div>
                  {card.qrEnabled && <div style={{ position: 'absolute', top: '10px', left: '10px', width: '40px', height: '40px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', zIndex: 1 }}>📱</div>}
                </div>
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
              <input ref={inputRef} type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} min="1" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
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
          <Popup title=" سعة الكرت" onClose={() => setActivePopup(null)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اختر النوع</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Btn active={formData.capacityType === 'limited'} onClick={() => setFormData({...formData, capacityType: 'limited'})}>محدود</Btn>
                <Btn active={formData.capacityType === 'unlimited'} onClick={() => setFormData({...formData, capacityType: 'unlimited'})}>غير محدود</Btn>
              </div>
            </div>
            {formData.capacityType === 'limited' && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>أدخل الرقم</label>
                  <input ref={inputRef} type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} min="1" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
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
            <div style={{ padding: '15px', background: 'rgba(0,255,255,0.1)', borderRadius: '12px', marginBottom: '20px', color: '#00ffff', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>السعة: {formData.capacityType === 'unlimited' ? 'غير محدودة' : formData.capacity + ' ' + formData.capacityUnit}</div>
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </Popup>
        )}

        {activePopup === 'expiry' && (
          <Popup title=" زمن انتهاء الكرت" onClose={() => setActivePopup(null)}>
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
                  <input ref={inputRef} type="number" value={formData.expiryTime} onChange={(e) => setFormData({...formData, expiryTime: e.target.value})} min="1" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
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
                <Btn active={formData.cardStyle === 'plain'} onClick={() => setFormData({...formData, cardStyle: 'plain'})}>عادي</Btn>
                <Btn active={formData.cardStyle === 'colored'} onClick={() => setFormData({...formData, cardStyle: 'colored'})}>ملون</Btn>
              </div>
            </div>
            {formData.cardStyle === 'colored' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نظام الألوان</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {Object.entries(colorSchemes).map(([key, val]) => (
                    <button key={key} onClick={() => setFormData({...formData, colorScheme: key})} style={{ padding: '12px', background: 'linear-gradient(135deg, ' + val.bg + ', ' + val.accent + ')', border: formData.colorScheme === key ? '3px solid #fff' : '2px solid transparent', borderRadius: '10px', color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {key === 'blue-gold' && 'أزرق ذهبي'}
                      {key === 'purple-silver' && 'بنفسجي فضي'}
                      {key === 'green-gold' && 'أخضر ذهبي'}
                      {key === 'red-black' && 'أحمر أسود'}
                      {key === 'orange-dark' && 'برتقالي داكن'}
                      {key === 'blue-green' && 'أزرق أخضر'}
                      {key === 'pure-blue' && 'أزرق'}
                      {key === 'pure-green' && 'أخضر'}
                      {key === 'black-gold' && 'أسود ذهبي'}
                      {key === 'white-blue' && 'أبيض أزرق'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>التأثير</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {['plain', '3d', 'shadow', 'glow'].map(effect => (
                  <Btn key={effect} active={formData.cardEffect === effect} onClick={() => setFormData({...formData, cardEffect: effect})}>
                    {effect === 'plain' && 'عادي'}
                    {effect === '3d' && '3D'}
                    {effect === 'shadow' && 'مظل'}
                    {effect === 'glow' && 'موهج'}
                  </Btn>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>شكل الحواف</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {['rectangle', 'square', 'rounded'].map(shape => (
                  <Btn key={shape} active={formData.cardShape === shape} onClick={() => setFormData({...formData, cardShape: shape})}>
                    {shape === 'rectangle' && 'مستطيل'}
                    {shape === 'square' && 'مربع'}
                    {shape === 'rounded' && 'مدور'}
                  </Btn>
                ))}
              </div>
            </div>
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </Popup>
        )}

        {activePopup === 'preview' && printedCards.length > 0 && (
          <Popup title={'👁️ معاينة الكروت (' + printedCards.length + ')'} onClose={() => setActivePopup(null)}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', maxHeight: '60vh', overflow: 'auto' }}>
              {printedCards.map((card, index) => (
                <div key={index} style={getCardStyle(card)}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '30px', opacity: '0.08', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none' }}>JassasNetCard</div>
                  <div style={{ background: card.cardStyle === 'colored' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '12px', marginBottom: '12px', textAlign: 'center', border: '2px solid ' + card.colors.accent, position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '5px' }}> الشبكة</div>
                    <h3 style={{ margin: 0, fontSize: '18px', color: card.colors.accent, fontWeight: 'bold' }}>{card.network}</h3>
                  </div>
                  <div style={{ background: card.cardStyle === 'colored' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', borderRadius: '10px', padding: '10px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>🔑 رقم الكرت:</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', padding: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginTop: '5px' }}>{card.cardNumber}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '8px' }}>🔒 كلمة المرور:</div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', padding: '5px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginTop: '5px' }}>{card.password}</div>
                  </div>
                  <div style={{ fontSize: '10px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}><div style={{ fontSize: '9px', opacity: 0.8 }}>⏱️</div><div style={{ fontWeight: 'bold' }}>{card.duration}</div></div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}><div style={{ fontSize: '9px', opacity: 0.8 }}>💾</div><div style={{ fontWeight: 'bold' }}>{card.capacity}</div></div>
                    {card.value && <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '6px', textAlign: 'center', gridColumn: '1 / -1' }}><div style={{ fontSize: '9px', opacity: 0.8 }}>💰</div><div style={{ fontWeight: 'bold' }}>{card.value} جنيه</div></div>}
                  </div>
                  {card.qrEnabled && <div style={{ position: 'absolute', top: '10px', left: '10px', width: '35px', height: '35px', background: '#fff', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', zIndex: 1 }}>📱</div>}
                </div>
              ))}
            </div>
            <button onClick={() => window.print()} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '20px' }}>🖨️ طباعة الكل</button>
          </Popup>
        )}
      </div>
    </div>
  )
}
'''

with open('app/dashboard/print-cards/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('✅ تم إنشاء النظام المحسّن بنجاح!')
print('')
print('الإصلاحات:')
print('✅ مشكلة الكيبورد - استخدام useRef للحفاظ على focus')
print('✅ تأثير 3D - perspective + rotateX/Y + inset shadows')
print('✅ تأثير مظل - translateY + deep shadow')
print('✅ تأثير موهج - glow effect حول الكرت')
print('✅ الأشكال - borderRadius صحيح لكل شكل')
print('✅ مؤشرات بصرية - أيقونات + أسهم + hover effects')
