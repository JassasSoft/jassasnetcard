"use client"
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [darkMode, setDarkMode] = useState(true)
  const [stats, setStats] = useState({
    totalCards: 3015,
    usedCards: 317,
    availableCards: 2698,
    networks: 1,
    connectedNow: 12,
    usagePercent: 10.5
  })

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
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid #00ffff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: '#fff', fontSize: '18px' }}>جاري التحميل...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const usagePercent = ((stats.usedCards / stats.totalCards) * 100).toFixed(1)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', fontFamily: 'Segoe UI, Tahoma, Arial', paddingBottom: '80px' }}>
      
      {/* الشريط العلوي */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '20px', borderRadius: '0 0 30px 30px', boxShadow: '0 10px 30px rgba(30, 64, 175, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 5px 0', fontSize: '14px' }}>مرحباً،</p>
            <h1 style={{ color: '#fff', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{user.fullName || 'مستخدم'}</h1>
          </div>
          <div style={{ width: '60px', height: '60px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>
            {(user.fullName || 'U').charAt(0)}
          </div>
        </div>

        {/* بطاقة الرصيد */}
        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 5px 0', fontSize: '14px' }}>رصيدك من الكروت</p>
              <h2 style={{ color: '#fff', margin: 0, fontSize: '48px', fontWeight: 'bold' }}>{user.cardsRemaining || 500}</h2>
            </div>
            <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
              
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        
        {activeTab === 'home' && (
          <>
            {/* الإحصائيات */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}></span>
                  <span style={{ color: '#3b82f6', fontSize: '12px' }}>إجمالي</span>
                </div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.totalCards}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '5px 0 0 0', fontSize: '12px' }}>الكروت</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}>👥</span>
                  <span style={{ color: '#10b981', fontSize: '12px' }}>متصلين</span>
                </div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.connectedNow}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '5px 0 0 0', fontSize: '12px' }}>الآن</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}></span>
                  <span style={{ color: '#f59e0b', fontSize: '12px' }}>الشبكات</span>
                </div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.networks}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '5px 0 0 0', fontSize: '12px' }}>نشطة</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}>⚡</span>
                  <span style={{ color: '#8b5cf6', fontSize: '12px' }}>السرعة</span>
                </div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>100 Mbps</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '5px 0 0 0', fontSize: '12px' }}>أقصى سرعة</p>
              </div>
            </div>

            {/* أزرار سريعة */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <button onClick={() => setActiveTab('cards')} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', color: '#fff', border: 'none', borderRadius: '15px', padding: '20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span></span> فحص كرت
              </button>
              <a href="https://wa.me/1234567890" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', borderRadius: '15px', padding: '20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
                  <span></span> تواصل معنا
                </button>
              </a>
            </div>

            {/* نسبة الاستخدام */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>نسبة الاستخدام</h3>
                <span style={{ color: '#3b82f6', fontSize: '24px', fontWeight: 'bold' }}>{usagePercent}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)', height: '100%', width: `${usagePercent}%`, borderRadius: '10px', transition: 'width 0.5s' }}></div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'cards' && (
          <>
            {/* إجمالي الكروت */}
            <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', borderRadius: '20px', padding: '25px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 5px 0', fontSize: '14px' }}>إجمالي الكروت</p>
                  <h2 style={{ color: '#fff', margin: 0, fontSize: '48px', fontWeight: 'bold' }}>{stats.totalCards.toLocaleString()}</h2>
                </div>
                <span style={{ fontSize: '40px' }}>🎫</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>✅</div>
                  <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>{stats.usedCards}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>مستخدمة</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>🆕</div>
                  <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>{stats.availableCards}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>متاحة</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '15px', padding: '15px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>📶</div>
                  <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>{stats.networks}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>الشبكات</div>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>نسبة الاستخدام</span>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{usagePercent}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ background: '#fff', height: '100%', width: `${usagePercent}%`, borderRadius: '10px' }}></div>
                </div>
              </div>
            </div>

            {/* تفاصيل الشبكة */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '18px' }}>أولاد آدم</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '12px' }}>#5660 • 10.16.1.80</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ background: '#3b82f6', color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '12px' }}>باقة 2</span>
                  <span style={{ fontSize: '24px' }}></span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#3b82f6', fontSize: '24px', fontWeight: 'bold' }}>{stats.totalCards}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>الإجمالي</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>{stats.usedCards}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>مستخدم</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#f59e0b', fontSize: '24px', fontWeight: 'bold' }}>{stats.availableCards}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>متاح</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            {/* البروفايل */}
            <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', borderRadius: '20px', padding: '30px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '100px', height: '100px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 'bold', color: '#1e40af', margin: '0 auto 15px' }}>
                {(user.fullName || 'U').charAt(0)}
              </div>
              <h2 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '24px' }}>{user.fullName}</h2>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '5px 20px', borderRadius: '20px', fontSize: '14px' }}>عميل</span>
            </div>

            {/* الرصيد */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 15px 0', fontSize: '18px' }}>الرصيد المتاح</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ color: '#10b981', fontSize: '48px', fontWeight: 'bold' }}>{user.cardsRemaining || 500}</span>
                  <span style={{ color: '#10b981', fontSize: '24px', marginRight: '10px' }}>كرت</span>
                </div>
                <span style={{ fontSize: '40px' }}>💳</span>
              </div>
            </div>

            {/* الإعدادات */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 15px 0', fontSize: '18px' }}>الإعدادات</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '24px' }}></span>
                  <span style={{ color: '#fff', fontSize: '16px' }}>الليلي</span>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, background: darkMode ? '#3b82f6' : '#ccc', borderRadius: '34px', transition: '.4s' }}></span>
                  <span style={{ position: 'absolute', content: '""', height: '26px', width: '26px', left: darkMode ? '26px' : '4px', bottom: '4px', background: 'white', borderRadius: '50%', transition: '.4s' }}></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '24px' }}></span>
                  <span style={{ color: '#fff', fontSize: '16px' }}>اللغة</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>العربية ←</span>
              </div>
            </div>

            {/* الحساب */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
              <h3 style={{ color: '#fff', margin: '0 0 15px 0', fontSize: '18px' }}>الحساب</h3>
              
              <button onClick={handleLogout} style={{ width: '100%', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', border: 'none', borderRadius: '15px', padding: '15px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
                 تسجيل الخروج
              </button>
            </div>
          </>
        )}

        {activeTab === 'store' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <span style={{ fontSize: '80px', marginBottom: '20px', display: 'block' }}></span>
            <h2 style={{ color: '#fff', marginBottom: '10px' }}>المتجر</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>قريباً - شراء كروت إضافية</p>
          </div>
        )}

        {activeTab === 'solutions' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <span style={{ fontSize: '80px', marginBottom: '20px', display: 'block' }}>💡</span>
            <h2 style={{ color: '#fff', marginBottom: '10px' }}>حلول</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>قريباً - حلول تقنية متكاملة</p>
          </div>
        )}
      </div>

      {/* شريط التنقل السفلي */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '10px 0', zIndex: 1000 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '600px', margin: '0 auto' }}>
          {[
            { id: 'home', icon: '', label: 'الرئيسية' },
            { id: 'cards', icon: '', label: 'الكروت' },
            { id: 'store', icon: '🏪', label: 'المتجر' },
            { id: 'solutions', icon: '📚', label: 'حلول' },
            { id: 'profile', icon: '👤', label: 'حسابي' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
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
