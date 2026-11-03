import type { Metadata, Viewport } from "next"
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
}


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#eaf8ff",
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
        <meta name="theme-color" content="#eaf8ff" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#f5f7fc" }}>
        {children}
        <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              let refreshing = false;

              navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                  refreshing = true;
                  window.location.reload();
                }
              });

              window.addEventListener('load', async () => {
                try {
                  const registration = await navigator.serviceWorker.register('/sw.js', {
                    updateViaCache: 'none',
                  });
                  await registration.update();
                } catch (error) {
                  console.warn('Service worker update failed:', error);
                }
              }, { once: true });
            }
          `,
        }}
      />
      </body>
    </html>
  )
}
