"use client"
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
