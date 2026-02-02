import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface FeedbackIndicatorProps {
  type: "correct" | "wrong";
}

export function FeedbackIndicator({ type }: FeedbackIndicatorProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <div
        style={{
          width: "128px",
          height: "128px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: type === "correct" 
            ? "rgba(34, 197, 94, 0.8)" 
            : "rgba(239, 68, 68, 0.8)",
          animation: "zoomIn 0.2s ease-out",
        }}
      >
        {type === "correct" ? (
          <CheckCircleIcon sx={{ fontSize: 80, color: "white" }} />
        ) : (
          <CancelIcon sx={{ fontSize: 80, color: "white" }} />
        )}
      </div>
    </div>
  );
}