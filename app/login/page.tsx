"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (email && password) {
        const mockUser = { fullName: 'محمد حبيب', email: email, cardsRemaining: 487, role: 'admin' }
        localStorage.setItem('user', JSON.stringify(mockUser))
        router.push('/dashboard')
      } else {
        setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3c72 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '450px', border: '2px solid rgba(0,255,255,0.3)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}></div>
          <h1 style={{ color: '#00ffff', fontSize: '32px', margin: '0 0 8px 0', fontWeight: 'bold' }}>Jassas Net Card</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>نظام إدارة شبكات المايكروتك</p>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>البريد الإلكتروني أو اسم المستخدم</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="habib1008@gmail.com" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(0,255,255,0.3)', borderRadius: '12px', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#666' : 'linear-gradient(135deg, #00ffff, #00bfff)', color: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 25px rgba(0,255,255,0.3)' }}>
            {loading ? 'جاري الدخول...' : 'دخول آمن'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px' }}>
          ليس لديك حساب؟ <a href="/register" style={{ color: '#00ffff', textDecoration: 'none', fontWeight: 'bold' }}>إنشاء حساب جديد</a>
        </div>
      </div>
    </div>
  )
}
