import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import type { Direction } from "../types";
import { useAttentionGameController } from "./AttentionGameController";

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
import { useAuth } from "@hooks/useAuth";
import { showToast } from "@atoms/Toast";
import { addGameSession } from "@api/gameSession";
import { getAllGameTemplates } from "@api/gameTemplate";

interface AttentionGameProps {
  onBack?: () => void;
}

export function AttentionGame({ onBack }: AttentionGameProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const game = useAttentionGameController();
  const { startGame, stopGame } = game;

  const startedAtRef = React.useRef<number>(Date.now());
  const persistedRef = React.useRef(false);

  const resetAndStart = React.useCallback(() => {
    startedAtRef.current = Date.now();
    persistedRef.current = false;
    startGame();
  }, [startGame]);

  const handleBack = React.useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigate("/home");
    }
  }, [navigate, onBack]);

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  React.useEffect(() => {
    resetAndStart();
    return () => {
      stopGame();
    };
  }, [resetAndStart, stopGame]);

  React.useEffect(() => {
    if (!game.isGameOver || persistedRef.current) return;
    persistedRef.current = true;

    if (!isLoggedIn) return;

    const persistSession = async () => {
      try {
        const templatesResponse = await getAllGameTemplates();
        const templates = templatesResponse.data || [];

        console.log("templates", templatesResponse.data);

        const attentionTemplate = templates.find(
          (t) => String(t.gameType).toUpperCase() === "ATTENTION"
        );

        if (!attentionTemplate) {
          showToast({
            message: "Attention template not found, could not save session.",
            type: "warning",
          });
          return;
        }

        await addGameSession({
          gameTemplateId: attentionTemplate.id,
          startTime: new Date(startedAtRef.current).toISOString(),
          endTime: new Date().toISOString(),
          score: game.score,
          accuracy: game.accuracy,
          metadata: {
            totalAnswers: game.totalAnswers,
          },
        });

        showToast({ message: "Game session saved.", type: "success" });
      } catch (error: any) {
        console.error("Failed to save attention game session:", error);
        showToast({
          message:
            error?.response?.data?.message || "Failed to save game session",
          type: "error",
        });
      }
    };

    persistSession();
  }, [
    game.isGameOver,
    game.score,
    game.accuracy,
    game.totalAnswers,
    isLoggedIn,
  ]);

  if (game.isGameOver) {
    return (
      <>
        <GameHeader onBack={handleBack} />
        <GameOverScreen onPlayAgain={resetAndStart} onHome={handleBack}>
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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        background: "#e0dcf19d",
      }}
    >
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
              <StatsBox label="Time" value={game.timeLeft + "s"} width="90px" />
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

            {game.isPaused && game.countdown === 0 && (
              <PauseOverlay onResume={game.togglePause} />
            )}

            {game.countdown === 0 && !game.isPaused && (
              <div style={{ position: "absolute", inset: 0 }}>
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

export default AttentionGame;