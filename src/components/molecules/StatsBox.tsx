import React from "react";

interface StatsBoxProps {
  label: string;
  value: React.ReactNode;
  width?: string;
  variant?: "dark" | "light";
  isLast?: boolean;
}

export function StatsBox({
  label,
  value,
  width = "90px",
  variant = "dark",
  isLast = false,
}: StatsBoxProps) {
  const bgClass = variant === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.6)";
  const textClass = variant === "dark" ? "white" : "#334155";
  const labelClass = variant === "dark" ? "rgba(255, 255, 255, 0.7)" : "#64748b";
  const borderRight = isLast ? "" : "1px solid rgba(255, 255, 255, 0.2)";

  return (
    <div
      style={{
        background: bgClass,
        padding: "8px 16px",
        borderRight,
        width,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "10px", color: labelClass, marginBottom: "4px" }}>{label}</div>
      <div style={{ fontSize: "14px", fontWeight: "600", color: textClass }}>{value}</div>
    </div>
  );
}

interface StatsContainerProps {
  children: React.ReactNode;
}

export function StatsContainer({ children }: StatsContainerProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        zIndex: 10,
        display: "flex",
      }}
    >
      {children}
    </div>
  );
}