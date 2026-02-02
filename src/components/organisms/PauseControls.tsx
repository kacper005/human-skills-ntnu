import React from "react";
import { IconButton, Button } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface PauseButtonProps {
  isPaused: boolean;
  onToggle: () => void;
}

export function PauseButton({ isPaused, onToggle }: PauseButtonProps) {
  return (
    <IconButton
      onClick={onToggle}
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
        zIndex: 20,
        bgcolor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(4px)",
        "&:hover": { bgcolor: "white" },
      }}
    >
      {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
    </IconButton>
  );
}

interface PauseOverlayProps {
  onResume: () => void;
}

export function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.25rem", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
          Paused
        </div>
        <Button variant="contained" color="secondary" onClick={onResume}>
          Resume
        </Button>
      </div>
    </div>
  );
}