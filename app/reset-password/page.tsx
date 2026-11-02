"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import BrandLogo from "@/components/BrandLogo"
import AuthThemeToggle from "@/components/AuthThemeToggle"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [checking, setChecking] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    const checkSession = async () => {
      try {
        const supabase = createClient()
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (!active) return

        setHasSession(!sessionError && Boolean(data.session))
        if (sessionError) {
          setError("تعذر التحقق من رابط الاستعادة. أعد طلب رابط جديد.")
        }
      } catch {
        if (active) {
          setError("تعذر الاتصال بالخدمة. تحقق من الإنترنت.")
        }
      } finally {
        if (active) setChecking(false)
      }
    }

    void checkSession()

    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.")
      return
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        setError("تعذر تحديث كلمة المرور. قد يكون رابط الاستعادة منتهياً؛ اطلب رابطاً جديداً.")
        return
      }

      setSuccess(true)
      setPassword("")
      setConfirmPassword("")

      // إنهاء جلسة الاستعادة بعد نجاح تحديث كلمة المرور.
      await supabase.auth.signOut()
    } catch {
      setError("حدث خطأ أثناء تحديث كلمة المرور. حاول مرة أخرى.")
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
              حماية حسابك
            </span>
            <AuthThemeToggle />
          </div>

          <BrandLogo />

          <div className="auth-heading">
            <div className="auth-heading-icon" aria-hidden="true">✦</div>
            <h1>تعيين كلمة مرور جديدة</h1>
            <p>اختر كلمة مرور جديدة وآمنة لحسابك في جساس نت كرت.</p>
          </div>

          {checking ? (
            <div className="auth-recovery-message">
              جارٍ التحقق من رابط الاستعادة...
            </div>
          ) : success ? (
            <div className="auth-recovery-success" role="status">
              <span className="auth-recovery-success-icon">✓</span>
              <strong>تم تحديث كلمة المرور بنجاح</strong>
              <p>يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.</p>
              <Link className="auth-submit auth-recovery-login" href="/login">
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          ) : !hasSession ? (
            <div className="auth-recovery-message" role="alert">
              <strong>رابط الاستعادة غير صالح أو منتهي الصلاحية.</strong>
              <p>اطلب رابط استعادة جديداً ثم افتحه من بريدك الإلكتروني.</p>
              <Link className="auth-submit auth-recovery-login" href="/forgot-password">
                طلب رابط جديد
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="auth-error" role="alert" aria-live="polite">
                  <span className="auth-error-symbol">!</span>
                  <span>{error}</span>
                </div>
              )}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label htmlFor="new-password">كلمة المرور الجديدة</label>
                  <div className="auth-input-wrap" dir="ltr">
                    <input
                      id="new-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="6 أحرف على الأقل"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="confirm-new-password">تأكيد كلمة المرور</label>
                  <div className="auth-input-wrap" dir="ltr">
                    <input
                      id="confirm-new-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="أعد كتابة كلمة المرور"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <button className="auth-submit" type="submit" disabled={loading}>
                  {loading ? "جارٍ تحديث كلمة المرور..." : "حفظ كلمة المرور الجديدة"}
                </button>
              </form>
            </>
          )}

          <div className="auth-recovery-back">
            <Link href="/login">العودة إلى تسجيل الدخول</Link>
          </div>

          <footer className="auth-footer">
            <span>JASSAS SOFT PRO</span>
            <span className="auth-footer-separator">•</span>
            <span>أمان وموثوقية</span>
          </footer>
        </section>
      </div>
    </main>
  )
}
