import React, { useState, useEffect } from "react";
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
import questionsData from "../data/questionnaires/big5.json";

interface Question {
  id: number;
  text: string;
}

const Questionnaire: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    setQuestions(questionsData.questions);
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
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Personality Self Assesment
        </Typography>
        <Paper
          elevation={0}
          sx={{ width: "100%", padding: "16px", borderRadius: 5 }}
        >
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
                  sx={{ flexGrow: 0 }}
                >
                  <FormControlLabel
                    value="1"
                    control={
                      <Radio
                        sx={{
                          color: "red",
                          "&.Mui-checked": { color: "red" },
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

export default Questionnaire;
