import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Dialog, useTheme } from "@mui/material";

interface GameInfoProps {
  gameInfo: Array<string>;
  gameModalOpen: boolean;
  setGameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameInfo: React.FC<GameInfoProps> = ({
  gameInfo,
  gameModalOpen,
  setGameModalOpen,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClose = () => {
    setGameModalOpen(false);
  };

  return (
    <Dialog
      open={gameModalOpen}
      onClose={handleClose}
      aria-labelledby="game-info-title"
      aria-describedby="game-info-description"
      PaperProps={{
        style: {
          borderRadius: 20,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
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
        <Typography sx={{ mt: 2, color: theme.palette.text.secondary }}>
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
          onClick={() => {
            handleClose();
            navigate("/game");
          }}
        >
          Start
        </Button>
      </Box>
    </Dialog>
  );
};
