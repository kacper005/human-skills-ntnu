import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export const GameEmbed: React.FC = () => {
  const theme = useTheme();

  React.useEffect(() => {
    // Create a script element
    const script = document.createElement("script");
    script.src = `https://cdn.htmlgames.com/embed.js?game=Daily2Queens&bgcolor=${
      theme.palette.mode === "dark" ? "black" : "white"
    }`; //
    script.async = true; // Load asynchronously for performance

    // Append the script to the div
    const embedDiv = document.getElementById("game-container");
    if (embedDiv) {
      embedDiv.appendChild(script);
    }

    // Cleanup script when the component unmounts
    return () => {
      if (embedDiv) {
        while (embedDiv.firstChild) {
          embedDiv.removeChild(embedDiv.firstChild); //
        }
      }
    };
  }, [theme.palette.mode]); //

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h4"
        color="text.primary"
        fontWeight="bold"
        gutterBottom
      >
        Daily 2 Queens Game
      </Typography>
      {/* The container for the game */}
      <Box
        id="game-container"
        sx={{
          width: "100%",
          maxWidth: "800px",
          height: "600px",
          backgroundColor:
            theme.palette.mode === "dark" ? "#121212" : "#ffffff",
          borderRadius: "8px",
          boxShadow: theme.shadows[3],
          padding: 2,
        }}
      ></Box>
    </Box>
  );
};
