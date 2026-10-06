"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/login')
    }
  }, [router])

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #FFD700', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p>جاري التحميل...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', fontFamily: 'Segoe UI, Tahoma, Arial', paddingBottom: '80px' }}>
      {/* الهيدر */}
      <div style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', padding: '25px 20px', borderRadius: '0 0 30px 30px', boxShadow: '0 10px 30px rgba(30, 60, 114, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 5px 0', fontSize: '14px' }}>مرحباً بك،</p>
            <h1 style={{ color: '#FFD700', margin: 0, fontSize: '26px', fontWeight: 'bold' }}>{user.fullName}</h1>
          </div>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}>
            🚪 خروج
          </button>
        </div>

        {/* بطاقة الرصيد */}
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '25px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', fontSize: '15px' }}>رصيدك من الكروت</p>
              <h2 style={{ color: '#fff', margin: 0, fontSize: '48px', fontWeight: 'bold', lineHeight: 1 }}>{user.cardsRemaining || 0}</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '8px 0 0 0', fontSize: '13px' }}>كرت متاح للطباعة</p>
            </div>
            <div style={{ width: '70px', height: '70px', background: 'rgba(255, 215, 0, 0.2)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px' }}>
              💳
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {activeTab === 'home' && (
          <>
            {/* الإحصائيات */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '28px' }}>📊</span>
                  <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}>إجمالي</span>
                </div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>3,015</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '5px 0 0 0', fontSize: '12px' }}>كرت تم إنشاؤه</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '28px' }}>👥</span>
                  <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>متصلين</span>
                </div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>12</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '5px 0 0 0', fontSize: '12px' }}>مستخدم الآن</p>
              </div>
            </div>

            {/* الأزرار الرئيسية */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
              <button onClick={() => router.push('/dashboard/print-cards')} style={{ background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', border: 'none', borderRadius: '18px', padding: '25px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '32px' }}>🖨️</span>
                طباعة كروت
              </button>
              
              <button style={{ background: 'linear-gradient(135deg, #3b82f6, #1e40af)', color: '#fff', border: 'none', borderRadius: '18px', padding: '25px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 30px rgba(59,130,246,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '32px' }}>🔍</span>
                فحص كرت
              </button>
            </div>

            {/* روابط إضافية */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <button style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: '18px', padding: '20px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '28px' }}>🌐</span>
                إعدادات MikroTik
              </button>
              
              <button style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', borderRadius: '18px', padding: '20px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '28px' }}>💬</span>
                تواصل معنا
              </button>
            </div>
          </>
        )}
      </div>

      {/* شريط التنقل السفلي */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 0', zIndex: 1000 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '600px', margin: '0 auto' }}>
          {[
            { id: 'home', icon: '🏠', label: 'الرئيسية' },
            { id: 'cards', icon: '🎫', label: 'الكروت' },
            { id: 'settings', icon: '⚙️', label: 'الإعدادات' },
            { id: 'profile', icon: '👤', label: 'حسابي' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? '#FFD700' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 15px',
                transform: activeTab === tab.id ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s'
              }}
            >
              <span style={{ fontSize: '24px' }}>{tab.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: activeTab === tab.id ? 'bold' : 'normal' }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
