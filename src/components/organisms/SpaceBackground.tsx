import React from "react";
import { Star } from "../atoms/Star";

interface SpaceBackgroundProps {
  starCount?: number;
}

export function SpaceBackground({ starCount = 50 }: SpaceBackgroundProps) {
  const stars = React.useMemo(
    () =>
      Array.from({ length: starCount }).map((_, i) => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        opacity: Math.random() * 0.7 + 0.3,
      })),
    [starCount]
  );

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {stars.map((star, i) => (
        <Star key={i} style={star} />
      ))}
    </div>
  );
}