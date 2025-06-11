import React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { createUser, CreateUserDto } from "../../api/userApi";
import { AuthProvider } from "../../enums/AuthProvider";
import { Role } from "../../enums/Role";
import { Gender } from "../../enums/Gender";
import { ToastContainer } from "react-toastify";
import { showToast } from "../atoms/Toast";
import { useNavigate } from "react-router-dom";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<CreateUserDto>({
    authProvider: AuthProvider.LOCAL,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: Role.STUDENT,
    gender: Gender.MALE,
  });

  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createUser(formData);
      setFormData({
        authProvider: AuthProvider.LOCAL,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: Role.STUDENT,
        gender: Gender.MALE,
      });

      showToast({
        message: "Signup successful!",
        type: "success",
      });
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Signup failed",
        type: "error",
      });
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Create Your Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            fullWidth
            label="First Name"
            name="firstName"
            autoComplete="first-name"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            autoComplete="last-name"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value={Gender.FEMALE}>Female</MenuItem>
            <MenuItem value={Gender.MALE}>Male</MenuItem>
            <MenuItem value={Gender.UNIDENTIFIED}>I will not disclose</MenuItem>
          </TextField>
          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value={Role.STUDENT}>Student</MenuItem>
            <MenuItem value={Role.TEACHER}>Teacher</MenuItem>
          </TextField>

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};
