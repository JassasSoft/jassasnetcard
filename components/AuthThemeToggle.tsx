"use client"

import { useEffect, useState } from "react"

type Theme = "light" | "dark"

export default function AuthThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jassas-auth-theme")
      const initial: Theme = saved === "dark" ? "dark" : "light"
      setTheme(initial)
      document.documentElement.setAttribute("data-auth-theme", initial)
    } catch {
      document.documentElement.setAttribute("data-auth-theme", "light")
    }
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light"
    setTheme(next)
    document.documentElement.setAttribute("data-auth-theme", next)

    try {
      localStorage.setItem("jassas-auth-theme", next)
    } catch {
      // The theme still works for the current page if storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      className="auth-theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "تفعيل الوضع الداكن" : "تفعيل الوضع الأبيض"}
      aria-pressed={theme === "dark"}
      title={theme === "light" ? "الوضع الداكن" : "الوضع الأبيض"}
    >
      <span className="auth-theme-toggle-icon" aria-hidden="true">
        {theme === "light" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
        )}
      </span>
      <span>{theme === "light" ? "الوضع الداكن" : "الوضع الأبيض"}</span>
    </button>
  )
}
