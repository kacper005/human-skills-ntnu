import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { SocialLogins } from "./AuthShared";
import { useAuth } from "@hooks/useAuth";
import { showToast } from "@atoms/Toast";
import { AuthProvider as AuthProviderType } from "@enums/AuthProvider";

interface SignInProps {
  onAuthenticated: () => void;
  onSwitchToSignUp: () => void;
}

export default function SignIn({ onAuthenticated, onSwitchToSignUp }: SignInProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(email, password, AuthProviderType.LOCAL);
      showToast({ message: "Login successful", type: "success" });
      onAuthenticated();
    } catch (err: any) {
      setError("Invalid credentials or server error.");
      showToast({
        message: err?.response?.data?.message || "Login failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ px: 3, pb: 3, overflowY: "scroll" }}>
      <SocialLogins
        onGoogle={() =>
          showToast({ message: "Google sign-in is not implemented yet.", type: "info" })
        }
        onFeide={() =>
          showToast({ message: "Feide sign-in is not implemented yet.", type: "info" })
        }
      />

      <TextField
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        size="small"
        margin="dense"
        autoComplete="email"
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        size="small"
        margin="dense"
        autoComplete="current-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((s) => !s)}
                edge="end"
                size="small"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        disabled={loading}
        sx={{ mt: 2.5, py: 1.2, fontWeight: 700, textTransform: "none" }}
      >
        {loading ? <CircularProgress size={22} /> : "Sign In"}
      </Button>

      <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "text.secondary" }}>
        {"Don't have an account? "}
        <Box
          component="span"
          onClick={onSwitchToSignUp}
          sx={{
            color: "primary.main",
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Sign Up
        </Box>
      </Typography>
    </Box>
  );
}