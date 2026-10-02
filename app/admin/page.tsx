"use client"
import { useState, useEffect } from "react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [commands, setCommands] = useState("")
  const [result, setResult] = useState("")

  useEffect(() => {
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      window.location.href = "/login"
    }
  }, [])

  const sendCommand = async () => {
    try {
      const res = await fetch("/api/mikrotik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commands, type: "admin" })
      })
      const data = await res.json()
      setResult(data.success ? "✅ " + data.message : "❌ " + data.message)
    } catch (e) {
      setResult("❌ Connection error")
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e27", padding: "20px", fontFamily: "Arial" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#00ffff", fontSize: "32px", marginBottom: "30px" }}>Admin Dashboard</h1>
        
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          {["overview", "subscriptions", "mikrotik", "devices", "support"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "12px 24px", background: activeTab === tab ? "#00ffff" : "rgba(0,255,255,0.1)", border: "2px solid #00ffff", color: activeTab === tab ? "#0a0e27" : "#00ffff", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ background: "rgba(10,14,39,0.9)", borderRadius: "15px", padding: "30px", border: "2px solid rgba(0,255,255,0.2)" }}>
          {activeTab === "overview" && (
            <div>
              <h2 style={{ color: "#00ffff" }}>Overview</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" }}>
                <div style={{ padding: "20px", background: "linear-gradient(135deg, #00ffff, #00bfff)", borderRadius: "10px" }}>
                  <h3 style={{ color: "#0a0e27", margin: "0 0 10px" }}>Total Users</h3>
                  <p style={{ fontSize: "36px", fontWeight: "bold", color: "#0a0e27", margin: 0 }}>150</p>
                </div>
                <div style={{ padding: "20px", background: "linear-gradient(135deg, #00ff00, #00cc00)", borderRadius: "10px" }}>
                  <h3 style={{ color: "#0a0e27", margin: "0 0 10px" }}>Active</h3>
                  <p style={{ fontSize: "36px", fontWeight: "bold", color: "#0a0e27", margin: 0 }}>89</p>
                </div>
                <div style={{ padding: "20px", background: "linear-gradient(135deg, #a855f7, #7c3aed)", borderRadius: "10px" }}>
                  <h3 style={{ color: "white", margin: "0 0 10px" }}>Devices</h3>
                  <p style={{ fontSize: "36px", fontWeight: "bold", color: "white", margin: 0 }}>234</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mikrotik" && (
            <div>
              <h2 style={{ color: "#00ffff" }}>MikroTik Commands</h2>
              <textarea value={commands} onChange={(e) => setCommands(e.target.value)} placeholder="Enter MikroTik commands..." style={{ width: "100%", minHeight: "200px", padding: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#00ff00", fontSize: "14px", fontFamily: "monospace", marginTop: "15px", boxSizing: "border-box" }} />
              <button onClick={sendCommand} style={{ width: "100%", padding: "15px", background: "#00ffff", color: "#0a0e27", fontSize: "18px", fontWeight: "bold", borderRadius: "10px", border: "none", cursor: "pointer", marginTop: "15px" }}>Send Commands</button>
              {result && <div style={{ marginTop: "15px", padding: "15px", background: result.includes("✅") ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)", borderRadius: "10px", color: result.includes("✅") ? "#00ff00" : "#ff0000", textAlign: "center", fontWeight: "bold" }}>{result}</div>}
            </div>
          )}

          {activeTab === "subscriptions" && (
            <div>
              <h2 style={{ color: "#00ffff" }}>Subscriptions</h2>
              <p style={{ color: "#94a3b8", marginTop: "20px" }}>Subscription management coming soon...</p>
            </div>
          )}

          {activeTab === "devices" && (
            <div>
              <h2 style={{ color: "#00ffff" }}>Devices</h2>
              <p style={{ color: "#94a3b8", marginTop: "20px" }}>Device monitoring coming soon...</p>
            </div>
          )}

          {activeTab === "support" && (
            <div>
              <h2 style={{ color: "#00ffff" }}>Support</h2>
              <div style={{ marginTop: "20px" }}>
                <p style={{ color: "#fff", marginBottom: "10px" }}>Email: support@jassasnetcard.com</p>
                <p style={{ color: "#fff" }}>WhatsApp: +967 XXX XXX XXX</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
