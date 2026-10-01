import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'جساس نت كارت - Jassas Net Card',
  description: 'نظام إدارة شبكات المايكروتك وتوليد كروت الإنترنت',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#0f3460" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
