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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onStart} variant="contained" color="primary">
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
};
