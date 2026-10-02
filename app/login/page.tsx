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
        setMessage("Welcome " + data.user.full_name)
        localStorage.setItem("user", JSON.stringify(data.user))
        setTimeout(() => { window.location.href = "/dashboard" }, 1500)
      } else {
        setMessage("Error: " + data.message)
      }
    } catch (error) {
      setMessage("Connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e27", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "Arial" }}>
      <div style={{ background: "rgba(10,14,39,0.95)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "20px", padding: "30px", maxWidth: "500px", width: "100%" }}>
        <h1 style={{ color: "#00ffff", textAlign: "center", fontSize: "28px" }}>Jassas Net Card</h1>
        <h2 style={{ color: "#00ffff", textAlign: "center", fontSize: "22px" }}>Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "15px", marginBottom: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "15px", marginBottom: "20px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "18px", background: loading ? "#666" : "linear-gradient(135deg, #00ffff, #00bfff)", color: "#0a0e27", fontSize: "18px", fontWeight: "bold", borderRadius: "10px", border: "none", cursor: "pointer" }}>
          {loading ? "Loading..." : "Login"}
        </button>
        {message && <p style={{ marginTop: "15px", textAlign: "center", color: message.includes("Welcome") ? "#00ff00" : "#ff0000", fontWeight: "bold" }}>{message}</p>}
      </div>
    </div>
  )
}
