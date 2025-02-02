import React from "react";
import { Box, Typography, Button, Dialog } from "@mui/material";

interface GameInfoProps {
  gameModalOpen: boolean;
  setGameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameInfo: React.FC<GameInfoProps> = ({
  gameModalOpen,
  setGameModalOpen,
}) => {
  const handleClose = () => setGameModalOpen(false);

  return (
    <Dialog
      open={gameModalOpen}
      onClose={handleClose}
      aria-labelledby="game-info-title"
      aria-describedby="game-info-description"
      PaperProps={{
        style: {
          borderRadius: 20,
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={6}
      >
        <Typography
          gutterBottom
          variant="h5"
          fontWeight="bold"
          component="div"
          color="secondary"
        >
          Attention
        </Typography>
        <Typography sx={{ mt: 2 }}>
          This is an Attention Game: it records your ability to focus (pay
          attention) to the right things (ignore everything else).
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Indicate the direction of the space shuttle in the middle (ignore all
          others - if any). You respond by using "left" or "right" arrow on your
          keyboard (or using buttons on the screen).
        </Typography>
        <Typography sx={{ mt: 2 }}>
          The game will last for 1 minute; score will be calculated based on
          number of answers and number of correct answers i.e. a combination of
          speed and accuracy.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
          sx={{ mt: 3 }}
        >
          Start
        </Button>
      </Box>
    </Dialog>
  );
};

export default GameInfo;
