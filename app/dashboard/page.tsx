"use client"
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [cards, setCards] = useState([])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontSize: '20px' }}>جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)', padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* الهيدر */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '30px', marginBottom: '30px', border: '2px solid rgba(0,255,255,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#00ffff', margin: '0 0 10px 0', fontSize: '32px' }}>مرحباً، {user.fullName}</h1>
            <p style={{ color: '#94a3b8', margin: 0 }}>JassasNetCard Dashboard</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '12px 30px', background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: '2px solid #ff0000', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Logout
          </button>
        </div>

        {/* الإحصائيات */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'linear-gradient(135deg, #00ffff, #00bfff)', borderRadius: '20px', padding: '30px', color: '#0a0e27' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>الكروت المتبقية</h3>
            <p style={{ margin: 0, fontSize: '48px', fontWeight: 'bold' }}>{user.cardsRemaining || 500}</p>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #00ff00, #00cc00)', borderRadius: '20px', padding: '30px', color: '#0a0e27' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>سعر الكرت</h3>
            <p style={{ margin: 0, fontSize: '48px', fontWeight: 'bold' }}>1.5 <span style={{ fontSize: '24px' }}>جنيه</span></p>
          </div>
          
          <div style={{ background: 'linear-gradient(135deg, #9b59b6, #8e44ad)', borderRadius: '20px', padding: '30px', color: '#fff' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>الاشتراك</h3>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>تجريبي (500 كرت)</p>
          </div>
        </div>

        {/* الأزرار الرئيسية */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <a href="/dashboard/print-cards" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #00ffff, #00bfff)', borderRadius: '15px', padding: '25px', textAlign: 'center', color: '#0a0e27', fontWeight: 'bold', fontSize: '18px', transition: 'transform 0.3s' }}>
              🖨️ طباعة كروت
            </div>
          </a>
          
          <a href="/dashboard/buy-cards" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #9b59b6, #8e44ad)', borderRadius: '15px', padding: '25px', textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>
               شراء كروت
            </div>
          </a>
          
          <a href="/dashboard/mikrotik" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #00ff00, #00cc00)', borderRadius: '15px', padding: '25px', textAlign: 'center', color: '#0a0e27', fontWeight: 'bold', fontSize: '18px' }}>
              🌐 MikroTik
            </div>
          </a>
        </div>

        {/* الكروت المطبوعة */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '30px', border: '2px solid rgba(0,255,255,0.3)' }}>
          <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>📋 الكروت المطبوعة</h2>
          {cards.length > 0 ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {cards.map((card, index) => (
                <div key={index} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: '#fff', margin: '0 0 5px 0' }}><strong>Username:</strong> {card.username}</p>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>{card.duration} | {card.capacity}</p>
                  </div>
                  <div style={{ color: '#00ff00', fontWeight: 'bold' }}>{card.status}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>لا توجد كروت مطبوعة بعد</p>
          )}
        </div>
      </div>
    </div>
  )
}
