import Grid from "@mui/material/Grid2";
import GameCard from "./GameCard";
import Box from "@mui/material/Box";

interface Game {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  image: string;
}

const gameData: Game[] = [
  {
    id: 1,
    title: "Attention",
    description:
      "Identify the direction of the central shuttle in a group of space shuttles",
    type: "attention",
    difficulty: "easy",
    image: "/game_images/attention.png",
  },
  {
    id: 2,
    title: "Balloon",
    description:
      "Inflate a number of balloons to the maximum to collect as many points as possible",
    type: "attention",
    difficulty: "easy",
    image: "/game_images/balloon.png",
  },
  {
    id: 3,
    title: "CogFlex",
    description: "Identify pattern, apply pattern and detect pattern changes.",
    type: "problem-solving",
    difficulty: "easy",
    image: "/game_images/cogflex.png",
  },
  {
    id: 4,
    title: "TestyMcTestFace",
    description: "Identify pattern, apply pattern and detect pattern changes.",
    type: "critical thingking",
    difficulty: "easy",
    image: "/game_images/troll.jpg",
  },

  {
    id: 5,
    title: "CogFlex",
    description: "Identify pattern, apply pattern and detect pattern changes.",
    type: "problem-solving",
    difficulty: "easy",
    image: "/game_images/cogflex.png",
  },
  {
    id: 6,
    title: "TestyMcTestFace",
    description: "Identify pattern, apply pattern and detect pattern changes.",
    type: "critical thingking",
    difficulty: "easy",
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
import GameInfo from "./GameInfo";
import { useState } from "react";

const GameCardGrid = () => {
  const [gameModalOpen, setGameModalOpen] = useState(false);
  return (
    <>
      <GameInfo
        gameModalOpen={gameModalOpen}
        setGameModalOpen={setGameModalOpen}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" color="secondary" paddingBottom="24px">
          <Box sx={{ fontWeight: "bold", m: 1 }}>Cognitive Games</Box>
        </Typography>
        <Grid
          container
          spacing={{ xs: 3, sm: 3, md: 3 }}
          columns={{ xs: 2, sm: 2, md: 8, lg: 12 }}
        >
          {Array.from({ length: gameData.length }).map((_, index) => (
            <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
              <GameCard
                title={gameData[index].title}
                description={gameData[index].description}
                type={gameData[index].type}
                difficulty={gameData[index].difficulty}
                setGameModalOpen={setGameModalOpen}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default GameCardGrid;
