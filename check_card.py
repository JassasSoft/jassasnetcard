code = '''"use client"
import { useState } from 'react'

export default function CheckCardPage() {
  const [cardNumber, setCardNumber] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkCard = async () => {
    if (!cardNumber) {
      alert('الرجاء إدخال رقم الكرت')
      return
    }

    setLoading(true)
    
    // محاكاة فحص الكرت
    setTimeout(() => {
      setResult({
        valid: true,
        cardNumber: cardNumber,
        duration: '12 ساعة',
        capacity: '500 MB',
        status: 'نشط',
        expiryDate: '2026/10/05 10:30 م',
        network: 'Jassas Net'
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* الهيدر */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button onClick={() => window.history.back()} style={{ 
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer'
          }}>←</button>
          
          <h1 style={{ color: '#00ffff', fontSize: '32px', margin: '0 0 10px 0' }}> فحص كرت</h1>
          <p style={{ color: '#94a3b8' }}>تحقق من حالة الكرت ومعلوماته</p>
        </div>

        {/* نموذج الفحص */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          padding: '30px',
          border: '2px solid rgba(0,255,255,0.2)',
          marginBottom: '20px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>
              🔑 أدخل رقم الكرت
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="مثال: 861234567890"
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(0,0,0,0.4)',
                border: '2px solid rgba(0,255,255,0.3)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '18px',
                fontFamily: 'monospace',
                letterSpacing: '2px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={checkCard}
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: loading ? '#666' : 'linear-gradient(135deg, #00ffff, #00bfff)',
              color: loading ? '#999' : '#0f172a',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 30px rgba(0,255,255,0.3)'
            }}
          >
            {loading ? '⏳ جاري الفحص...' : '🔍 فحص الكرت'}
          </button>
        </div>

        {/* نتيجة الفحص */}
        {result && (
          <div style={{
            background: result.valid ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `2px solid ${result.valid ? '#10b981' : '#ef4444'}`,
            borderRadius: '20px',
            padding: '25px',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '60px', marginBottom: '10px' }}>
                {result.valid ? '✅' : '❌'}
              </div>
              <h2 style={{ 
                color: result.valid ? '#10b981' : '#ef4444',
                margin: '0 0 5px 0',
                fontSize: '24px'
              }}>
                {result.valid ? 'كرت صالح' : 'كرت غير صالح'}
              </h2>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>
                {result.valid ? 'الكرت نشط وجاهز للاستخدام' : 'الكرت غير موجود أو منتهي'}
              </p>
            </div>

            {result.valid && (
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ 
                  background: 'rgba(0,0,0,0.3)',
                  padding: '15px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}> رقم الكرت</span>
                  <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {result.cardNumber}
                  </span>
                </div>

                <div style={{ 
                  background: 'rgba(0,0,0,0.3)',
                  padding: '15px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>🌐 الشبكة</span>
                  <span style={{ color: '#00ffff', fontSize: '16px', fontWeight: 'bold' }}>
                    {result.network}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ 
                    background: 'rgba(0,0,0,0.3)',
                    padding: '15px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}>⏱️ المدة</div>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{result.duration}</div>
                  </div>

                  <div style={{ 
                    background: 'rgba(0,0,0,0.3)',
                    padding: '15px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}> السعة</div>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{result.capacity}</div>
                  </div>
                </div>

                <div style={{ 
                  background: 'rgba(0,0,0,0.3)',
                  padding: '15px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>📊 الحالة</span>
                  <span style={{ 
                    background: '#10b981',
                    color: '#fff',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {result.status}
                  </span>
                </div>

                <div style={{ 
                  background: 'rgba(0,0,0,0.3)',
                  padding: '15px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>⏰ ينتهي في</span>
                  <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: 'bold' }}>
                    {result.expiryDate}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* معلومات إضافية */}
        <div style={{
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#3b82f6', margin: '0 0 15px 0', fontSize: '16px' }}>💡 كيف تستخدم الكرت؟</h3>
          <ol style={{ color: '#94a3b8', margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: 1.8 }}>
            <li>اتصل بشبكة WiFi الخاصة بنا</li>
            <li>سيظهر لك صفحة تسجيل الدخول</li>
            <li>أدخل رقم الكرت في خانة Username</li>
            <li>أدخل نفس الرقم في خانة Password</li>
            <li>اضغط Connect للاستمتاع بالإنترنت</li>
          </ol>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
'''

with open('app/dashboard/check-card/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('✅ صفحة فحص الكرت تم إنشاؤها!')
