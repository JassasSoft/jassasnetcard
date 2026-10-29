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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState("")

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
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
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
          const errorText = error.message.toLowerCase()

          if (errorText.includes("password") &&
              (errorText.includes("weak") || errorText.includes("short"))) {
            setMessage("كلمة المرور ضعيفة. اختر كلمة مرور أقوى.")
          } else if (
            errorText.includes("rate limit") ||
            errorText.includes("too many requests")
          ) {
            setMessage("حاولت إنشاء الحساب مرات كثيرة. انتظر قليلًا ثم حاول مجددًا.")
          } else {
            setMessage("تعذر إنشاء الحساب الآن. تحقق من البيانات وحاول مرة أخرى.")
          }
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

  const handleResendConfirmation = async () => {
    const email = formData.email.trim()
    if (!email) {
      setResendMessage("أدخل بريدك الإلكتروني أولاً.")
      return
    }

    setResendLoading(true)
    setResendMessage("")
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      setResendMessage(
        error
          ? "تعذر إرسال رسالة التأكيد. حاول لاحقاً."
          : "راجع بريدك الوارد ومجلد الرسائل غير المرغوب فيها."
      )
    } catch {
      setResendMessage("حدث خطأ في الاتصال. حاول مرة أخرى.")
    } finally {
      setResendLoading(false)
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
          "radial-gradient(circle at 15% 12%, rgba(124,58,237,.15), transparent 32%), radial-gradient(circle at 88% 85%, rgba(0,153,255,.20), transparent 34%), linear-gradient(135deg,#e8f7ff 0%,#d7edff 48%,#f5f1ff 100%)",
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
          background: "linear-gradient(145deg,rgba(255,255,255,.97),rgba(247,250,255,.95))",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,.92)",
          boxShadow:
            "0 28px 70px rgba(47,91,150,.17), 0 10px 30px rgba(124,58,237,.08)",
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
              color: "#172b49",
              fontSize: "25px",
              margin: "0 0 8px",
              fontWeight: 800,
            }}
          >
            إنشاء حساب جديد
          </h1>

          <p
            style={{
              color: "#5c708d",
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
              "linear-gradient(110deg,rgba(255,248,220,.98),rgba(241,235,255,.98) 52%,rgba(224,245,255,.98))",
            border: "1px solid rgba(201,154,40,.38)",
            borderRadius: "16px",
            padding: "14px",
            marginBottom: "20px",
            textAlign: "center",
            color: "#674b12",
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

          <div style={{ position: "relative", marginBottom: "14px" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              autoComplete="new-password"
              disabled={loading}
              style={{ ...inputStyle, paddingRight: "76px", marginBottom: 0 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              disabled={loading}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              style={eyeButtonStyle}
            >
              {showPassword ? "إخفاء" : "إظهار"}
            </button>
          </div>

          <div style={{ position: "relative", marginBottom: "20px" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="تأكيد كلمة المرور"
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              autoComplete="new-password"
              disabled={loading}
              style={{ ...inputStyle, paddingRight: "76px", marginBottom: 0 }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              disabled={loading}
              aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
              style={eyeButtonStyle}
            >
              {showConfirmPassword ? "إخفاء" : "إظهار"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              border: "1px solid rgba(255,255,255,.75)",
              borderRadius: "14px",
              background: loading
                ? "#8293aa"
                : "linear-gradient(110deg,#168de2 0%,#8060dc 68%,#c99a28 125%)",
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

        {success && (
          <button
            type="button"
            onClick={handleResendConfirmation}
            disabled={resendLoading}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid rgba(22,141,226,.28)",
              background: "linear-gradient(110deg,#edf8ff,#f4f0ff)",
              color: "#176fc0",
              fontWeight: 700,
              cursor: resendLoading ? "wait" : "pointer",
            }}
          >
            {resendLoading ? "جارٍ الإرسال..." : "إعادة إرسال رسالة التأكيد"}
          </button>
        )}
        {resendMessage && (
          <p role="status" style={{ color: "#176fc0", fontSize: "13px", textAlign: "center" }}>
            {resendMessage}
          </p>
        )}

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
              color: success ? "#087c60" : "#b42335",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#536985",
            fontSize: "14px",
          }}
        >
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            style={{
              color: "#176fc0",
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

const eyeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  right: "10px",
  transform: "translateY(-50%)",
  border: "none",
  background: "transparent",
  color: "#176fc0",
  fontSize: "12px",
  fontWeight: 800,
  padding: "8px",
  cursor: "pointer",
  zIndex: 2,
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "15px",
  marginBottom: "14px",
  background: "linear-gradient(145deg,#ffffff,#f3f8ff)",
  border: "1px solid rgba(120,157,205,.32)",
  borderRadius: "14px",
  color: "#203754",
  boxShadow: "0 5px 14px rgba(50,88,140,.07), inset 0 1px 0 rgba(255,255,255,.95)",
  fontSize: "16px",
  outline: "none",
}
