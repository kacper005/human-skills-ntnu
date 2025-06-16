import React from "react";
import {
  Container,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Button,
  Box,
  Paper,
  Divider,
} from "@mui/material";

interface Question {
  id: number;
  text: string;
}

export const Questionnaire: React.FC = () => {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [answers, setAnswers] = React.useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    //setQuestions(questionsData.questions);
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

  const handleSubmit = () => {
    console.log("Submitted answers:", answers);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Container maxWidth="md">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Paper
            elevation={0}
            sx={{ width: "100%", padding: "16px", borderRadius: 5 }}
          >
            <Typography variant="h5" component="h1" gutterBottom align="center">
              Thank you for taking this test!
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Paper
          elevation={0}
          sx={{ width: "100%", padding: "16px", borderRadius: 5 }}
        >
          <br />
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Personality Self Assessment
          </Typography>
          <br />
          <Divider />
          {questions.map((question) => (
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
                  {question.id}. {question.text}
                </FormLabel>
                <RadioGroup
                  row
                  value={answers[question.id] || ""}
                  onChange={(event) => handleChange(event, question.id)}
                  sx={{ flexGrow: 0, gap: 0.0 }}
                >
                  <FormControlLabel
                    value="1"
                    control={
                      <Radio
                        sx={{
                          color: "red",
                          "&.Mui-checked": { color: "red" },
                          transform: "scale(1.4)",
                        }}
                      />
                    }
                    label=""
                  />
                  <FormControlLabel
                    value="2"
                    control={
                      <Radio
                        sx={{
                          color: "orange",
                          "&.Mui-checked": { color: "orange" },
                          transform: "scale(1.1)",
                        }}
                      />
                    }
                    label=""
                  />
                  <FormControlLabel
                    value="3"
                    control={
                      <Radio
                        sx={{
                          color: "grey",
                          "&.Mui-checked": { color: "grey" },
                          transform: "scale(0.9)",
                        }}
                      />
                    }
                    label=""
                  />
                  <FormControlLabel
                    value="4"
                    control={
                      <Radio
                        sx={{
                          color: "lightgreen",
                          "&.Mui-checked": { color: "lightgreen" },
                          transform: "scale(1.1)",
                        }}
                      />
                    }
                    label=""
                  />
                  <FormControlLabel
                    value="5"
                    control={
                      <Radio
                        sx={{
                          color: "green",
                          "&.Mui-checked": { color: "green" },
                          transform: "scale(1.4)",
                        }}
                      />
                    }
                    label=""
                  />
                </RadioGroup>
              </Box>
              <Divider />
            </FormControl>
          ))}
          <br />
          <br />
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
