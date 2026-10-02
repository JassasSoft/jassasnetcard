"use client"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [commands, setCommands] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    else { setUser(JSON.parse(userData)) }
  }, [])

  const sendCommand = async () => {
    setLoading(true)
    setResult("")
    try {
      const res = await fetch("/api/mikrotik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commands })
      })
      const data = await res.json()
      setResult(data.success ? "Success: " + data.message : "Error: " + data.message)
    } catch (e) { setResult("Connection error") }
    finally { setLoading(false) }
  }


  return (
    <div style={{ minHeight: "100vh", background: "#0a0e27", padding: "20px", fontFamily: "Arial" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", background: "rgba(10,14,39,0.95)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "20px", padding: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#00ffff", fontSize: "28px", margin: 0 }}>Dashboard</h1>
          <button onClick={() => { localStorage.removeItem("user"); window.location.href = "/login" }} style={{ background: "rgba(255,0,0,0.2)", border: "2px solid #ff0000", color: "#ff0000", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" }}>Logout</button>
        </div>
        <h2 style={{ color: "#00ffff" }}>MikroTik Commands</h2>
        <textarea value={commands} onChange={(e) => setCommands(e.target.value)} placeholder="/user add name=test password=123" style={{ width: "100%", minHeight: "200px", padding: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "14px", fontFamily: "monospace", boxSizing: "border-box" }} />
        <button onClick={sendCommand} disabled={loading} style={{ width: "100%", padding: "15px", background: loading ? "#666" : "#00ffff", color: "#0a0e27", fontSize: "18px", fontWeight: "bold", borderRadius: "10px", border: "none", cursor: "pointer", marginTop: "15px" }}>
          {loading ? "Sending..." : "Send Commands"}
        </button>
        {result && <div style={{ marginTop: "15px", padding: "15px", background: result.includes("Success") ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)", border: "2px solid " + (result.includes("Success") ? "#00ff00" : "#ff0000"), borderRadius: "10px", color: result.includes("Success") ? "#00ff00" : "#ff0000", textAlign: "center", fontWeight: "bold" }}>{result}</div>}
      </div>
    </div>
  )
}
