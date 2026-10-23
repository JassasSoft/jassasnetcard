"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BrandLogo from "@/components/BrandLogo"
import { createClient } from "@/lib/supabase/client"

type AccountData = {
  id: string
  fullName: string
  email: string
  cardsRemaining: number
  totalCardsPrinted: number
  planType: string
  subscriptionStatus: string
  role: string
}

function DashboardIcon({
  name,
  size = 22,
}: {
  name: string
  size?: number
}) {
  const paths: Record<string, string[]> = {
    home: [
      "M3 10.5 12 3l9 7.5",
      "M5.5 9v11h13V9",
      "M9 20v-6h6v6",
    ],
    cards: [
      "M4 5.5A2.5 2.5 0 0 1 6.5 3H19",
      "M5 7h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3V6",
      "M7 12h5",
    ],
    print: [
      "M6 9V3h12v6",
      "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      "M6 14h12v7H6z",
      "M18 12h.01",
    ],
    shield: [
      "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z",
      "m9 12 2 2 4-4",
    ],
    router: [
      "M5 16h14a3 3 0 0 0 .4-6A7.5 7.5 0 0 0 5 8a4 4 0 0 0 0 8Z",
      "M8 20h8",
      "M12 16v4",
    ],
    arrow: ["M5 12h14", "m12 5 7 7-7 7"],
    logout: ["M10 17l5-5-5-5", "M15 12H3", "M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6"],
    clock: ["M12 8v4l3 2", "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"],
    package: [
      "m12 3 9 5-9 5-9-5 9-5Z",
      "m3 8 9 5 9-5",
      "M3 8v9l9 5 9-5V8",
      "M12 13v9",
    ],
    spark: [
      "m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z",
      "m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z",
    ],
    alert: [
      "M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z",
      "M12 9v4",
      "M12 17h.01",
    ],
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(paths[name] || paths.spark).map((path, index) => (
        <path key={`${name}-${index}`} d={path} />
      ))}
    </svg>
  )
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ar").format(
    Number.isFinite(value) ? value : 0
  )
}

function planLabel(value: string) {
  const labels: Record<string, string> = {
    trial: "التجربة المجانية",
    free: "الخطة المجانية",
    basic: "الخطة الأساسية",
    standard: "الخطة القياسية",
    premium: "الخطة الاحترافية",
    pro: "الخطة الاحترافية",
  }

  return labels[(value || "").toLowerCase()] || value || "الخطة الحالية"
}

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    active: "نشط",
    trialing: "تجريبي",
    pending: "قيد الانتظار",
    expired: "منتهي",
    cancelled: "ملغي",
    canceled: "ملغي",
    suspended: "موقوف",
  }

  return labels[(value || "").toLowerCase()] || value || "غير محدد"
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AccountData | null>(null)
  const [accountError, setAccountError] = useState("")
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  const loadUser = useCallback(async () => {
    setLoading(true)
    setAccountError("")

    try {
      const response = await fetch("/api/account/summary", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      })

      const result = await response.json()

      if (response.status === 401) {
        router.replace("/login")
        return
      }

      if (!response.ok || !result.success || !result.subscription) {
        setAccountError(
          result.message || "تعذر تحميل بيانات الحساب. حاول مرة أخرى."
        )
        return
      }

      setUser({
        id: result.user.id,
        fullName: result.user.fullName,
        email: result.user.email,
        cardsRemaining: Number(result.subscription.cards_remaining ?? 0),
        totalCardsPrinted: Number(
          result.subscription.total_cards_printed ?? 0
        ),
        planType: result.subscription.plan_type || "",
        subscriptionStatus: result.subscription.status || "",
        role: "customer",
      })
    } catch {
      setAccountError("تعذر الاتصال بالخادم. تحقق من الإنترنت وحاول مجددًا.")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void loadUser()
  }, [loadUser])

  const handleLogout = async () => {
    if (loggingOut) return

    setLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } finally {
      router.replace("/login")
      router.refresh()
    }
  }

  if (loading || !user) {
    return (
      <main className="dashboard-state" dir="rtl">
        <div className="dashboard-state-glow" />
        <div className="dashboard-state-card">
          <BrandLogo />
          <div className="dashboard-loader" aria-hidden="true" />
          <h1>{accountError ? "تعذر تحميل حسابك" : "مرحباً بك في جساس"}</h1>
          <p>
            {accountError || "نجهّز لوحة التحكم ونتحقق من بيانات اشتراكك..."}
          </p>
          {accountError && (
            <button
              type="button"
              className="dashboard-primary-button"
              onClick={() => void loadUser()}
            >
              إعادة المحاولة
              <DashboardIcon name="arrow" size={18} />
            </button>
          )}
          {accountError && (
            <button
              type="button"
              className="dashboard-text-button"
              onClick={() => router.replace("/login")}
            >
              العودة إلى تسجيل الدخول
            </button>
          )}
        </div>
      </main>
    )
  }

  const customerName =
    user.fullName?.trim() ||
    user.email?.split("@")[0]?.trim() ||
    "عميلنا العزيز"
  const initial = customerName.charAt(0) || "ج"
  const subscriptionActive = ["active", "trialing"].includes(
    user.subscriptionStatus.toLowerCase()
  )

  return (
    <main className="dashboard-shell" dir="rtl">
      <div className="dashboard-background-glow dashboard-glow-one" />
      <div className="dashboard-background-glow dashboard-glow-two" />

      <header className="dashboard-topbar">
        <div className="dashboard-brand">
          <BrandLogo compact />
        </div>

        <div className="dashboard-topbar-actions">
          <div className="dashboard-session-label">
            <span className="dashboard-session-dot" />
            مساحة العميل
          </div>
          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <DashboardIcon name="logout" size={17} />
            <span>{loggingOut ? "جارٍ الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        <section className="dashboard-welcome">
          <div className="dashboard-welcome-copy">
            <span className="dashboard-eyebrow">
              <DashboardIcon name="spark" size={15} />
              لوحة إدارة الشبكة
            </span>
            <h1>
              أهلاً بك، <span>{customerName}</span>
            </h1>
            <p>
              كل أدوات إدارة كروتك في مساحة واحدة، واضحة وسهلة الاستخدام.
            </p>
          </div>

          <div className="dashboard-avatar" aria-label="صورة الحساب">
            <span>{initial}</span>
            <i aria-hidden="true" />
          </div>
        </section>

        <section className="dashboard-balance-card" aria-labelledby="balance-title">
          <div className="dashboard-balance-decoration dashboard-balance-decoration-one" />
          <div className="dashboard-balance-decoration dashboard-balance-decoration-two" />

          <div className="dashboard-balance-content">
            <div className="dashboard-balance-copy">
              <div className="dashboard-balance-label">
                <span className="dashboard-balance-icon">
                  <DashboardIcon name="cards" size={21} />
                </span>
                <span id="balance-title">رصيد الكروت المتاح</span>
              </div>
              <div className="dashboard-balance-number">
                {formatNumber(user.cardsRemaining)}
              </div>
              <p>كرت متاح ضمن اشتراكك الحالي</p>
            </div>

            <button
              type="button"
              className="dashboard-balance-action"
              onClick={() => router.push("/dashboard/print-cards")}
            >
              <DashboardIcon name="print" size={19} />
              <span>إنشاء وطباعة الكروت</span>
              <DashboardIcon name="arrow" size={17} />
            </button>
          </div>

          <div className="dashboard-balance-footer">
            <span><DashboardIcon name="shield" size={15} /> رصيد مرتبط بحسابك</span>
            <span>JASSAS NET CARD</span>
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="overview-title">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-section-kicker">نظرة عامة</span>
              <h2 id="overview-title">ملخص حسابك</h2>
            </div>
            <span className="dashboard-live-label">
              <span />
              بيانات الحساب
            </span>
          </div>

          <div className="dashboard-stat-grid">
            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon stat-icon-blue">
                  <DashboardIcon name="package" size={22} />
                </span>
                <span className="dashboard-stat-caption">الرصيد الحالي</span>
              </div>
              <strong>{formatNumber(user.cardsRemaining)}</strong>
              <span className="dashboard-stat-foot">كرت متاح للطباعة</span>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon stat-icon-purple">
                  <DashboardIcon name="print" size={22} />
                </span>
                <span className="dashboard-stat-caption">إجمالي المطبوع</span>
              </div>
              <strong>{formatNumber(user.totalCardsPrinted)}</strong>
              <span className="dashboard-stat-foot">حسب سجل الاشتراك</span>
            </article>

            <article className="dashboard-stat-card dashboard-plan-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon stat-icon-gold">
                  <DashboardIcon name="shield" size={22} />
                </span>
                <span className="dashboard-stat-caption">نوع الاشتراك</span>
              </div>
              <strong className="dashboard-plan-name">{planLabel(user.planType)}</strong>
              <span className="dashboard-stat-foot">الخطة المرتبطة بحسابك</span>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon stat-icon-status">
                  <DashboardIcon name="clock" size={22} />
                </span>
                <span className="dashboard-stat-caption">حالة الاشتراك</span>
              </div>
              <strong className="dashboard-status-value">
                <span className={subscriptionActive ? "status-dot-active" : "status-dot-inactive"} />
                {statusLabel(user.subscriptionStatus)}
              </strong>
              <span className="dashboard-stat-foot">الحالة المسجلة في النظام</span>
            </article>
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="actions-title">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-section-kicker">اختصارات</span>
              <h2 id="actions-title">ماذا تريد أن تفعل؟</h2>
            </div>
          </div>

          <div className="dashboard-action-grid">
            <button
              type="button"
              className="dashboard-action-card dashboard-action-primary"
              onClick={() => router.push("/dashboard/print-cards")}
            >
              <span className="dashboard-action-icon">
                <DashboardIcon name="print" size={25} />
              </span>
              <span className="dashboard-action-copy">
                <strong>تصميم وطباعة الكروت</strong>
                <small>جهّز كروت الإنترنت واختر شكل الطباعة</small>
              </span>
              <span className="dashboard-action-arrow">
                <DashboardIcon name="arrow" size={19} />
              </span>
            </button>

            <article className="dashboard-action-card dashboard-router-card">
              <span className="dashboard-action-icon router-action-icon">
                <DashboardIcon name="router" size={25} />
              </span>
              <span className="dashboard-action-copy">
                <strong>تكامل MikroTik</strong>
                <small>تحقق من إعداد الراوتر وربطه قبل اعتماد التوليد المباشر</small>
                <span className="dashboard-integration-status">
                  <DashboardIcon name="alert" size={14} />
                  يحتاج إلى التحقق من الاتصال
                </span>
              </span>
            </article>
          </div>
        </section>

        <section className="dashboard-account-strip">
          <span className="dashboard-account-icon">
            <DashboardIcon name="shield" size={20} />
          </span>
          <div className="dashboard-account-copy">
            <strong>حسابك ومساحتك الخاصة</strong>
            <span>{user.email}</span>
          </div>
          <span className="dashboard-account-role">عميل</span>
        </section>

        <footer className="dashboard-footer">
          <BrandLogo compact />
          <p>إدارة كروت الإنترنت باحتراف وأمان</p>
          <span>JASSAS SOFT PRO · JASSAS NET CARD</span>
        </footer>
      </div>

      <nav className="dashboard-bottom-nav" aria-label="التنقل الرئيسي">
        <button
          type="button"
          className="dashboard-nav-item is-active"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-current="page"
        >
          <DashboardIcon name="home" size={21} />
          <span>الرئيسية</span>
        </button>
        <button
          type="button"
          className="dashboard-nav-item"
          onClick={() => router.push("/dashboard/print-cards")}
        >
          <DashboardIcon name="cards" size={21} />
          <span>الكروت والطباعة</span>
        </button>
        <button
          type="button"
          className="dashboard-nav-item"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <DashboardIcon name="logout" size={21} />
          <span>الخروج</span>
        </button>
      </nav>
    </main>
  )
}
