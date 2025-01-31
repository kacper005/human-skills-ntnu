import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

interface GameCardProps {
  title: string;
  description: string;
  type: string;
  difficulty: string;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  type,
  difficulty,
}) => {
  return (
    <Card elevation={0}>
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
        <Typography gutterBottom variant="body1" color="text.secondary">
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
          style={{ marginTop: "10px" }}
          onClick={() => (window.location.href = "/game/1")}
        >
          Play
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
