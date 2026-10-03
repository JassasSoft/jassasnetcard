"use client"
import { useState, useEffect } from 'react'

export default function PrintCardsPage() {
  const [user, setUser] = useState(null)
  const [activePopup, setActivePopup] = useState(null)
  const [printedCards, setPrintedCards] = useState([])
  
  const [formData, setFormData] = useState({
    networkName: 'Jassas Net',
    cardNumberLength: 12,
    cardValue: '1',
    duration: '1',
    durationType: 'hour',
    capacity: '500',
    capacityUnlimited: false,
    expiryTime: '12',
    expiryType: 'hour',
    cardStyle: 'colored',
    colorScheme: 'blue-gold',
    customColors: {
      bg: '#1e3c72',
      accent: '#d4af37',
      text: '#ffffff',
      border: '#d4af37'
    },
    quantity: 10,
    enableQR: true,
    specialOffer: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      window.location.href = '/login'
    }
  }, [])

  const colorSchemes = {
    'blue-gold': { bg: '#1e3c72', accent: '#d4af37', text: '#ffffff', border: '#d4af37' },
    'purple-silver': { bg: '#667eea', accent: '#c0c0c0', text: '#ffffff', border: '#c0c0c0' },
    'green-gold': { bg: '#134e5e', accent: '#ffd700', text: '#ffffff', border: '#ffd700' },
    'red-black': { bg: '#cb2d3e', accent: '#ff0000', text: '#ffffff', border: '#ff0000' },
    'orange-dark': { bg: '#f12711', accent: '#f5af19', text: '#ffffff', border: '#f5af19' }
  }

  const durationLabels = { hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }

  const generateCardNumber = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const calculateExpiry = () => {
    const now = new Date()
    const amount = parseInt(formData.expiryTime)
    switch(formData.expiryType) {
      case 'hour': now.setHours(now.getHours() + amount); break
      case 'day': now.setDate(now.getDate() + amount); break
      case 'week': now.setDate(now.getDate() + (amount * 7)); break
      case 'month': now.setMonth(now.getMonth() + amount); break
    }
    return now.toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })
  }

  const generateCards = () => {
    const cards = []
    const qty = parseInt(formData.quantity) || 1
    const expiryDate = calculateExpiry()
    const durationText = formData.duration + ' ' + durationLabels[formData.durationType]
    const colors = formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme] : { bg: '#ffffff', accent: '#333333', text: '#000000', border: '#cccccc' }
    
    for (let i = 0; i < qty; i++) {
      cards.push({
        id: 'JNC-' + Date.now() + '-' + i,
        cardNumber: generateCardNumber(formData.cardNumberLength),
        password: Math.random().toString(36).substr(2, 10).toUpperCase(),
        value: formData.cardValue,
        duration: durationText,
        capacity: formData.capacityUnlimited ? 'غير محدود' : formData.capacity + ' MB',
        expiryDate: expiryDate,
        network: formData.networkName,
        specialOffer: formData.specialOffer,
        qrEnabled: formData.enableQR,
        cardStyle: formData.cardStyle,
        colors: colors,
        createdAt: new Date().toLocaleString('ar-EG')
      })
    }
    setPrintedCards(cards)
    setActivePopup('preview')
  }

  const getCardBorderStyle = (style) => {
    if (style === 'square') return { borderRadius: '8px' }
    if (style === 'rounded') return { borderRadius: '25px' }
    return { borderRadius: '15px' }
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid #00ffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p>جاري التحميل...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const PopupWrapper = ({ title, onClose, children }) => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000, overflow: 'auto' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '25px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', border: '2px solid rgba(0,255,255,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid rgba(0,255,255,0.2)' }}>
          <h2 style={{ color: '#00ffff', margin: 0, fontSize: '24px' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ffff', fontSize: 'clamp(24px, 5vw, 36px)', margin: '0 0 10px 0' }}>🎫 طباعة كروت الإنترنت</h1>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>نظام احترافي متكامل</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          {[
            { id: 'network', label: ' اسم الشبكة', value: formData.networkName },
            { id: 'cardNumber', label: '🔢 رقم الكرت', value: formData.cardNumberLength + ' رقم' },
            { id: 'value', label: '💰 قيمة الكرت', value: formData.cardValue + ' جنيه' },
            { id: 'duration', label: '⏱️ المدة', value: formData.duration + ' ' + durationLabels[formData.durationType] },
            { id: 'capacity', label: ' السعة', value: formData.capacityUnlimited ? 'غير محدود' : formData.capacity + ' MB' },
            { id: 'expiry', label: ' زمن الانتهاء', value: formData.expiryTime + ' ' + durationLabels[formData.expiryType] },
            { id: 'style', label: '🎨 تصميم الكرت', value: formData.cardStyle === 'colored' ? 'ملون' : 'عادي' },
            { id: 'quantity', label: '📦 الكمية', value: formData.quantity }
          ].map(item => (
            <button key={item.id} onClick={() => setActivePopup(item.id)} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '15px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>{item.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00ffff' }}>{item.value}</div>
            </button>
          ))}
        </div>

        <button onClick={generateCards} style={{ width: '100%', padding: '20px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '20px', fontWeight: 'bold', borderRadius: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,255,255,0.4)', marginBottom: '30px' }}>
          🖨️ طباعة الكروت
        </button>

        {printedCards.length > 0 && (
          <div>
            <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>📋 الكروت المطبوعة ({printedCards.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {printedCards.slice(0, 6).map((card, index) => (
                <div key={index} style={{ background: card.cardStyle === 'colored' ? `linear-gradient(135deg, ${card.colors.bg} 0%, ${card.colors.accent} 100%)` : '#fff', ...getCardBorderStyle('rectangle'), padding: '20px', color: card.colors.text, position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: `3px solid ${card.colors.border}` }}>
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
                    <div> {card.capacity}</div>
                    <div>💰 {card.value} جنيه</div>
                    <div>⏰ {card.expiryDate}</div>
                  </div>
                  {card.specialOffer && <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '10px', position: 'relative', zIndex: 1 }}> {card.specialOffer}</div>}
                </div>
              ))}
            </div>
            {printedCards.length > 6 && (
              <button onClick={() => setActivePopup('preview')} style={{ width: '100%', padding: '15px', background: 'rgba(0,255,255,0.1)', color: '#00ffff', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
                عرض كل الكروت ({printedCards.length})
              </button>
            )}
          </div>
        )}

        {/* Popup: اسم الشبكة */}
        {activePopup === 'network' && (
          <PopupWrapper title="🌐 اسم الشبكة" onClose={() => setActivePopup(null)}>
            <InputField label="أدخل اسم الشبكة" value={formData.networkName} onChange={(v) => setFormData({...formData, networkName: v})} placeholder="مثال: Jassas Net" />
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </PopupWrapper>
        )}

        {/* Popup: رقم الكرت */}
        {activePopup === 'cardNumber' && (
          <PopupWrapper title="🔢 عدد أرقام الكرت" onClose={() => setActivePopup(null)}>
            <InputField label="عدد الأرقام" value={formData.cardNumberLength} onChange={(v) => setFormData({...formData, cardNumberLength: parseInt(v) || 12})} type="number" placeholder="مثال: 12" />
            <div style={{ padding: '15px', background: 'rgba(0,255,255,0.1)', borderRadius: '12px', marginBottom: '20px', color: '#00ffff', fontSize: '14px' }}>
              💡 مثال: {generateCardNumber(formData.cardNumberLength)}
            </div>
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </PopupWrapper>
        )}

        {/* Popup: قيمة الكرت */}
        {activePopup === 'value' && (
          <PopupWrapper title="💰 قيمة الكرت" onClose={() => setActivePopup(null)}>
            <InputField label="القيمة بالجنيه" value={formData.cardValue} onChange={(v) => setFormData({...formData, cardValue: v})} type="number" placeholder="مثال: 100" />
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </PopupWrapper>
        )}

        {/* Popup: المدة */}
        {activePopup === 'duration' && (
          <PopupWrapper title="⏱️ مدة الكرت" onClose={() => setActivePopup(null)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الرقم</label>
              <input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} min="1" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>النوع</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['hour', 'day', 'week', 'month'].map(type => (
                  <button key={type} onClick={() => setFormData({...formData, durationType: type})} style={{ padding: '15px', background: formData.durationType === type ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.durationType === type ? '#0f172a' : '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {durationLabels[type]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(0,255,255,0.1)', borderRadius: '12px', marginBottom: '20px', color: '#00ffff', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
              النتيجة: {formData.duration} {durationLabels[formData.durationType]}
            </div>
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </PopupWrapper>
        )}

        {/* Popup: السعة */}
        {activePopup === 'capacity' && (
          <PopupWrapper title="💾 سعة الكرت" onClose={() => setActivePopup(null)}>
            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="checkbox" checked={formData.capacityUnlimited} onChange={(e) => setFormData({...formData, capacityUnlimited: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                <label style={{ color: '#e2e8f0', fontWeight: 'bold', fontSize: '16px' }}>سعة غير محدودة</label>
              </div>
            </div>
            {!formData.capacityUnlimited && (
              <InputField label="السعة بالـ MB" value={formData.capacity} onChange={(v) => setFormData({...formData, capacity: v})} type="number" placeholder="مثال: 500" />
            )}
            <div style={{ padding: '15px', background: 'rgba(0,255,255,0.1)', borderRadius: '12px', marginBottom: '20px', color: '#00ffff', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
              السعة: {formData.capacityUnlimited ? 'غير محدودة' : formData.capacity + ' MB'}
            </div>
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </PopupWrapper>
        )}

        {/* Popup: زمن الانتهاء */}
        {activePopup === 'expiry' && (
          <PopupWrapper title="⏰ زمن انتهاء الكرت" onClose={() => setActivePopup(null)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الرقم</label>
              <input type="number" value={formData.expiryTime} onChange={(e) => setFormData({...formData, expiryTime: e.target.value})} min="1" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>النوع</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['hour', 'day', 'week', 'month'].map(type => (
                  <button key={type} onClick={() => setFormData({...formData, expiryType: type})} style={{ padding: '15px', background: formData.expiryType === type ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.expiryType === type ? '#0f172a' : '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {durationLabels[type]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(0,255,255,0.1)', borderRadius: '12px', marginBottom: '20px', color: '#00ffff', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>سينتهي الكرت بعد:</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{formData.expiryTime} {durationLabels[formData.expiryType]}</div>
              <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>التاريخ المتوقع: {calculateExpiry()}</div>
            </div>
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </PopupWrapper>
        )}

        {/* Popup: تصميم الكرت */}
        {activePopup === 'style' && (
          <PopupWrapper title="🎨 تصميم الكرت" onClose={() => setActivePopup(null)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نوع التصميم</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => setFormData({...formData, cardStyle: 'plain'})} style={{ padding: '20px', background: formData.cardStyle === 'plain' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : '#fff', color: formData.cardStyle === 'plain' ? '#0f172a' : '#000', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  عادي
                </button>
                <button onClick={() => setFormData({...formData, cardStyle: 'colored'})} style={{ padding: '20px', background: formData.cardStyle === 'colored' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'linear-gradient(135deg, #1e3c72, #d4af37)', color: formData.cardStyle === 'colored' ? '#0f172a' : '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  ملون
                </button>
              </div>
            </div>
            {formData.cardStyle === 'colored' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نظام الألوان</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {Object.entries(colorSchemes).map(([key, val]) => (
                    <button key={key} onClick={() => setFormData({...formData, colorScheme: key})} style={{ padding: '15px', background: `linear-gradient(135deg, ${val.bg}, ${val.accent})`, border: formData.colorScheme === key ? '3px solid #fff' : '2px solid transparent', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {key === 'blue-gold' && 'أزرق ذهبي'}
                      {key === 'purple-silver' && 'بنفسجي فضي'}
                      {key === 'green-gold' && 'أخضر ذهبي'}
                      {key === 'red-black' && 'أحمر أسود'}
                      {key === 'orange-dark' && 'برتقالي داكن'}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </PopupWrapper>
        )}

        {/* Popup: الكمية */}
        {activePopup === 'quantity' && (
          <PopupWrapper title="📦 كمية الكروت" onClose={() => setActivePopup(null)}>
            <InputField label="عدد الكروت" value={formData.quantity} onChange={(v) => setFormData({...formData, quantity: parseInt(v) || 1})} type="number" placeholder="مثال: 10" />
            <button onClick={() => setActivePopup(null)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>حفظ</button>
          </PopupWrapper>
        )}

        {/* Popup: المعاينة */}
        {activePopup === 'preview' && printedCards.length > 0 && (
          <PopupWrapper title={`👁️ معاينة الكروت (${printedCards.length})`} onClose={() => setActivePopup(null)}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', maxHeight: '60vh', overflow: 'auto' }}>
              {printedCards.map((card, index) => (
                <div key={index} style={{ background: card.cardStyle === 'colored' ? `linear-gradient(135deg, ${card.colors.bg} 0%, ${card.colors.accent} 100%)` : '#fff', ...getCardBorderStyle('rectangle'), padding: '15px', color: card.colors.text, position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: `3px solid ${card.colors.border}`, animation: 'fadeIn 0.5s ease-in' }}>
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
                    <div>⏰ {card.expiryDate}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => window.print()} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '20px' }}>
              🖨️ طباعة الكل
            </button>
          </PopupWrapper>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
        }
      `}</style>
    </div>
  )
}
