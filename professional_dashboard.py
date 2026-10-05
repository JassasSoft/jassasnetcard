dashboard_code = '''"use client"
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      window.location.href = '/login'
    }
    
    if ('caches' in window) {
      caches.keys().then(names => names.forEach(name => caches.delete(name)))
    }
  }, [])

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

  const stats = {
    cardsRemaining: user.cardsRemaining || 487,
    totalCards: 3015,
    connectedNow: 12,
    networks: 1,
    speed: '100 Mbps'
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: darkMode ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
      fontFamily: 'Segoe UI, Tahoma, Arial',
      paddingBottom: '80px'
    }}>
      
      {/* الهيدر */}
      <div style={{ 
        background: darkMode ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        padding: '25px 20px',
        borderRadius: '0 0 30px 30px',
        boxShadow: '0 10px 30px rgba(30, 64, 175, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 5px 0', fontSize: '14px' }}>مرحباً،</p>
            <h1 style={{ color: '#fff', margin: 0, fontSize: '26px', fontWeight: 'bold' }}>{user.fullName || 'مستخدم'}</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => setDarkMode(!darkMode)} style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              cursor: 'pointer',
              fontSize: '20px'
            }}>
              {darkMode ? '☀️' : ''}
            </button>
            <div style={{ 
              width: '55px', 
              height: '55px', 
              background: '#fff', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '26px', 
              fontWeight: 'bold', 
              color: '#1e40af'
            }}>
              {(user.fullName || 'U').charAt(0)}
            </div>
          </div>
        </div>

        {/* بطاقة الرصيد */}
        <div style={{ 
          background: 'rgba(255,255,255,0.15)', 
          backdropFilter: 'blur(10px)',
          borderRadius: '20px', 
          padding: '25px', 
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0 0 8px 0', fontSize: '15px' }}>رصيدك من الكروت</p>
              <h2 style={{ color: '#fff', margin: 0, fontSize: '52px', fontWeight: 'bold', lineHeight: 1 }}>{stats.cardsRemaining}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: '8px 0 0 0', fontSize: '13px' }}>كرت متبقي</p>
            </div>
            <div style={{ 
              width: '70px', 
              height: '70px', 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '18px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '35px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}>
              💳
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
              <div style={{ 
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '20px', 
                padding: '20px', 
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '28px' }}></span>
                  <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}>إجمالي</span>
                </div>
                <h3 style={{ color: darkMode ? '#fff' : '#0f172a', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.totalCards}</h3>
                <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', margin: '5px 0 0 0', fontSize: '12px' }}>الكروت</p>
              </div>

              <div style={{ 
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '20px', 
                padding: '20px', 
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '28px' }}>👥</span>
                  <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>متصلين</span>
                </div>
                <h3 style={{ color: darkMode ? '#fff' : '#0f172a', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.connectedNow}</h3>
                <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', margin: '5px 0 0 0', fontSize: '12px' }}>الآن</p>
              </div>

              <div style={{ 
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '20px', 
                padding: '20px', 
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '28px' }}></span>
                  <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 'bold' }}>الشبكات</span>
                </div>
                <h3 style={{ color: darkMode ? '#fff' : '#0f172a', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.networks}</h3>
                <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', margin: '5px 0 0 0', fontSize: '12px' }}>نشطة</p>
              </div>

              <div style={{ 
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '20px', 
                padding: '20px', 
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '28px' }}>⚡</span>
                  <span style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: 'bold' }}>السرعة</span>
                </div>
                <h3 style={{ color: darkMode ? '#fff' : '#0f172a', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{stats.speed}</h3>
                <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', margin: '5px 0 0 0', fontSize: '12px' }}>أقصى سرعة</p>
              </div>
            </div>

            {/* الأزرار الرئيسية */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <a href="/dashboard/print-cards" style={{ textDecoration: 'none' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #00ffff, #00bfff)',
                  borderRadius: '18px', 
                  padding: '25px', 
                  textAlign: 'center', 
                  color: '#0f172a', 
                  fontWeight: 'bold', 
                  fontSize: '16px',
                  boxShadow: '0 10px 30px rgba(0,255,255,0.3)',
                  transition: 'transform 0.3s'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🖨️</div>
                  طباعة كروت
                </div>
              </a>
              
              <a href="/dashboard/check-card" style={{ textDecoration: 'none' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                  borderRadius: '18px', 
                  padding: '25px', 
                  textAlign: 'center', 
                  color: '#fff', 
                  fontWeight: 'bold', 
                  fontSize: '16px',
                  boxShadow: '0 10px 30px rgba(59,130,246,0.3)'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                  فحص كرت
                </div>
              </a>
            </div>

            {/* أزرار إضافية */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <a href="/dashboard/mikrotik" style={{ textDecoration: 'none' }}>
                <div style={{ 
                  background: darkMode ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.2)',
                  border: '2px solid #10b981',
                  borderRadius: '18px', 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: '#10b981', 
                  fontWeight: 'bold', 
                  fontSize: '15px'
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '5px' }}>🌐</div>
                  MikroTik
                </div>
              </a>
              
              <a href="https://wa.me/1234567890" style={{ textDecoration: 'none' }}>
                <div style={{ 
                  background: darkMode ? 'rgba(37,211,102,0.1)' : 'rgba(37,211,102,0.2)',
                  border: '2px solid #25D366',
                  borderRadius: '18px', 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: '#25D366', 
                  fontWeight: 'bold', 
                  fontSize: '15px'
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '5px' }}>💬</div>
                  تواصل معنا
                </div>
              </a>
            </div>

            {/* نسبة الاستخدام */}
            <div style={{ 
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              borderRadius: '20px', 
              padding: '20px', 
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: darkMode ? '#fff' : '#0f172a', margin: 0, fontSize: '16px' }}>نسبة الاستخدام</h3>
                <span style={{ color: '#3b82f6', fontSize: '24px', fontWeight: 'bold' }}>10.5%</span>
              </div>
              <div style={{ 
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderRadius: '10px', 
                height: '12px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  background: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)', 
                  height: '100%', 
                  width: '10.5%', 
                  borderRadius: '10px', 
                  transition: 'width 0.5s' 
                }}></div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'cards' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎫</div>
            <h2 style={{ color: darkMode ? '#fff' : '#0f172a', marginBottom: '10px' }}>الكروت</h2>
            <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>إدارة الكروت المطبوعة</p>
            <a href="/dashboard/print-cards" style={{ textDecoration: 'none' }}>
              <button style={{ 
                marginTop: '20px',
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #00ffff, #00bfff)',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                طباعة كروت جديدة
              </button>
            </a>
          </div>
        )}

        {activeTab === 'store' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏪</div>
            <h2 style={{ color: darkMode ? '#fff' : '#0f172a', marginBottom: '10px' }}>المتجر</h2>
            <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>شراء كروت إضافية قريباً</p>
          </div>
        )}

        {activeTab === 'solutions' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>💡</div>
            <h2 style={{ color: darkMode ? '#fff' : '#0f172a', marginBottom: '10px' }}>حلول</h2>
            <p style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>حلول تقنية متكاملة قريباً</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <>
            {/* البروفايل */}
            <div style={{ 
              background: darkMode ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              borderRadius: '20px', 
              padding: '30px', 
              textAlign: 'center', 
              marginBottom: '20px',
              boxShadow: '0 10px 30px rgba(30, 64, 175, 0.3)'
            }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                background: '#fff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: '#1e40af', 
                margin: '0 auto 15px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
              }}>
                {(user.fullName || 'U').charAt(0)}
              </div>
              <h2 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '24px' }}>{user.fullName}</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 15px 0', fontSize: '14px' }}>{user.email}</p>
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: '#fff', 
                padding: '6px 20px', 
                borderRadius: '20px', 
                fontSize: '13px',
                backdropFilter: 'blur(10px)'
              }}>عميل</span>
            </div>

            {/* الإعدادات */}
            <div style={{ 
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              borderRadius: '20px', 
              padding: '20px', 
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              marginBottom: '20px'
            }}>
              <h3 style={{ color: darkMode ? '#fff' : '#0f172a', margin: '0 0 15px 0', fontSize: '18px' }}>الإعدادات</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '24px' }}>{darkMode ? '' : '☀️'}</span>
                  <span style={{ color: darkMode ? '#fff' : '#0f172a', fontSize: '16px' }}>الوضع الليلي</span>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                  <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ 
                    position: 'absolute', 
                    cursor: 'pointer', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    background: darkMode ? '#3b82f6' : '#ccc', 
                    borderRadius: '34px', 
                    transition: '.4s' 
                  }}></span>
                  <span style={{ 
                    position: 'absolute', 
                    content: '""', 
                    height: '26px', 
                    width: '26px', 
                    left: darkMode ? '26px' : '4px', 
                    bottom: '4px', 
                    background: 'white', 
                    borderRadius: '50%', 
                    transition: '.4s' 
                  }}></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '24px' }}>🌐</span>
                  <span style={{ color: darkMode ? '#fff' : '#0f172a', fontSize: '16px' }}>اللغة</span>
                </div>
                <span style={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: '14px' }}>العربية ←</span>
              </div>
            </div>

            {/* تسجيل الخروج */}
            <button onClick={() => {
              localStorage.removeItem('user')
              window.location.href = '/login'
            }} style={{ 
              width: '100%', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '15px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(239, 68, 68, 0.3)'
            }}>
              🚪 تسجيل الخروج
            </button>
          </>
        )}
      </div>

      {/* شريط التنقل السفلي */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        padding: '10px 0', 
        zIndex: 1000,
        boxShadow: '0 -5px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '600px', margin: '0 auto' }}>
          {[
            { id: 'home', icon: '🏠', label: 'الرئيسية' },
            { id: 'cards', icon: '', label: 'الكروت' },
            { id: 'store', icon: '🏪', label: 'المتجر' },
            { id: 'solutions', icon: '💡', label: 'حلول' },
            { id: 'profile', icon: '👤', label: 'حسابي' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? '#3b82f6' : (darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                transition: 'all 0.3s',
                transform: activeTab === tab.id ? 'scale(1.1)' : 'scale(1)'
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
'''

with open('app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(dashboard_code)

print('✅ Dashboard الاحترافي الموحد تم إنشاؤه!')
