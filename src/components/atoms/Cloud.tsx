"use client"

import React from "react"

interface CloudProps {
  style?: React.CSSProperties
}

export function Cloud({ style }: CloudProps) {
  return (
    <div
      className = "absolute bg-white rounded-full opacity-80"
      style={{
        filter: "blur(2px)",
        ...style,
      }}
    />
  )
}