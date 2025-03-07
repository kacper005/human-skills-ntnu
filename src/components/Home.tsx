import React from "react";
import GameCardGrid from "./GameCardGrid";
import { Box, useTheme } from "@mui/material";

const Home: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: 3,
      }}
    >
      <GameCardGrid />
    </Box>
  );
};

export default Home;
