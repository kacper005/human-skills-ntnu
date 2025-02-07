import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const UserAccount: React.FC = () => {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleUpdate = () => {
    console.log("Updating account:", { email, password });
    alert("Account updated!");
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account...");
    alert("Account deleted!");
    setOpenDeleteDialog(false);
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Manage Account
        </Typography>
        <TextField
          label="Email Address"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpdate}
        >
          Update Account
        </Button>
        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => setOpenDeleteDialog(true)}
        >
          Delete Account
        </Button>
      </CardContent>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action is
            irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UserAccount;
