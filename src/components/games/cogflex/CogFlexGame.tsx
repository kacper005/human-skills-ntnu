"use client";

import { useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip, 
} from "@mui/material";
import {
  StatsBox,
  StatsContainer,
} from "../../molecules";
import { Pause, PlayArrow } from "@mui/icons-material";
import type { Feedback } from "../types";
import { useCogFlexGameController, type Card, type CardShape, type CardColor } from "./CogFlexGameController";
import { GameHeader } from "../../organisms";
import { useNavigate } from "react-router-dom";

const COLOR_MAP: Record<CardColor, string> = {
  red: "#e57373",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
}

function Shape({ shape, color, size = 24 }: { shape: CardShape; color: CardColor; size?: number }) {
  const fill = COLOR_MAP[color]

  switch (shape) {
    case "circle":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill={fill} />
        </svg>
      )
    case "square":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="2" fill={fill} />
        </svg>
      ) 
    case "triangle":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <polygon points="12,2 22,22 2,22" fill={fill} />
        </svg>
      )
    case "star":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <polygon points="12,2 15,9 22,9 16,14 18,22 12,18 6,22 8,14 2,9 9,9" fill={fill} />
        </svg>
      )
    default:
      return null
  }
}

function CardDisplay({
  card,
  onClick,
  isOption = false,
  feedback = null,
}: {
  card: Card
  onClick?: () => void
  isOption?: boolean
  feedback?: Feedback | null
}) {
  const borderColor = feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : "#e2e8f0"

  return (
    <Paper
      component="button"
      onClick={onClick}
      disabled={!isOption}
      elevation={4}
      sx={{
        p: 2,
        width: isOption ? 120 : 160,
        height: isOption ? 150 : 180,
        borderRadius: 3,
        border: `3px solid ${borderColor}`,
        cursor: isOption ? "pointer" : "default",
        transition: "all 0.2s",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        "&:hover": isOption ? { transform: "scale(1.05)", boxShadow: 8 } : {},
      }}
    >
      {Array.from({ length: card.count }).map((_, i) => (
        <Shape key={i} shape={card.shape} color={card.color} size={isOption ? 28 : 36} />
      ))}
    </Paper>
  )
}

function GameOverBackground() {
  const particles = useMemo(() => 
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      color: ["#f97316", "#7c3aed", "#22c55e", "#3b82f6", "#eab308"][Math.floor(Math.random() * 5)],
    })), [])

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
      }}
    >
      {particles.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            bgcolor: p.color,
            opacity: 0.6,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0) scale(1)", opacity: 0.6 },
              "50%": { transform: "translateY(-20px) scale(1.2)", opacity: 1 },
            },
          }}
        />
      ))}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "pulse 4s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
            "50%": { transform: "scale(1.2)", opacity: 0.8 },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "pulse 5s ease-in-out 1s infinite",
        }}
      />
      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Box
          key={`star-${i}`}
          sx={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 2,
            height: 2,
            bgcolor: "white",
            borderRadius: "50%",
            animation: `twinkle ${Math.random() * 2 + 1}s ease-in-out ${Math.random()}s infinite`,
            "@keyframes twinkle": {
              "0%, 100%": { opacity: 0.3 },
              "50%": { opacity: 1 },
            },
          }}
        />
      ))}
    </Box>
  )
}


export function CogFlexGame() {
  const game = useCogFlexGameController()
  const navigate = useNavigate()

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  useEffect(() => {
    game.startGame()
  }, [])
  
  const handleBack = () => {
    game.stopGame()
    navigate("/home")
  }

  if (game.isGameOver) {
    return (
      <Box sx={{ minHeight: "100vh", position: "relative" }}>
        <GameOverBackground />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <GameHeader onBack={handleBack} />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 4, minHeight: "calc(100vh - 80px)" }}>
            <Paper
              elevation={24}
              sx={{
                p: 6,
                maxWidth: 450,
                width: "100%",
                textAlign: "center",
                borderRadius: 4,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
              }}
              >
                <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: "#1e293b" }}>
                  Game Over
                </Typography>
                <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography variant="h5" sx={{ color: "#475569" }}>
                    Score: <Box component="span" sx={{ color: "#f97316", fontWeight: "bold" }}>{game.score}</Box>
                </Typography>
                <Typography variant="h6" sx={{ color: "#64748b" }}>
                  Correct: {game.correctAnswers} / {game.totalAnswers}
                </Typography>
                <Typography variant="h6" sx={{ color: "#64748b" }}>
                  Accuracy: {game.accuracy}%
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8", mt: 2 }}>
                  This game measures your cognitive flexibility - the ability to adapt to changing rules.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button variant="contained" size="large" onClick={game.startGame} sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" } }}>
                  Play Again
                </Button>
                <Button variant="outlined" size="large" onClick={handleBack}>
                  Home
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#e2e8f0", overflow: "hidden"}} >
      <GameHeader onBack={handleBack} />
      
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Paper elevation={8} sx={{ p: 2, borderRadius: 3, border: "2px solid #99f6e4" }}>
          <IconButton
            onClick={game.togglePause}
            sx={{ position: "absolute", top: 8, right: 8, bgcolor: "rgba(0,0,0,0.1)" }}
          >
            {game.isPaused ? <PlayArrow /> : <Pause />}
          </IconButton>

          <Box
            sx={{
              position: "relative",
              width: 950,
              height: 500,
              borderRadius: 2,
              overflow: "hidden",
              background: "linear-gradient(to bottom, #f1f5f9, #e2e8f0)",
            }}
          >
            <StatsContainer>
                          <StatsBox label="Time" value={`${game.timeLeft}s`} width="90px" />
                          <StatsBox label="Score" value={game.score} width="90px" />
                          <StatsBox
                            label="Correct"
                            width="150px"
                            isLast
                            value={<span style={{ fontWeight: "bold" }}>{game.correctAnswers}</span>
                            }
                          />
              </StatsContainer>
            {game.showRuleHint && (
              <Chip
                label="Pattern Changed!"
                sx={{
                  position: "absolute",
                  top: 60,
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: "#fbbf24",
                  color: "#78350f",
                  fontWeight: "bold",
                  animation: "bounce 0.5s ease infinite",
                  "@keyframes bounce": {
                    "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
                    "50%": { transform: "translateX(-50%) translateY(-10px)" },
                  },
                }}
              />
            )}

            {game.countdown > 0 && (
              <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(0,0,0,0.5)", zIndex: 20 }}>
                <Typography variant="h1" sx={{ color: "white", fontWeight: "bold" }}>{game.countdown}</Typography>
              </Box>
            )}

            {game.isPaused && game.countdown === 0 && (
              <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(0,0,0,0.7)", zIndex: 20 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" sx={{ color: "white", mb: 2 }}>Paused</Typography>
                  <Button variant="contained" onClick={game.togglePause}>Resume</Button>
                </Box>
              </Box>
            )}

            {game.countdown === 0 && !game.isPaused && game.masterCard && (
              <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", py: 4 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {game.optionCards.map((card, index) => (
                    <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">{index + 1}</Typography>
                      <CardDisplay card={card} isOption onClick={() => game.handleCardSelect(index)} feedback={game.feedback} />
                    </Box>
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Match by: <b>Color</b>, <b>Shape</b>, or <b>Number</b>
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">Match this card:</Typography>
                  <CardDisplay card={game.masterCard} />
                </Box>

                {game.feedback && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: game.feedback === "correct" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                      pointerEvents: "none",
                    }}
                  >
                    <Typography variant="h2" fontWeight="bold" sx={{ color: game.feedback === "correct" ? "#22c55e" : "#ef4444" }}>
                      {game.feedback === "correct" ? "Correct!" : "Try Again"}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Tip */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Chip label="Tip: Use keys 1-4 to quickly select cards" size="small" />
      </Box>
    </Box>
  )
}

export default CogFlexGame