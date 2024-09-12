import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [questionState, setQuestionState] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios
      .get("https://the-trivia-api.com/v2/questions")
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
        shuffleAnswers(res.data[0]); // Shuffle answers for the first question
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  function shuffleAnswers(question) {
    const answers = [
      ...question.incorrectAnswers,
      question.correctAnswer,
    ];
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    setShuffledAnswers(answers); // Set shuffled answers in the state
  }

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      alert("Please select an answer!");
      return;
    }

    if (selectedAnswer === questions[questionState].correctAnswer) {
      setScore(score + 1);
    }

    if (questionState < questions.length - 1) {
      setQuestionState(questionState + 1);
      setSelectedAnswer(null);
      shuffleAnswers(questions[questionState + 1]); // Shuffle answers for the next question
    } else {
      setIsQuizComplete(true);
    }
  };

  const renderQuestion = () => {
    const currentQuestion = questions[questionState];

    return (
      <Paper
        elevation={3}
        style={{
          padding: "30px",
          marginTop: "20px",
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
          Question {questionState + 1} of {questions.length}
        </Typography>
        <Typography variant="h6" style={{ marginBottom: "20px" }}>
          {currentQuestion.question.text}
        </Typography>

        <FormControl component="fieldset" style={{ width: "100%" }}>
          <RadioGroup
            aria-label="quiz-answers"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
          >
            {shuffledAnswers.map((answer, index) => (
              <FormControlLabel
                key={index}
                value={answer}
                control={<Radio />}
                label={answer}
                style={{ marginBottom: "10px" }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleNextQuestion}
          style={{ marginTop: "20px", width: "100%" }}
        >
          {questionState < questions.length - 1 ? "Next" : "Finish Quiz"}
        </Button>
      </Paper>
    );
  };

  const renderQuizResult = () => (
    <Paper
      elevation={3}
      style={{
        padding: "30px",
        marginTop: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
        Quiz Completed!
      </Typography>
      <Typography variant="h5" style={{ marginBottom: "20px" }}>
        Your score: {score} / {questions.length}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => window.location.reload()}
        style={{ marginTop: "20px", width: "100%" }}
      >
        Restart Quiz
      </Button>
    </Paper>
  );

  return (
    <Box p={4} style={{ textAlign: "center", backgroundColor: "#f4f4f9", minHeight: "100vh" }}>
      <Typography variant="h3" gutterBottom style={{ fontWeight: "bold", color: "#333" }}>
        Quiz App
      </Typography>

      {loading && <CircularProgress />}

      {!loading && questions.length > 0 && !isQuizComplete && renderQuestion()}

      {isQuizComplete && renderQuizResult()}
    </Box>
  );
}

export default App;
