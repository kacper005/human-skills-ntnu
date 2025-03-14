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
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  margin: "auto",
  marginTop: theme.spacing(5),
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: theme.typography.button.fontWeight,
  borderRadius: theme.shape.borderRadius,
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
}));

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
    <StyledCard>
      <CardContent>
        <Typography variant="h4" gutterBottom>
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
        <StyledButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpdate}
        >
          Update Account
        </StyledButton>
        <DeleteButton
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => setOpenDeleteDialog(true)}
        >
          Delete Account
        </DeleteButton>
      </CardContent>

      {/* Delete Confirmation Dialog */}
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
          <DeleteButton onClick={handleDeleteAccount}>Delete</DeleteButton>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
};

export default UserAccount;
