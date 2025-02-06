import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";

interface GameCardProps {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  descriptionFull: string;
  setGameInfo: React.Dispatch<React.SetStateAction<string[]>>;
  setGameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  type,
  difficulty,
  descriptionFull,
  setGameInfo,
  setGameModalOpen,
}) => {
  // const navigate = useNavigate();

  const handleGameStart = () => {
    setGameModalOpen(true);
    setGameInfo([title, descriptionFull]);
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 5,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: 3,
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
          style={{ minHeight: "3em" }}
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
          style={{ marginTop: "12px", width: "100%" }}
          onClick={handleGameStart}
        >
          Play Game
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
