import React from "react";

interface StarProps {
  style?: React.CSSProperties;
}

export function Star({ style }: StarProps) {
  return (
    <div
      style={{
        position: "absolute",
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        background: "white",
        borderRadius: "50%",
        ...style,
      }}
    />
  );
}