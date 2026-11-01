"use client"

import { useState } from "react"
import Link from "next/link"
import BrandLogo from "@/components/BrandLogo"
import AuthThemeToggle from "@/components/AuthThemeToggle"
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

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
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

          if (
            errorText.includes("password") &&
            (errorText.includes("weak") || errorText.includes("short"))
          ) {
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

  return (
    <main className="auth-shell auth-register-page" dir="rtl">
      <div className="auth-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-orb auth-orb-two" aria-hidden="true" />
      <div className="auth-grid" aria-hidden="true" />

      <div className="auth-register-layout">
        <section className="auth-card auth-register-card" aria-labelledby="register-heading">
          <div className="auth-card-top">
            <span className="auth-status">
              <span className="auth-status-dot" />
              انضم إلى جساس نت كرت
            </span>
            <AuthThemeToggle />
          </div>

          <BrandLogo />

          <div className="auth-heading">
            <div className="auth-heading-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6m-3-3h6" />
              </svg>
            </div>
            <h1 id="register-heading">إنشاء حساب جديد</h1>
            <p>ابدأ إدارة كروتك وشبكتك باحتراف.</p>
          </div>

          <div className="auth-gift">
            <span className="auth-gift-icon" aria-hidden="true">🎁</span>
            <span>هدية التسجيل</span>
            <strong>500 كرت مجاني</strong>
          </div>

          <form className="auth-form auth-register-form" onSubmit={handleRegister}>
            <div className="auth-field">
              <label htmlFor="register-name">الاسم الكامل</label>
              <div className="auth-input-wrap">
                <input
                  id="register-name"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  autoComplete="name"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">البريد الإلكتروني</label>
              <div className="auth-input-wrap" dir="ltr">
                <input
                  id="register-email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-phone">رقم الهاتف <span className="auth-optional">(اختياري)</span></label>
              <div className="auth-input-wrap" dir="ltr">
                <input
                  id="register-phone"
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  autoComplete="tel"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">كلمة المرور</label>
              <div className="auth-input-wrap" dir="ltr">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="6 أحرف على الأقل"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                  minLength={6}
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={loading}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "إخفاء" : "إظهار"}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-confirm-password">تأكيد كلمة المرور</label>
              <div className="auth-input-wrap" dir="ltr">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="أعد إدخال كلمة المرور"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? "إخفاء" : "إظهار"}
                </button>
              </div>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner" aria-hidden="true" />
                  جارٍ إنشاء الحساب...
                </>
              ) : (
                <>
                  <span>إنشاء الحساب</span>
                  <span className="auth-submit-icon" aria-hidden="true">✦</span>
                </>
              )}
            </button>
          </form>

          {success && (
            <button
              className="auth-resend-button"
              type="button"
              onClick={handleResendConfirmation}
              disabled={resendLoading}
            >
              {resendLoading ? "جارٍ الإرسال..." : "إعادة إرسال رسالة التأكيد"}
            </button>
          )}

          {resendMessage && (
            <p className="auth-resend-message" role="status">{resendMessage}</p>
          )}

          {message && (
            <div
              className={`auth-register-message ${success ? "is-success" : "is-error"}`}
              role={success ? "status" : "alert"}
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <div className="auth-register">
            <span>لديك حساب بالفعل؟</span>
            <Link href="/login">
              تسجيل الدخول
              <span aria-hidden="true">←</span>
            </Link>
          </div>

          <footer className="auth-footer">
            <span>JASSAS SOFT PRO</span>
            <span className="auth-footer-separator">•</span>
            <span>تقنية تُسهّل إدارة شبكتك</span>
          </footer>
        </section>
      </div>
    </main>
  )
}
