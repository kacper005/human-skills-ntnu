import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { IntFluid } from "./IntFluid";

export const IntFluidController: React.FC = () => {
  const [choices, setChoices] = React.useState<string[]>([]);
  const [gridImage, setGridImage] = React.useState<string>("");
  const [correctChoice, setCorrectChoice] = React.useState<string>("");
  const [assets, setAssets] = React.useState<
    { grid: string; choices: string[]; correct: string }[]
  >([]);
  const [score, setScore] = React.useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = React.useState<number>(0);
  const [startTime, setStartTime] = React.useState<number>(Date.now());
  const [totalTime, setTotalTime] = React.useState<number>(0);
  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);

  const TILE_BASE_PATH = "/games/intFluid/tiles/";

  React.useEffect(() => {
    const fetchGameAssets = async () => {
      const res = await fetch("/games/intFluid/filelist.json");
      if (!res.ok) return;

      const files: string[] = await res.json();
      const totalSets = Math.floor(files.length / 7);

      const selectedSets = new Set<number>();
      while (selectedSets.size < 15 && selectedSets.size < totalSets) {
        selectedSets.add(Math.floor(Math.random() * totalSets));
      }

      const sets = Array.from(selectedSets).map((index) => {
        const startIndex = index * 7;
        const grid = TILE_BASE_PATH + files[startIndex];
        const correct = TILE_BASE_PATH + files[startIndex + 1];
        const otherChoices = files
          .slice(startIndex + 2, startIndex + 7)
          .map((f) => TILE_BASE_PATH + f);

        const allChoices = [correct, ...otherChoices].sort(
          () => Math.random() - 0.5
        );

        return {
          grid,
          correct,
          choices: allChoices,
        };
      });

      setAssets(sets);
      setStartTime(Date.now());
    };

    fetchGameAssets();

    const interval = setInterval(() => {
      setTotalTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (assets.length > 0 && currentQuestion < assets.length) {
      const next = assets[currentQuestion];
      setGridImage(next.grid);
      setCorrectChoice(next.correct);
      setChoices(next.choices);
    } else if (assets.length > 0 && currentQuestion >= assets.length) {
      setIsGameOver(true);
    }
  }, [assets, currentQuestion]);

  const handleChoiceClick = (choice: string) => {
    if (choice === correctChoice) {
      setScore((prev) => prev + 1);
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  if (isGameOver) {
    return (
      <Paper
        elevation={3}
        style={{
          padding: "32px",
          borderRadius: "12px",
          maxWidth: "400px",
          margin: "100px auto",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">Game Over</Typography>
        <Typography variant="h6">Your Score: {score}</Typography>
      </Paper>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stats */}
      <Paper
        elevation={3}
        style={{
          padding: "16px",
          borderRadius: "12px",
          maxWidth: "400px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <Typography variant="body1">
          Total Time: {Math.floor(totalTime / 60)}:
          {("0" + (totalTime % 60)).slice(-2)} minutes
        </Typography>
        <Typography variant="body1">
          Question: {currentQuestion + 1} / 15
        </Typography>
      </Paper>

      {/* Game */}
      <IntFluid
        gridImage={gridImage}
        choices={choices}
        correctChoice={correctChoice}
        onChoiceClick={handleChoiceClick}
      />
    </div>
  );
};
