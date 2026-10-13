"use client"

import { useState } from "react"
import Link from "next/link"
import BrandLogo from "@/components/BrandLogo"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    setMessage("")
    setSuccess(false)

    if (!formData.fullName.trim()) {
      setMessage("الرجاء إدخال الاسم الكامل")
      return
    }

    if (!formData.email.trim()) {
      setMessage("الرجاء إدخال البريد الإلكتروني")
      return
    }

    if (formData.password.length < 6) {
      setMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("كلمتا المرور غير متطابقتين")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
          },
        },
      })

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          setMessage("هذا البريد الإلكتروني مستخدم بالفعل")
        } else {
          setMessage("تعذر إنشاء الحساب: " + error.message)
        }

        setLoading(false)
        return
      }

      if (data.session) {
        window.location.href = "/dashboard"
        return
      }

      setSuccess(true)
      setMessage(
        "تم إنشاء الحساب بنجاح. تحقق من بريدك الإلكتروني لتفعيل الحساب ثم سجل الدخول."
      )

      setLoading(false)
    } catch {
      setMessage("حدث خطأ في الاتصال. حاول مرة أخرى.")
      setLoading(false)
    }
  }

  const updateField = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 10%, rgba(124,58,237,.22), transparent 30%), radial-gradient(circle at 80% 90%, rgba(0,217,255,.12), transparent 30%), linear-gradient(135deg,#070b18 0%,#10172a 50%,#080b15 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Segoe UI, Tahoma, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "36px",
          borderRadius: "28px",
          background: "rgba(15,23,42,.78)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,.10)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,.55), 0 0 50px rgba(124,58,237,.10)",
        }}
      >
        <BrandLogo />

        <div
          style={{
            textAlign: "center",
            marginTop: "28px",
            marginBottom: "22px",
          }}
        >
          <h1
            style={{
              color: "#fff",
              fontSize: "25px",
              margin: "0 0 8px",
              fontWeight: 800,
            }}
          >
            إنشاء حساب جديد
          </h1>

          <p
            style={{
              color: "#94a3b8",
              margin: 0,
              fontSize: "14px",
            }}
          >
            ابدأ إدارة كروتك وشبكتك باحتراف
          </p>
        </div>

        <div
          style={{
            background:
              "linear-gradient(135deg,rgba(212,175,55,.10),rgba(124,58,237,.12))",
            border: "1px solid rgba(212,175,55,.25)",
            borderRadius: "14px",
            padding: "13px",
            marginBottom: "20px",
            textAlign: "center",
            color: "#f5d76e",
            fontWeight: 800,
            fontSize: "14px",
          }}
        >
          🎁 هدية التسجيل: 500 كرت مجاني
        </div>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="الاسم الكامل"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            autoComplete="name"
            disabled={loading}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            autoComplete="email"
            disabled={loading}
            style={inputStyle}
          />

          <input
            type="tel"
            placeholder="رقم الهاتف"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            autoComplete="tel"
            disabled={loading}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            autoComplete="new-password"
            disabled={loading}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="تأكيد كلمة المرور"
            value={formData.confirmPassword}
            onChange={(e) =>
              updateField("confirmPassword", e.target.value)
            }
            autoComplete="new-password"
            disabled={loading}
            style={{
              ...inputStyle,
              marginBottom: "20px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: loading
                ? "#475569"
                : "linear-gradient(135deg,#00d9ff,#7c3aed 65%,#d4af37)",
              color: "#fff",
              fontSize: "17px",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading
                ? "none"
                : "0 12px 30px rgba(124,58,237,.25)",
            }}
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              borderRadius: "13px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 700,
              background: success
                ? "rgba(16,185,129,.12)"
                : "rgba(239,68,68,.12)",
              border: success
                ? "1px solid rgba(16,185,129,.35)"
                : "1px solid rgba(239,68,68,.35)",
              color: success ? "#6ee7b7" : "#fca5a5",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            style={{
              color: "#67e8f9",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "15px",
  marginBottom: "14px",
  background: "rgba(2,6,23,.72)",
  border: "1px solid rgba(0,217,255,.25)",
  borderRadius: "14px",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
}
