"use client"

interface BalloonSpriteProps {
  size: number
  risk: number // 0-1 value for color interpolation
}

// Helper to get balloon color based on risk
export function getBalloonColor(risk: number): string {
  if (risk < 0.3) return "#22c55e"
  if (risk < 0.5) return "#eab308"
  if (risk < 0.7) return "#f97316"
  return "#ef4444"
}

export function BalloonSprite({ size, risk }: BalloonSpriteProps) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size * 1.1}px`,
        transition: "all 0.1s ease-out",
      }}
    >
      <svg viewBox="0 0 100 120" style={{ width: "100%", height: "100%", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))" }}>
        <ellipse
          cx="50"
          cy="50"
          rx="40"
          ry="45"
          fill={getBalloonColor(risk)}
          style={{ transition: "fill 0.2s" }}
        />
        <ellipse cx="38" cy="35" rx="8" ry="12" fill="white" opacity="0.4" />
        <path d="M50 95 L45 105 L55 105 Z" fill="#94a3b8" />
        <path d="M45 105 Q50 115 55 105" stroke="#64748b" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

// Popped balloon display
export function PoppedBalloon() {
  return (
    <div style={{ 
      animation: "zoomIn 0.2s ease-out",
      position: "relative",
      width: "192px",
      height: "192px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <span style={{ 
        fontSize: "60px", 
        fontWeight: "bold", 
        color: "#ef4444",
        animation: "bounce 0.5s ease-in-out"
      }}>
        POP!
      </span>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "16px",
            height: "24px",
            background: "#f87171",
            borderRadius: "9999px",
            transform: `rotate(${i * 45}deg) translateY(-60px)`,
            animation: "scatter 0.5s ease-out forwards",
          }}
        />
      ))}
      <style>{`
        @keyframes zoomIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes scatter {
          to {
            transform: rotate(${Math.random() * 360}deg) translate(${80 + Math.random() * 40}px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

// Cashed out display
export function CashedOutBalloon({ value }: { value: number }) {
  return (
    <div style={{ 
      animation: "zoomIn 0.2s ease-out",
      position: "relative",
      width: "192px",
      height: "192px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: "36px", fontWeight: "bold", color: "#22c55e" }}>+{value}</span>
        <p style={{ fontSize: "18px", color: "#475569", marginTop: "8px" }}>Cashed Out!</p>
      </div>
      <style>{`
        @keyframes zoomIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}