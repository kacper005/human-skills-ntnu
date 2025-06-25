import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { getTestTemplatesByType } from "@api/testTemplate";
import {
  createNewTestSession,
  getTestSessionFormattedById,
  CreateTestSessionRequest,
  TestSessionView,
  getTestSessionEvaluation,
} from "@api/testSession";
import { TestQuestion } from "@api/testQuestion";
import { TestChoiceView } from "@api/testChoice";
import { CreateTestChoiceRequest } from "@api/testChoice";
import { useAuth } from "@hooks/useAuth";
import { showToast } from "@atoms/Toast";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { TestType } from "@enums/TestType";
import { IntFluid } from "./IntFluid";

export const IntFluidController: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [choices, setChoices] = React.useState<string[]>([]);
  const [gridImage, setGridImage] = React.useState<string>("");
  const [correctChoice, setCorrectChoice] = React.useState<string>("");
  const [assets, setAssets] = React.useState<
    { grid: string; choices: string[]; correct: string }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    React.useState<number>(0);
  const [startTime, setStartTime] = React.useState<number>(Date.now());
  const [totalTime, setTotalTime] = React.useState<number>(0);
  const [testTemplateId, setTestTemplateId] = React.useState<number | null>(
    null
  );
  const [questions, setQuestions] = React.useState<TestQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const [resultSummary, setResultSummary] =
    React.useState<TestSessionView | null>(null);

  const TILE_BASE_PATH = "/games/intFluid/tiles/";

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data: template } = await getTestTemplatesByType(
          TestType.INTELLIGENCE_FLUID
        );
        setTestTemplateId(template.id);
        if (template.questions?.length) {
          setQuestions(template.questions);
        } else {
          showToast({ message: "No questions found.", type: "error" });
        }
      } catch (error: any) {
        console.error(error);
        showToast({
          message: error.response?.data?.message || "Failed to fetch questions",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  React.useEffect(() => {
    if (!questions.length) return;

    const preparedAssets = questions.slice(0, 15).map((q) => {
      const folder = q.questionText.split("_")[0];
      const grid = `${TILE_BASE_PATH}${folder}/${q.questionText}`;
      const correctOption = q.options.find((opt) =>
        opt.optionText.includes("OptionA")
      );
      const correct = `${TILE_BASE_PATH}${folder}/${correctOption?.optionText}`;
      const otherChoices = q.options
        .slice(1)
        .map((opt) => `${TILE_BASE_PATH}${folder}/${opt.optionText}`);
      const allChoices = [correct, ...otherChoices].sort(
        () => Math.random() - 0.5
      );
      return { grid, correct, choices: allChoices };
    });

    setAssets(preparedAssets);
    setStartTime(Date.now());
  }, [questions]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  React.useEffect(() => {
    if (assets.length && currentQuestionIndex < assets.length) {
      const { grid, correct, choices } = assets[currentQuestionIndex];
      setGridImage(grid);
      setCorrectChoice(correct);
      setChoices(choices);
    }
  }, [assets, currentQuestionIndex]);

  const handleChoiceClick = (choice: string) => {
    setSelectedAnswers((prev) => [...prev, choice]);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const fetchTestSessionResult = async (sessionId: number) => {
    setLoading(true);
    try {
      const response = await getTestSessionFormattedById(sessionId);
      setResultSummary(response.data);
    } catch (error) {
      console.error("Failed to fetch test session result:", error);
      showToast({ message: "Failed to load test results", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!testTemplateId) {
      showToast({ message: "Test template ID not found.", type: "error" });
      return;
    }

    const parsedStartTime = new Date(startTime).toISOString();
    const endTime = new Date().toISOString();

    const choicesPayload: CreateTestChoiceRequest[] = questions
      .slice(0, selectedAnswers.length)
      .map((q, idx) => {
        const folder = q.questionText.split("_")[0];
        const selectedImagePath = selectedAnswers[idx];
        const matchedOption = q.options.find((opt) => {
          const optionPath = `${TILE_BASE_PATH}${folder}/${opt.optionText}`;
          return optionPath === selectedImagePath;
        });

        return {
          questionId: q.id,
          selectedOptionId: matchedOption?.id ?? -1,
        };
      });

    const payload: CreateTestSessionRequest = {
      testTemplateId,
      startTime: parsedStartTime,
      endTime,
      choices: choicesPayload,
    };

    try {
      if (isLoggedIn) {
        const response = await createNewTestSession(payload);
        const testSessionId = response.data;

        showToast({ message: "Test submitted successfully!", type: "success" });
        await fetchTestSessionResult(testSessionId);
      } else {
        const response = await getTestSessionEvaluation(payload);
        const evaluation = response.data;

        setResultSummary(evaluation);
        showToast({ message: "Test completed!", type: "success" });
      }
      setSubmitted(true);
    } catch (error: any) {
      console.error("Failed to submit test session:", error);
      showToast({
        message: error.response?.data?.message || "Submission failed.",
        type: "error",
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  if (submitted) {
    return (
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 3,
          maxWidth: 700,
          margin: "100px auto",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">✅ Test Submitted Successfully!</Typography>
        <Typography variant="h6" mt={2}>
          🧠 Score: {resultSummary?.score}
        </Typography>

        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Your Answer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resultSummary?.choices.map(
              (choice: TestChoiceView, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{choice.question}</TableCell>
                  <TableCell>{choice.answer}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>

        <Grid container spacing={2} justifyContent="center" mt={3}>
          <Grid item>
            <Button variant="contained" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  if (currentQuestionIndex >= assets.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 3,
          maxWidth: 400,
          margin: "100px auto",
          textAlign: "center",
        }}
      >
        <Typography variant="h3">Test Complete</Typography>
        <Typography variant="body1" mt={1}>
          Ready to submit your results?
        </Typography>

        <Grid container spacing={2} justifyContent="center" mt={2}>
          <Grid item>
            <Button variant="outlined" onClick={() => navigate("/")}>
              Reject
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          borderRadius: 3,
          maxWidth: 400,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <Typography variant="body1">
          Total Time: {Math.floor(totalTime / 60)}:
          {("0" + (totalTime % 60)).slice(-2)} minutes
        </Typography>
        <Typography variant="body1">
          Question: {currentQuestionIndex + 1} / 15
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
