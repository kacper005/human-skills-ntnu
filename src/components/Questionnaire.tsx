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
} from "@api/testSession";
import { getTestTemplatesByType } from "@api/testTemplate";
import { CreateTestChoiceRequest, TestChoiceView } from "@api/testChoice";
import { TestType } from "@enums/TestType";
import { showToast } from "./atoms/Toast";
import { LoadingSpinner } from "./atoms/LoadingSpinner";
import { InfoTooltip } from "./atoms/InfoTooltip";

export const Questionnaire: React.FC = () => {
  // TODO Refactor this component
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
  const [resultSummary, setResultSummary] = React.useState<any | null>(null);

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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    questionId: number
  ) => {
    setAnswers({
      ...answers,
      [questionId]: event.target.value,
    });
  };

  const areCurrentPageQuestionsAnswered = (): boolean => {
    return paginatedQuestions.every(
      (question) =>
        answers[question.id] !== undefined && answers[question.id] !== ""
    );
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
    const endTime = new Date().toISOString();

    try {
      const startTime = new Date();
      const storedStartTime = sessionStorage.getItem("questionnaireStartTime");
      const parsedStartTime = storedStartTime
        ? new Date(storedStartTime)
        : startTime;

      const choices: CreateTestChoiceRequest[] = questions.map((question) => {
        const selectedOptionId = question.options.find(
          (opt) => opt.agreementLevel.toString() === answers[question.id]
        )?.id;

        return {
          questionId: question.id,
          selectedOptionId: selectedOptionId!,
        };
      });

      if (!testTemplateId) {
        showToast({ message: "Test template ID not found.", type: "error" });
        return;
      }

      const payload: CreateTestSessionRequest = {
        testTemplateId: testTemplateId,
        startTime: parsedStartTime.toISOString(),
        endTime,
        choices,
      };

      const response = await createNewTestSession(payload);
      const testSessionId = response.data;

      showToast({ message: "Test submitted successfully!", type: "success" });

      fetchTestSessionResult(testSessionId);

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
    switch (level) {
      case 1:
        return "#e53935"; // red
      case 2:
        return "#fb8c00"; // orange
      case 3:
        return "#9e9e9e"; // grey
      case 4:
        return "#66bb6a"; // light green
      case 5:
        return "#388e3c"; // green
      default:
        return "#bdbdbd";
    }
  };

  const getLabelForLevel = (level: number): string => {
    switch (level) {
      case 1:
        return "Strongly Disagree";
      case 2:
        return "Disagree";
      case 3:
        return "Neutral";
      case 4:
        return "Agree";
      case 5:
        return "Strongly Agree";
      default:
        return "";
    }
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
            elevation={0}
            sx={{ width: "100%", padding: "24px", borderRadius: 5 }}
          >
            <Typography variant="h3" component="h1" gutterBottom align="center">
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
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  mt={2}
                  gap={2}
                >
                  <Button variant="contained" onClick={handleExportJSON}>
                    Export JSON
                  </Button>
                  <Button variant="outlined" onClick={() => navigate("/")}>
                    Back to Home
                  </Button>
                  <InfoTooltip
                    title={
                      "You can export your test result later, visiting 'My Test Sessions' page. "
                    }
                  />
                </Box>

                <Table sx={{ mt: 3 }}>
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
          elevation={0}
          sx={{ width: "100%", padding: "16px", borderRadius: 5 }}
        >
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Personality Self Assessment
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Respond to this assessment (test) consisting of {questions.length}{" "}
            statements, by indicating if you Disagree, Partially Disagree,
            Neither Disagree nor Agree, Partially Agree or Agree with the
            statements as given below.
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={2}
            mb={2}
          >
            <Typography variant="body2" sx={{ mr: 2 }}>
              Disagree
            </Typography>

            <RadioGroup row>
              {[1, 2, 3, 4, 5].map((level) => (
                <Tooltip key={level} title={getLabelForLevel(level)} arrow>
                  <Radio
                    disabled
                    sx={{
                      "&.Mui-disabled": {
                        color: getRadioColor(level),
                      },
                      "&.MuiRadio-root.Mui-disabled.Mui-checked": {
                        color: getRadioColor(level),
                      },
                      mx: 0.5,
                    }}
                  />
                </Tooltip>
              ))}
            </RadioGroup>

            <Typography variant="body2" sx={{ ml: 2 }}>
              Agree
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={4}
            py={2}
          >
            <Typography
              variant="subtitle1"
              sx={{ flex: 1, fontWeight: "bold" }}
            >
              Statement
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Agreement Level
            </Typography>
          </Box>
          <Divider />

          {paginatedQuestions.map((question) => (
            <FormControl component="fieldset" key={question.id} fullWidth>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                margin={1}
              >
                <FormLabel
                  component="legend"
                  sx={{ flexGrow: 1, textAlign: "left", marginLeft: "32px" }}
                >
                  {question.id}. {question.questionText}
                </FormLabel>

                <RadioGroup
                  row
                  value={answers[question.id] || ""}
                  onChange={(event) => handleChange(event, question.id)}
                  sx={{ flexGrow: 0, gap: 0.0 }}
                >
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.agreementLevel.toString()}
                      control={
                        <Radio
                          sx={{
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.2)",
                            },
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
          >
            <Button
              variant="outlined"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              sx={{ mx: 1 }}
            >
              Previous
            </Button>
            <Typography variant="body1" mx={2}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              sx={{ mx: 1 }}
            >
              Next
            </Button>
          </Box>

          {currentPage === totalPages && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
            >
              <Tooltip
                title={
                  !areCurrentPageQuestionsAnswered()
                    ? "Please answer all the questions"
                    : ""
                }
                disableHoverListener={areCurrentPageQuestionsAnswered()}
              >
                <span>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                    disabled={!areCurrentPageQuestionsAnswered()}
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
