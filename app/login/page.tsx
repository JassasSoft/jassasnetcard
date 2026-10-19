"use client"

import { Suspense, useState, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import BrandLogo from "@/components/BrandLogo"
import { createClient } from "@/lib/supabase/client"

type IconName = "mail" | "lock" | "eye" | "eye-off" | "shield" | "arrow" | "wifi"

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  }

  switch (name) {
    case "mail":
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>
    case "lock":
      return <svg {...common}><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v3" /></svg>
    case "eye":
      return <svg {...common}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
    case "eye-off":
      return <svg {...common}><path d="m3 3 18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.9M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7c1.2 0 2.3-.2 3.3-.6" /></svg>
    case "shield":
      return <svg {...common}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></svg>
    case "arrow":
      return <svg {...common}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    case "wifi":
      return <svg {...common}><path d="M5 9a11 11 0 0 1 14 0" /><path d="M8 12a6.5 6.5 0 0 1 8 0" /><path d="M10.5 15a2.5 2.5 0 0 1 3 0" /><circle cx="12" cy="18" r=".8" fill="currentColor" /></svg>
  }
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (!email.trim() || !password) {
      setError("أدخل البريد الإلكتروني وكلمة المرور للمتابعة.")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        if (authError.message.toLowerCase().includes("email not confirmed")) {
          setError("يرجى تأكيد بريدك الإلكتروني أولاً، ثم حاول تسجيل الدخول.")
        } else {
          setError("تعذّر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.")
        }
        setLoading(false)
        return
      }

      const redirectTo = searchParams.get("redirect")
      const safeRedirect =
        redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
          ? redirectTo
          : "/dashboard"

      router.replace(safeRedirect)
      router.refresh()
    } catch {
      setError("تعذر الاتصال بالخدمة الآن. تحقق من الإنترنت وحاول مجدداً.")
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell" dir="rtl">
      <div className="auth-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-orb auth-orb-two" aria-hidden="true" />
      <div className="auth-grid" aria-hidden="true" />

      <div className="auth-layout">
        <section className="auth-card" aria-labelledby="login-heading">
          <div className="auth-card-top">
            <span className="auth-status">
              <span className="auth-status-dot" />
              بوابتك لإدارة الشبكة
            </span>
            <span className="auth-version">JNC · SECURE ACCESS</span>
          </div>

          <BrandLogo />

          <div className="auth-heading">
            <div className="auth-heading-icon">
              <Icon name="wifi" size={22} />
            </div>
            <h1 id="login-heading">مرحباً بعودتك</h1>
            <p>سجّل دخولك وتابع إدارة كروت الإنترنت بكل سهولة.</p>
          </div>

          {error && (
            <div className="auth-error" role="alert" aria-live="polite">
              <span className="auth-error-symbol">!</span>
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label htmlFor="login-email">البريد الإلكتروني</label>
              <div className="auth-input-wrap" dir="ltr">
                <span className="auth-input-icon"><Icon name="mail" /></span>
                <input
                  id="login-email"
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

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="login-password">كلمة المرور</label>
                <span className="auth-label-hint">محميّة بتشفير آمن</span>
              </div>
              <div className="auth-input-wrap" dir="ltr">
                <span className="auth-input-icon"><Icon name="lock" /></span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="أدخل كلمة المرور"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  dir="auto"
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  aria-pressed={showPassword}
                  disabled={loading}
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} size={19} />
                </button>
              </div>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner" aria-hidden="true" />
                  جارٍ التحقق من بياناتك...
                </>
              ) : (
                <>
                  <span>دخول إلى حسابي</span>
                  <span className="auth-submit-icon"><Icon name="arrow" size={19} /></span>
                </>
              )}
            </button>
          </form>

          <div className="auth-secure-note">
            <Icon name="shield" size={17} />
            <span>جلسة دخول آمنة لحماية حسابك وبيانات شبكتك</span>
          </div>

          <div className="auth-register">
            <span>جديد في جساس نت كرت؟</span>
            <Link href="/register">
              إنشاء حساب جديد
              <Icon name="arrow" size={15} />
            </Link>
          </div>

          <footer className="auth-footer">
            <span>JASSAS SOFT PRO</span>
            <span className="auth-footer-separator">•</span>
            <span>تقنية تُسهّل إدارة شبكتك</span>
          </footer>
        </section>

        <aside className="auth-side" aria-label="مميزات جساس نت كرت">
          <div className="auth-side-kicker">
            <span className="auth-side-line" />
            SMART NETWORK MANAGEMENT
          </div>
          <h2>
            شبكتك في يدك،
            <span> وإدارتك بمستوى آخر.</span>
          </h2>
          <p>
            تجربة أكثر تنظيماً لإدارة كروت الإنترنت، مع واجهة صُممت لتمنحك
            وضوحاً وسرعة وراحة في الاستخدام.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <span className="auth-feature-icon feature-cyan"><Icon name="wifi" size={21} /></span>
              <span><strong>إدارة أذكى</strong><small>أدوات واضحة وسير عمل منظم</small></span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon feature-purple"><Icon name="shield" size={21} /></span>
              <span><strong>حسابك أولاً</strong><small>تجربة دخول معتمدة على المصادقة الحقيقية</small></span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon feature-gold"><Icon name="lock" size={21} /></span>
              <span><strong>جاهزة لهاتفك</strong><small>واجهة مرنة ومريحة على الشاشات الصغيرة</small></span>
            </div>
          </div>

          <div className="auth-side-bottom">
            <span className="auth-side-ring"><Icon name="wifi" size={19} /></span>
            <span>JASSAS NET CARD</span>
            <span className="auth-side-bottom-dot" />
            <span>CONNECT · MANAGE · GROW</span>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="auth-loading" dir="rtl">
          <span className="auth-spinner" aria-hidden="true" />
          <span>جارٍ تجهيز صفحة الدخول...</span>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
