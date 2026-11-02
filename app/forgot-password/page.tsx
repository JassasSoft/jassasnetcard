"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import BrandLogo from "@/components/BrandLogo"
import AuthThemeToggle from "@/components/AuthThemeToggle"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSent(false)

    if (!email.trim()) {
      setError("أدخل البريد الإلكتروني أولاً.")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })

      if (resetError) {
        setError("تعذر إرسال رابط الاستعادة الآن. حاول مرة أخرى بعد قليل.")
        return
      }

      setSent(true)
    } catch {
      setError("حدث خطأ في الاتصال. تحقق من الإنترنت وحاول مجدداً.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell auth-recovery-page" dir="rtl">
      <div className="auth-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-orb auth-orb-two" aria-hidden="true" />
      <div className="auth-grid" aria-hidden="true" />

      <div className="auth-layout auth-recovery-layout">
        <section className="auth-card auth-recovery-card">
          <div className="auth-card-top">
            <span className="auth-status">
              <span className="auth-status-dot" />
              استعادة الوصول إلى حسابك
            </span>
            <AuthThemeToggle />
          </div>

          <BrandLogo />

          <div className="auth-heading">
            <div className="auth-heading-icon" aria-hidden="true">✉</div>
            <h1>نسيت كلمة المرور؟</h1>
            <p>
              لا تقلق، أدخل بريدك الإلكتروني وسنرسل إليك رابطاً آمناً
              لإعادة تعيين كلمة المرور.
            </p>
          </div>

          {error && (
            <div className="auth-error" role="alert" aria-live="polite">
              <span className="auth-error-symbol">!</span>
              <span>{error}</span>
            </div>
          )}

          {sent ? (
            <div className="auth-recovery-success" role="status" aria-live="polite">
              <span className="auth-recovery-success-icon">✓</span>
              <strong>تم إرسال طلب الاستعادة</strong>
              <p>
                إذا كان البريد مسجلاً لدينا، فستصلك رسالة تحتوي على رابط
                إعادة تعيين كلمة المرور. تحقق أيضاً من مجلد الرسائل غير المرغوب فيها.
              </p>
              <span className="auth-recovery-email">{email.trim()}</span>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="recovery-email">البريد الإلكتروني</label>
                <div className="auth-input-wrap" dir="ltr">
                  <input
                    id="recovery-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    disabled={loading}
                    dir="ltr"
                  />
                </div>
              </div>

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "جارٍ إرسال رابط الاستعادة..." : "إرسال رابط الاستعادة"}
              </button>
            </form>
          )}

          <div className="auth-recovery-back">
            <Link href="/login">العودة إلى تسجيل الدخول</Link>
          </div>

          <footer className="auth-footer">
            <span>JASSAS SOFT PRO</span>
            <span className="auth-footer-separator">•</span>
            <span>حسابك محمي معنا</span>
          </footer>
        </section>
      </div>
    </main>
  )
}
