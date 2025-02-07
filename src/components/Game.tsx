import { Card, CardContent, Typography, Box } from "@mui/material";

const GameEmbed = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
    >
      <Card>
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
