import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  useTheme,
} from "@mui/material";

const Profile: React.FC = () => {
  const theme = useTheme();
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        padding: 3,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          textAlign: "center",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          padding: 4,
          borderRadius: 4,
          boxShadow: theme.shadows[3],
        }}
      >
        <CardContent>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: "0 auto",
              backgroundColor: theme.palette.primary.main,
            }}
          >
            {name.charAt(0)}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
            {name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {email}
          </Typography>

          {editing ? (
            <>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  mt: 3,
                  backgroundColor: theme.palette.background.default,
                }}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mt: 2,
                  backgroundColor: theme.palette.background.default,
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
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
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
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
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
