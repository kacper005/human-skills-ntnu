import Grid from "@mui/material/Grid2";
import GameCard from "./GameCard";
import Box from "@mui/material/Box";

interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
}

const gameData: Game[] = [
  {
    id: 1,
    title: "Attention",
    description:
      "Identify the direction of the central shuttle in a group of space shuttles",
    image: "/game_images/attention.png",
  },
  {
    id: 2,
    title: "Balloon",
    description:
      "Inflate a number of balloons to the maximum to collect as many points as possible",
    image: "/game_images/balloon.png",
  },
  {
    id: 3,
    title: "CogFlex",
    description: "Identify pattern, apply pattern and detect pattern changes.",
    image: "/game_images/cogflex.png",
  },
  {
    id: 4,
    title: "TestyMcTestFace",
    description: "Identify pattern, apply pattern and detect pattern changes.",
    image: "/game_images/troll.jpg",
  },
  // {
  //   id: 5,
  //   title: "Attention",
  //   description:
  //     "Identify the direction of the central shuttle in a group of space shuttles",
  //   image: "https://picsum.photos/id/543/200",
  // },
  // {
  //   id: 6,
  //   title: "Balloon",
  //   description:
  //     "Inflate a number of balloons to the maximum to collect as many points as possible",
  //   image: "https://picsum.photos/id/123/200",
  // },
  // {
  //   id: 7,
  //   title: "CogFlex",
  //   description: "Identify pattern, apply pattern and detect pattern changes.",
  //   image: "https://picsum.photos/id/424/200",
  // },
  // {
  //   id: 8,
  //   title: "TestyMcTestFace",
  //   description: "Identify pattern, apply pattern and detect pattern changes.",
  //   image: "https://picsum.photos/id/534/200",
  // },
];

import Typography from "@mui/material/Typography";

const Quizzes = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h2" gutterBottom color="black">
        Quizzes
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {Array.from({ length: gameData.length }).map((_, index) => (
          <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
            <GameCard
              image={gameData[index].image}
              title={gameData[index].title}
              description={
                gameData[index].description.split(" ").slice(0, 10).join(" ") +
                (gameData[index].description.split(" ").length > 10
                  ? "..."
                  : "")
              }
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Quizzes;
