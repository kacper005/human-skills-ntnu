// components/TestInfoModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type TestInfoModalProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onStart: () => void;
};

export const TestInfoModal: React.FC<TestInfoModalProps> = ({
  open,
  title,
  description,
  onClose,
  onStart,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This test will help assess your personality traits. Please answer all
          questions honestly. You won’t be able to change answers once
          submitted.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onStart} variant="contained" color="primary">
          Start Test
        </Button>
      </DialogActions>
    </Dialog>
  );
};
