'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0a0e27',
      color: '#00ffff',
      fontFamily: 'Arial'
    }}>
      <p>جاري التحويل لصفحة تسجيل الدخول...</p>
    </div>
  )
}
