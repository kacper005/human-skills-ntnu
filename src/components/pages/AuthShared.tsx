import React from "react";
import axios from "axios";
import { Box, Button, Typography, Divider, CircularProgress } from "@mui/material";
import { useAuth } from "@hooks/useAuth";
import { showToast } from "@atoms/Toast";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function FeideIcon() {
  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: "4px",
        bgcolor: "#1F4698",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Typography sx={{ color: "white", fontWeight: 800, fontSize: 13, lineHeight: 1 }}>
        F
      </Typography>
    </Box>
  );
}

const getGoogleLoginErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 409) {
      return "An account with this email already exists. Sign in with your email and password.";
    }
    if (error.response?.status === 400) {
      return "Google could not verify your account. Please try again.";
    }
  }
  return "Google sign-in is currently unavailable. Please try again later.";
};

interface SocialLoginsProps {
  onAuthenticated: () => void;
  onFeide: () => void;
}

export function SocialLogins({ onAuthenticated, onFeide }: SocialLoginsProps) {
  const { loginWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [googleError, setGoogleError] = React.useState<string | null>(null);

  const handleGoogleCredential = async (idToken: string) => {
    setGoogleError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle(idToken);
      showToast({ message: "Signed in with Google", type: "success" });
      onAuthenticated();
    } catch (error) {
      setGoogleError(getGoogleLoginErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Hidden instead of unmounted, so the Google button keeps its rendered state */}
        <Box sx={{ display: googleLoading ? "none" : "block" }}>
          <GoogleSignInButton onCredential={handleGoogleCredential} />
        </Box>
        {googleLoading && (
          <Button
            fullWidth
            variant="outlined"
            disabled
            sx={{ textTransform: "none", fontWeight: 600, py: 1.1 }}
          >
            <CircularProgress size={20} sx={{ mr: 1.5 }} />
            Signing in with Google...
          </Button>
        )}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FeideIcon />}
          onClick={onFeide}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            py: 1.1,
            borderColor: "#1F4698",
            color: "#1F4698",
            "&:hover": { borderColor: "#163472", bgcolor: "rgba(31,70,152,0.06)" },
          }}
        >
          Continue with Feide
        </Button>
      </Box>

      {googleError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {googleError}
        </Typography>
      )}

      <Divider sx={{ my: 2.5, color: "text.secondary", fontSize: 13 }}>or</Divider>
    </>
  );
}
