'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('✅ مرحباً ' + data.user.full_name)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setMessage('❌ ' + data.message)
      }
    } catch (error) {
      setMessage('❌ خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(10, 14, 39, 0.95)',
        border: '2px solid rgba(0, 255, 255, 0.3)',
        borderRadius: '20px',
        padding: '40px 30px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* تأثير الإضاءة */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)',
          animation: 'pulse 3s ease-in-out infinite'
        }} />
        
        {/* الشعار */}
        <div style={{ textAlign: 'center', marginBottom: '30px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)',
            borderRadius: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)',
            border: '2px solid rgba(0, 255, 255, 0.5)'
          }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#00ffff" strokeWidth="2"/>
              <path d="M2 12h20M12 2c3 3 4.5 6.5 4.5 10s-1.5 7-4.5 10c-3-3-4.5-6.5-4.5-10s1.5-7 4.5-10z" stroke="#00ffff" strokeWidth="2"/>
            </svg>
          </div>
          
          <h1 style={{
            color: '#00ffff',
            fontSize: '36px',
            fontWeight: 'bold',
            margin: '0 0 10px',
            textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
          }}>
            جساس نت كارت
          </h1>
          <p style={{
            color: '#a855f7',
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 0 15px'
          }}>
            Jassas Net Card
          </p>
          <p style={{
            color: '#94a3b8',
            fontSize: '16px',
            margin: 0
          }}>
            نظام إدارة شبكات المايكروتك
          </p>
        </div>

        {/* عنوان تسجيل الدخول */}
        <h2 style={{
          color: '#00ffff',
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '30px',
          position: 'relative',
          zIndex: 1
        }}>
          🚀 تسجيل الدخول
        </h2>

        {/* حقل اسم المستخدم */}
        <div style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }}>
          <label style={{
            display: 'block',
            color: '#e2e8f0',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            اسم المستخدم أو الإيميل
          </label>
          <input
            type="text"
            placeholder="أدخل اليوزر هنا"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '2px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00ffff'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 255, 255, 0.3)'}
          />
        </div>

        {/* حقل كلمة المرور */}
        <div style={{ marginBottom: '25px', position: 'relative', zIndex: 1 }}>
          <label style={{
            display: 'block',
            color: '#e2e8f0',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            كلمة المرور
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '2px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#00ffff'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0, 255, 255, 0.3)'}
          />
        </div>

        {/* زر الدخول */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            background: loading ? '#666' : 'linear-gradient(135deg, #00ffff 0%, #00bfff 100%)',
            color: '#0a0e27',
            fontSize: '20px',
            fontWeight: 'bold',
            borderRadius: '10px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1,
            transition: 'all 0.3s',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
          }}
        >
          {loading ? '⏳ جاري التحميل...' : 'دخول آمن →'}
        </button>

        {/* رسالة */}
        {message && (
          <div style={{
            padding: '15px',
            background: message.includes('✅') ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
            border: `2px solid ${message.includes('✅') ? '#00ff00' : '#ff0000'}`,
            borderRadius: '10px',
            color: message.includes('✅') ? '#00ff00' : '#ff0000',
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            {message}
          </div>
        )}

        {/* روابط إضافية */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#ffa500', fontSize: '16px', marginBottom: '15px', cursor: 'pointer' }}>
            🔒 نسيت كلمة المرور؟
          </p>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>
            ليس لديك حساب؟{' '}
            <span style={{ color: '#00ffff', fontWeight: 'bold', cursor: 'pointer' }}>
              إنشاء حساب جديد
            </span>
          </p>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}
