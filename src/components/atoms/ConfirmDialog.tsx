import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmationWord?: string;
  confirmationPrompt?: string;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  confirmText,
  cancelText,
  onClose,
  onConfirm,
  confirmationWord,
  confirmationPrompt,
}) => {
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (!open) setInputValue("");
  }, [open]);

  const isConfirmDisabled: boolean =
    !!confirmationWord &&
    inputValue.toLowerCase() !== confirmationWord.toLowerCase();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        {confirmationWord && (
          <>
            <DialogContentText sx={{ mt: 2 }}>
              {confirmationPrompt ??
                `Please type "${confirmationWord}" to confirm.`}
            </DialogContentText>
            <TextField
              fullWidth
              variant="outlined"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              margin="dense"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelText}</Button>
        <Button
          onClick={onConfirm}
          color="error"
          disabled={isConfirmDisabled}
          variant="contained"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
