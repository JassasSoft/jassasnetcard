import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Jassas Net Card - نظام إدارة شبكات المايكروتك",
  description: "نظام إدارة شبكات المايكروتك وطباعة كروت الإنترنت",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JassasNet"
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#00ffff" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0a0e27" }}>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then((reg) => {
                  console.log('SW registered:', reg)
                }).catch((err) => {
                  console.log('SW registration failed:', err)
                })
              })
            }
          `
        }} />
      </body>
    </html>
  )
}
