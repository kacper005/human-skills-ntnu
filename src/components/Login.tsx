import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
} from "@mui/material";

interface LoginProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ isOpen, setIsOpen, setIsLoggedIn }) => {
  const theme = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsOpen(false);
    setIsLoggedIn(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSignUp(false);
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
          <DialogTitle sx={{ marginTop: 1, color: theme.palette.text.primary }}>
            {isSignUp ? "Sign Up" : "Login"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                sx={{ marginTop: 1 }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  sx: { backgroundColor: theme.palette.background.default },
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  sx: { backgroundColor: theme.palette.background.default },
                }}
              />
              {isSignUp && (
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    sx: { backgroundColor: theme.palette.background.default },
                  }}
                />
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
                {isSignUp ? "Sign Up" : "Login"}
              </Button>
              <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </Container>
  );
};

export default Login;
