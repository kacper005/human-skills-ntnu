import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";

interface TestCardProps {
  title: string;
  description: string;
  type: string;
}

const TestCard: React.FC<TestCardProps> = ({ title, description, type }) => {
  //   const handleGameStart = () => {
  //     setGameModalOpen(true);
  //     setGameInfo([title, descriptionFull]);
  //   };

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
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: "12px", width: "100%" }}
          //   onClick={handleGameStart}
        >
          Take Test
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestCard;
