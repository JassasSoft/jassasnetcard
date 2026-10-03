"use client"
import { useState, useEffect } from 'react'

export default function PrintCardsPage() {
  const [user, setUser] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
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
    quantity: '10'
  })
  const [printedCards, setPrintedCards] = useState([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      window.location.href = '/login'
    }
  }, [])

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
    const qty = parseInt(formData.quantity) || 1
    
    for (let i = 0; i < qty; i++) {
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
    setShowPreview(true)
    setShowSettings(false)
  }

  const getShapeStyle = (shape) => {
    if (shape === 'square') return { borderRadius: '15px', aspectRatio: '1' }
    if (shape === 'rounded') return { borderRadius: '30px' }
    return { borderRadius: '12px' }
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid #00ffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: '#fff', fontSize: '18px' }}>جاري التحميل...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* الهيدر */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ffff', fontSize: 'clamp(24px, 5vw, 36px)', margin: '0 0 10px 0' }}>
            🎫 طباعة كروت الإنترنت
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>نظام احترافي متكامل</p>
        </div>

        {/* الأزرار الرئيسية */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <button onClick={() => setShowSettings(true)} style={{ padding: '20px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '18px', fontWeight: 'bold', borderRadius: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,255,255,0.3)' }}>
            ⚙️ إعدادات الكرت
          </button>
          <button onClick={() => setShowPreview(true)} disabled={printedCards.length === 0} style={{ padding: '20px', background: printedCards.length > 0 ? 'linear-gradient(135deg, #10b981, #059669)' : '#666', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '15px', border: 'none', cursor: printedCards.length > 0 ? 'pointer' : 'not-allowed', boxShadow: printedCards.length > 0 ? '0 10px 30px rgba(16,185,129,0.3)' : 'none' }}>
            👁️ معاينة الكروت ({printedCards.length})
          </button>
        </div>

        {/* نافذة الإعدادات المنبثقة */}
        {showSettings && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000, overflow: 'auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '25px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', border: '2px solid rgba(0,255,255,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ color: '#00ffff', margin: 0, fontSize: '24px' }}>⚙️ إعدادات الكرت</h2>
                <button onClick={() => setShowSettings(false)} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>💰 قيمة الكرت (جنيه)</label>
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

              <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="checkbox" checked={formData.enableQR} onChange={(e) => setFormData({...formData, enableQR: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                  <label style={{ color: '#e2e8f0', fontWeight: 'bold' }}>🔳 تفعيل QR Code</label>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}> شكل الكرت</label>
                <select value={formData.cardShape} onChange={(e) => setFormData({...formData, cardShape: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                  <option value="rectangle">مستطيل (قياسي)</option>
                  <option value="square">مربع</option>
                  <option value="rounded">مستطيل مدور</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}> نظام الألوان</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {Object.entries(colorSchemes).map(([key, val]) => (
                    <button key={key} onClick={() => setFormData({...formData, colorScheme: key})} style={{ padding: '12px', background: val.bg, border: formData.colorScheme === key ? '3px solid #fff' : '2px solid transparent', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
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
                ️ طباعة الكروت
              </button>
            </div>
          </div>
        )}

        {/* نافذة المعاينة المنبثقة */}
        {showPreview && printedCards.length > 0 && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000, overflow: 'auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '25px', padding: '30px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'auto', border: '2px solid rgba(0,255,255,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ color: '#00ffff', margin: 0, fontSize: '24px' }}> معاينة الكروت ({printedCards.length})</h2>
                <button onClick={() => setShowPreview(false)} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {printedCards.map((card, index) => (
                  <div key={index} style={{ background: card.colors.bg, ...getShapeStyle(card.shape), padding: '20px', color: card.colors.text, position: 'relative', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.5)', border: '3px solid ' + card.colors.accent, animation: 'fadeIn 0.5s ease-in' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '50px', opacity: '0.08', fontWeight: 'bold', whiteSpace: 'nowrap' }}>JassasNetCard</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', position: 'relative', zIndex: 1 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '20px', color: card.colors.accent, fontWeight: 'bold' }}>{card.network}</h3>
                        <p style={{ margin: '3px 0 0 0', fontSize: '11px', opacity: 0.8 }}>نظام إدارة شبكات المايكروتك</p>
                      </div>
                      {card.qrEnabled && (
                        <div style={{ width: '55px', height: '55px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📱</div>
                      )}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '15px', marginBottom: '15px', position: 'relative', zIndex: 1 }}>
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ fontSize: '11px', opacity: 0.9 }}>👤 Username:</label>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>{card.username}</div>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', opacity: 0.9 }}>🔑 Password:</label>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>{card.password}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', position: 'relative', zIndex: 1 }}>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '8px' }}><strong>️ المدة:</strong><br/>{card.duration}</div>
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

              <button onClick={() => window.print()} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '20px', boxShadow: '0 5px 20px rgba(16,185,129,0.4)' }}>
                ️ طباعة الكروت
              </button>
            </div>
          </div>
        )}

        {/* عرض الكروت المطبوعة في الصفحة الرئيسية */}
        {printedCards.length > 0 && (
          <div>
            <h2 style={{ color: '#00ffff', marginBottom: '20px', fontSize: '22px' }}>📋 الكروت المطبوعة ({printedCards.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {printedCards.slice(0, 6).map((card, index) => (
                <div key={index} style={{ background: card.colors.bg, ...getShapeStyle(card.shape), padding: '20px', color: card.colors.text, position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '2px solid ' + card.colors.accent }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '40px', opacity: '0.08', fontWeight: 'bold', whiteSpace: 'nowrap' }}>JassasNetCard</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', position: 'relative', zIndex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: card.colors.accent }}>{card.network}</h3>
                    {card.qrEnabled && <div style={{ width: '45px', height: '45px', background: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📱</div>}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '12px', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>{card.username}</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>{card.password}</div>
                  </div>
                  <div style={{ fontSize: '11px', position: 'relative', zIndex: 1 }}>
                    <div>⏱️ {card.duration} | 💾 {card.capacity}</div>
                    <div>💰 {card.value} جنيه</div>
                  </div>
                </div>
              ))}
            </div>
            {printedCards.length > 6 && (
              <button onClick={() => setShowPreview(true)} style={{ width: '100%', padding: '15px', background: 'rgba(0,255,255,0.1)', color: '#00ffff', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
                عرض كل الكروت ({printedCards.length})
              </button>
            )}
          </div>
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
