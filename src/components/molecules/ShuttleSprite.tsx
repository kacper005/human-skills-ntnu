import React from "react";

type Direction = "up" | "down" | "left" | "right";

interface ShuttleSpriteProps {
  x: number;
  y: number;
  direction: Direction;
  visible: boolean;
  size?: number;
}

export function getShuttleRotation(direction: Direction): number {
  const rotations: Record<Direction, number> = {
    up: 0,
    right: 90,
    down: 180,
    left: -90,
  };
  return rotations[direction];
}

export function ShuttleSprite({ x, y, direction, visible, size = 50 }: ShuttleSpriteProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        transition: "all 0.3s ease",
        opacity: visible ? 1 : 0,
        scale: visible ? "1" : "0.75",
      }}
    >
      <div
        style={{
          transform: `rotate(${getShuttleRotation(direction)}deg)`,
          transition: "transform 0.3s ease",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
        >
          <path
            d="M50 10 L70 50 L70 70 L60 80 L40 80 L30 70 L30 50 Z"
            fill="#60a5fa"
            stroke="#1e293b"
            strokeWidth="2"
          />
          <circle cx="50" cy="40" r="8" fill="#38bdf8" opacity="0.8" />
          <path d="M30 50 L10 60 L20 65 L30 60 Z" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1" />
          <path d="M70 50 L90 60 L80 65 L70 60 Z" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1" />
          <ellipse cx="50" cy="85" rx="8" ry="4" fill="#f97316" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}