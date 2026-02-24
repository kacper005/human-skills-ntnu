"use client"

import { useState, useEffect, useCallback } from "react"
import type { GameScreen, Feedback } from "../types"

export type MatchRule = "color" | "shape" | "number"
export type CardShape = "circle" | "triangle" | "square" | "star"
export type CardColor = "red" | "green" | "blue" | "yellow"

export interface Card {
  color: CardColor
  shape: CardShape
  count: number
}

const COGFLEX_GAME_DURATION = 120
const COGFLEX_COUNTDOWN = 3
const MIN_RULE_CHANGE_INTERVAL = 5
const MAX_RULE_CHANGE_INTERVAL = 12

const SHAPES: CardShape[] = ["circle", "triangle", "square", "star"]
const COLORS: CardColor[] = ["red", "green", "blue", "yellow"]
const COUNTS = [1, 2, 3, 4]

export interface CogFlexGameState {
  screen: GameScreen
  score: number
  timeLeft: number
  correctAnswers: number
  totalAnswers: number
  isGameActive: boolean
  isPaused: boolean
  countdown: number
  masterCard: Card | null
  optionCards: Card[]
  currentRule: MatchRule
  feedback: Feedback | null
  answersSinceRuleChange: number
  nextRuleChangeAt: number
  showRuleHint: boolean
  accuracy: number
  isGameOver: boolean
}

export interface CogFlexGameActions {
  startGame: () => void
  stopGame: () => void
  togglePause: () => void
  handleCardSelect: (index: number) => void
  setScreen: (screen: GameScreen) => void
}

function generateRandomCard(): Card {
  return {
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    count: COUNTS[Math.floor(Math.random() * COUNTS.length)],
  }
}

function generateOptionCards(masterCard: Card, rule: MatchRule): Card[] {
  const options: Card[] = []

  const correctCard: Card = {
    color: rule === "color" ? masterCard.color : COLORS.filter(c => c !== masterCard.color)[Math.floor(Math.random() * 3)],
    shape: rule === "shape" ? masterCard.shape : SHAPES.filter(s => s !== masterCard.shape)[Math.floor(Math.random() * 3)],
    count: rule === "number" ? masterCard.count : COUNTS.filter(n => n !== masterCard.count)[Math.floor(Math.random() * 3)],
  }

  const correctIndex = Math.floor(Math.random() * 4)

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push(correctCard)
    } else {
      let incorrectCard: Card
      let attempts = 0
      do {
        incorrectCard = generateRandomCard()
        attempts++
        const matchesByRule = 
          (rule === "color" && incorrectCard.color === masterCard.color) ||
          (rule === "shape" && incorrectCard.shape === masterCard.shape) ||
          (rule === "number" && incorrectCard.count === masterCard.count)

        if (!matchesByRule) break
      } while (attempts < 50)

      options.push(incorrectCard)
    }
  }

  return options
}

function checkMatch(masterCard: Card, optionCard: Card, rule: MatchRule): boolean {
  switch (rule) {
    case "color":
      return masterCard.color === optionCard.color
    case "shape":
      return masterCard.shape === optionCard.shape
    case "number":
      return masterCard.count === optionCard.count
    default:
      return false
  }
}

export function useCogFlexGameController(): CogFlexGameState & CogFlexGameActions {
  const [screen, setScreen] = useState<GameScreen>("description")

  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(COGFLEX_GAME_DURATION)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAnswers, setTotalAnswers] = useState(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [countdown, setCountdown] = useState(COGFLEX_COUNTDOWN)
  const [masterCard, setMasterCard] = useState<Card | null>(null)
  const [optionCards, setOptionCards] = useState<Card[]>([])
  const [currentRule, setCurrentRule] = useState<MatchRule>("color")
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [answersSinceRuleChange, setAnswersSinceRuleChange] = useState(0)
  const [nextRuleChangeAt, setNextRuleChangeAt] = useState(
    MIN_RULE_CHANGE_INTERVAL + Math.floor(Math.random() * (MAX_RULE_CHANGE_INTERVAL -
      MIN_RULE_CHANGE_INTERVAL))
  )
  const [showRuleHint, setShowRuleHint] = useState(false)

  const getNewRule = useCallback((current: MatchRule): MatchRule => {
    const rules: MatchRule[] = ["color", "shape", "number"]
    const otherRules = rules.filter(r => r !== current)
    return otherRules[Math.floor(Math.random() * otherRules.length)]
  }, [])

  const generateNewRound = useCallback((rule: MatchRule) => {
    const master = generateRandomCard()
    const options = generateOptionCards(master, rule)
    setMasterCard(master)
    setOptionCards(options)
    setFeedback(null)
  }, [])

  const handleCardSelect = useCallback(
    (index: number) => {
      if (!isGameActive || isPaused || !masterCard || feedback !== null) return
      
      const selectedCard = optionCards[index]
      const isCorrect = checkMatch(masterCard, selectedCard, currentRule)

      setTotalAnswers(prev => prev + 1)

      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1)
        const timeBonus = Math.max(1, Math.floor(timeLeft / 20))
        setScore(prev => prev + (10 * timeBonus))
        setFeedback("correct")

        const newAnswersSinceRuleChange = answersSinceRuleChange + 1
        setAnswersSinceRuleChange(newAnswersSinceRuleChange)

        if (newAnswersSinceRuleChange >= nextRuleChangeAt) {
          const newRule = getNewRule(currentRule)
          setCurrentRule(newRule)
          setAnswersSinceRuleChange(0)
          setNextRuleChangeAt(
            MIN_RULE_CHANGE_INTERVAL + Math.floor(Math.random() * (MAX_RULE_CHANGE_INTERVAL -
              MIN_RULE_CHANGE_INTERVAL))
          )
          setShowRuleHint(true)
          setTimeout(() => setShowRuleHint(false), 1500)

          setTimeout(() => generateNewRound(newRule), 600)
      } else {
        setTimeout(() => generateNewRound(currentRule), 600)
      }
    } else {
      setFeedback("wrong")
      setTimeout(() => {
        setFeedback(null)
      }, 600)
    }
  },
    [isGameActive, isPaused, masterCard, optionCards, currentRule, feedback, timeLeft, 
    answersSinceRuleChange, nextRuleChangeAt, getNewRule, generateNewRound]
  )

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isGameActive || isPaused || feedback !== null) return

      const keyMap: Record<string, number> = {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
      }

      const index = keyMap[e.key]
      if (index !== undefined) handleCardSelect(index)
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleCardSelect, isGameActive, isPaused, feedback])

  useEffect(() => {
    if (countdown > 0 && isGameActive) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && isGameActive && !masterCard) {
      generateNewRound(currentRule)
    }
  }, [countdown, isGameActive, masterCard, currentRule, generateNewRound])

  useEffect(() => {
    if (isGameActive && countdown === 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isGameActive, isPaused, countdown])

  const startGame = useCallback(() => {
    const initialRule: MatchRule = ["color", "shape", "number"][Math.floor(Math.random() * 3)] as MatchRule
    setIsGameActive(true)
    setScore(0)
    setTimeLeft(COGFLEX_GAME_DURATION)
    setCountdown(COGFLEX_COUNTDOWN)
    setCorrectAnswers(0)
    setTotalAnswers(0)
    setCurrentRule(initialRule)
    setMasterCard(null)
    setOptionCards([])
    setAnswersSinceRuleChange(0)
    setNextRuleChangeAt(
      MIN_RULE_CHANGE_INTERVAL + Math.floor(Math.random() * (MAX_RULE_CHANGE_INTERVAL -
        MIN_RULE_CHANGE_INTERVAL))
      )
      setFeedback(null)
      setScreen("game")
  }, [])

  const stopGame = useCallback(() => {
    setIsGameActive(false)
  }, [])

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev)
  }, [])

  const accuracy = totalAnswers === 0 ? 0 : Math.round((correctAnswers / totalAnswers) * 100)

  const isGameOver = !isGameActive && timeLeft === 0

  return {
    screen,
    score,
    timeLeft,
    correctAnswers,
    totalAnswers,
    isGameActive,
    isPaused,
    countdown,
    masterCard,
    optionCards,
    currentRule,
    feedback,
    answersSinceRuleChange,
    nextRuleChangeAt,
    showRuleHint,
    accuracy,
    isGameOver,

    startGame,
    stopGame,
    togglePause,
    handleCardSelect,
    setScreen,
  }
}