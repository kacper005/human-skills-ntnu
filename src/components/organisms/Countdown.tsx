import React from "react";

interface CountdownProps {
  value: number;
  variant?: "dark" | "light";
}

export function Countdown({ value, variant = "dark" }: CountdownProps) {
  if (value <= 0) return null;

  const bgClass = variant === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(30, 41, 59, 0.8)";
  const textColor = "white";
  const borderColor = variant === "dark" ? "rgba(255, 255, 255, 0.3)" : "#475569";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: "128px",
          height: "128px",
          background: bgClass,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `4px solid ${borderColor}`,
        }}
      >
        <span style={{ fontSize: "72px", fontWeight: "bold", color: textColor }}>{value}</span>
      </div>
    </div>
  );
}