import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import "./AttentionGame.css";

export type Direction = "up" | "down" | "left" | "right";
export type Feedback = "correct" | "wrong" | null;

export interface ShuttlePosition {
  x: number;
  y: number;
  direction: Direction;
  isTarget: boolean;
}

interface AttentionGameProps {
  score: number;
  timeLeft: number;
  streak: number;
  multiplier: number;
  showMultiplierAnimation: boolean;
  isGameActive: boolean;
  isPaused: boolean;
  countdown: number;
  shuttles: ShuttlePosition[];
  feedback: Feedback;
  showShuttles: boolean;
  totalAnswers: number;
  correctAnswers: number;
  shuttleCount: number;
  onAnswer: (dir: Direction) => void;
  onRestart: () => void;
  onTogglePause: () => void;
  onExit: () => void;
}

const rotationFor = (d: Direction): number => {
  switch (d) {
    case "up": return 0;
    case "right": return 90;
    case "down": return 180;
    case "left": return -90;
  }
};

const AttentionGame: React.FC<AttentionGameProps> = ({
  score,
  timeLeft,
  streak,
  multiplier,
  showMultiplierAnimation,
  isGameActive,
  isPaused,
  countdown,
  shuttles,
  feedback,
  showShuttles,
  totalAnswers,
  correctAnswers,
  onRestart,
  onTogglePause,
  onExit,
}) => {
  const accuracy = totalAnswers === 0 ? 0 : Math.round((correctAnswers / totalAnswers) * 100);

  // Game over screen
  if (!isGameActive && timeLeft === 0) {
    return (
      <div className="attentionGameWrapper">
        <div className="game-over-card">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Game Over!
          </Typography>
          <Box sx={{ my: 3 }}>
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{ 
                mb: 2,
                animation: 'slideIn 0.5s ease',
                '@keyframes slideIn': {
                  from: { opacity: 0, transform: 'translateX(-20px)' },
                  to: { opacity: 1, transform: 'translateX(0)' }
                }
              }}
            >
              Final Score:{" "}
              <span style={{ 
                color: "#ed6c02", 
                fontWeight: "bold",
                fontSize: '1.8rem'
              }}>
                {score}
              </span>
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{
                animation: 'slideIn 0.6s ease',
                animationDelay: '0.1s',
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              Correct Answers: <strong>{correctAnswers}</strong> / {totalAnswers}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                mt: 1,
                animation: 'slideIn 0.7s ease',
                animationDelay: '0.2s',
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              Accuracy: <strong style={{ 
                color: accuracy >= 80 ? '#22c55e' : accuracy >= 60 ? '#eab308' : '#ef4444' 
              }}>{accuracy}%</strong>
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mt: 3,
                fontStyle: 'italic',
                animation: 'slideIn 0.8s ease',
                animationDelay: '0.3s',
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              Higher accuracy indicates strong selective attention and focus.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="warning"
            size="large"
            fullWidth
            onClick={onRestart}
            sx={{ mt: 2 }}
          >
            Play Again
          </Button>
          <Button
            variant="text"
            color="inherit"
            onClick={onExit}
            sx={{ mt: 1 }}
          >
            Home
          </Button>
        </div>
      </div>
    );
  }

  // Active game view
  return (
  <>
    <Button
      variant="text"
      startIcon={<ArrowBackIcon />}
      onClick={onExit}
      sx={{
        position: 'fixed',
        top: '100px',
        left: '120px',
        zIndex: 9999,
        fontWeight: 600,
        '&:hover': {
          color: '#ea580c',
        }
      }}
    >
      Other Games
    </Button><div className="attentionGameWrapper">
        {/* Other Games Button - positioned absolutely */}

        <div className="game-container-wrapper">
          <div className="game-card">
            {/* Pause Button */}
            <div className="pause-button-wrapper">
              <IconButton
                onClick={onTogglePause}
                sx={{
                  bgcolor: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(4px)",
                  "&:hover": { bgcolor: "white" },
                }}
              >
                {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
              </IconButton>
            </div>

            {/* Game Container */}
            <div className="gameContainer">
              {/* Background stars */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="star"
                    style={{
                      width: `${Math.random() * 3 + 1}px`,
                      height: `${Math.random() * 3 + 1}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      opacity: Math.random() * 0.7 + 0.3,
                    }} />
                ))}
              </div>

              {/* Stats Row */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  display: "flex",
                  zIndex: 10,
                }}
              >
                <div
                  className="stat-box"
                  style={{
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                    borderRight: "none",
                  }}
                >
                  <div className="stat-label">Time</div>
                  <div className="stat-value">{timeLeft}s</div>
                </div>
                <div className="stat-box" style={{ borderRight: "none" }}>
                  <div className="stat-label">Score</div>
                  <div className="stat-value">{score}</div>
                </div>
                <div
                  className="multiplier-box"
                  style={{
                    borderTopRightRadius: 6,
                    borderBottomRightRadius: 6,
                  }}
                >
                  <div className="stat-label">Multiplier</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4 }}>
                    <div className="multiplier-dots">
                      {[0, 1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`multiplier-dot ${idx < streak ? "active" : ""}`} />
                      ))}
                    </div>
                    <span
                      className={`multiplier-value ${showMultiplierAnimation ? "animated" : ""}`}
                    >
                      {multiplier}x
                    </span>
                  </div>
                </div>
              </Box>

              {/* Countdown */}
              {countdown > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 30,
                  }}
                >
                  <div className="countdown-circle">
                    <span className="countdown-number">{countdown}</span>
                  </div>
                </Box>
              )}

              {/* Pause Overlay */}
              {isPaused && countdown === 0 && (
                <div className="pause-overlay">
                  <Box sx={{ textAlign: "center", color: "white" }}>
                    <PauseIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h4" fontWeight="bold">
                      Paused
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={onTogglePause}
                      sx={{ mt: 2 }}
                    >
                      Resume
                    </Button>
                  </Box>
                </div>
              )}

              {/* Shuttles */}
              {countdown === 0 && !isPaused && (
                <div style={{ position: "absolute", inset: 0 }}>
                  {shuttles.map((s, idx) => (
                    <div
                      key={idx}
                      className={`shuttle-wrapper ${showShuttles ? "visible" : "hidden"}`}
                      style={{
                        left: s.x,
                        top: s.y,
                      }}
                    >
                      <div
                        style={{
                          transform: `rotate(${rotationFor(s.direction)}deg)`,
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <svg
                          width={s.isTarget ? 80 : 60}
                          height={s.isTarget ? 80 : 60}
                          viewBox="0 0 100 100"
                          style={{
                            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
                          }}
                        >
                          <path
                            d="M50 10 L70 50 L70 70 L60 80 L40 80 L30 70 L30 50 Z"
                            fill={s.isTarget ? "#60a5fa" : "#94a3b8"}
                            stroke="#1e293b"
                            strokeWidth="2" />
                          <circle cx="50" cy="40" r="8" fill="#38bdf8" opacity="0.8" />
                          <path
                            d="M30 50 L10 60 L20 65 L30 60 Z"
                            fill="#cbd5e1"
                            stroke="#1e293b"
                            strokeWidth="1" />
                          <path
                            d="M70 50 L90 60 L80 65 L70 60 Z"
                            fill="#cbd5e1"
                            stroke="#1e293b"
                            strokeWidth="1" />
                          <ellipse cx="50" cy="85" rx="8" ry="4" fill="#f97316" opacity="0.6" />
                        </svg>
                      </div>
                    </div>
                  ))}

                  {/* Feedback */}
                  {feedback && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 20,
                      }}
                    >
                      <div className={`feedback-circle ${feedback}`}>
                        {feedback === "correct" ? (
                          <CheckCircleIcon sx={{ fontSize: 80, color: "white" }} />
                        ) : (
                          <CancelIcon sx={{ fontSize: 80, color: "white" }} />
                        )}
                      </div>
                    </Box>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div></>
  );
};

export default AttentionGame;