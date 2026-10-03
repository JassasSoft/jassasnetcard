"use client"
import { useState } from 'react'

export default function PrintCardsPage() {
  const [formData, setFormData] = useState({
    cardValue: '1',
    duration: '1',
    durationType: 'hour',
    capacity: '500',
    capacityUnlimited: false,
    networkName: 'Jassas Net',
    specialOffer: '',
    enableQR: true,
    cardShape: 'rectangle',
    colorScheme: 'blue-gold',
    quantity: 10
  })
  
  const [printedCards, setPrintedCards] = useState([])

  const colorSchemes = {
    'blue-gold': { bg: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #d4af37 100%)', accent: '#d4af37', text: '#fff' },
    'purple-silver': { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #c0c0c0 100%)', accent: '#c0c0c0', text: '#fff' },
    'green-gold': { bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 50%, #ffd700 100%)', accent: '#ffd700', text: '#fff' },
    'red-black': { bg: 'linear-gradient(135deg, #cb2d3e 0%, #ef473a 50%, #1a1a2e 100%)', accent: '#ff0', text: '#fff' },
    'orange-dark': { bg: 'linear-gradient(135deg, #f12711 0%, #f5af19 50%, #2c3e50 100%)', accent: '#f5af19', text: '#fff' }
  }

  const durationLabels = { hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }

  const generateCards = () => {
    const cards = []
    const durationText = formData.duration + ' ' + durationLabels[formData.durationType]
    
    for (let i = 0; i < parseInt(formData.quantity); i++) {
      cards.push({
        id: 'JNC-' + Date.now() + '-' + i,
        username: 'USER' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        password: Math.random().toString(36).substr(2, 10),
        value: formData.cardValue,
        duration: durationText,
        capacity: formData.capacityUnlimited ? 'غير محدود' : formData.capacity + ' MB',
        network: formData.networkName,
        specialOffer: formData.specialOffer,
        qrEnabled: formData.enableQR,
        shape: formData.cardShape,
        colors: colorSchemes[formData.colorScheme]
      })
    }
    setPrintedCards(cards)
  }

  const getShapeStyle = (shape) => {
    if (shape === 'square') return { borderRadius: '15px' }
    if (shape === 'rounded') return { borderRadius: '30px' }
    return { borderRadius: '12px' }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ffff', fontSize: '36px', margin: '0 0 10px 0' }}>
            🎫 طباعة كروت الإنترنت
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>نظام احترافي متكامل</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '25px', padding: '30px', border: '2px solid rgba(0,255,255,0.2)' }}>
            <h2 style={{ color: '#00ffff', marginBottom: '25px', fontSize: '22px' }}>️ إعدادات الكرت</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}> قيمة الكرت (جنيه)</label>
              <input type="number" value={formData.cardValue} onChange={(e) => setFormData({...formData, cardValue: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>⏱️ المدة</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} min="1" style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }} />
                <select value={formData.durationType} onChange={(e) => setFormData({...formData, durationType: e.target.value})} style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                  <option value="hour">ساعة</option>
                  <option value="day">يوم</option>
                  <option value="week">أسبوع</option>
                  <option value="month">شهر</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>💾 السعة</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <input type="checkbox" checked={formData.capacityUnlimited} onChange={(e) => setFormData({...formData, capacityUnlimited: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                <label style={{ color: '#e2e8f0' }}>غير محدود</label>
              </div>
              {!formData.capacityUnlimited && (
                <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} placeholder="مثال: 500 MB" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🌐 اسم الشبكة</label>
              <input type="text" value={formData.networkName} onChange={(e) => setFormData({...formData, networkName: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🎁 عرض خاص (اختياري)</label>
              <textarea value={formData.specialOffer} onChange={(e) => setFormData({...formData, specialOffer: e.target.value})} rows="2" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="checkbox" checked={formData.enableQR} onChange={(e) => setFormData({...formData, enableQR: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                <label style={{ color: '#e2e8f0', fontWeight: 'bold' }}>🔳 تفعيل QR Code</label>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>📐 شكل الكرت</label>
              <select value={formData.cardShape} onChange={(e) => setFormData({...formData, cardShape: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                <option value="rectangle">مستطيل (قياسي)</option>
                <option value="square">مربع</option>
                <option value="rounded">مستطيل مدور</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🎨 نظام الألوان</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {Object.entries(colorSchemes).map(([key, val]) => (
                  <button key={key} onClick={() => setFormData({...formData, colorScheme: key})} style={{ padding: '10px', background: val.bg, border: formData.colorScheme === key ? '3px solid #fff' : '2px solid transparent', borderRadius: '10px', color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {key === 'blue-gold' && 'أزرق ذهبي'}
                    {key === 'purple-silver' && 'بنفسجي فضي'}
                    {key === 'green-gold' && 'أخضر ذهبي'}
                    {key === 'red-black' && 'أحمر أسود'}
                    {key === 'orange-dark' && 'برتقالي داكن'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>🔢 الكمية</label>
              <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} min="1" max="100" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>

            <button onClick={generateCards} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 5px 20px rgba(0,255,255,0.4)' }}>
              🖨️ طباعة الكروت
            </button>
          </div>

          <div>
            <h2 style={{ color: '#00ffff', marginBottom: '25px', fontSize: '22px' }}> معاينة الكروت ({printedCards.length})</h2>
            
            {printedCards.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {printedCards.map((card, index) => (
                  <div key={index} style={{ background: card.colors.bg, ...getShapeStyle(card.shape), padding: '20px', color: card.colors.text, position: 'relative', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.5)', border: '3px solid ' + card.colors.accent }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '50px', opacity: '0.08', fontWeight: 'bold', whiteSpace: 'nowrap' }}>JassasNetCard</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', position: 'relative', zIndex: 1 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '20px', color: card.colors.accent, fontWeight: 'bold' }}>{card.network}</h3>
                        <p style={{ margin: '3px 0 0 0', fontSize: '11px', opacity: 0.8 }}>نظام إدارة شبكات المايكروتك</p>
                      </div>
                      {card.qrEnabled && (
                        <div style={{ width: '55px', height: '55px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}></div>
                      )}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '15px', marginBottom: '15px', position: 'relative', zIndex: 1 }}>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '11px', opacity: 0.9 }}>👤 Username:</label>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>{card.username}</div>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', opacity: 0.9 }}> Password:</label>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>{card.password}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', position: 'relative', zIndex: 1 }}>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}><strong>⏱️ المدة:</strong><br/>{card.duration}</div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}><strong>💾 السعة:</strong><br/>{card.capacity}</div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px', gridColumn: '1 / -1' }}><strong>💰 القيمة:</strong> {card.value} جنيه</div>
                    </div>
                    {card.specialOffer && (
                      <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', fontSize: '11px', position: 'relative', zIndex: 1 }}>🎁 {card.specialOffer}</div>
                    )}
                    <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '10px', opacity: 0.8, position: 'relative', zIndex: 1, paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>Powered by JassasNetCard © 2026</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '25px', padding: '80px 40px', textAlign: 'center', border: '2px dashed rgba(0,255,255,0.3)' }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎫</div>
                <p style={{ color: '#94a3b8', fontSize: '18px' }}>اضغط "طباعة الكروت" لإنشاء كروت جديدة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
