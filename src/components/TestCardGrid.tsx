import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";

interface Test {
  id: number;
  title: string;
  description: string;
  type: string;
}

const testData: Test[] = [
  {
    id: 1,
    title: "Intelligence Test Crystalised",
    description: "Indicative Intelligence Test, Crystalised",
    type: "questionnaire",
  },
  {
    id: 2,
    title: "BIG-5",
    description: "Personality Test, BIG-5",
    type: "questionnaire",
  },
];

import Typography from "@mui/material/Typography";
// import GameInfo from "./GameInfo";
// import { useState } from "react";
import TestCard from "./TestCard";

const TestCardGrid = () => {
  //   const [gameInfo, setGameInfo] = useState<string[]>(["", ""]);
  //   const [gameModalOpen, setGameModalOpen] = useState(false);
  return (
    <>
      {/* <GameInfo
        gameInfo={gameInfo}
        gameModalOpen={gameModalOpen}
        setGameModalOpen={setGameModalOpen}
      /> */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" color="secondary" paddingBottom="24px">
          <Box sx={{ fontWeight: "bold", m: 1 }}>Tests</Box>
        </Typography>
        <Grid
          container
          spacing={{ xs: 3, sm: 3, md: 3 }}
          columns={{ xs: 2, sm: 2, md: 8, lg: 12 }}
        >
          {Array.from({ length: testData.length }).map((_, index) => (
            <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
              <TestCard
                title={testData[index].title}
                description={testData[index].description}
                type={testData[index].type}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default TestCardGrid;
