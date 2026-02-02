import React from "react";
import { Button } from "@mui/material";

interface GameOverScreenProps {
  children: React.ReactNode;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function GameOverScreen({ children, onPlayAgain, onHome }: GameOverScreenProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          padding: "48px",
          maxWidth: "448px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#0f172a", marginBottom: "24px" }}>
          Game Over!
        </h1>
        <div style={{ marginBottom: "24px" }}>{children}</div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button
            onClick={onPlayAgain}
            size="large"
            variant="contained"
            color="warning"
            sx={{ flex: 1 }}
          >
            Play Again
          </Button>
          <Button onClick={onHome} size="large" variant="outlined" sx={{ flex: 1 }}>
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}