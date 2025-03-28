import React, { useEffect, useState } from "react";
import IntFluid from "./IntFluid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const IntFluidController: React.FC = () => {
  const [choices, setChoices] = useState<string[]>([]);
  const [gridImage, setGridImage] = useState<string>("");
  const [correctChoice, setCorrectChoice] = useState<string>("");
  const [assets, setAssets] = useState<
    { grid: string; choices: string[]; correct: string }[]
  >([]);
  const [score, setScore] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(-1);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => {
    const fetchGameAssets = async () => {
      const res = await fetch("/games/intFluid/filelist.json");
      if (!res.ok) return;

      const files: string[] = await res.json();

      const totalSets = Math.floor(files.length / 7);
      const selectedSets = new Set<number>();

      while (selectedSets.size < 15) {
        const randomSet = Math.floor(Math.random() * totalSets);
        selectedSets.add(randomSet);
      }

      const fetchedAssets = Array.from(selectedSets).map((setIndex) => {
        const startIndex = setIndex * 7;
        const gridPath = `/games/intFluid/tiles/${files[startIndex]}`;
        const correctChoice = `/games/intFluid/tiles/${files[startIndex + 1]}`;
        const otherChoices = files
          .slice(startIndex + 2, startIndex + 7)
          .map((file) => `/games/intFluid/tiles/${file}`)
          .sort(() => Math.random() - 0.5);

        const choicePaths = [correctChoice, ...otherChoices].sort(
          () => Math.random() - 0.5
        );

        return {
          grid: gridPath,
          choices: choicePaths,
          correct: correctChoice,
        };
      });

      setAssets(fetchedAssets);
      if (fetchedAssets.length > 0) {
        loadNextBoard(fetchedAssets);
      }
    };

    fetchGameAssets();

    // Start timer
    setStartTime(Date.now());
    const interval = setInterval(() => {
      setTotalTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const loadNextBoard = (remainingAssets: typeof assets) => {
    if (remainingAssets.length > 0) {
      const nextAsset = remainingAssets[0];
      setGridImage(nextAsset.grid);
      setChoices(nextAsset.choices);
      setCorrectChoice(nextAsset.correct);

      // Remove the current asset from the queue
      setAssets(remainingAssets.slice(1));
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsGameOver(true); // Mark the game as over
    }
  };

  const handleChoiceClick = (choice: string) => {
    if (choice === correctChoice) {
      setScore((prev) => prev + 1);
    }
    loadNextBoard(assets);
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
      {/* Statistics */}
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
          Question: {currentQuestion} / 15
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

export default IntFluidController;
