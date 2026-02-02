import React from "react";

interface IconProps {
  children: React.ReactNode;
  className?: string;
}

export function Icon({ children, className }: IconProps) {
  return (
    <div 
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      className={className}
    >
      {children}
    </div>
  );
}

export function ArrowIcon({ direction }: { direction: "up" | "down" | "left" | "right" }) {
  const paths: Record<string, string> = {
    left: "M15 19l-7-7 7-7",
    up: "M5 15l7-7 7 7",
    down: "M19 9l-7 7-7-7",
    right: "M9 5l7 7-7 7",
  };

  return (
    <svg style={{ width: "24px", height: "24px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[direction]} />
    </svg>
  );
}

export function CheckMarkIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg style={{ width: "64px", height: "64px", color: "white" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function XIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg style={{ width: "64px", height: "64px", color: "white" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}