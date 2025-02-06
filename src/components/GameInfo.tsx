import React from "react";
import { Box, Typography, Button, Dialog } from "@mui/material";

interface GameInfoProps {
  gameInfo: Array<string>;
  gameModalOpen: boolean;
  setGameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameInfo: React.FC<GameInfoProps> = ({
  gameInfo,
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
          {gameInfo[0]}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {gameInfo[1].split("\n\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
              <br />
            </React.Fragment>
          ))}
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
