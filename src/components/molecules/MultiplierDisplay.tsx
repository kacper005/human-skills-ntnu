import React from "react";
import { StreakDot } from "../atoms/StreakDot";

interface MultiplierDisplayProps {
  streak: number;
  multiplier: number;
  showAnimation: boolean;
  maxStreak?: number;
}

export function MultiplierDisplay({
  streak,
  multiplier,
  showAnimation,
  maxStreak = 4,
}: MultiplierDisplayProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {Array.from({ length: maxStreak }).map((_, index) => (
          <StreakDot key={index} filled={index < streak} animated={showAnimation && index < maxStreak} />
        ))}
      </div>
      <div
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          transition: "all 0.3s ease",
          transform: showAnimation ? "scale(1.25)" : "scale(1)",
          color: showAnimation ? "#4ade80" : "white",
        }}
      >
        {multiplier}x
      </div>
    </div>
  );
}