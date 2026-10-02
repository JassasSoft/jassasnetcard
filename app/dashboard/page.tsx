'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<{ full_name?: string } | null>(null)
  const [mikrotikCommands, setMikrotikCommands] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const sendMikrotikCommand = async () => {
    setLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/mikrotik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands: mikrotikCommands })
      })

      const data = await response.json()

      if (data.success) {
        setResult('✅ ' + data.message)
      } else {
        setResult('❌ ' + data.message)
      }
    } catch (error) {
      setResult(' خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
        جاري التحميل...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f3460 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(10, 14, 39, 0.95)',
        border: '2px solid rgba(0, 255, 255, 0.3)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 0 40px rgba(0, 255, 255, 0.2)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid rgba(0, 255, 255, 0.2)'
        }}>
          <div>
            <h1 style={{ color: '#00ffff', fontSize: '28px', margin: 0 }}>
              🎯 لوحة التحكم
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '16px', margin: '5px 0 0' }}>
              مرحباً، {user.full_name || 'مدير النظام'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 0, 0, 0.2)',
              border: '2px solid #ff0000',
              color: '#ff0000',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            تسجيل الخروج
          </button>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#00ffff', fontSize: '22px', marginBottom: '15px' }}>
            🔧 إرسال أوامر MikroTik
          </h2>
          
          <textarea
            value={mikrotikCommands}
            onChange={(e) => setMikrotikCommands(e.target.value)}
            placeholder="أدخل أوامر MikroTik هنا (كل أمر في سطر)&#10;مثال:&#10;/user add name=test password=123 group=full"
            style={{
              width: '100%',
              minHeight: '200px',
              padding: '15px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '2px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'monospace',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />

          <button
            onClick={sendMikrotikCommand}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: loading ? '#666' : 'linear-gradient(135deg, #00ffff 0%, #00bfff 100%)',
              color: '#0a0e27',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '15px',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
            }}
          >
            {loading ? '⏳ جاري الإرسال...' : ' إرسال الأوامر'}
          </button>

          {result && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              background: result.includes('✅') ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
              border: `2px solid ${result.includes('✅') ? '#00ff00' : '#ff0000'}`,
              borderRadius: '10px',
              color: result.includes('✅') ? '#00ff00' : '#ff0000',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {result}
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <button style={{
            padding: '20px',
            background: 'rgba(0, 255, 255, 0.1)',
            border: '2px solid rgba(0, 255, 255, 0.3)',
            borderRadius: '10px',
            color: '#00ffff',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            👥 إدارة المستخدمين
          </button>

          <button style={{
            padding: '20px',
            background: 'rgba(168, 85, 247, 0.1)',
            border: '2px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '10px',
            color: '#a855f7',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            🌐 إدارة الشبكات
          </button>

          <button style={{
            padding: '20px',
            background: 'rgba(255, 165, 0, 0.1)',
            border: '2px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '10px',
            color: '#ffa500',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            📊 الإحصائيات
          </button>

          <button style={{
            padding: '20px',
            background: 'rgba(0, 255, 0, 0.1)',
            border: '2px solid rgba(0, 255, 0, 0.3)',
            borderRadius: '10px',
            color: '#00ff00',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            ⚙️ الإعدادات
          </button>
        </div>
      </div>
    </div>
  )
}
