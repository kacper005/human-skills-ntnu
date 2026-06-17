import React, { useState } from "react";
import { Dialog, Box, Tabs, Tab, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

type Mode = "signin" | "signup";

export default function AuthDialog({ open, onClose, onAuthenticated }: AuthDialogProps) {
  const [mode, setMode] = useState<Mode>("signin");

  const handleAuthenticated = () => {
    onAuthenticated();
    onClose();
    setMode("signin");
  };

  const handleClose = () => {
    onClose();
    setMode("signin");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      <Box
        sx={{
          backgroundImage: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          px: 3,
          pt: 3,
          pb: 2.5,
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleClose}
          aria-label="Close"
          sx={{ position: "absolute", top: 8, right: 8, color: "rgba(255,255,255,0.85)" }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: "secondary.main",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden="true">
              <path
                d="M12 2C12 2 8 6 8 10C8 12.2 9.8 14 12 14C14.2 14 16 12.2 16 10C16 6 12 2 12 2Z"
                fill="white"
              />
              <path
                d="M7 16C7 16 5 18 5 20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20C19 18 17 16 17 16H7Z"
                fill="white"
              />
            </svg>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700, lineHeight: 1.2 }}>
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
              {mode === "signin"
                ? "Sign in to continue to Human Skills"
                : "Join Human Skills to get started"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 3, pt: 2 }}>
        <Tabs
          value={mode}
          onChange={(_, value: Mode) => setMode(value)}
          variant="fullWidth"
          sx={{ mb: 2, "& .MuiTab-root": { fontWeight: 600, textTransform: "none" } }}
        >
          <Tab label="Sign In" value="signin" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>
      </Box>

      {mode === "signin" ? (
        <SignIn onAuthenticated={handleAuthenticated} onSwitchToSignUp={() => setMode("signup")} />
      ) : (
        <SignUp onAuthenticated={handleAuthenticated} onSwitchToSignIn={() => setMode("signin")} />
      )}
    </Dialog>
  );
}