import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";

interface TestCardProps {
  title: string;
  description: string;
  type: string;
}

export const TestCard: React.FC<TestCardProps> = ({
  title,
  description,
  type,
}) => {
  const navigate = useNavigate();

  // React.useEffect(() => {
  //   // Any side effects or navigation logic can go here
  // }, [navigate]);

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
          onClick={() => {
            if (type === "questionnaire") {
              navigate("/test");
            } else if (type === "game") {
              navigate("/test2");
            }
          }}
        >
          Take Test
        </Button>
      </CardContent>
    </Card>
  );
};
