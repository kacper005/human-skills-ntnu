"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Direction, Feedback, ShuttlePosition } from "../types"
import {
  ATTENTION_GAME_DURATION,
  ATTENTION_COUNTDOWN,
  MAX_MULTIPLIER,
  STREAK_FOR_MULTIPLIER,
  SHUTTLE_FORMATIONS,
  DIRECTIONS,
} from "../constants"

export interface AttentionGameState {
  score: number
  timeLeft: number
  streak: number
  multiplier: number
  showMultiplierAnimation: boolean
  isGameActive: boolean
  isPaused: boolean
  countdown: number
  shuttles: ShuttlePosition[]
  feedback: Feedback
  showShuttles: boolean
  totalAnswers: number
  accuracy: number
  isGameOver: boolean
}

export interface AttentionGameActions {
  startGame: () => void
  stopGame: () => void
  togglePause: () => void
  handleAnswer: (direction: Direction) => void
}

export function useAttentionGameController(): AttentionGameState & AttentionGameActions {

  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ATTENTION_GAME_DURATION)
  const [streak, setStreak] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [showMultiplierAnimation, setShowMultiplierAnimation] = useState(false)

  const [isGameActive, setIsGameActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const [countdown, setCountdown] = useState(ATTENTION_COUNTDOWN)
  const [shuttles, setShuttles] = useState<ShuttlePosition[]>([])
  const [feedback, setFeedback] = useState<Feedback>(null)

  const [showShuttles, setShowShuttles] = useState(true)
  const [totalAnswers, setTotalAnswers] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)


  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0


  const generateShuttles = useCallback(() => {
    const formation = SHUTTLE_FORMATIONS[Math.floor(Math.random() * SHUTTLE_FORMATIONS.length)]
    const centerX = 450
    const centerY = 262.5

    const centerIndex = formation.findIndex(offset => offset.x === 0 && offset.y === 0)

    const targetIndex = centerIndex !== -1 ? centerIndex : 0

    const targetDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]

    return formation.map((offset, index) => ({
      x: centerX + offset.x,
      y: centerY + offset.y,
      direction: index === targetIndex ? targetDirection : DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
      isTarget: index === targetIndex,
    }))
  }, [])

  const startGame = useCallback(() => {
    setScore(0)
    setStreak(0)
    setMultiplier(1)
    setTimeLeft(ATTENTION_GAME_DURATION)
    setCountdown(ATTENTION_COUNTDOWN)
    setIsGameActive(false)
    setIsPaused(false)
    setTotalAnswers(0)
    setCorrectAnswers(0)
    setIsGameOver(false)
    setFeedback(null)
    setShowShuttles(true)
    setShuttles(generateShuttles())
  }, [generateShuttles])

  const stopGame = useCallback(() => {
    setIsGameActive(false)
    setIsGameOver(true)
    if (timerRef.current) clearInterval(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }, [])

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  const handleAnswer = useCallback(
    (direction: Direction) => {
      if (!isGameActive || isPaused || countdown > 0) return

      const target = shuttles.find((s) => s.isTarget)
      if (!target) return

      const isCorrect = target.direction === direction
      setFeedback(isCorrect ? "correct" : "wrong")
      setTotalAnswers((prev) => prev + 1)

      if (isCorrect) {
        setCorrectAnswers((prev) => prev + 1)
        const newStreak = streak + 1
        setStreak(newStreak)

        if (newStreak % STREAK_FOR_MULTIPLIER === 0 && multiplier < MAX_MULTIPLIER) {
          setMultiplier((prev) => Math.min(prev + 1, MAX_MULTIPLIER))
          setShowMultiplierAnimation(true)
          setTimeout(() => setShowMultiplierAnimation(false), 500)
        }

        setScore((prev) => prev + multiplier)
      } else {
        setStreak(0)
        setMultiplier(1)
      }

      setShowShuttles(false)
      setTimeout(() => {
        setFeedback(null)
        setShowShuttles(true)
        setShuttles(generateShuttles())
      }, 500)
    },
    [isGameActive, isPaused, countdown, shuttles, streak, multiplier, generateShuttles]
  )

  useEffect(() => {
    if (countdown > 0 && !isPaused) {
      countdownRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0 && !isGameActive && !isGameOver) {
      setIsGameActive(true)
      setShuttles(generateShuttles())
    }

    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current)
    }
  }, [countdown, isPaused, isGameActive, isGameOver, generateShuttles])

  useEffect(() => {
    if (isGameActive && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isGameActive, isPaused, timeLeft, stopGame])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      }

      if (keyMap[e.key]) {
        e.preventDefault()
        handleAnswer(keyMap[e.key])
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleAnswer])

  return {
    score,
    timeLeft,
    streak,
    multiplier,
    showMultiplierAnimation,
    isGameActive,
    isPaused,
    countdown,
    shuttles,
    feedback,
    showShuttles,
    totalAnswers,
    accuracy,
    isGameOver,

    startGame,
    stopGame,
    togglePause,
    handleAnswer,
  }
}