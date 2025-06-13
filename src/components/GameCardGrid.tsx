import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { GameCard } from "./GameCard";
import { GameInfo } from "./GameInfo";

interface Game {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  image: string;
  descriptionFull: string;
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
    descriptionFull: `This is an Attention Game: It records your ability to focus (pay attention) to the right things (ignore everything else).
        \n\nIndicate the direction of the space shuttle in the middle (ignore all others - if any). You respond by using "left" or "right" arrow on your keyboard (or using buttons on the screen).
        \n\nThe game will last for 1 minute; score will be calculated based on number of answers and number of correct answers i.e. a combination of speed and accuracy.`,
  },
  {
    id: 2,
    title: "Balloon",
    description:
      "Inflate a number of balloons to the maximum to collect as many points as possible",
    type: "attention",
    difficulty: "easy",
    image: "/game_images/balloon.png",
    descriptionFull: `This is a Risk Game: it records your willingness to take risk for a higher potential reward.
        \n\nMaximize your points collection by inflating the balloon to its limit - you inflate by pressing "Inflate Balloon" and you collect your gains by pressing "$$$ Collected".
        \n\nThe more the balloon is inflated the more you collect, but at the risk of the balloon bursting (and you lose your money); the inflation burst point of the balloon changes randomly.
        \n\nThe goal is to collect as much points ($$$) as possible over 10 attempts - there is a 1-minute time cap.`,
  },
  {
    id: 3,
    title: "CogFlex",
    description: "Identify pattern, apply pattern and detect pattern changes.",
    type: "problem-solving",
    difficulty: "easy",
    image: "/game_images/cogflex.png",
    descriptionFull: `This is a Cognitive Flexibility Game: it records your ability to detect, apply and adapt to change.
        \n\nPress on the correct card option (out of 4 at the top) that matches the master card (bottom section) - following the identified pattern (color of items, number of items or shape of items); the pattern will change at irregular intervals.
        \n\nThe game will last for 2 minutes; the score will be calculated based on number of answers and number of correct answers i.e. a combination of speed and accuracy.`,
  },
  {
    id: 4,
    title: "TestyMcTestFace",
    description: "Identify pattern, apply pattern and detect pattern changes.",
    type: "critical thinking",
    difficulty: "easy",
    image: "/game_images/troll.jpg",
    descriptionFull: `This is a TestyMcTestFace Game: it records your ability to test, McFace and face the TestFace.
        \n\nPress on the correct face option (out of 4 at the top) that matches the McTestFace - following the identified McFace (color of the Test, number of Testy's McFace or shape of McFace); the pattern will change at irregular intervals.
        \n\nThe game will last for 2 minutes; the score will be calculated based on number of answers and number of correct answers i.e. a combination of speed and accuracy.`,
  },
  {
    id: 5,
    title: "Super Mario",
    description: "Help Mario as he advertures through the Mushroom Kingdom.",
    type: "Sidescroller",
    difficulty: "Insane",
    image: "/game_images/troll.jpg",
    descriptionFull: `RAMPAGE!\n\n`,
  },
];

export const GameCardGrid: React.FC = () => {
  const [gameInfo, setGameInfo] = React.useState<string[]>(["", ""]);
  const [gameModalOpen, setGameModalOpen] = React.useState(false);
  const theme = useTheme();

  return (
    <>
      <GameInfo
        gameInfo={gameInfo}
        gameModalOpen={gameModalOpen}
        setGameModalOpen={setGameModalOpen}
      />
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          backgroundColor:
            theme.palette.mode === "dark" ? "#121212" : "#f5f5f5",
        }}
      >
        <Typography variant="h4" color="secondary" paddingBottom="24px">
          <Box sx={{ fontWeight: "bold", m: 1 }}>Cognitive Games</Box>
        </Typography>
        <Grid
          container
          spacing={{ xs: 3, sm: 3, md: 3 }}
          columns={{ xs: 2, sm: 4, md: 8, lg: 12 }}
        >
          {gameData.map((game, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <GameCard
                title={game.title}
                description={game.description}
                type={game.type}
                difficulty={game.difficulty}
                descriptionFull={game.descriptionFull}
                setGameInfo={setGameInfo}
                setGameModalOpen={setGameModalOpen}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};
