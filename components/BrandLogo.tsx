'use client'

type BrandLogoProps = {
  compact?: boolean
}

export default function BrandLogo({ compact = false }: BrandLogoProps) {
  const size = compact ? 66 : 94

  return (
    <div
      dir="rtl"
      aria-label="جساس نت كرت - Jassas Net Card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: compact ? 7 : 12,
        userSelect: 'none',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          boxSizing: 'border-box',
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          borderRadius: compact ? 19 : 27,
          background:
            'radial-gradient(circle at 28% 15%, rgba(0,217,255,.19), transparent 42%), linear-gradient(145deg, #171d35 0%, #171329 58%, #24203a 100%)',
          border: '1px solid rgba(212,175,55,.72)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,.15), 0 9px 28px rgba(0,0,0,.32), 0 0 25px rgba(124,58,237,.16)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 5,
            border: '1px solid rgba(148,163,184,.28)',
            borderRadius: compact ? 14 : 21,
            pointerEvents: 'none',
          }}
        />

        <svg
          width={compact ? 51 : 72}
          height={compact ? 51 : 72}
          viewBox="0 0 100 100"
          fill="none"
          role="img"
          aria-label="رمز جساس نت كرت للشبكات وكروت الإنترنت"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* موجات اتصال الشبكة */}
          <path
            d="M36 24 Q50 11 64 24"
            stroke="#00D9FF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M42 30 Q50 23 58 30"
            stroke="#9B8AFB"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="35" r="2.7" fill="#E7C76A" />

          {/* كرت إنترنت بتفاصيل معدنية */}
          <path
            d="M22 42 Q22 37 27 37 H73 Q78 37 78 42 V72 Q78 77 73 77 H27 Q22 77 22 72 Z"
            fill="#171C31"
            stroke="#C7D2E2"
            strokeWidth="1.8"
          />
          <path
            d="M27 42 H73"
            stroke="#00D9FF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M30 67 H39"
            stroke="#D4AF37"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M44 67 H51"
            stroke="#94A3B8"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* حرف J كعلامة مميزة */}
          <path
            d="M61 47 V60 Q61 68 53 68 Q48 68 45 64"
            stroke="#D9B85F"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M61 47 H69"
            stroke="#00D9FF"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* لمسات بنفسجية وذهبية */}
          <circle cx="28" cy="49" r="2" fill="#A78BFA" />
          <circle cx="72" cy="71" r="2" fill="#D4AF37" />
        </svg>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '18%',
            right: '18%',
            height: 2,
            borderRadius: 99,
            background:
              'linear-gradient(90deg, #00D9FF, #8B5CF6, #D4AF37)',
            opacity: 0.95,
          }}
        />
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: compact ? 18 : 27,
            fontWeight: 900,
            lineHeight: 1.35,
            letterSpacing: '.15px',
            background:
              'linear-gradient(100deg, #55DDF7 0%, #B5A2FF 48%, #F1D486 90%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 10px rgba(124,58,237,.14))',
          }}
        >
          جساس نت كرت
        </div>

        <div
          dir="ltr"
          style={{
            marginTop: 3,
            color: '#D4DCEB',
            fontSize: compact ? 10 : 13,
            fontWeight: 800,
            letterSpacing: compact ? 1 : 1.5,
            lineHeight: 1.5,
          }}
        >
          JASSAS NET CARD
        </div>

        {!compact && (
          <>
            <div
              style={{
                width: 54,
                height: 1,
                margin: '9px auto 8px',
                background:
                  'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              }}
            />
            <div
              style={{
                color: '#AAB5CA',
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.9,
              }}
            >
              إدارة كروت المايكروتك باحتراف وأمان
            </div>
          </>
        )}
      </div>
    </div>
  )
}
