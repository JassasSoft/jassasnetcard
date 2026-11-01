type BrandLogoProps = {
  compact?: boolean
}

export default function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div
      className={`brand-logo${compact ? " brand-logo-compact" : ""}`}
      dir="rtl"
      role="img"
      aria-label="جساس نت كرت - Jassas Net Card"
    >
      <div className="brand-mark">
        <span className="brand-mark-halo" />
        <span className="brand-mark-inner" />

        <svg
          className="brand-svg"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="jassas-j" x1="20" y1="20" x2="78" y2="85">
              <stop stopColor="#A9E9FF" />
              <stop offset="0.55" stopColor="#398BFA" />
              <stop offset="1" stopColor="#1746A2" />
            </linearGradient>
            <linearGradient id="jassas-jeem" x1="35" y1="25" x2="72" y2="80">
              <stop stopColor="#FFF0B5" />
              <stop offset="0.55" stopColor="#E8BD58" />
              <stop offset="1" stopColor="#B47A20" />
            </linearGradient>
            <linearGradient id="jassas-wifi" x1="30" y1="5" x2="70" y2="32">
              <stop stopColor="#B9F2FF" />
              <stop offset="1" stopColor="#D9B65C" />
            </linearGradient>
          </defs>

          {/* إشارة الاتصال */}
          <path
            d="M27 24C40 10 60 10 73 24"
            stroke="url(#jassas-wifi)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M36 31C44 23 56 23 64 31"
            stroke="url(#jassas-wifi)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="38" r="3" fill="#F5D47C" />

          {/* حرف J الإنجليزي */}
          <path
            d="M66 39V65C66 76 59 82 48 82C39 82 32 78 28 70"
            stroke="url(#jassas-j)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* حرف ج العربي */}
          <text
            x="43"
            y="68"
            textAnchor="middle"
            fontFamily="Tahoma, Arial, sans-serif"
            fontSize="49"
            fontWeight="900"
            fill="url(#jassas-jeem)"
            stroke="#FFF0B5"
            strokeWidth="0.6"
            paintOrder="stroke"
          >
            ج
          </text>

          {/* نقطة الجيم */}
          <circle cx="28" cy="78" r="4" fill="#F5D47C" />
          <circle cx="27" cy="77" r="1.4" fill="#FFF4D1" />
        </svg>

        <span className="brand-mark-base" />
      </div>

      <div className="brand-copy">
        <div className="brand-name">جساس نت كرت</div>
        <div className="brand-name-en" dir="ltr">JASSAS NET CARD</div>

        {!compact && (
          <>
            <div className="brand-divider" />
            <div className="brand-tagline">
              إدارة كروت المايكروتك باحتراف وأمان
            </div>
          </>
        )}
      </div>
    </div>
  )
}
