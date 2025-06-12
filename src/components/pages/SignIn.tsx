import React from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { showToast } from "../atoms/Toast";
import { AuthProvider as AuthProviderType } from "../../enums/AuthProvider";
import { useAuth } from "../../hooks/useAuth";

interface LoginProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SignIn: React.FC<LoginProps> = ({ isOpen, setIsOpen }) => {
  const theme = useTheme();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!login) {
      showToast({ message: "Auth context not available", type: "error" });
      return;
    }

    try {
      await login(email, password, AuthProviderType.LOCAL);
      showToast({ message: "Login successful", type: "success" });

      handleClose();
    } catch (error: any) {
      console.error("Login error:", error);
      showToast({
        message: "Login failed: Invalid credentials or server error",
        type: "error",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setEmail("");
    setPassword("");
  };

  return (
    <Container maxWidth="xs">
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: 20,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            padding: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <DialogTitle sx={{ color: theme.palette.text.primary }}>
            Login
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <Typography color="error" variant="body2" mt={1}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary.dark
                      : theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.light
                        : theme.palette.primary.dark,
                  },
                }}
              >
                Login
              </Button>

              <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={() => {
                  navigate("/sign-up");
                  setIsOpen(false);
                }}
              >
                Don't have an account? Sign Up
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </Container>
  );
};
