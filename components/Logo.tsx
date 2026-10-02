"use client"

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const sizes = {
    small: { width: 40, height: 40, fontSize: 14 },
    medium: { width: 80, height: 80, fontSize: 20 },
    large: { width: 120, height: 120, fontSize: 28 }
  }
  
  const s = sizes[size]
  
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: size === 'large' ? "20px" : "10px" }}>
      <div style={{
        width: s.width,
        height: s.height,
        background: "linear-gradient(135deg, #00ffff 0%, #a855f7 100%)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 20px rgba(0,255,255,0.5)",
        border: "2px solid rgba(255,255,255,0.3)",
        fontSize: s.fontSize,
        fontWeight: "bold",
        color: "#0a0e27"
      }}>
        JNC
      </div>
      {size !== 'small' && (
        <div>
          <h1 style={{ 
            color: "#00ffff", 
            fontSize: size === 'large' ? 32 : 24, 
            margin: 0,
            textShadow: "0 0 10px rgba(0,255,255,0.5)",
            textAlign: "center"
          }}>
            Jassas Net Card
          </h1>
        </div>
      )}
    </div>
  )
}
