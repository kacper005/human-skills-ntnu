import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

interface GameCardProps {
  title: string;
  description: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, description }) => {
  return (
    <Card elevation={5}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" color="#6F4A7D">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
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
