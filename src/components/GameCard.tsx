import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

interface GameCardProps {
  image: string;
  title: string;
  description: string;
}

const GameCard: React.FC<GameCardProps> = ({ image, title, description }) => {
  return (
    <Card>
      <CardMedia component="img" height="140" image={image} alt={title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Button
          variant="contained"
          color="success"
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
