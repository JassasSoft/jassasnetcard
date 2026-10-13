"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import BrandLogo from "@/components/BrandLogo"
import { createClient } from "@/lib/supabase/client"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      setError("الرجاء إدخال البريد الإلكتروني وكلمة المرور")
      return
    }

    setLoading(true)
    setError("")

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        if (
          error.message.toLowerCase().includes("email not confirmed")
        ) {
          setError("يجب تأكيد البريد الإلكتروني أولاً")
        } else {
          setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
        }

        setLoading(false)
        return
      }

      const redirectTo = searchParams.get("redirect")

      router.replace(
        redirectTo && redirectTo.startsWith("/")
          ? redirectTo
          : "/dashboard"
      )

      router.refresh()
    } catch {
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.")
      setLoading(false)
    }
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
          maxWidth: "450px",
          padding: "36px",
          borderRadius: "28px",
          background: "rgba(15,23,42,.76)",
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
            marginTop: "30px",
            marginBottom: "25px",
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
            تسجيل الدخول
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
              margin: 0,
            }}
          >
            ادخل إلى لوحة إدارة شبكتك بأمان
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,.12)",
              border: "1px solid rgba(239,68,68,.45)",
              color: "#fca5a5",
              padding: "13px",
              borderRadius: "13px",
              marginBottom: "18px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              color: "#e2e8f0",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            البريد الإلكتروني
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            autoComplete="email"
            disabled={loading}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              marginBottom: "18px",
              background: "rgba(2,6,23,.72)",
              border: "1px solid rgba(0,217,255,.25)",
              borderRadius: "14px",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <label
            style={{
              display: "block",
              color: "#e2e8f0",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            كلمة المرور
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={loading}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              marginBottom: "24px",
              background: "rgba(2,6,23,.72)",
              border: "1px solid rgba(0,217,255,.25)",
              borderRadius: "14px",
              color: "#fff",
              fontSize: "16px",
              outline: "none",
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
            {loading ? "جاري التحقق..." : "دخول آمن"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          ليس لديك حساب؟{" "}
          <Link
            href="/register"
            style={{
              color: "#67e8f9",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </main>
  )
}


export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main
          dir="rtl"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#080b15",
            color: "#e2e8f0",
            fontFamily: "Segoe UI, Tahoma, Arial, sans-serif",
          }}
        >
          جاري تجهيز صفحة الدخول...
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
