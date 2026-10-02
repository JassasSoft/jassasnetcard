"use client"
import { useState, useEffect } from "react"

export default function InstallPrompt() {
  const [showInstall, setShowInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstall(false)
    }
    setDeferredPrompt(null)
  }

  if (!showInstall) return null

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      left: 20,
      right: 20,
      background: "linear-gradient(135deg, #00ffff, #a855f7)",
      color: "#0a0e27",
      padding: "15px 20px",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0,255,255,0.5)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 9999,
      fontFamily: "Arial"
    }}>
      <div>
        <p style={{ margin: 0, fontWeight: "bold", fontSize: 14 }}>📱 ثبّت التطبيق على جهازك!</p>
        <p style={{ margin: "5px 0 0", fontSize: 12 }}>وصول أسرع وأداء أفضل</p>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={handleInstall} style={{
          padding: "10px 20px",
          background: "#0a0e27",
          color: "#00ffff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 14
        }}>
          تثبيت
        </button>
        <button onClick={() => setShowInstall(false)} style={{
          padding: "10px",
          background: "transparent",
          color: "#0a0e27",
          border: "none",
          cursor: "pointer",
          fontSize: 18
        }}>
          ✕
        </button>
      </div>
    </div>
  )
}
