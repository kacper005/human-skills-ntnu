import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import type { Direction } from "../types";
import { useAttentionGameController2 } from "./AttentionGameController2";

import { ArrowIcon } from "../../atoms";
import {
  StatsBox,
  StatsContainer,
  MultiplierDisplay,
  FeedbackIndicator,
  ShuttleSprite,
} from "../../molecules";

import {
  PauseButton,
  PauseOverlay,
  Countdown,
  SpaceBackground,
  GameOverScreen,
  GameHeader,
} from "../../organisms";

interface AttentionGame2Props {
  onBack?: () => void;
}

export function AttentionGame2({ onBack }: AttentionGame2Props) {
  const navigate = useNavigate();
  const game = useAttentionGameController2();

  const handleBack = React.useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigate("/home")
    }
  }, [navigate]);

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  React.useEffect(() => {
    game.startGame();
    
    return () => {
      game.stopGame();
    };
  }, []);

  if (game.isGameOver) {
    return (
      <>
        <GameHeader onBack={handleBack} />
        <GameOverScreen onPlayAgain={game.startGame} onHome={handleBack}>
          <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "#334155" }}>
            Score: <span style={{ color: "#ea580c" }}>{game.score}</span> / {game.totalAnswers}
          </p>
          <p style={{ fontSize: "1.25rem", color: "#475569" }}>Accuracy: {game.accuracy}%</p>
          <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "16px" }}>
            Higher accuracy indicates strong selective attention and focus.
          </p>
        </GameOverScreen>
      </>
    );
  }

  return (
    <div style={{ 
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "hidden",
      background: "#e0dcf19d"
    }}>
      <GameHeader onBack={handleBack} />
      
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          paddingTop: "100px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            position: "relative",
          }}
        >
          <PauseButton isPaused={game.isPaused} onToggle={game.togglePause} />

          <div
            style={{
              position: "relative",
              width: "900px",
              height: "525px",
              borderRadius: "8px",
              overflow: "hidden",
              background: "linear-gradient(to bottom, #1e1b4b, #3b0764, #020617)",
            }}
          >
            <SpaceBackground starCount={50} />

            <StatsContainer>
              <StatsBox label="Time" value={`${game.timeLeft}s`} width="90px" />
              <StatsBox label="Score" value={game.score} width="90px" />
              <StatsBox
                label="Multiplier"
                width="130px"
                isLast
                value={
                  <MultiplierDisplay
                    streak={game.streak}
                    multiplier={game.multiplier}
                    showAnimation={game.showMultiplierAnimation}
                  />
                }
              />
            </StatsContainer>

            <Countdown value={game.countdown} variant="dark" />

            {game.isPaused && game.countdown === 0 && <PauseOverlay onResume={game.togglePause} />}

            {game.countdown === 0 && !game.isPaused && (
              <div style={{ position: "absolute", inset: 0 }}>
                {/* Shuttles */}
                {game.shuttles.map((shuttle, index) => (
                  <ShuttleSprite
                    key={index}
                    x={shuttle.x}
                    y={shuttle.y}
                    direction={shuttle.direction}
                    visible={game.showShuttles}
                  />
                ))}

                {game.feedback && <FeedbackIndicator type={game.feedback} />}
              </div>
            )}

            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                zIndex: 10,
              }}
            >
              {(["left", "up", "down", "right"] as Direction[]).map((dir) => (
                <Button
                  key={dir}
                  variant="outlined"
                  onClick={() => game.handleAnswer(dir)}
                  disabled={game.countdown > 0 || game.isPaused}
                  sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "white",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.3)",
                      borderColor: "rgba(255, 255, 255, 0.4)",
                    },
                    "&:disabled": {
                      background: "rgba(255, 255, 255, 0.1)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      color: "rgba(255, 255, 255, 0.5)",
                    },
                  }}
                >
                  <ArrowIcon direction={dir} />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttentionGame2;