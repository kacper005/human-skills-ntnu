export const ATTENTION_GAME_DURATION = 60
export const ATTENTION_COUNTDOWN = 3
export const MAX_MULTIPLIER = 10
export const STREAK_FOR_MULTIPLIER = 4


export const SHUTTLE_FORMATIONS = [

  // Horizontal line
  [
    { x: -140, y: 0 },
    { x: -70, y: 0 },
    { x: 0, y: 0 },
    { x: 70, y: 0 },
    { x: 140, y: 0 },
  ],
  // Vertical line
  [
    { x: 0, y: -140 },
    { x: 0, y: -70 },
    { x: 0, y: 0 },
    { x: 0, y: 70 },
    { x: 0, y: 140 },
  ],
  // Diagonal (top-left to bottom-right)
  [
    { x: -120, y: -120 },
    { x: -60, y: -60 },
    { x: 0, y: 0 },
    { x: 60, y: 60 },
    { x: 120, y: 120 },
  ],
  // L-shape
  [
    { x: 0, y: -120 },
    { x: 0, y: -60 },
    { x: 0, y: 0 },
    { x: 60, y: 0 },
    { x: 120, y: 0 },
  ],
  // Plus/cross
  [
    { x: 0, y: -120 },
    { x: -60, y: 0 },
    { x: 0, y: 0 },
    { x: 60, y: 0 },
    { x: 0, y: 120 },
  ],
  // Diagonal (bottom-left to top-right)
  [
    { x: -140, y: 120 },
    { x: -70, y: 60 },
    { x: 0, y: 0 },
    { x: 70, y: -60 },
    { x: 140, y: -120 },
  ],
  // Diamond formation
  [
    { x: 0, y: 0 },
    { x: 0, y: -100 },
    { x: 0, y: 100 },
    { x: -70, y: -50 },
    { x: 70, y: -50 },
    { x: -70, y: 50 },
    { x: 70, y: 50 },
  ],
  // V formation
  [
    { x: 0, y: 0 },
    { x: -60, y: 60 },
    { x: 60, y: 60 },
    { x: -100, y: 100 },
    { x: 100, y: 100 },
  ],
]

export const DIRECTIONS: readonly ("up" | "down" | "left" | "right")[] = ["up", "down", "left", "right"]
