import React from "react";
import { Box, useTheme } from "@mui/material";
import { TestCardGrid } from "../TestCardGrid";
import { GameCardGrid } from "../GameCardGrid";

export const Home: React.FC = () => {
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
      <br />
      <TestCardGrid />
    </Box>
  );
};
