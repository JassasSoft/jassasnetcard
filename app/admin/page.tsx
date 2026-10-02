"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalDevices: 0, revenue: 0 })
  const [mikrotikCommands, setMikrotikCommands] = useState("")
  const [commandResult, setCommandResult] = useState("")
  const [subscriptions, setSubscriptions] = useState([])
  const [notifications, setNotifications] = useState([])
  const router = useRouter()

  useEffect(() => {
    const adminData = localStorage.getItem("admin")
    else { loadDashboardData() }
  }, [])

  const loadDashboardData = () => {
    setStats({ totalUsers: 150, activeUsers: 89, totalDevices: 234, revenue: 12500 })
    setSubscriptions([
      { id: 1, user: "أحمد محمد", plan: "شهري", status: "نشط", device: "Router-001", expiry: "2026-11-01" },
      { id: 2, user: "محمد علي", plan: "سنوي", status: "منتهي", device: "Router-002", expiry: "2026-09-15" },
      { id: 3, user: "فاطمة أحمد", plan: "شهري", status: "نشط", device: "Router-003", expiry: "2026-11-10" }
    ])
    setNotifications([
      { id: 1, type: "new_device", message: "جهاز جديد متصل: Router-004", time: "منذ 5 دقائق" },
      { id: 2, type: "subscription", message: "اشتراك جديد: أحمد محمد - شهري", time: "منذ ساعة" }
    ])
  }

  const sendMikrotikCommand = async () => {
    try {
      const res = await fetch("/api/mikrotik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commands: mikrotikCommands, type: "admin" })
      })
      const data = await res.json()
      setCommandResult(data.success ? "✅ " + data.message : "❌ " + data.message)
    } catch (e) { setCommandResult("❌ خطأ في الاتصال") }
  }

  const activateSubscription = async (id: number) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: "نشط" } : sub
    ))
  }

  const deactivateSubscription = async (id: number) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: "منتهي" } : sub
    ))
    alert("تم إيقاف الاشتراك")
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)", fontFamily: "Arial", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", padding: "20px", background: "rgba(10,14,39,0.9)", borderRadius: "15px", border: "2px solid rgba(0,255,255,0.3)" }}>
          <div>
            <h1 style={{ color: "#00ffff", fontSize: "32px", margin: 0 }}>🎯 لوحة تحكم المدير</h1>
            <p style={{ color: "#94a3b8", margin: "5px 0 0" }}>JassasNetCard Admin Panel</p>
          </div>
          <button onClick={() => { localStorage.removeItem("admin"); router.push("/login") }} style={{ background: "rgba(255,0,0,0.2)", border: "2px solid #ff0000", color: "#ff0000", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>تسجيل الخروج</button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ padding: "25px", background: "linear-gradient(135deg, #00ffff, #00bfff)", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,255,255,0.3)" }}>
            <h3 style={{ color: "#0a0e27", fontSize: "16px", margin: "0 0 10px" }}>إجمالي المشتركين</h3>
            <p style={{ fontSize: "36px", fontWeight: "bold", color: "#0a0e27", margin: 0 }}>{stats.totalUsers}</p>
          </div>
          <div style={{ padding: "25px", background: "linear-gradient(135deg, #00ff00, #00cc00)", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,255,0,0.3)" }}>
            <h3 style={{ color: "#0a0e27", fontSize: "16px", margin: "0 0 10px" }}>المشتركين النشطين</h3>
            <p style={{ fontSize: "36px", fontWeight: "bold", color: "#0a0e27", margin: 0 }}>{stats.activeUsers}</p>
          </div>
          <div style={{ padding: "25px", background: "linear-gradient(135deg, #a855f7, #7c3aed)", borderRadius: "15px", boxShadow: "0 10px 30px rgba(168,85,247,0.3)" }}>
            <h3 style={{ color: "white", fontSize: "16px", margin: "0 0 10px" }}>إجمالي الأجهزة</h3>
            <p style={{ fontSize: "36px", fontWeight: "bold", color: "white", margin: 0 }}>{stats.totalDevices}</p>
          </div>
          <div style={{ padding: "25px", background: "linear-gradient(135deg, #ffa500, #ff8c00)", borderRadius: "15px", boxShadow: "0 10px 30px rgba(255,165,0,0.3)" }}>
            <h3 style={{ color: "#0a0e27", fontSize: "16px", margin: "0 0 10px" }}>الإيرادات (USD)</h3>
            <p style={{ fontSize: "36px", fontWeight: "bold", color: "#0a0e27", margin: 0 }}>${stats.revenue}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          {["overview", "subscriptions", "mikrotik", "devices", "notifications", "support"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "12px 24px", background: activeTab === tab ? "#00ffff" : "rgba(0,255,255,0.1)", border: "2px solid #00ffff", color: activeTab === tab ? "#0a0e27" : "#00ffff", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", textTransform: "capitalize" }}>
              {tab === "overview" && "📊 نظرة عامة"}
              {tab === "subscriptions" && "💳 الاشتراكات"}
              {tab === "mikrotik" && "🔧 MikroTik"}
              {tab === "devices" && " الأجهزة"}
              {tab === "notifications" && "🔔 الإشعارات"}
              {tab === "support" && "💬 الدعم"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ background: "rgba(10,14,39,0.9)", borderRadius: "15px", padding: "30px", border: "2px solid rgba(0,255,255,0.2)" }}>
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h2 style={{ color: "#00ffff", fontSize: "24px", marginBottom: "20px" }}>📊 نظرة عامة على النظام</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                <div style={{ padding: "20px", background: "rgba(0,255,255,0.1)", borderRadius: "10px", border: "1px solid rgba(0,255,255,0.3)" }}>
                  <h3 style={{ color: "#00ffff", margin: "0 0 15px" }}> الإحصائيات الشهرية</h3>
                  <p style={{ color: "#94a3b8", margin: "5px 0" }}>مشتركين جدد هذا الشهر: <strong style={{ color: "#00ff00" }}>+23</strong></p>
                  <p style={{ color: "#94a3b8", margin: "5px 0" }}>إيرادات الشهر: <strong style={{ color: "#00ff00" }}>$2,450</strong></p>
                  <p style={{ color: "#94a3b8", margin: "5px 0" }}>معدل النمو: <strong style={{ color: "#00ff00" }}>+15.3%</strong></p>
                </div>
                <div style={{ padding: "20px", background: "rgba(255,165,0,0.1)", borderRadius: "10px", border: "1px solid rgba(255,165,0,0.3)" }}>
                  <h3 style={{ color: "#ffa500", margin: "0 0 15px" }}>⚠️ تنبيهات مهمة</h3>
                  <p style={{ color: "#94a3b8", margin: "5px 0" }}>3 اشتراكات تنتهي خلال 3 أيام</p>
                  <p style={{ color: "#94a3b8", margin: "5px 0" }}>جهاز واحد غير متصل منذ ساعة</p>
                </div>
              </div>
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === "subscriptions" && (
            <div>
              <h2 style={{ color: "#00ffff", fontSize: "24px", marginBottom: "20px" }}>💳 إدارة الاشتراكات</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(0,255,255,0.1)", borderBottom: "2px solid #00ffff" }}>
                      <th style={{ padding: "15px", textAlign: "right", color: "#00ffff" }}>المشترك</th>
                      <th style={{ padding: "15px", textAlign: "right", color: "#00ffff" }}>الخطة</th>
                      <th style={{ padding: "15px", textAlign: "right", color: "#00ffff" }}>الحالة</th>
                      <th style={{ padding: "15px", textAlign: "right", color: "#00ffff" }}>الجهاز</th>
                      <th style={{ padding: "15px", textAlign: "right", color: "#00ffff" }}>تاريخ الانتهاء</th>
                      <th style={{ padding: "15px", textAlign: "right", color: "#00ffff" }}>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub: any) => (
                      <tr key={sub.id} style={{ borderBottom: "1px solid rgba(0,255,255,0.1)" }}>
                        <td style={{ padding: "15px", color: "#fff" }}>{sub.user}</td>
                        <td style={{ padding: "15px", color: "#fff" }}>{sub.plan}</td>
                        <td style={{ padding: "15px" }}>
                          <span style={{ padding: "5px 15px", borderRadius: "20px", background: sub.status === "نشط" ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)", color: sub.status === "نشط" ? "#00ff00" : "#ff0000", fontWeight: "bold" }}>{sub.status}</span>
                        </td>
                        <td style={{ padding: "15px", color: "#fff" }}>{sub.device}</td>
                        <td style={{ padding: "15px", color: "#94a3b8" }}>{sub.expiry}</td>
                        <td style={{ padding: "15px" }}>
                          {sub.status === "نشط" ? (
                            <button onClick={() => deactivateSubscription(sub.id)} style={{ padding: "8px 16px", background: "rgba(255,0,0,0.2)", border: "1px solid #ff0000", color: "#ff0000", borderRadius: "5px", cursor: "pointer" }}>إيقاف</button>
                          ) : (
                            <button onClick={() => activateSubscription(sub.id)} style={{ padding: "8px 16px", background: "rgba(0,255,0,0.2)", border: "1px solid #00ff00", color: "#00ff00", borderRadius: "5px", cursor: "pointer" }}>تفعيل</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MikroTik Tab */}
          {activeTab === "mikrotik" && (
            <div>
              <h2 style={{ color: "#00ffff", fontSize: "24px", marginBottom: "20px" }}>🔧 إرسال أوامر MikroTik</h2>
              <div style={{ marginBottom: "20px", padding: "20px", background: "rgba(0,255,0,0.1)", borderRadius: "10px", border: "1px solid rgba(0,255,0,0.3)" }}>
                <h3 style={{ color: "#00ff00", margin: "0 0 15px" }}>📋 أوامر جاهزة للاستخدام:</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
                  <button onClick={() => setMikrotikCommands("/user remove [find name="tc_mohmed_214c"];
/user add name="tc_mohmed_214c" password="ad7fa28e77cf23f693" group=full;
/ip service enable api;
/ip service set api port=8728 disabled=no;")} style={{ padding: "10px 20px", background: "rgba(0,255,255,0.2)", border: "1px solid #00ffff", color: "#00ffff", borderRadius: "5px", cursor: "pointer", fontSize: "12px" }}>🔌 ربط جهاز جديد</button>
                  <button onClick={() => setMikrotikCommands("/interface l2tp-client remove [find name="l2tp_mikrosaas"];
/interface l2tp-client add name="l2tp_mikrosaas" connect-to=185.188.249.189 user="mohmed" password="7hsaqgjh" use-ipsec=no add-default-route=no use-peer-dns=no disabled=no;")} style={{ padding: "10px 20px", background: "rgba(168,85,247,0.2)", border: "1px solid #a855f7", color: "#a855f7", borderRadius: "5px", cursor: "pointer", fontSize: "12px" }}>🌐 إنشاء اتصال L2TP</button>
                  <button onClick={() => setMikrotikCommands("/system resource print")} style={{ padding: "10px 20px", background: "rgba(255,165,0,0.2)", border: "1px solid #ffa500", color: "#ffa500", borderRadius: "5px", cursor: "pointer", fontSize: "12px" }}>📊 عرض معلومات الجهاز</button>
                </div>
              </div>
              <textarea value={mikrotikCommands} onChange={(e) => setMikrotikCommands(e.target.value)} placeholder="أدخل أوامر MikroTik هنا..." style={{ width: "100%", minHeight: "200px", padding: "15px", background: "rgba(0,0,0,0.5)", border: "2px solid rgba(0,255,255,0.3)", borderRadius: "10px", color: "#00ff00", fontSize: "14px", fontFamily: "monospace", marginBottom: "15px", boxSizing: "border-box" }} />
              <button onClick={sendMikrotikCommand} style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #00ffff, #00bfff)", color: "#0a0e27", fontSize: "18px", fontWeight: "bold", borderRadius: "10px", border: "none", cursor: "pointer" }}>📤 إرسال الأوامر</button>
              {commandResult && <div style={{ marginTop: "15px", padding: "15px", background: commandResult.includes("✅") ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)", border: "2px solid " + (commandResult.includes("✅") ? "#00ff00" : "#ff0000"), borderRadius: "10px", color: commandResult.includes("✅") ? "#00ff00" : "#ff0000", fontWeight: "bold" }}>{commandResult}</div>}
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === "devices" && (
            <div>
              <h2 style={{ color: "#00ffff", fontSize: "24px", marginBottom: "20px" }}>📱 الأجهزة المتصلة</h2>
              <div style={{ display: "grid", gap: "15px" }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ padding: "20px", background: "rgba(0,255,255,0.05)", border: "1px solid rgba(0,255,255,0.2)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ color: "#00ffff", margin: "0 0 5px" }}>Router-00{i}</h3>
                      <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>IP: 192.168.88.{i} • آخر اتصال: منذ {i * 5} دقيقة</p>
                    </div>
                    <span style={{ padding: "8px 16px", background: "rgba(0,255,0,0.2)", color: "#00ff00", borderRadius: "5px", fontWeight: "bold" }}>متصل</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div>
              <h2 style={{ color: "#00ffff", fontSize: "24px", marginBottom: "20px" }}>🔔 الإشعارات</h2>
              {notifications.map((notif: any) => (
                <div key={notif.id} style={{ padding: "15px", marginBottom: "10px", background: notif.type === "new_device" ? "rgba(0,255,0,0.1)" : "rgba(0,255,255,0.1)", border: "1px solid " + (notif.type === "new_device" ? "rgba(0,255,0,0.3)" : "rgba(0,255,255,0.3)"), borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ color: "#fff", margin: "0 0 5px", fontWeight: "bold" }}>{notif.message}</p>
                    <p style={{ color: "#94a3b8", margin: 0, fontSize: "12px" }}>{notif.time}</p>
                  </div>
                  <span style={{ fontSize: "24px" }}>{notif.type === "new_device" ? "📱" : "💳"}</span>
                </div>
              ))}
            </div>
          )}

          {/* Support Tab */}
          {activeTab === "support" && (
            <div>
              <h2 style={{ color: "#00ffff", fontSize: "24px", marginBottom: "20px" }}>💬 الدعم والتواصل</h2>
              <div style={{ display: "grid", gap: "20px" }}>
                <div style={{ padding: "25px", background: "rgba(0,255,255,0.1)", borderRadius: "15px", border: "2px solid rgba(0,255,255,0.3)", textAlign: "center" }}>
                  <h3 style={{ color: "#00ffff", margin: "0 0 15px" }}>📧 البريد الإلكتروني للدعم</h3>
                  <p style={{ color: "#fff", fontSize: "18px", margin: "0 0 15px" }}>support@jassasnetcard.com</p>
                  <button style={{ padding: "12px 24px", background: "#00ffff", color: "#0a0e27", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>إرسال بريد</button>
                </div>
                <div style={{ padding: "25px", background: "rgba(168,85,247,0.1)", borderRadius: "15px", border: "2px solid rgba(168,85,247,0.3)", textAlign: "center" }}>
                  <h3 style={{ color: "#a855f7", margin: "0 0 15px" }}>📱 واتساب الدعم الفني</h3>
                  <p style={{ color: "#fff", fontSize: "18px", margin: "0 0 15px" }}>+967 XXX XXX XXX</p>
                  <button style={{ padding: "12px 24px", background: "#25D366", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>تواصل عبر واتساب</button>
                </div>
                <div style={{ padding: "25px", background: "rgba(255,165,0,0.1)", borderRadius: "15px", border: "2px solid rgba(255,165,0,0.3)", textAlign: "center" }}>
                  <h3 style={{ color: "#ffa500", margin: "0 0 15px" }}>📚 الوثائق والدليل</h3>
                  <p style={{ color: "#94a3b8", margin: "0 0 15px" }}>دليل الاستخدام الشامل للنظام</p>
                  <button style={{ padding: "12px 24px", background: "#ffa500", color: "#0a0e27", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>عرض الوثائق</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
