export type Direction = "up" | "down" | "left" | "right"
export type Feedback = "correct" | "wrong" | null
export type GameScreen = "description" | "game"

export interface GameProps {
  onBack: () => void
}

export interface ShuttlePosition {
  x: number
  y: number
  direction: Direction
  isTarget: boolean
}