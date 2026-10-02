"use client"
import { useState } from "react"

export default function LoginPage() {
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
        setMessage("Welcome " + data.user.fullName)
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "Arial" }}>
      <div style={{ background: "rgba(10,14,39,0.95)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "20px", padding: "40px", maxWidth: "500px", width: "100%" }}>
        <h1 style={{ color: "#00ffff", textAlign: "center", fontSize: "32px", marginBottom: "10px" }}>Jassas Net Card</h1>
        <p style={{ color: "#94a3b8", textAlign: "center", marginBottom: "30px" }}>نظام إدارة شبكات المايكروتك</p>
        <h2 style={{ color: "#00ffff", textAlign: "center", marginBottom: "25px" }}>تسجيل الدخول</h2>
        <input type="text" placeholder="اسم المستخدم أو الإيميل" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "15px", marginBottom: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "15px", marginBottom: "20px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "18px", background: loading ? "#666" : "linear-gradient(135deg, #00ffff, #00bfff)", color: "#0a0e27", fontSize: "18px", fontWeight: "bold", borderRadius: "10px", border: "none", cursor: "pointer", marginBottom: "20px" }}>
          {loading ? "جاري التحميل..." : "دخول آمن"}
        </button>
        {message && <div style={{ padding: "15px", background: message.includes("Welcome") ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)", borderRadius: "10px", color: message.includes("Welcome") ? "#00ff00" : "#ff0000", textAlign: "center", fontWeight: "bold" }}>{message}</div>}
        <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "20px" }}>
          ليس لديك حساب؟ <a href="/register" style={{ color: "#00ffff", textDecoration: "none", fontWeight: "bold" }}>إنشاء حساب جديد</a>
        </p>
      </div>
    </div>
  )
}
