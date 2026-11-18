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
            <linearGradient id="jassas-gold" x1="20" y1="15" x2="80" y2="90">
              <stop stopColor="#FFF5C9" />
              <stop offset=".35" stopColor="#FFD76B" />
              <stop offset=".7" stopColor="#D99B25" />
              <stop offset="1" stopColor="#FFF0B0" />
            </linearGradient>
            <linearGradient id="jassas-wifi-gold" x1="25" y1="5" x2="75" y2="35">
              <stop stopColor="#B8F4FF" />
              <stop offset=".55" stopColor="#55CFFF" />
              <stop offset="1" stopColor="#E8C36B" />
            </linearGradient>
          </defs>

          {/* Wi-Fi */}
          <path d="M25 25C39 10 61 10 75 25"
            stroke="url(#jassas-wifi-gold)" strokeWidth="5"
            strokeLinecap="round" />
          <path d="M35 34C44 25 56 25 65 34"
            stroke="url(#jassas-wifi-gold)" strokeWidth="4"
            strokeLinecap="round" />
          <circle cx="50" cy="41" r="3.5" fill="#FFD76B" />

          {/* J - gold, never standalone blue */}
          <path
            d="M66 40V66C66 79 58 86 45 86C35 86 27 81 23 72"
            stroke="url(#jassas-gold)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Arabic ج */}
          <text
            x="43"
            y="70"
            textAnchor="middle"
            fontFamily="Tahoma, Arial, sans-serif"
            fontSize="49"
            fontWeight="900"
            fill="url(#jassas-gold)"
            stroke="#FFF0B0"
            strokeWidth=".65"
            paintOrder="stroke"
          >ج</text>

          <circle cx="27" cy="81" r="4.2" fill="#FFD76B" />
          <circle cx="26" cy="80" r="1.4" fill="#FFF8DE" />
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
