import React from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { IntFluid } from "./IntFluid";
import { getTestTemplatesByType } from "@api/testTemplate";
import { TestType } from "@enums/TestType";
import { TestQuestion } from "@api/testQuestion";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import {
  createNewTestSession,
  CreateTestSessionRequest,
} from "@api/testSession";
import { CreateTestChoiceRequest } from "@api/testChoice";

export const IntFluidController: React.FC = () => {
  const navigate = useNavigate();
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
  const [_, setIsGameOver] = React.useState<boolean>(false);
  const [testTemplateId, setTestTemplateId] = React.useState<number | null>(
    null
  );
  const [questions, setQuestions] = React.useState<TestQuestion[]>([]);
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(true);

  const TILE_BASE_PATH = "/games/intFluid/tiles/";

  React.useEffect(() => {
    const fetchTestQuestions = async () => {
      try {
        const response = await getTestTemplatesByType(
          TestType.INTELLIGENCE_FLUID
        );
        const template = response.data;
        setTestTemplateId(template.id);

        if (template.questions && template.questions.length > 0) {
          setQuestions(template.questions);
        } else {
          showToast({
            message: "No questions found for this test type.",
            type: "error",
          });
        }
      } catch (err: any) {
        console.error(err);
        showToast({
          message: err.response?.data?.message || "Failed to fetch questions",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestQuestions();
  }, []);

  React.useEffect(() => {
    if (questions.length === 0) return;

    const assets = questions.slice(0, 15).map((q) => {
      const folderName = q.questionText.split("_")[0];
      const grid = `${TILE_BASE_PATH}${folderName}/${q.questionText}`;

      const correctOption = q.options[0];
      const correct = `${TILE_BASE_PATH}${folderName}/${correctOption.optionText}`;

      const otherChoices = q.options
        .slice(1)
        .map((opt) => `${TILE_BASE_PATH}${folderName}/${opt.optionText}`);

      const allChoices = [correct, ...otherChoices].sort(
        () => Math.random() - 0.5
      );

      return { grid, correct, choices: allChoices };
    });

    setAssets(assets);
    setStartTime(Date.now());
  }, [questions]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  React.useEffect(() => {
    if (assets.length > 0 && currentQuestion < assets.length) {
      const next = assets[currentQuestion];
      setGridImage(next.grid);
      setCorrectChoice(next.correct);
      setChoices(next.choices);
    }
  }, [assets, currentQuestion]);

  const handleChoiceClick = (choice: string) => {
    if (choice === correctChoice) {
      setScore((prev) => prev + 1);
    }
    const selectedIndex = choices.indexOf(choice);
    setAnswers((prev) => [...prev, selectedIndex]);
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const endTime = new Date().toISOString();
    const parsedStartTime = new Date(startTime);

    if (!testTemplateId) {
      showToast({ message: "Test template ID not found.", type: "error" });
      return;
    }

    const choicesPayload: CreateTestChoiceRequest[] = questions
      .slice(0, answers.length)
      .map((question, idx) => {
        const selected = question.options[answers[idx]];
        return {
          questionId: question.id,
          selectedOptionId: selected?.id,
        };
      });

    const payload: CreateTestSessionRequest = {
      testTemplateId: testTemplateId,
      startTime: parsedStartTime.toISOString(),
      endTime,
      choices: choicesPayload,
    };

    try {
      const response = await createNewTestSession(payload);
      console.log(
        JSON.stringify({
          payload: payload,
        })
      );

      console.log(
        JSON.stringify({
          message: "Test submitted successfully",
          data: response.data,
          level: "info",
          timestamp: new Date().toISOString(),
        })
      );
      showToast({ message: "Test submitted successfully!", type: "success" });
      setIsGameOver(true);
    } catch (error: any) {
      console.error("Submission failed:", error);
      showToast({
        message: error.response?.data?.message || "Submission failed.",
        type: "error",
      });
    } finally {
      navigate("/");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (currentQuestion >= assets.length) {
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
        <Typography variant="h3">Test Complete</Typography>
        <Typography variant="h6">Your Score: {score}</Typography>
        <Typography variant="body1">Ready to submit your results?</Typography>

        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ marginTop: 16 }}
        >
          Submit
        </Button>
      </Paper>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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

      <IntFluid
        gridImage={gridImage}
        choices={choices}
        correctChoice={correctChoice}
        onChoiceClick={handleChoiceClick}
      />
    </div>
  );
};
