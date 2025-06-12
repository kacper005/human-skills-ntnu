import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const adminLinks = [
  { title: "Study Programs", path: "/admin/study-programs" },
  { title: "Users", path: "/admin/users" },
  { title: "Tests", path: "/admin/tests" },
  { title: "Games", path: "/admin/games" },
];

export const Admin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <Grid container spacing={4} maxWidth="md">
        {adminLinks.map((link) => (
          <Grid item xs={12} sm={6} md={4} key={link.title}>
            <Card>
              <CardActionArea onClick={() => navigate(link.path)}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {link.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
