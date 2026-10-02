"use client"
import { useState } from "react"
import Logo from "@/components/Logo"
import { translations } from "@/lib/translations"

export default function LoginPage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar')
  const t = translations[lang]
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setMessage("")
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
      const data = await response.json()
      if (data.success) {
        setMessage(t.welcome + " " + data.user.fullName)
        localStorage.setItem("user", JSON.stringify(data.user))
        setTimeout(() => { window.location.href = "/dashboard" }, 1500)
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
        <h2 style={{ color: "#00ffff", textAlign: "center", marginBottom: "25px" }}>{t.login}</h2>
        <input type="text" placeholder={t.username} value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "15px", marginBottom: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
        <input type="password" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "15px", marginBottom: "20px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "18px", background: loading ? "#666" : "linear-gradient(135deg, #00ffff, #00bfff)", color: "#0a0e27", fontSize: "18px", fontWeight: "bold", borderRadius: "10px", border: "none", cursor: "pointer", marginBottom: "20px" }}>
          {loading ? "..." : t.loginBtn}
        </button>
        {message && <div style={{ padding: "15px", background: message.includes(t.welcome) ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)", borderRadius: "10px", color: message.includes(t.welcome) ? "#00ff00" : "#ff0000", textAlign: "center", fontWeight: "bold" }}>{message}</div>}
        <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "20px" }}>
          {t.noAccount} <a href="/register" style={{ color: "#00ffff", textDecoration: "none", fontWeight: "bold" }}>{t.createAccount}</a>
        </p>
      </div>
    </div>
  )
}
