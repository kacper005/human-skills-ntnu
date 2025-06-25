import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const STORAGE_KEY = "visited-human-skills";

export const WelcomeDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const visited = localStorage.getItem(STORAGE_KEY);
    if (!visited) {
      setOpen(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }
  }, []);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>🧠 Welcome to Human Skills</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Human Skills is a growing platform designed to help you explore and
          understand your cognitive abilities and personality traits.
        </Typography>
        <Typography gutterBottom>
          You'll find a range of assessments, like personality and intelligence
          tests — with more coming soon.
        </Typography>
        <Typography gutterBottom>
          For the best experience, we recommend creating a free account. You’ll
          be able to save your progress, view past results, and share your
          insights.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No pressure — explore at your own pace and have fun learning about
          yourself.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} variant="contained" autoFocus>
          Start Exploring
        </Button>
      </DialogActions>
    </Dialog>
  );
};
