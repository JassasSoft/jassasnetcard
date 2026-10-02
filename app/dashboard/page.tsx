"use client"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("print")
  const [cardValue, setCardValue] = useState("")
  const [duration, setDuration] = useState("1 ساعة")
  const [quantity, setQuantity] = useState(10)
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/login"
    } else {
      setUser(JSON.parse(userData))
    }
  }, [])

  const printCards = async () => {
    setLoading(true)
    setResult("")
    
    const cost = quantity * 1.5
    
    if ((user.cardsRemaining || 0) < quantity) {
      setResult("❌ رصيدك غير كافٍ! تحتاج " + quantity + " كرت")
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch("/api/print-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, cardValue, duration, quantity })
      })
      const data = await res.json()
      
      if (data.success) {
        const newRemaining = (user.cardsRemaining || 0) - quantity
        user.cardsRemaining = newRemaining
        localStorage.setItem("user", JSON.stringify(user))
        setUser({...user})
        setResult("✅ تم طباعة " + quantity + " كرت بنجاح! (التكلفة: " + cost + " جنيه)")
      } else {
        setResult("❌ " + data.message)
      }
    } catch (e) {
      setResult("❌ خطأ في الاتصال")
    }
    setLoading(false)
  }

  const buyCards = (amount: number, cards: number) => {
    alert("سيتم تحويلك لصفحة الدفع لشراء " + cards + " كرت بـ " + amount + " جنيه")
  }

  if (!user) return <div style={{ padding: "20px", color: "white" }}>Loading...</div>

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)", padding: "20px", fontFamily: "Arial" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", padding: "20px", background: "rgba(10,14,39,0.9)", borderRadius: "15px", border: "2px solid rgba(0,255,255,0.3)", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h1 style={{ color: "#00ffff", fontSize: "28px", margin: 0 }}>مرحباً، {user.fullName || "مدير النظام"}</h1>
            <p style={{ color: "#94a3b8", margin: "5px 0 0" }}>JassasNetCard Dashboard</p>
          </div>
          <button onClick={() => { localStorage.removeItem("user"); window.location.href = "/login" }} style={{ background: "rgba(255,0,0,0.2)", border: "2px solid #ff0000", color: "#ff0000", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>Logout</button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ padding: "25px", background: "linear-gradient(135deg, #00ffff, #00bfff)", borderRadius: "15px" }}>
            <h3 style={{ color: "#0a0e27", margin: "0 0 10px" }}>الكروت المتبقية</h3>
            <p style={{ fontSize: "36px", fontWeight: "bold", color: "#0a0e27", margin: 0 }}>{user.cardsRemaining || 500}</p>
          </div>
          <div style={{ padding: "25px", background: "linear-gradient(135deg, #00ff00, #00cc00)", borderRadius: "15px" }}>
            <h3 style={{ color: "#0a0e27", margin: "0 0 10px" }}>سعر الكرت الواحد</h3>
            <p style={{ fontSize: "36px", fontWeight: "bold", color: "#0a0e27", margin: 0 }}>1.5 جنيه</p>
          </div>
          <div style={{ padding: "25px", background: "linear-gradient(135deg, #a855f7, #7c3aed)", borderRadius: "15px" }}>
            <h3 style={{ color: "white", margin: "0 0 10px" }}>نوع الاشتراك</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "white", margin: 0 }}>{user.plan === "trial" ? "تجريبي (500 كرت)" : "مميز"}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          {[
            { id: "print", label: "🖨️ طباعة كروت", color: "#00ffff" },
            { id: "buy", label: "💳 شراء كروت", color: "#a855f7" },
            { id: "mikrotik", label: "🔧 MikroTik", color: "#00ff00" },
            { id: "history", label: " السجل", color: "#ffa500" }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "12px 24px", background: activeTab === tab.id ? tab.color : "rgba(0,255,255,0.1)", border: "2px solid " + tab.color, color: activeTab === tab.id ? "#0a0e27" : tab.color, borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ background: "rgba(10,14,39,0.9)", borderRadius: "15px", padding: "30px", border: "2px solid rgba(0,255,255,0.2)" }}>
          
          {activeTab === "print" && (
            <div>
              <h2 style={{ color: "#00ffff", marginBottom: "20px" }}>🖨️ طباعة كروت الإنترنت</h2>
              
              <div style={{ background: "rgba(255,165,0,0.1)", border: "1px solid rgba(255,165,0,0.3)", borderRadius: "10px", padding: "15px", marginBottom: "20px" }}>
                <p style={{ color: "#ffa500", margin: 0, fontWeight: "bold" }}>💰 سعر الكرت: 1.5 جنيه | التكلفة الحالية: {quantity * 1.5} جنيه</p>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ color: "#fff", display: "block", marginBottom: "10px" }}>قيمة الكرت (جنيه):</label>
                <input type="number" value={cardValue} onChange={(e) => setCardValue(e.target.value)} placeholder="مثال: 100" style={{ width: "100%", padding: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ color: "#fff", display: "block", marginBottom: "10px" }}>المدة:</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: "100%", padding: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px" }}>
                  <option value="1 ساعة">1 ساعة</option>
                  <option value="3 ساعات">3 ساعات</option>
                  <option value="1 يوم">1 يوم</option>
                  <option value="7 أيام">7 أيام</option>
                  <option value="30 يوم">30 يوم</option>
                </select>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ color: "#fff", display: "block", marginBottom: "10px" }}>الكمية:</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} min="1" max="100" style={{ width: "100%", padding: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }} />
              </div>
              
              <button onClick={printCards} disabled={loading || (user.cardsRemaining || 0) < quantity} style={{ width: "100%", padding: "18px", background: (user.cardsRemaining || 0) < quantity ? "#666" : "linear-gradient(135deg, #00ffff, #00bfff)", color: "#0a0e27", fontSize: "18px", fontWeight: "bold", borderRadius: "10px", border: "none", cursor: "pointer", marginBottom: "15px" }}>
                {loading ? "⏳ جاري الطباعة..." : "🖨️ طباعة " + quantity + " كرت (" + (quantity * 1.5) + " جنيه)"}
              </button>
              
              {result && <div style={{ padding: "15px", background: result.includes("✅") ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)", borderRadius: "10px", color: result.includes("✅") ? "#00ff00" : "#ff0000", textAlign: "center", fontWeight: "bold" }}>{result}</div>}
            </div>
          )}

          {activeTab === "buy" && (
            <div>
              <h2 style={{ color: "#a855f7", marginBottom: "20px" }}>💳 شراء كروت إضافية</h2>
              <p style={{ color: "#94a3b8", marginBottom: "20px" }}>سعر الكرت: <strong style={{ color: "#00ffff" }}>1.5 جنيه</strong></p>
              
              <div style={{ display: "grid", gap: "15px" }}>
                <div onClick={() => buyCards(150, 100)} style={{ padding: "25px", background: "rgba(0,255,255,0.1)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "15px", cursor: "pointer" }}>
                  <h3 style={{ color: "#00ffff", margin: "0 0 10px" }}>100 كرت</h3>
                  <p style={{ color: "#fff", fontSize: "24px", fontWeight: "bold", margin: 0 }}>150 جنيه</p>
                </div>
                
                <div onClick={() => buyCards(750, 500)} style={{ padding: "25px", background: "rgba(168,85,247,0.1)", border: "2px solid rgba(168,85,247,0.3)", borderRadius: "15px", cursor: "pointer" }}>
                  <h3 style={{ color: "#a855f7", margin: "0 0 10px" }}>500 كرت</h3>
                  <p style={{ color: "#fff", fontSize: "24px", fontWeight: "bold", margin: 0 }}>750 جنيه</p>
                  <span style={{ background: "#00ff00", color: "#0a0e27", padding: "5px 10px", borderRadius: "5px", fontSize: "12px", fontWeight: "bold" }}>الأكثر مبيعاً</span>
                </div>
                
                <div onClick={() => buyCards(15000, 1000)} style={{ padding: "25px", background: "rgba(255,165,0,0.1)", border: "2px solid rgba(255,165,0,0.3)", borderRadius: "15px", cursor: "pointer" }}>
                  <h3 style={{ color: "#ffa500", margin: "0 0 10px" }}>1000 كرت</h3>
                  <p style={{ color: "#fff", fontSize: "24px", fontWeight: "bold", margin: 0 }}>15,000 جنيه</p>
                  <span style={{ background: "#ffa500", color: "#0a0e27", padding: "5px 10px", borderRadius: "5px", fontSize: "12px", fontWeight: "bold" }}>أفضل قيمة</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mikrotik" && (
            <div>
              <h2 style={{ color: "#00ff00", marginBottom: "20px" }}>🔧 ربط جهاز MikroTik</h2>
              <p style={{ color: "#94a3b8", marginBottom: "20px" }}>اتبع الخطوات التالية لربط جهازك:</p>
              
              <div style={{ background: "rgba(0,255,0,0.1)", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
                <h3 style={{ color: "#00ff00", margin: "0 0 15px" }}>📱 الخطوة 1: تحميل التطبيق</h3>
                <p style={{ color: "#fff", margin: "0 0 10px" }}>حمّل تطبيق MikroTik Pro من المتجر</p>
                <a href="https://play.google.com/store/apps/details?id=com.mikrotik.android.tikapp" target="_blank" style={{ color: "#00ffff", textDecoration: "underline" }}>تحميل التطبيق</a>
              </div>
              
              <div style={{ background: "rgba(0,255,255,0.1)", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
                <h3 style={{ color: "#00ffff", margin: "0 0 15px" }}>🔐 الخطوة 2: تفعيل API</h3>
                <p style={{ color: "#fff", margin: 0, fontFamily: "monospace" }}>/ip service enable api</p>
              </div>
              
              <div style={{ background: "rgba(168,85,247,0.1)", padding: "20px", borderRadius: "10px" }}>
                <h3 style={{ color: "#a855f7", margin: "0 0 15px" }}>📡 الخطوة 3: إدخال بيانات الجهاز</h3>
                <input type="text" placeholder="IP Address (مثال: 192.168.88.1)" style={{ width: "100%", padding: "12px", marginBottom: "10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "5px", color: "#fff", boxSizing: "border-box" }} />
                <input type="text" placeholder="Username" style={{ width: "100%", padding: "12px", marginBottom: "10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "5px", color: "#fff", boxSizing: "border-box" }} />
                <input type="password" placeholder="Password" style={{ width: "100%", padding: "12px", marginBottom: "15px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "5px", color: "#fff", boxSizing: "border-box" }} />
                <button style={{ width: "100%", padding: "15px", background: "#a855f7", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>ربط الجهاز</button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 style={{ color: "#ffa500", marginBottom: "20px" }}>📊 سجل الطباعة</h2>
              <p style={{ color: "#94a3b8" }}>لا توجد عمليات طباعة بعد. ابدأ بطباعة كروتك الأولى!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
