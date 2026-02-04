import { useMemo } from "react"
import { Cloud } from "../atoms"

interface SkyBackgroundProps {
  cloudCount?: number
}

export function SkyBackground({ cloudCount = 8 }: SkyBackgroundProps) {
  const clouds = useMemo(() =>
    Array.from({ length: cloudCount }).map(() => ({
      width: `${60 + Math.random() * 80}px`,
      height: `${30 + Math.random() * 40}px`,
      top: `${Math.random() * 60}%`,
      left: `${Math.random() * 100}%`,
    })),
    [cloudCount]
  )

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {clouds.map((cloud, i) => (
        <Cloud key={i} style={cloud} />
      ))}
    </div>
  )
}