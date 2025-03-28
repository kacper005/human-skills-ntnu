import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";

const GameEmbed = () => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f5f5f5",
      }}
    >
      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[3],
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            Games in progress...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GameEmbed;
