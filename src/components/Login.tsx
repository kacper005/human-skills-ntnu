import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Handle login or sign up logic here
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="50vh"
      >
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          {isSignUp ? "S342ign Up" : "Login"}
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isSignUp ? "Sign Up" : "Login"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
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
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
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
        </Dialog>
      </Box>
    </Container>
  );
};

export default Login;
