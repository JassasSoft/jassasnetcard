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
            <linearGradient id="brand-cyan" x1="20" y1="15" x2="78" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#70F0FF" />
              <stop offset="1" stopColor="#00B8E5" />
            </linearGradient>
            <linearGradient id="brand-gold" x1="35" y1="35" x2="72" y2="76" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE8A3" />
              <stop offset="1" stopColor="#C49A35" />
            </linearGradient>
          </defs>

          <path d="M34 20C43 11 57 11 66 20" stroke="url(#brand-cyan)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M40 27C46 21 54 21 60 27" stroke="#A99AFF" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M46 33C48.5 31 51.5 31 54 33" stroke="#E9CC75" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="38" r="2.4" fill="#F6D887" />

          <path
            d="M19 45C19 41.7 21.7 39 25 39H75C78.3 39 81 41.7 81 45V72C81 75.3 78.3 78 75 78H25C21.7 78 19 75.3 19 72V45Z"
            fill="#10172C"
            stroke="#B9C8DD"
            strokeWidth="1.6"
          />
          <path d="M22 46H78" stroke="url(#brand-cyan)" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M27 51H39" stroke="#8B9CB6" strokeWidth="2" strokeLinecap="round" />
          <path d="M27 57H35" stroke="#8B9CB6" strokeWidth="2" strokeLinecap="round" />
          <path d="M28 69H38" stroke="#E4BD60" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M43 69H50" stroke="#8B9CB6" strokeWidth="2.5" strokeLinecap="round" />

          <path d="M67 50V63C67 68 64 71 59 71C55.5 71 53 69.4 51 66" stroke="url(#brand-gold)" strokeWidth="5.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M67 50H74" stroke="url(#brand-cyan)" strokeWidth="4.8" strokeLinecap="round" />
          <circle cx="74" cy="69" r="2" fill="#A99AFF" />
          <circle cx="25" cy="62" r="1.8" fill="#00D9FF" />
        </svg>
        <span className="brand-mark-base" />
      </div>

      <div className="brand-copy">
        <div className="brand-name">جساس نت كرت</div>
        <div className="brand-name-en" dir="ltr">JASSAS NET CARD</div>
        {!compact && (
          <>
            <div className="brand-divider" />
            <div className="brand-tagline">إدارة كروت المايكروتك باحتراف وأمان</div>
          </>
        )}
      </div>
    </div>
  )
}
