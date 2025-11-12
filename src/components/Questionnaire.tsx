import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Box,
  Paper,
  Divider,
  Tooltip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { TestQuestion } from "@api/testQuestion";
import {
  createNewTestSession,
  CreateTestSessionRequest,
  getTestSessionFormattedById,
  getTestSessionEvaluation,
  TestSessionView,
} from "@api/testSession";
import { getTestTemplatesByType } from "@api/testTemplate";
import { CreateTestChoiceRequest, TestChoiceView } from "@api/testChoice";
import { useAuth } from "@hooks/useAuth";
import { showToast } from "@atoms/Toast";
import { InfoTooltip } from "@atoms/InfoTooltip";
import { LoadingSpinner } from "@atoms/LoadingSpinner";
import { TestType } from "@enums/TestType";

export const Questionnaire: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const QUESTIONS_PER_PAGE = 10;
  const navigate = useNavigate();
  const [questions, setQuestions] = React.useState<TestQuestion[]>([]);
  const [answers, setAnswers] = React.useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [testTemplateId, setTestTemplateId] = React.useState<number | null>(
    null
  );
  const [resultSummary, setResultSummary] =
    React.useState<TestSessionView | null>(null);

  React.useEffect(() => {
    const fetchTestQuestions = async () => {
      sessionStorage.setItem(
        "questionnaireStartTime",
        new Date().toISOString()
      );
      try {
        const response = await getTestTemplatesByType(TestType.BIG_5);
        const template = response.data;
        setTestTemplateId(template.id);
        if (template.questions?.length > 0) setQuestions(template.questions);
        else
          showToast({
            message: "No questions found for this test type.",
            type: "error",
          });
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    questionId: number
  ) => {
    setAnswers({ ...answers, [questionId]: event.target.value });
  };

  const areAllQuestionsAnswered = (): boolean =>
    questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== "");

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
    const endTime = new Date().toISOString();

    try {
      const storedStartTime = sessionStorage.getItem("questionnaireStartTime");
      const parsedStartTime = storedStartTime
        ? new Date(storedStartTime)
        : new Date();

      if (!testTemplateId) {
        showToast({ message: "Test template ID not found.", type: "error" });
        return;
      }

      const choices: CreateTestChoiceRequest[] = questions.map((q) => {
        const selectedOption = q.options.find(
          (opt) => opt.agreementLevel.toString() === answers[q.id]
        );
        if (!selectedOption) {
          throw new Error(`Missing selection for question ${q.id}`);
        }
        return {
          questionId: q.id,
          selectedOptionId: selectedOption.id,
        };
      });

      const payload: CreateTestSessionRequest = {
        testTemplateId,
        startTime: parsedStartTime.toISOString(),
        endTime,
        choices,
      };

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

  const getRadioColor = (level: number): string => {
    const map = {
      1: "#e53935",
      2: "#fb8c00",
      3: "#9e9e9e",
      4: "#66bb6a",
      5: "#388e3c",
    };
    return map[level as keyof typeof map] || "#bdbdbd";
  };

  const getLabelForLevel = (level: number): string => {
    return (
      [
        "",
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree",
      ][level] || ""
    );
  };

  const handleExportJSON = () => {
    if (!resultSummary) return;
    const jsonStr = JSON.stringify(resultSummary, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Test-session-${resultSummary.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const paginatedQuestions = questions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  if (submitted) {
    return (
      <Container maxWidth="md">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Paper
            sx={{
              width: "100%",
              px: { xs: 2, sm: 4 },
              py: { xs: 2, sm: 4 },
              borderRadius: 5,
            }}
          >
            <Typography variant="h3" gutterBottom align="center">
              Thank you for completing the test!
            </Typography>
            <Divider sx={{ my: 2 }} />

            {resultSummary ? (
              <>
                <Typography variant="h4" align="center">
                  🧾 Test: {resultSummary.testName}
                </Typography>
                <Typography variant="h4" align="center">
                  📅 Taken: {new Date(resultSummary.endTime).toLocaleString()}
                </Typography>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  alignItems="center"
                  justifyContent="center"
                  mt={2}
                  gap={2}
                >
                  <Button variant="contained" onClick={handleExportJSON}>
                    Export JSON
                  </Button>
                  <Button variant="outlined" onClick={() => navigate("/")}>
                    Back to Home
                  </Button>
                  {isLoggedIn && (
                    <InfoTooltip title="You can export your test result later, visiting 'My Test Sessions' page." />
                  )}
                </Box>

                <Box sx={{ width: "100%", overflowX: "auto", mt: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>#</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Question</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Your Answer</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resultSummary.choices.map(
                        (choice: TestChoiceView, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{choice.question}</TableCell>
                            <TableCell>{choice.answer}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </>
            ) : (
              <LoadingSpinner />
            )}
          </Paper>
        </Box>
      </Container>
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Paper
          sx={{
            width: "100%",
            px: { xs: 2, sm: 4 },
            py: { xs: 2, sm: 4 },
            borderRadius: 5,
          }}
        >
          <Typography variant="h3" gutterBottom align="center">
            Personality Self Assessment
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Respond to this assessment consisting of {questions.length}{" "}
            statements by indicating your level of agreement.
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
              mb: 2,
              overflowX: "auto",
              whiteSpace: "nowrap",
              px: 1,
            }}
          >
            <Typography variant="body2" sx={{ mr: 2, flexShrink: 0 }}>
              Disagree
            </Typography>

            <RadioGroup
              row
              sx={{
                flexWrap: "nowrap",
                justifyContent: "center",
                minWidth: 300,
              }}
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <Tooltip key={level} title={getLabelForLevel(level)} arrow>
                  <Radio
                    disabled
                    sx={{
                      "&.Mui-disabled": { color: getRadioColor(level) },
                      "&.MuiRadio-root.Mui-disabled.Mui-checked": {
                        color: getRadioColor(level),
                      },
                      mx: 0.5,
                      flexShrink: 0,
                    }}
                  />
                </Tooltip>
              ))}
            </RadioGroup>

            <Typography variant="body2" sx={{ ml: 2, flexShrink: 0 }}>
              Agree
            </Typography>
          </Box>

          {paginatedQuestions.map((question) => (
            <FormControl key={question.id} fullWidth>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                margin={1}
                gap={1}
              >
                <FormLabel
                  sx={{ flexGrow: 1, ml: { sm: 4 }, textAlign: "left" }}
                >
                  {question.id}. {question.questionText}
                </FormLabel>

                <RadioGroup
                  row
                  value={answers[question.id] || ""}
                  onChange={(event) => handleChange(event, question.id)}
                  sx={{
                    flexWrap: "wrap",
                    justifyContent: { xs: "flex-start", sm: "center" },
                  }}
                >
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.agreementLevel.toString()}
                      control={
                        <Radio
                          sx={{
                            transition: "transform 0.2s",
                            "&:hover": { transform: "scale(1.2)" },
                            color: getRadioColor(option.agreementLevel),
                            "&.Mui-checked": {
                              color: getRadioColor(option.agreementLevel),
                            },
                          }}
                        />
                      }
                      label={option.optionText || ""}
                    />
                  ))}
                </RadioGroup>
              </Box>
              <Divider />
            </FormControl>
          ))}

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
            flexWrap="wrap"
            gap={2}
          >
            <Button
              variant="outlined"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Typography variant="body1">
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Box>

          {currentPage === totalPages && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={3}
            >
              <Tooltip
                title={
                  !areAllQuestionsAnswered()
                    ? "Please answer all the questions"
                    : ""
                }
                disableHoverListener={areAllQuestionsAnswered()}
              >
                <span>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                    disabled={!areAllQuestionsAnswered()}
                  >
                    Submit
                  </Button>
                </span>
              </Tooltip>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};
