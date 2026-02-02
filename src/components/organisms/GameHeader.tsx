"use client"

import React from "react"
import { ArrowLeft } from "@mui/icons-material"
import { Button } from "@mui/material"

interface GameHeaderProps {
  onBack: () => void
}

export function GameHeader({ onBack }: GameHeaderProps) {  
  return (
    <div 
      style={{ 
        position: "fixed", 
        top: "130px", 
        left: "60px", 
        zIndex: 1000,
      }}
    >
      <Button
        variant="text"
        color="primary"
        onClick={onBack}
        startIcon={<ArrowLeft />}
        sx={{
          color: "#475569",
          "&:hover": {
            color: "#ea580c",
            backgroundColor: "rgba(234, 88, 12, 0.08)",
          },
        }}
      >
        Other Games
      </Button>
    </div>
  )
}