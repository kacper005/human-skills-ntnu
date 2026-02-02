import React from "react";

interface StreakDotProps {
  filled: boolean;
  animated?: boolean;
}

export function StreakDot({ filled, animated = false }: StreakDotProps) {
  return (
    <div
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        background: filled ? "#4ade80" : "rgba(255, 255, 255, 0.2)",
        transform: filled ? "scale(1.1)" : "scale(1)",
        transition: "all 0.3s ease",
        animation: animated ? "pulse 2s ease-in-out infinite" : "none",
      }}
    />
  );
}