import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AttentionGame, {
  Direction,
  Feedback,
  ShuttlePosition,
} from "./AttentionGame";

const SHUTTLE_COUNT = 5;

const AttentionGameController: React.FC = () => {
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [showMultiplierAnimation, setShowMultiplierAnimation] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true); // Start as true
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [shuttles, setShuttles] = useState<ShuttlePosition[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [showShuttles, setShowShuttles] = useState(true);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Generate random shuttle formation
  const generateShuttleFormation = useCallback((): ShuttlePosition[] => {
    const formations = [
      () => [
        { x: -140, y: 0 },
        { x: -70, y: 0 },
        { x: 0, y: 0 },
        { x: 70, y: 0 },
        { x: 140, y: 0 },
      ],
      () => [
        { x: 0, y: -140 },
        { x: 0, y: -70 },
        { x: 0, y: 0 },
        { x: 0, y: 70 },
        { x: 0, y: 140 },
      ],
      () => [
        { x: -120, y: -120 },
        { x: -60, y: -60 },
        { x: 0, y: 0 },
        { x: 60, y: 60 },
        { x: 120, y: 120 },
      ],
      () => [
        { x: 0, y: -120 },
        { x: 0, y: -60 },
        { x: 0, y: 0 },
        { x: 60, y: 0 },
        { x: 120, y: 0 },
      ],
      () => [
        { x: 0, y: -120 },
        { x: -60, y: 0 },
        { x: 0, y: 0 },
        { x: 60, y: 0 },
        { x: 0, y: 120 },
      ],
      () => [
        { x: -140, y: 120 },
        { x: -70, y: 60 },
        { x: 0, y: 0 },
        { x: 70, y: -60 },
        { x: 140, y: -120 },
      ],
    ];

    const formation = formations[Math.floor(Math.random() * formations.length)]();
    const targetIndex = 2; // middle shuttle is target
    const directions: Direction[] = ["up", "down", "left", "right"];
    const targetDirection = directions[Math.floor(Math.random() * 4)];

    const possibleDistractors = directions.filter((d) => d !== targetDirection);
    const distractorDirection =
      possibleDistractors[Math.floor(Math.random() * possibleDistractors.length)];

    const centerX = 180 + Math.random() * 340;
    const centerY = 130 + Math.random() * 240;

    return formation.map((pos, index) => ({
      x: centerX + pos.x,
      y: centerY + pos.y,
      direction: index === targetIndex ? targetDirection : distractorDirection,
      isTarget: index === targetIndex,
    }));
  }, []);

  // Start a new round
  const startNewRound = useCallback(() => {
    setShowShuttles(true);
    setShuttles(generateShuttleFormation());
    setFeedback(null);
  }, [generateShuttleFormation]);

  // Handle an answer
  const handleAnswer = useCallback(
    (answer: Direction) => {
      if (!isGameActive || isPaused || !showShuttles || countdown > 0) return;

      const targetShuttle = shuttles.find((s) => s.isTarget);
      if (!targetShuttle) return;

      const isCorrect = answer === targetShuttle.direction;
      setTotalAnswers((prev) => prev + 1);

      if (isCorrect) {
        setCorrectAnswers((prev) => prev + 1)
        setScore((prev) => prev + multiplier);
        const newStreak = streak + 1;
        setStreak(newStreak);

        if (newStreak === 4 && multiplier < 10) {
          setMultiplier((prev) => Math.min(prev + 1, 10));
          setStreak(0);
          setShowMultiplierAnimation(true);
          setTimeout(() => setShowMultiplierAnimation(false), 800);
        }

        setFeedback("correct");
      } else {
        setStreak(0);
        setMultiplier(1);
        setFeedback("wrong");
      }

      setShowShuttles(false);

      setTimeout(() => {
        startNewRound();
      }, 600);
    },
    [shuttles, isGameActive, isPaused, showShuttles, countdown, startNewRound, streak, multiplier]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      if (!isGameActive || isPaused || countdown > 0) return;

      switch (e.key) {
        case "ArrowUp":
          handleAnswer("up");
          break;
        case "ArrowDown":
          handleAnswer("down");
          break;
        case "ArrowLeft":
          handleAnswer("left");
          break;
        case "ArrowRight":
          handleAnswer("right");
          break;
        case "Escape":
          togglePause();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleAnswer, isGameActive, isPaused, countdown]);

  // Countdown timer
  useEffect(() => {
    if (!isGameActive || isPaused) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && shuttles.length === 0) {
      startNewRound();
    }
  }, [countdown, isGameActive, isPaused, shuttles.length, startNewRound]);

  // Game timer
  useEffect(() => {
    if (!isGameActive || countdown > 0 || isPaused) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isGameActive, countdown, isPaused]);

  const restartGame = () => {
    setIsGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setCountdown(3);
    setTotalAnswers(0);
    setCorrectAnswers(0);
    setShuttles([]);
    setStreak(0);
    setMultiplier(1);
    setShowMultiplierAnimation(false);
    setFeedback(null);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (countdown > 0) return; // Don't allow pause during countdown
    setIsPaused((p) => !p);
  };
  
  const exitGame = () => navigate("/");

  return (
    <AttentionGame
      score={score}
      timeLeft={timeLeft}
      streak={streak}
      multiplier={multiplier}
      showMultiplierAnimation={showMultiplierAnimation}
      isGameActive={isGameActive}
      isPaused={isPaused}
      countdown={countdown}
      shuttles={shuttles}
      feedback={feedback}
      showShuttles={showShuttles}
      totalAnswers={totalAnswers}
      correctAnswers={correctAnswers}
      shuttleCount={SHUTTLE_COUNT}
      onAnswer={handleAnswer}
      onRestart={restartGame}
      onTogglePause={togglePause}
      onExit={exitGame}
    />
  );
};

export default AttentionGameController;