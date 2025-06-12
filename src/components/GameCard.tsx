import React from "react";
import { Card, CardContent, Typography, Button, useTheme } from "@mui/material";

interface GameCardProps {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  descriptionFull: string;
  setGameInfo: React.Dispatch<React.SetStateAction<string[]>>;
  setGameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  type,
  difficulty,
  descriptionFull,
  setGameInfo,
  setGameModalOpen,
}) => {
  const theme = useTheme();

  const handleGameStart = () => {
    setGameModalOpen(true);
    setGameInfo([title, descriptionFull]);
  };

  return (
    <Card
      elevation={theme.palette.mode === "dark" ? 2 : 0}
      sx={{
        borderRadius: 5,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: theme.shadows[3],
        },
      }}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          fontWeight="bold"
          component="div"
          color="secondary"
        >
          {title}
        </Typography>
        <Typography
          gutterBottom
          variant="body1"
          color="text.secondary"
          sx={{ minHeight: "3em" }}
        >
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {type}
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          Difficulty: {difficulty}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            marginTop: "12px",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.secondary.dark
                : theme.palette.secondary.main,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.secondary.light
                  : theme.palette.secondary.dark,
            },
          }}
          onClick={handleGameStart}
        >
          Play Game
        </Button>
      </CardContent>
    </Card>
  );
};
