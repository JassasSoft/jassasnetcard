code = '''"use client"
import { useState, useEffect } from 'react'

export default function PrintCardsPage() {
  const [user, setUser] = useState(null)
  const [showDurationPopup, setShowDurationPopup] = useState(false)
  const [showExpiryPopup, setShowExpiryPopup] = useState(false)
  const [showDesignPopup, setShowDesignPopup] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [printedCards, setPrintedCards] = useState([])

  const [formData, setFormData] = useState({
    networkName: 'Jassas Net',
    cardPrefix: '86',
    cardNumberLength: 12,
    cardValue: '1',
    duration: '1',
    durationType: 'hour',
    capacityType: 'limited',
    capacity: '500',
    capacityUnit: 'MB',
    expiryType: 'limited',
    expiryTime: '12',
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

  const colorSchemes = {
    'blue-gold': { bg: '#1e3c72', accent: '#d4af37', text: '#ffffff', border: '#d4af37' },
    'purple-silver': { bg: '#667eea', accent: '#c0c0c0', text: '#ffffff', border: '#c0c0c0' },
    'green-gold': { bg: '#134e5e', accent: '#ffd700', text: '#ffffff', border: '#ffd700' },
    'red-black': { bg: '#cb2d3e', accent: '#ff0000', text: '#ffffff', border: '#ff0000' },
    'orange-dark': { bg: '#f12711', accent: '#f5af19', text: '#ffffff', border: '#f5af19' },
    'blue-green': { bg: '#0066cc', accent: '#00cc66', text: '#ffffff', border: '#00cc66' },
    'pure-blue': { bg: '#0047AB', accent: '#4169E1', text: '#ffffff', border: '#4169E1' },
    'pure-green': { bg: '#228B22', accent: '#32CD32', text: '#ffffff', border: '#32CD32' }
  }

  const durationLabels = { hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }

  const generateCardNumber = (prefix, length) => {
    const chars = '0123456789'
    let result = prefix
    const remaining = length - prefix.length
    for (let i = 0; i < remaining; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const calculateExpiry = () => {
    if (formData.expiryType === 'unlimited') return 'غير محدد'
    const now = new Date()
    const amount = parseInt(formData.expiryTime)
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
    setShowPreview(true)
  }

  const getCardStyle = (card) => {
    const colors = card.colors
    let background = card.cardStyle === 'colored'
      ? (card.cardEffect === 'gradient' ? 'linear-gradient(135deg, ' + colors.bg + ', ' + colors.accent + ')' : colors.bg)
      : '#fff'
    let boxShadow = '0 10px 30px rgba(0,0,0,0.3)'
    if (card.cardEffect === '3d') boxShadow = '0 10px 30px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.3)'
    if (card.cardEffect === 'glow') boxShadow = '0 0 30px ' + colors.accent + '80'
    let borderRadius = '15px'
    if (card.cardShape === 'square') borderRadius = '8px'
    if (card.cardShape === 'rounded') borderRadius = '25px'
    return { background, boxShadow, border: '3px solid ' + colors.border, borderRadius, color: colors.text, padding: '20px', position: 'relative', overflow: 'hidden' }
  }

  if (!user) {
    return <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><p>جاري التحميل...</p></div>
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ffff', fontSize: 'clamp(24px, 5vw, 36px)', margin: '0 0 10px 0' }}>🎫 طباعة كروت الإنترنت</h1>
          <p style={{ color: '#94a3b8' }}>نظام احترافي متكامل</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(0,255,255,0.2)' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>💰 قيمة الكرت (جنيه)</label>
            <input type="number" value={formData.cardValue} onChange={(e) => setFormData({...formData, cardValue: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🔢 بداية رقم الكرت</label>
            <input type="text" value={formData.cardPrefix} onChange={(e) => setFormData({...formData, cardPrefix: e.target.value})} placeholder="مثال: 86" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}> عدد أرقام الكرت</label>
            <input type="number" value={formData.cardNumberLength} onChange={(e) => setFormData({...formData, cardNumberLength: parseInt(e.target.value) || 12})} min="6" max="20" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(0,255,255,0.1)', borderRadius: '8px', color: '#00ffff', fontSize: '13px' }}>💡 مثال: {generateCardNumber(formData.cardPrefix, formData.cardNumberLength)}</div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setShowDurationPopup(true)} style={{ width: '100%', padding: '14px', background: 'rgba(0,255,255,0.1)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'right' }}>⏱️ المدة: {formData.duration} {durationLabels[formData.durationType]}</button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>💾 السعة</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <button onClick={() => setFormData({...formData, capacityType: 'limited'})} style={{ padding: '12px', background: formData.capacityType === 'limited' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.capacityType === 'limited' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>محدود</button>
              <button onClick={() => setFormData({...formData, capacityType: 'unlimited'})} style={{ padding: '12px', background: formData.capacityType === 'unlimited' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.capacityType === 'unlimited' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>غير محدود</button>
            </div>
            {formData.capacityType === 'limited' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} placeholder="الرقم" style={{ flex: 2, padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }} />
                <select value={formData.capacityUnit} onChange={(e) => setFormData({...formData, capacityUnit: e.target.value})} style={{ flex: 1, padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                  <option value="MB">ميجا</option>
                  <option value="GB">جيجا</option>
                </select>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setShowExpiryPopup(true)} style={{ width: '100%', padding: '14px', background: 'rgba(0,255,255,0.1)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'right' }}>⏰ زمن الانتهاء: {formData.expiryType === 'unlimited' ? 'مفتوح' : formData.expiryTime + ' ' + durationLabels[formData.expiryUnit]}</button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🌐 اسم الشبكة</label>
            <input type="text" value={formData.networkName} onChange={(e) => setFormData({...formData, networkName: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🎁 عرض خاص (اختياري)</label>
            <textarea value={formData.specialOffer} onChange={(e) => setFormData({...formData, specialOffer: e.target.value})} rows="2" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="checkbox" checked={formData.enableQR} onChange={(e) => setFormData({...formData, enableQR: e.target.checked})} style={{ width: '20px', height: '20px' }} />
              <label style={{ color: '#e2e8f0', fontWeight: 'bold' }}>🔳 تفعيل QR Code</label>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setShowDesignPopup(true)} style={{ width: '100%', padding: '14px', background: 'rgba(0,255,255,0.1)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'right' }}> تصميم الكرت: {formData.cardStyle === 'colored' ? 'ملون' : 'عادي'} | {formData.cardEffect === '3d' ? '3D' : formData.cardEffect === 'gradient' ? 'مدرج' : formData.cardEffect === 'glow' ? 'موهج' : 'عادي'}</button>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>📦 الكمية</label>
            <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} min="1" max="100" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <button onClick={generateCards} style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '20px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,255,255,0.4)' }}>️ طباعة الكروت</button>
        </div>

        {printedCards.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>📋 الكروت المطبوعة ({printedCards.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {printedCards.slice(0, 6).map((card, index) => (
                <div key={index} style={getCardStyle(card)}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '40px', opacity: '0.08', fontWeight: 'bold', whiteSpace: 'nowrap' }}>JassasNetCard</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', position: 'relative', zIndex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: card.cardStyle === 'colored' ? card.colors.accent : '#1e3c72' }}>{card.network}</h3>
                    {card.qrEnabled && <div style={{ width: '45px', height: '45px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📱</div>}
                  </div>
                  <div style={{ background: card.cardStyle === 'colored' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', borderRadius: '10px', padding: '12px', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>🔑 رقم الكرت:</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '1px' }}>{card.cardNumber}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '8px' }}>🔒 كلمة المرور:</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>{card.password}</div>
                  </div>
                  <div style={{ fontSize: '11px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    <div>⏱️ {card.duration}</div>
                    <div>💾 {card.capacity}</div>
                    <div>💰 {card.value} جنيه</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPreview(true)} style={{ width: '100%', padding: '15px', background: 'rgba(0,255,255,0.1)', color: '#00ffff', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>عرض كل الكروت ({printedCards.length})</button>
          </div>
        )}

        {showDurationPopup && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '25px', padding: '30px', maxWidth: '500px', width: '100%', border: '2px solid rgba(0,255,255,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ color: '#00ffff', margin: 0 }}>⏱️ مدة الكرت</h2>
                <button onClick={() => setShowDurationPopup(false)} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الرقم</label>
                <input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} min="1" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>النوع</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['hour', 'day', 'week', 'month'].map(type => (
                    <button key={type} onClick={() => setFormData({...formData, durationType: type})} style={{ padding: '15px', background: formData.durationType === type ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.durationType === type ? '#0f172a' : '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>{durationLabels[type]}</button>
                  ))}
                </div>
              </div>
              <div style={{ padding: '15px', background: 'rgba(0,255,255,0.1)', borderRadius: '12px', marginBottom: '20px', color: '#00ffff', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>النتيجة: {formData.duration} {durationLabels[formData.durationType]}</div>
              <button onClick={() => setShowDurationPopup(false)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
            </div>
          </div>
        )}

        {showExpiryPopup && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '25px', padding: '30px', maxWidth: '500px', width: '100%', border: '2px solid rgba(0,255,255,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ color: '#00ffff', margin: 0 }}>⏰ زمن انتهاء الكرت</h2>
                <button onClick={() => setShowExpiryPopup(false)} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>النوع</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                  <button onClick={() => setFormData({...formData, expiryType: 'limited'})} style={{ padding: '15px', background: formData.expiryType === 'limited' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.expiryType === 'limited' ? '#0f172a' : '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>محدد</button>
                  <button onClick={() => setFormData({...formData, expiryType: 'unlimited'})} style={{ padding: '15px', background: formData.expiryType === 'unlimited' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.expiryType === 'unlimited' ? '#0f172a' : '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>مفتوح (غير محدد)</button>
                </div>
              </div>
              {formData.expiryType === 'limited' && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الرقم</label>
                    <input type="number" value={formData.expiryTime} onChange={(e) => setFormData({...formData, expiryTime: e.target.value})} min="1" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>النوع</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {['hour', 'day', 'week', 'month'].map(type => (
                        <button key={type} onClick={() => setFormData({...formData, expiryUnit: type})} style={{ padding: '15px', background: formData.expiryUnit === type ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.expiryUnit === type ? '#0f172a' : '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>{durationLabels[type]}</button>
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
              <button onClick={() => setShowExpiryPopup(false)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
            </div>
          </div>
        )}

        {showDesignPopup && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '25px', padding: '30px', maxWidth: '500px', width: '100%', border: '2px solid rgba(0,255,255,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ color: '#00ffff', margin: 0 }}>🎨 تصميم الكرت</h2>
                <button onClick={() => setShowDesignPopup(false)} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نوع التصميم</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button onClick={() => setFormData({...formData, cardStyle: 'plain'})} style={{ padding: '20px', background: formData.cardStyle === 'plain' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : '#fff', color: formData.cardStyle === 'plain' ? '#0f172a' : '#000', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>عادي</button>
                  <button onClick={() => setFormData({...formData, cardStyle: 'colored'})} style={{ padding: '20px', background: formData.cardStyle === 'colored' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'linear-gradient(135deg, #1e3c72, #d4af37)', color: formData.cardStyle === 'colored' ? '#0f172a' : '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>ملون</button>
                </div>
              </div>
              {formData.cardStyle === 'colored' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نظام الألوان</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {Object.entries(colorSchemes).map(([key, val]) => (
                      <button key={key} onClick={() => setFormData({...formData, colorScheme: key})} style={{ padding: '15px', background: 'linear-gradient(135deg, ' + val.bg + ', ' + val.accent + ')', border: formData.colorScheme === key ? '3px solid #fff' : '2px solid transparent', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {key === 'blue-gold' && 'أزرق ذهبي'}
                        {key === 'purple-silver' && 'بنفسجي فضي'}
                        {key === 'green-gold' && 'أخضر ذهبي'}
                        {key === 'red-black' && 'أحمر أسود'}
                        {key === 'orange-dark' && 'برتقالي داكن'}
                        {key === 'blue-green' && 'أزرق أخضر'}
                        {key === 'pure-blue' && 'أزرق'}
                        {key === 'pure-green' && 'أخضر'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>التأثير</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {['plain', '3d', 'gradient', 'glow'].map(effect => (
                    <button key={effect} onClick={() => setFormData({...formData, cardEffect: effect})} style={{ padding: '12px', background: formData.cardEffect === effect ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardEffect === effect ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {effect === 'plain' && 'عادي'}
                      {effect === '3d' && '3D'}
                      {effect === 'gradient' && 'مدرج'}
                      {effect === 'glow' && 'موهج'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>شكل الحواف</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  {['rectangle', 'square', 'rounded'].map(shape => (
                    <button key={shape} onClick={() => setFormData({...formData, cardShape: shape})} style={{ padding: '15px', background: formData.cardShape === shape ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardShape === shape ? '#0f172a' : '#fff', border: 'none', borderRadius: shape === 'square' ? '8px' : shape === 'rounded' ? '25px' : '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {shape === 'rectangle' && 'مستطيل'}
                      {shape === 'square' && 'مربع'}
                      {shape === 'rounded' && 'مدور'}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowDesignPopup(false)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
            </div>
          </div>
        )}

        {showPreview && printedCards.length > 0 && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000, overflow: 'auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '25px', padding: '30px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'auto', border: '2px solid rgba(0,255,255,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ color: '#00ffff', margin: 0 }}>👁️ معاينة الكروت ({printedCards.length})</h2>
                <button onClick={() => setShowPreview(false)} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {printedCards.map((card, index) => (
                  <div key={index} style={getCardStyle(card)}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '30px', opacity: '0.08', fontWeight: 'bold', whiteSpace: 'nowrap' }}>JassasNetCard</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '16px', color: card.cardStyle === 'colored' ? card.colors.accent : '#1e3c72' }}>{card.network}</h3>
                      {card.qrEnabled && <div style={{ width: '35px', height: '35px', background: '#fff', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📱</div>}
                    </div>
                    <div style={{ background: card.cardStyle === 'colored' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', borderRadius: '8px', padding: '10px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: '10px', opacity: 0.8 }}>🔑 رقم الكرت:</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>{card.cardNumber}</div>
                      <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '5px' }}>🔒 كلمة المرور:</div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>{card.password}</div>
                    </div>
                    <div style={{ fontSize: '10px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                      <div>⏱️ {card.duration}</div>
                      <div>💾 {card.capacity}</div>
                      <div>💰 {card.value} جنيه</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => window.print()} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '20px' }}>🖨️ طباعة الكل</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
'''

with open('app/dashboard/print-cards/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('✅ تم إنشاء الملف بنجاح!')
