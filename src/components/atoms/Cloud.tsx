"use client"

import React from "react"

interface CloudProps {
  style?: React.CSSProperties
}

export function Cloud({ style }: CloudProps) {
  return (
    <div
      style={{
        position: "absolute",
        background: "white",
        borderRadius: "9999px",
        opacity: 0.8,
        filter: "blur(2px)",
        ...style,
      }}
    />
  )
}