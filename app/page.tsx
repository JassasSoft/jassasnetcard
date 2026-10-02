"use client"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    window.location.href = "/login"
  }, [])
  return <div style={{ minHeight: "100vh", background: "#0a0e27", color: "#00ffff", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>
}
