import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { SocialLogins } from "./AuthShared";
import { createUser, CreateUserDto } from "@api/userApi";
import { useAuth } from "@hooks/useAuth";
import { Role } from "@enums/Role";
import { Gender } from "@enums/Gender";
import { showToast } from "@atoms/Toast";
import { AuthProvider } from "@enums/AuthProvider";

interface SignUpProps {
  onAuthenticated: () => void;
  onSwitchToSignIn: () => void;
}

export default function SignUp({ onAuthenticated, onSwitchToSignIn }: SignUpProps) {
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName) {
      setError("Please fill in all required fields.");
      return;
    }

    setError(null);
    setLoading(true);

    const payload: CreateUserDto = {
      authProvider: AuthProvider.LOCAL,
      firstName,
      lastName,
      email,
      password,
      gender,
      role,
    };

    try {
      await createUser(payload);
      await login(email, password, AuthProvider.LOCAL);
      showToast({
        message: "Signup successful! You are now logged in.",
        type: "success",
      });
      onAuthenticated();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Signup failed";
      setError(message);
      showToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ px: 3, pb: 3 }}>
      <SocialLogins
        onGoogle={() =>
          showToast({ message: "Google sign-up is not implemented yet.", type: "info" })
        }
        onFeide={() =>
          showToast({ message: "Feide sign-up is not implemented yet.", type: "info" })
        }
      />

      <Box sx={{ display: "flex", gap: 1.5 }}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          required
          size="small"
          margin="dense"
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          required
          size="small"
          margin="dense"
        />
      </Box>

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
        autoComplete="new-password"
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

      <Box sx={{ display: "flex", gap: 1.5 }}>
        <TextField
          select
          label="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          fullWidth
          size="small"
          margin="dense"
        >
          <MenuItem value={Gender.FEMALE}>Female</MenuItem>
          <MenuItem value={Gender.MALE}>Male</MenuItem>
          <MenuItem value={Gender.UNIDENTIFIED}>I will not disclose</MenuItem>
        </TextField>
        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          fullWidth
          size="small"
          margin="dense"
        >
          <MenuItem value={Role.STUDENT}>Student</MenuItem>
          <MenuItem value={Role.TEACHER}>Teacher</MenuItem>
        </TextField>
      </Box>

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
        {loading ? <CircularProgress size={22} /> : "Create Account"}
      </Button>

      <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "text.secondary" }}>
        {"Already have an account? "}
        <Box
          component="span"
          onClick={onSwitchToSignIn}
          sx={{
            color: "primary.main",
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Sign In
        </Box>
      </Typography>
    </Box>
  );
}