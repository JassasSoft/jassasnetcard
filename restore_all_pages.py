import os

# التأكد من وجود المجلدات
os.makedirs('app/login', exist_ok=True)
os.makedirs('app/dashboard/print-cards', exist_ok=True)

# ==========================================
# 1. صفحة تسجيل الدخول (Login Page)
# ==========================================
login_code = '''"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // محاكاة تسجيل الدخول (استبدل هذا بمنطق Supabase الفعلي لاحقاً)
    setTimeout(() => {
      if (email && password) {
        const mockUser = {
          fullName: 'مهندس جاسر',
          email: email,
          cardsRemaining: 500,
          role: 'admin'
        }
        localStorage.setItem('user', JSON.stringify(mockUser))
        router.push('/dashboard')
      } else {
        setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3c72 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Arial, sans-serif'
    }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📶</div>
          <h1 style={{ color: '#FFD700', fontSize: '28px', margin: '0 0 8px 0', fontWeight: 'bold' }}>Jassas Net Card</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>نظام إدارة شبكات المايكروتك الاحترافي</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            color: '#fca5a5', 
            padding: '12px', 
            borderRadius: '12px', 
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@jassas.net"
              style={{ 
                width: '100%', 
                padding: '14px', 
                background: 'rgba(0, 0, 0, 0.3)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                color: '#fff', 
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ 
                width: '100%', 
                padding: '14px', 
                background: 'rgba(0, 0, 0, 0.3)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px', 
                color: '#fff', 
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#FFD700'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: loading ? '#666' : 'linear-gradient(135deg, #FFD700 0%, #d4af37 100%)', 
              color: '#0f172a', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 25px -5px rgba(255, 215, 0, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '13px' }}>
          جميع الحقوق محفوظة © 2024 Jassas Soft
        </div>
      </div>
    </div>
  )
}
'''

# ==========================================
# 2. صفحة لوحة التحكم (Dashboard Page)
# ==========================================
dashboard_code = '''"use client"
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
'''

# ==========================================
# 3. صفحة طباعة الكروت (Print Cards Page) - Full Option
# ==========================================
print_cards_code = '''"use client"
import { useState, useEffect } from 'react'

export default function PrintCardsPage() {
  const [user, setUser] = useState<any>(null)
  const [printedCards, setPrintedCards] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(true)

  const [formData, setFormData] = useState({
    profile: 'DEFAULT',
    validity: '1',
    validityType: 'no-expiry',
    userDuration: '1',
    userDurationType: 'no-expiry',
    dataPackage: 'unlimited',
    dataAmount: '1',
    dataUnit: 'GB',
    networkName: 'Jassas Net',
    cardTime: '1',
    cardTimeType: 'hour',
    cardPrice: '500',
    distributor: '',
    usernameColor: '#FFD700',
    usernameLength: 8,
    usernamePrefix: '86',
    cardsCount: 100,
    rowsCount: 5,
    colsCount: 3,
    cardStyle: 'colored',
    cardEffect: 'gradient',
    colorScheme: 'blue-gold',
    cardShape: 'rectangle',
    enableQR: true,
    rechargeText: '',
    specialOffer: '',
    networkFontSize: 20,
    cardNumberFontSize: 22,
    infoFontSize: 12,
    labelFontSize: 10,
    networkColor: '#ffffff',
    cardNumberColor: '#FFD700',
    infoColor: '#ffffff',
    labelColor: '#e0e0e0',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#ffffff',
    fontFamily: 'default'
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
    else window.location.href = '/login'
  }, [])

  const colorSchemes: any = {
    'blue-gold': { bg: '#1e3c72', accent: '#d4af37', text: '#ffffff' },
    'purple-silver': { bg: '#667eea', accent: '#c0c0c0', text: '#ffffff' },
    'green-gold': { bg: '#134e5e', accent: '#ffd700', text: '#ffffff' },
    'red-black': { bg: '#cb2d3e', accent: '#ff4444', text: '#ffffff' },
    'orange-dark': { bg: '#f12711', accent: '#f5af19', text: '#ffffff' },
    'blue-green': { bg: '#0066cc', accent: '#00cc66', text: '#ffffff' },
    'pure-blue': { bg: '#0047AB', accent: '#4169E1', text: '#ffffff' },
    'pure-green': { bg: '#228B22', accent: '#32CD32', text: '#ffffff' },
    'black-gold': { bg: '#1a1a1a', accent: '#FFD700', text: '#FFD700' },
    'white-blue': { bg: '#f0f4f8', accent: '#0066cc', text: '#0066cc' }
  }

  const fontFamilies: any = {
    'default': 'Segoe UI, Tahoma, Arial, sans-serif',
    'arabic': 'Arial, Tahoma, sans-serif',
    'mono': 'Courier New, monospace',
    'serif': 'Georgia, serif',
    'sans': 'Helvetica, Arial, sans-serif'
  }

  const timeLabels: any = { hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }
  const validityLabels: any = { 'no-expiry': 'بدون مدة', hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }

  const generateUsername = (prefix: string, length: number) => {
    const chars = '0123456789'
    let result = prefix.replace(/[^0-9]/g, '')
    const remaining = Math.max(1, length - result.length)
    for (let i = 0; i < remaining; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generatePassword = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const generateRealQR = (cardNumber: string) => {
    const size = 25
    const pattern = []
    let seed = 0
    for (let i = 0; i < cardNumber.length; i++) {
      seed = (seed * 31 + cardNumber.charCodeAt(i)) & 0xFFFFFFFF
    }
    for (let row = 0; row < size; row++) {
      const rowPattern = []
      for (let col = 0; col < size; col++) {
        const isTopLeft = row < 7 && col < 7
        const isTopRight = row < 7 && col >= size - 7
        const isBottomLeft = row >= size - 7 && col < 7
        if (isTopLeft || isTopRight || isBottomLeft) {
          const localRow = isTopLeft ? row : isTopRight ? row : row - (size - 7)
          const localCol = isTopLeft ? col : isTopRight ? col - (size - 7) : col
          if (localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6) {
            rowPattern.push(1)
          } else if (localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4) {
            rowPattern.push(1)
          } else {
            rowPattern.push(0)
          }
        } else if (row === 8 || col === 8) {
          rowPattern.push(0)
        } else {
          const pos = ((row * size + col) * 7 + seed) % 5
          rowPattern.push(pos < 2 ? 1 : 0)
        }
      }
      pattern.push(rowPattern)
    }
    return pattern
  }

  const QRCode = ({ cardNumber, size = 50 }: { cardNumber: string, size: number }) => {
    const pattern = generateRealQR(cardNumber)
    const cellSize = size / 25
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: '#fff', padding: '2px', borderRadius: '4px', display: 'block' }}>
        {pattern.map((row: any[], rowIdx: number) => row.map((cell: number, colIdx: number) => cell === 1 ? (
          <rect key={`${rowIdx}-${colIdx}`} x={colIdx * cellSize} y={rowIdx * cellSize} width={cellSize + 0.3} height={cellSize + 0.3} fill="#000" />
        ) : null))}
      </svg>
    )
  }

  const generateCards = () => {
    const cards = []
    const qty = parseInt(formData.cardsCount.toString()) || 100
    const colors = formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme] : { bg: '#ffffff', accent: '#333333', text: '#000000' }

    for (let i = 0; i < qty; i++) {
      const username = generateUsername(formData.usernamePrefix, formData.usernameLength)
      const password = generatePassword(10)
      cards.push({
        id: 'JNC-' + Date.now() + '-' + i,
        username: username,
        password: password,
        validity: formData.validity + ' ' + validityLabels[formData.validityType],
        userDuration: formData.userDuration + ' ' + validityLabels[formData.userDurationType],
        dataPackage: formData.dataPackage === 'unlimited' ? 'بدون حد' : formData.dataAmount + ' ' + formData.dataUnit,
        network: formData.networkName,
        cardTime: formData.cardTime + ' ' + timeLabels[formData.cardTimeType],
        price: formData.cardPrice,
        distributor: formData.distributor,
        qrEnabled: formData.enableQR,
        rechargeText: formData.rechargeText,
        specialOffer: formData.specialOffer,
        cardStyle: formData.cardStyle,
        cardEffect: formData.cardEffect,
        cardShape: formData.cardShape,
        colors: colors,
        usernameColor: formData.usernameColor,
        networkFontSize: formData.networkFontSize,
        cardNumberFontSize: formData.cardNumberFontSize,
        infoFontSize: formData.infoFontSize,
        labelFontSize: formData.labelFontSize,
        networkColor: formData.networkColor,
        cardNumberColor: formData.cardNumberColor,
        infoColor: formData.infoColor,
        labelColor: formData.labelColor,
        borderWidth: formData.borderWidth,
        borderStyle: formData.borderStyle,
        borderColor: formData.borderColor,
        fontFamily: fontFamilies[formData.fontFamily]
      })
    }
    setPrintedCards(cards)
  }

  const getCardStyle = (card: any) => {
    const c = card.colors
    let bg = c.bg
    if (card.cardStyle === 'colored' && card.cardEffect === 'gradient') {
      bg = 'linear-gradient(135deg, ' + c.bg + ' 0%, ' + c.accent + ' 100%)'
    }
    let radius = '12px'
    if (card.cardShape === 'square') radius = '8px'
    if (card.cardShape === 'rounded') radius = '20px'
    let shadow = '0 8px 24px rgba(0,0,0,0.3)'
    let border = card.borderWidth + 'px ' + card.borderStyle + ' ' + card.borderColor
    let extraStyle: any = {}
    if (card.cardEffect === '3d') {
      shadow = '0 15px 40px rgba(0,0,0,0.5), inset 0 2px 8px rgba(255,255,255,0.3)'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    } else if (card.cardEffect === 'shadow') {
      shadow = '0 20px 50px rgba(0,0,0,0.6)'
    } else if (card.cardEffect === 'glow') {
      shadow = '0 0 20px ' + c.accent + '88, 0 0 40px ' + c.accent + '44'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    }
    return {
      background: bg,
      boxShadow: shadow,
      borderRadius: radius,
      border: border,
      color: c.text,
      padding: '12px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: card.fontFamily,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      ...extraStyle
    }
  }

  const exportToPDF = () => {
    if (printedCards.length === 0) {
      alert('لا توجد كروت للتصدير')
      return
    }
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('الرجاء السماح بفتح النوافذ المنبثقة')
      return
    }
    let cardsHTML = ''
    printedCards.forEach((card: any) => {
      const c = card.colors
      let bg = c.bg
      if (card.cardStyle === 'colored' && card.cardEffect === 'gradient') {
        bg = 'linear-gradient(135deg, ' + c.bg + ' 0%, ' + c.accent + ' 100%)'
      }
      let radius = '10px'
      if (card.cardShape === 'square') radius = '6px'
      if (card.cardShape === 'rounded') radius = '18px'
      cardsHTML += `
        <div class="card" style="background: ${bg}; border-radius: ${radius}; border: ${card.borderWidth}px ${card.borderStyle} ${card.borderColor}; padding: 10px; margin: 5px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1; text-align: center; padding: 5px;">
              <div style="font-size: 9px; color: ${card.labelColor};">الشبكة</div>
              <div style="font-size: ${card.networkFontSize}px; color: ${card.networkColor}; font-weight: bold;">${card.network}</div>
            </div>
            ${card.qrEnabled ? `<div style="background: #fff; padding: 2px; border-radius: 4px; margin-right: 8px;">
              <svg width="50" height="50" viewBox="0 0 50 50">
                ${generateRealQR(card.username).map((row: any[], rowIdx: number) => row.map((cell: number, colIdx: number) => cell === 1 ? `<rect x="${colIdx * 2}" y="${rowIdx * 2}" width="2" height="2" fill="#000"/>` : '').join('')).join('')}
              </svg>
            </div>` : ''}
          </div>
          <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 8px; margin: 8px 0; border: 2px dashed ${c.accent}; text-align: center;">
            <div style="font-size: 9px; color: ${card.labelColor};">اسم المستخدم</div>
            <div style="font-size: ${card.cardNumberFontSize}px; color: ${card.usernameColor}; font-weight: bold; font-family: monospace; letter-spacing: 2px;">${card.username}</div>
            <div style="font-size: 9px; color: ${card.labelColor}; margin-top: 5px;">كلمة المرور</div>
            <div style="font-size: ${card.cardNumberFontSize - 2}px; color: ${card.cardNumberColor}; font-weight: bold; font-family: monospace;">${card.password}</div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: ${card.infoFontSize}px;">
            <div style="background: rgba(0,0,0,0.2); padding: 4px; border-radius: 6px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor};">الصلاحية</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.validity}</div>
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 4px; border-radius: 6px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor};">الوقت</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.cardTime}</div>
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 4px; border-radius: 6px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor};">البيانات</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.dataPackage}</div>
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 4px; border-radius: 6px; text-align: center; border: 1px solid ${c.accent};">
              <div style="font-size: 8px; color: ${card.labelColor};">السعر</div>
              <div style="font-weight: bold; color: ${card.infoColor};">${card.price}</div>
            </div>
          </div>
          ${card.distributor ? `<div style="text-align: center; margin-top: 5px; font-size: 10px; color: ${card.labelColor};">الموزع: ${card.distributor}</div>` : ''}
          ${card.rechargeText ? `<div style="background: #00cc00; color: #fff; padding: 4px; border-radius: 6px; text-align: center; margin-top: 5px; font-size: 10px; font-weight: bold;">⚡ ${card.rechargeText}</div>` : ''}
          ${card.specialOffer ? `<div style="background: rgba(255,255,0,0.2); color: #ffff00; padding: 4px; border-radius: 6px; text-align: center; margin-top: 5px; font-size: 10px;">🎁 ${card.specialOffer}</div>` : ''}
        </div>
      `
    })
    printWindow.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>كروت ${formData.networkName}</title><style>@page { size: A4; margin: 10mm; } * { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: Arial, Tahoma, sans-serif; background: #fff; padding: 10px; } .cards-grid { display: grid; grid-template-columns: repeat(${formData.colsCount || 3}, 1fr); gap: 8px; } .card { page-break-inside: avoid; } @media print { body { padding: 0; } .no-print { display: none !important; } }</style></head><body><div class="no-print" style="background: #0f172a; color: #fff; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 10px;"><h2>🖨️ لتصدير PDF: اضغط Ctrl+P ثم اختر "حفظ كـ PDF"</h2><button onclick="window.print()" style="padding: 15px 30px; background: #00ffff; color: #0f172a; border: none; border-radius: 10px; font-size: 18px; font-weight: bold; cursor: pointer; margin: 10px;">🖨️ طباعة / حفظ PDF</button><button onclick="window.close()" style="padding: 15px 30px; background: #ef4444; color: #fff; border: none; border-radius: 10px; font-size: 18px; font-weight: bold; cursor: pointer; margin: 10px;">إغلاق</button></div><div class="cards-grid">${cardsHTML}</div></body></html>`)
    printWindow.document.close()
  }

  if (!user) {
    return <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><p>جاري التحميل...</p></div>
  }

  const previewCard = printedCards.length > 0 ? printedCards[0] : {
    username: generateUsername(formData.usernamePrefix, formData.usernameLength),
    password: 'AB12CD34EF',
    validity: formData.validity + ' ' + validityLabels[formData.validityType],
    userDuration: formData.userDuration + ' ' + validityLabels[formData.userDurationType],
    dataPackage: formData.dataPackage === 'unlimited' ? 'بدون حد' : formData.dataAmount + ' ' + formData.dataUnit,
    network: formData.networkName,
    cardTime: formData.cardTime + ' ' + timeLabels[formData.cardTimeType],
    price: formData.cardPrice,
    distributor: formData.distributor,
    qrEnabled: formData.enableQR,
    rechargeText: formData.rechargeText,
    specialOffer: formData.specialOffer,
    cardStyle: formData.cardStyle,
    cardEffect: formData.cardEffect,
    cardShape: formData.cardShape,
    colors: formData.cardStyle === 'colored' ? colorSchemes[formData.colorScheme] : { bg: '#ffffff', accent: '#333333', text: '#000000' },
    usernameColor: formData.usernameColor,
    networkFontSize: formData.networkFontSize,
    cardNumberFontSize: formData.cardNumberFontSize,
    infoFontSize: formData.infoFontSize,
    labelFontSize: formData.labelFontSize,
    networkColor: formData.networkColor,
    cardNumberColor: formData.cardNumberColor,
    infoColor: formData.infoColor,
    labelColor: formData.labelColor,
    borderWidth: formData.borderWidth,
    borderStyle: formData.borderStyle,
    borderColor: formData.borderColor,
    fontFamily: fontFamilies[formData.fontFamily]
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* الشعار الأصلي */}
        <div style={{ textAlign: 'center', marginBottom: '30px', padding: '20px', background: 'linear-gradient(135deg, #1e3c72 0%, #d4af37 100%)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(212,175,55,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{ fontSize: '40px' }}>📶</div>
            <div>
              <h1 style={{ color: '#FFD700', fontSize: '36px', margin: '0 0 5px 0', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Jassas Net Card</h1>
              <p style={{ color: '#fff', fontSize: '14px', margin: 0 }}>نظام إدارة شبكات المايكروتك</p>
            </div>
          </div>
        </div>

        {/* المعاينة المباشرة */}
        {showPreview && (
          <div style={{ marginBottom: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(0,255,255,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ color: '#00ffff', margin: 0, fontSize: '22px' }}>👁️ معاينة الكرت (مباشرة)</h2>
              <button onClick={() => setShowPreview(false)} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff0000', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
              <div style={getCardStyle(previewCard)}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '24px', opacity: '0.05', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0 }}>JassasNetCard</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: '8px' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', borderRadius: '10px', padding: '8px 12px', textAlign: 'center', border: previewCard.borderWidth + 'px ' + previewCard.borderStyle + ' ' + previewCard.borderColor, marginRight: (previewCard.qrEnabled || previewCard.rechargeText) ? '8px' : '0', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, marginBottom: '3px' }}>🌐 الشبكة</div>
                    <h3 style={{ margin: 0, fontSize: previewCard.networkFontSize + 'px', color: previewCard.networkColor, fontWeight: 'bold', lineHeight: 1.2, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{previewCard.network}</h3>
                  </div>
                  {(previewCard.qrEnabled || previewCard.rechargeText) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexShrink: 0 }}>
                      {previewCard.qrEnabled && (
                        <div style={{ background: '#fff', borderRadius: '8px', padding: '3px', boxShadow: '0 3px 10px rgba(0,0,0,0.3)', border: '2px solid ' + previewCard.colors.accent }}>
                          <QRCode cardNumber={previewCard.username} size={50} />
                        </div>
                      )}
                      {previewCard.rechargeText && (
                        <div style={{ background: 'linear-gradient(135deg, #00ff00, #00cc00)', borderRadius: '8px', padding: '5px 8px', boxShadow: '0 3px 10px rgba(0,255,0,0.4)', border: '1px solid #00ff00' }}>
                          <div style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>⚡ {previewCard.rechargeText}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(5px)', borderRadius: '10px', padding: '10px', position: 'relative', zIndex: 1, border: '2px dashed ' + previewCard.colors.accent, marginBottom: '8px', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.3)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '4px' }}>👤 اسم المستخدم</div>
                  <div style={{ fontSize: previewCard.cardNumberFontSize + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '3px', color: previewCard.usernameColor, textShadow: '0 2px 4px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>{previewCard.username}</div>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '4px', marginTop: '8px' }}>🔑 كلمة المرور</div>
                  <div style={{ fontSize: (previewCard.cardNumberFontSize - 2) + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '2px', color: previewCard.cardNumberColor, textShadow: '0 2px 4px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>{previewCard.password}</div>
                </div>
                <div style={{ fontSize: previewCard.infoFontSize + 'px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8 }}>الصلاحية</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.validity}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8 }}>الوقت</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.cardTime}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8 }}>البيانات</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.dataPackage}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8 }}>السعر</div>
                    <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.price}</div>
                  </div>
                </div>
                {previewCard.distributor && <div style={{ textAlign: 'center', marginTop: '5px', fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, position: 'relative', zIndex: 1 }}>الموزع: {previewCard.distributor}</div>}
                {previewCard.specialOffer && <div style={{ marginTop: '5px', padding: '5px', background: 'rgba(255,255,0,0.15)', borderRadius: '6px', fontSize: previewCard.labelFontSize + 'px', textAlign: 'center', position: 'relative', zIndex: 1, color: '#ffff00', border: '1px solid rgba(255,255,0,0.4)' }}>🎁 {previewCard.specialOffer}</div>}
              </div>
            </div>
          </div>
        )}

        {/* إعدادات الكرت */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(0,255,255,0.2)' }}>
          <h2 style={{ color: '#00ffff', marginBottom: '20px', fontSize: '24px' }}>⚙️ إعدادات الكرت</h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>البروفايل</label>
            <select value={formData.profile} onChange={(e) => setFormData({...formData, profile: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
              <option value="DEFAULT">DEFAULT</option>
              <option value="PREMIUM">PREMIUM</option>
              <option value="BASIC">BASIC</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>الصلاحية</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
              <input type="number" value={formData.validity} onChange={(e) => setFormData({...formData, validity: e.target.value})} min="1" style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }} />
              <select value={formData.validityType} onChange={(e) => setFormData({...formData, validityType: e.target.value})} style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                <option value="no-expiry">بدون مدة</option>
                <option value="hour">ساعة</option>
                <option value="day">يوم</option>
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>باقة البيانات</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <select value={formData.dataPackage} onChange={(e) => setFormData({...formData, dataPackage: e.target.value})} style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                <option value="unlimited">بدون حد</option>
                <option value="limited">محدد</option>
              </select>
              {formData.dataPackage === 'limited' && (
                <>
                  <input type="number" value={formData.dataAmount} onChange={(e) => setFormData({...formData, dataAmount: e.target.value})} min="1" style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }} />
                  <select value={formData.dataUnit} onChange={(e) => setFormData({...formData, dataUnit: e.target.value})} style={{ padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px' }}>
                    <option value="MB">ميجا (MB)</option>
                    <option value="GB">جيجا (GB)</option>
                  </select>
                </>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اسم الشبكة</label>
            <input type="text" value={formData.networkName} onChange={(e) => setFormData({...formData, networkName: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>سعر الكرت</label>
            <input type="number" value={formData.cardPrice} onChange={(e) => setFormData({...formData, cardPrice: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>بداية اسم المستخدم (أرقام فقط)</label>
            <input type="text" value={formData.usernamePrefix} onChange={(e) => setFormData({...formData, usernamePrefix: e.target.value.replace(/[^0-9]/g, '')})} placeholder="مثال: 86" maxLength="5" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>عدد أرقام اسم المستخدم: {formData.usernameLength}</label>
            <input type="range" min="6" max="20" value={formData.usernameLength} onChange={(e) => setFormData({...formData, usernameLength: parseInt(e.target.value)})} style={{ width: '100%' }} />
            <div style={{ marginTop: '5px', padding: '8px', background: 'rgba(0,255,255,0.1)', borderRadius: '8px', color: '#00ffff', fontSize: '13px', textAlign: 'center' }}>
              💡 مثال: {generateUsername(formData.usernamePrefix, formData.usernameLength)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>عدد الكروت</label>
              <input type="number" value={formData.cardsCount} onChange={(e) => setFormData({...formData, cardsCount: parseInt(e.target.value) || 100})} min="1" max="10000" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>عدد الأعمدة</label>
              <input type="number" value={formData.colsCount} onChange={(e) => setFormData({...formData, colsCount: parseInt(e.target.value) || 3})} min="1" max="10" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.2)' }}>
            <h3 style={{ color: '#00ffff', margin: '0 0 15px 0', fontSize: '16px' }}>⚙️ خيارات إضافية</h3>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <input type="checkbox" checked={formData.enableQR} onChange={(e) => setFormData({...formData, enableQR: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                <label style={{ color: '#e2e8f0', fontWeight: 'bold' }}>تفعيل QR Code</label>
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نص الشحن (اختياري - اكتب أي شيء)</label>
              <input type="text" value={formData.rechargeText} onChange={(e) => setFormData({...formData, rechargeText: e.target.value})} placeholder="مثال: بنكك، تحويل، يوجد شحن..." style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.2)' }}>
            <h3 style={{ color: '#00ffff', margin: '0 0 15px 0', fontSize: '16px' }}>🎨 تصميم الكرت</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نوع التصميم</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => setFormData({...formData, cardStyle: 'plain'})} style={{ padding: '12px', background: formData.cardStyle === 'plain' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardStyle === 'plain' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>عادي</button>
                <button onClick={() => setFormData({...formData, cardStyle: 'colored'})} style={{ padding: '12px', background: formData.cardStyle === 'colored' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardStyle === 'colored' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>ملون</button>
              </div>
            </div>
            {formData.cardStyle === 'colored' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>نظام الألوان</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {Object.entries(colorSchemes).map(([key, val]: [string, any]) => (
                    <button key={key} onClick={() => setFormData({...formData, colorScheme: key})} style={{ padding: '10px', background: 'linear-gradient(135deg, ' + val.bg + ', ' + val.accent + ')', border: formData.colorScheme === key ? '3px solid #fff' : '2px solid transparent', borderRadius: '10px', color: '#fff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {key === 'blue-gold' && 'أزرق ذهبي'}
                      {key === 'purple-silver' && 'بنفسجي فضي'}
                      {key === 'green-gold' && 'أخضر ذهبي'}
                      {key === 'red-black' && 'أحمر أسود'}
                      {key === 'orange-dark' && 'برتقالي داكن'}
                      {key === 'blue-green' && 'أزرق أخضر'}
                      {key === 'pure-blue' && 'أزرق صافي'}
                      {key === 'pure-green' && 'أخضر صافي'}
                      {key === 'black-gold' && 'أسود ذهبي'}
                      {key === 'white-blue' && 'أبيض أزرق'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>التأثير</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {['plain', 'gradient', '3d', 'shadow', 'glow'].map((effect: string) => (
                  <button key={effect} onClick={() => setFormData({...formData, cardEffect: effect})} style={{ padding: '12px', background: formData.cardEffect === effect ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardEffect === effect ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {effect === 'plain' && 'عادي'}
                    {effect === 'gradient' && 'مدرج'}
                    {effect === '3d' && '3D'}
                    {effect === 'shadow' && 'مظل'}
                    {effect === 'glow' && 'موهج'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>شكل الكرت</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <button onClick={() => setFormData({...formData, cardShape: 'rectangle'})} style={{ padding: '12px', background: formData.cardShape === 'rectangle' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardShape === 'rectangle' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مستطيل</button>
                <button onClick={() => setFormData({...formData, cardShape: 'square'})} style={{ padding: '12px', background: formData.cardShape === 'square' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardShape === 'square' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مربع</button>
                <button onClick={() => setFormData({...formData, cardShape: 'rounded'})} style={{ padding: '12px', background: formData.cardShape === 'rounded' ? 'linear-gradient(135deg, #00ffff, #00bfff)' : 'rgba(255,255,255,0.1)', color: formData.cardShape === 'rounded' ? '#0f172a' : '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مدور</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <button onClick={generateCards} style={{ padding: '18px', background: 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,255,255,0.4)' }}>
              🖨️ إنشاء الكروت
            </button>
            <button onClick={exportToPDF} disabled={printedCards.length === 0} style={{ padding: '18px', background: printedCards.length > 0 ? 'linear-gradient(135deg, #ff6b6b, #ee5a6f)' : '#666', color: '#fff', fontSize: '18px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: printedCards.length > 0 ? 'pointer' : 'not-allowed', boxShadow: printedCards.length > 0 ? '0 5px 20px rgba(238,90,111,0.4)' : 'none' }}>
              📄 تصدير PDF
            </button>
          </div>
        </div>

        {/* عرض الكروت المطبوعة */}
        {printedCards.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>📋 الكروت المُنشأة ({printedCards.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              {printedCards.slice(0, 6).map((card: any, index: number) => (
                <div key={index} style={getCardStyle(card)}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '24px', opacity: '0.05', fontWeight: 'bold', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 0 }}>JassasNetCard</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: '8px' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', borderRadius: '10px', padding: '8px 12px', textAlign: 'center', border: card.borderWidth + 'px ' + card.borderStyle + ' ' + card.borderColor, marginRight: (card.qrEnabled || card.rechargeText) ? '8px' : '0', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, marginBottom: '3px' }}>🌐 الشبكة</div>
                      <h3 style={{ margin: 0, fontSize: card.networkFontSize + 'px', color: card.networkColor, fontWeight: 'bold', lineHeight: 1.2, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{card.network}</h3>
                    </div>
                    {(card.qrEnabled || card.rechargeText) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexShrink: 0 }}>
                        {card.qrEnabled && (
                          <div style={{ background: '#fff', borderRadius: '8px', padding: '3px', boxShadow: '0 3px 10px rgba(0,0,0,0.3)', border: '2px solid ' + card.colors.accent }}>
                            <QRCode cardNumber={card.username} size={50} />
                          </div>
                        )}
                        {card.rechargeText && (
                          <div style={{ background: 'linear-gradient(135deg, #00ff00, #00cc00)', borderRadius: '8px', padding: '5px 8px', boxShadow: '0 3px 10px rgba(0,255,0,0.4)', border: '1px solid #00ff00' }}>
                            <div style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>⚡ {card.rechargeText}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(5px)', borderRadius: '10px', padding: '10px', position: 'relative', zIndex: 1, border: '2px dashed ' + card.colors.accent, marginBottom: '8px', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '4px' }}>👤 اسم المستخدم</div>
                    <div style={{ fontSize: card.cardNumberFontSize + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '3px', color: card.usernameColor, textShadow: '0 2px 4px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>{card.username}</div>
                    <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '4px', marginTop: '8px' }}>🔑 كلمة المرور</div>
                    <div style={{ fontSize: (card.cardNumberFontSize - 2) + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '2px', color: card.cardNumberColor, textShadow: '0 2px 4px rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>{card.password}</div>
                  </div>
                  <div style={{ fontSize: card.infoFontSize + 'px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8 }}>الصلاحية</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.validity}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8 }}>الوقت</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.cardTime}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8 }}>البيانات</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.dataPackage}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '8px', textAlign: 'center', border: '1px solid ' + card.colors.accent, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                      <div style={{ fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.8 }}>السعر</div>
                      <div style={{ fontWeight: 'bold', color: card.infoColor, fontSize: (card.infoFontSize - 1) + 'px' }}>{card.price}</div>
                    </div>
                  </div>
                  {card.distributor && <div style={{ textAlign: 'center', marginTop: '5px', fontSize: card.labelFontSize + 'px', color: card.labelColor, opacity: 0.9, position: 'relative', zIndex: 1 }}>الموزع: {card.distributor}</div>}
                  {card.specialOffer && <div style={{ marginTop: '5px', padding: '5px', background: 'rgba(255,255,0,0.15)', borderRadius: '6px', fontSize: card.labelFontSize + 'px', textAlign: 'center', position: 'relative', zIndex: 1, color: '#ffff00', border: '1px solid rgba(255,255,0,0.4)' }}>🎁 {card.specialOffer}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
'''

# كتابة الملفات
with open('app/login/page.tsx', 'w', encoding='utf-8') as f:
    f.write(login_code)

with open('app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(dashboard_code)

with open('app/dashboard/print-cards/page.tsx', 'w', encoding='utf-8') as f:
    f.write(print_cards_code)

print('✅ تم استعادة وتحديث جميع الصفحات الأساسية بنجاح!')
print('📁 Login Page: app/login/page.tsx')
print('📁 Dashboard Page: app/dashboard/page.tsx')
print('📁 Print Cards Page: app/dashboard/print-cards/page.tsx')
print('')
print('الآن قم بتنفيذ: git add . && git commit -m "Full option restore" && git push')
