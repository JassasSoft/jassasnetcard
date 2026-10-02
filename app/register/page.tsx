"use client"
import { useState } from "react"
import Logo from "@/components/Logo"
import InstallPrompt from "@/components/InstallPrompt"
import { translations } from "@/lib/translations"

export default function RegisterPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar')
  const t = translations[lang]
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", password: "" })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setMessage("")
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        setMessage(data.message || "Success!")
        setTimeout(() => { window.location.href = "/login" }, 2000)
      } else {
        setMessage("Error: " + data.message)
      }
    } catch (error) {
      setMessage("Connection error")
    }
    setLoading(false)
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "Arial", position: "relative" }}>
      <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ position: "absolute", top: 20, right: 20, padding: "10px 20px", background: "rgba(168,85,247,0.3)", border: "2px solid #a855f7", color: "#a855f7", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: 14 }}>
        🌐 {t.language}
      </button>
      <div style={{ background: "rgba(10,14,39,0.95)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "20px", padding: "40px", maxWidth: "500px", width: "100%", boxShadow: "0 0 40px rgba(0,255,255,0.2)" }}>
        <Logo size="large" />
        <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: "30px", fontSize: 14 }}>{t.appDesc}</p>
        <h2 style={{ color: "#00ffff", textAlign: "center", marginBottom: "25px" }}>{t.register}</h2>
        <div style={{ background: "rgba(0,255,0,0.1)", border: "1px solid rgba(0,255,0,0.3)", borderRadius: "10px", padding: "15px", marginBottom: "20px", textAlign: "center" }}>
          <p style={{ color: "#00ff00", margin: 0, fontWeight: "bold", fontSize: 16 }}>🎁 {t.giftMsg}</p>
        </div>
        <input type="text" placeholder={t.fullName} value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} style={{ width: "100%", padding: "15px", marginBottom: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
        <input type="email" placeholder={t.email} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: "100%", padding: "15px", marginBottom: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
        <input type="tel" placeholder={t.phone} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: "100%", padding: "15px", marginBottom: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
        <input type="password" placeholder={t.password} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: "100%", padding: "15px", marginBottom: "20px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
        <button onClick={handleRegister} disabled={loading} style={{ width: "100%", padding: "18px", background: loading ? "#666" : "linear-gradient(135deg, #00ffff, #00bfff)", color: "#0a0e27", fontSize: "18px", fontWeight: "bold", borderRadius: "10px", border: "none", cursor: "pointer", marginBottom: "20px" }}>
          {loading ? "..." : t.registerBtn}
        </button>
        {message && <div style={{ padding: "15px", background: message.includes("Success") || message.includes("تم") ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)", borderRadius: "10px", color: message.includes("Success") || message.includes("تم") ? "#00ff00" : "#ff0000", textAlign: "center", fontWeight: "bold" }}>{message}</div>}
        <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "20px" }}>
          {t.haveAccount} <a href="/login" style={{ color: "#00ffff", textDecoration: "none", fontWeight: "bold" }}>{t.loginLink}</a>
        </p>
      </div>
      <InstallPrompt />
    </div>
  )
}
