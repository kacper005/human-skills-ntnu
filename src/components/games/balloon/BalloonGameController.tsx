"use client"

import { useState, useEffect, useCallback } from "react"
import type { GameScreen } from "../types"
import {
  TOTAL_BALLOONS,
  MAX_POP_THRESHOLD,
  MIN_POP_THRESHOLD,
  BALLOON_SIZE_INCREMENT,
  INITIAL_BALLOON_SIZE,
} from "../constants"

// ============================================
// BALLOON GAME CONTROLLER
// All game logic and state management
// ============================================

export interface BalloonGameState {
  screen: GameScreen
  score: number
  balloonNumber: number
  currentPumps: number
  currentBalloonValue: number
  balloonSize: number
  isPopped: boolean
  isCashedOut: boolean
  isPaused: boolean
  isGameActive: boolean
  countdown: number
  showResult: boolean
  avgPumps: string
  successfulBalloons: number
  risk: number
  totalBalloons: number
}

export interface BalloonGameActions {
  startGame: () => void
  stopGame: () => void
  togglePause: () => void
  handlePump: () => void
  handleCashOut: () => void
  setScreen: (screen: GameScreen) => void
}

export function useBalloonGameController(): BalloonGameState & BalloonGameActions {
  // Screen state
  const [screen, setScreen] = useState<GameScreen>("description")

  // Game state
  const [score, setScore] = useState(0)
  const [balloonNumber, setBalloonNumber] = useState(1)
  const [currentPumps, setCurrentPumps] = useState(0)
  const [currentBalloonValue, setCurrentBalloonValue] = useState(0)
  const [balloonSize, setBalloonSize] = useState(INITIAL_BALLOON_SIZE)
  const [isPopped, setIsPopped] = useState(false)
  const [isCashedOut, setIsCashedOut] = useState(false)
  const [popThreshold, setPopThreshold] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isGameActive, setIsGameActive] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [showResult, setShowResult] = useState(false)
  const [pumpHistory, setPumpHistory] = useState<number[]>([])

  // Generate random pop threshold
  const generatePopThreshold = useCallback(() => {
    return Math.floor(Math.random() * (MAX_POP_THRESHOLD - MIN_POP_THRESHOLD + 1)) + MIN_POP_THRESHOLD
  }, [])

  // Start a new balloon
  const startNewBalloon = useCallback(() => {
    setCurrentPumps(0)
    setCurrentBalloonValue(0)
    setBalloonSize(INITIAL_BALLOON_SIZE)
    setIsPopped(false)
    setIsCashedOut(false)
    setPopThreshold(generatePopThreshold())
  }, [generatePopThreshold])

  // Handle pump action
  const handlePump = useCallback(() => {
    if (!isGameActive || isPaused || isPopped || isCashedOut) return

    const newPumps = currentPumps + 1
    const newValue = currentBalloonValue + 1
    const newSize = balloonSize + BALLOON_SIZE_INCREMENT

    if (newPumps >= popThreshold) {
      setIsPopped(true)
      setPumpHistory((prev) => [...prev, 0])

      setTimeout(() => {
        if (balloonNumber < TOTAL_BALLOONS) {
          setBalloonNumber((prev) => prev + 1)
          startNewBalloon()
        } else {
          setIsGameActive(false)
          setShowResult(true)
        }
      }, 1500)
    } else {
      setCurrentPumps(newPumps)
      setCurrentBalloonValue(newValue)
      setBalloonSize(newSize)
    }
  }, [isGameActive, isPaused, isPopped, isCashedOut, currentPumps, currentBalloonValue, balloonSize, popThreshold, balloonNumber, startNewBalloon])

  // Handle cash out
  const handleCashOut = useCallback(() => {
    if (!isGameActive || isPaused || isPopped || isCashedOut || currentBalloonValue === 0) return

    setIsCashedOut(true)
    setScore((prev) => prev + currentBalloonValue)
    setPumpHistory((prev) => [...prev, currentBalloonValue])

    setTimeout(() => {
      if (balloonNumber < TOTAL_BALLOONS) {
        setBalloonNumber((prev) => prev + 1)
        startNewBalloon()
      } else {
        setIsGameActive(false)
        setShowResult(true)
      }
    }, 1000)
  }, [isGameActive, isPaused, isPopped, isCashedOut, currentBalloonValue, balloonNumber, startNewBalloon])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isGameActive || isPaused) return

      if (e.code === "Space") {
        e.preventDefault()
        handlePump()
      } else if (e.key === "Enter") {
        e.preventDefault()
        handleCashOut()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handlePump, handleCashOut, isGameActive, isPaused])

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && isGameActive) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && isGameActive && !popThreshold) {
      startNewBalloon()
    }
  }, [countdown, isGameActive, popThreshold, startNewBalloon])

  // Start game
  const startGame = useCallback(() => {
    setIsGameActive(true)
    setScore(0)
    setBalloonNumber(1)
    setCountdown(3)
    setShowResult(false)
    setPumpHistory([])
    setPopThreshold(0)
    setScreen("game")
  }, [])

  // Stop game
  const stopGame = useCallback(() => {
    setIsGameActive(false)
  }, [])

  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  // Calculate stats
  const avgPumps = pumpHistory.length > 0
    ? (pumpHistory.reduce((a, b) => a + b, 0) / pumpHistory.length).toFixed(1)
    : "0"
  const successfulBalloons = pumpHistory.filter((p) => p > 0).length
  const risk = currentPumps / MAX_POP_THRESHOLD

  return {
    // State
    screen,
    score,
    balloonNumber,
    currentPumps,
    currentBalloonValue,
    balloonSize,
    isPopped,
    isCashedOut,
    isPaused,
    isGameActive,
    countdown,
    showResult,
    avgPumps,
    successfulBalloons,
    risk,
    totalBalloons: TOTAL_BALLOONS,

    // Actions
    startGame,
    stopGame,
    togglePause,
    handlePump,
    handleCashOut,
    setScreen,
  }
}
