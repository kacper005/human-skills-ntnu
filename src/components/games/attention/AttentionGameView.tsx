"use client"

import { ArrowIcon } from "../../atoms"
import type { Direction, Feedback, ShuttlePosition } from "../types"

import { StatsBox, StatsContainer, MultiplierDisplay,
  FeedbackIndicator, ShuttleSprite } from "../../molecules"

import { GameHeader, PauseButton, PauseOverlay,
  Countdown, SpaceBackground } from "../../organisms"


  interface AttentionGameViewProps {
    timeLeft: number
    score: number
    streak: number
    multiplier: number
    showMultiplierAnimation: boolean
    isPaused: boolean
    countdown: number
    shuttles: ShuttlePosition[]
    feedback: Feedback
    showShuttles: boolean

    onBack: () => void
    onTogglePause: () => void
    onResume: () => void
    onAnswer: (direction: Direction) => void
  }

  export function AttentionGameView({
  timeLeft,
  score,
  streak,
  multiplier,
  showMultiplierAnimation,
  isPaused,
  countdown,
  shuttles,
  feedback,
  showShuttles,
  onBack,
  onTogglePause,
  onResume,
  onAnswer,
}: AttentionGameViewProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
      <GameHeader onBack={onBack} />

      <div className="relative">
        <div className="bg-white rounded-xl shadow-2xl p-4">
          <PauseButton isPaused={isPaused} onToggle={onTogglePause} />

          <div className="relative w-[700px] h-[500px] rounded-lg overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
            <SpaceBackground starCount={50} />

            <StatsContainer>
              <StatsBox label="Time" value={`${timeLeft}s`} width="90px" />
              <StatsBox label="Score" value={score} width="90px" />
              <StatsBox
                label="Multiplier"
                width="130px"
                isLast
                value={
                  <MultiplierDisplay
                    streak={streak}
                    multiplier={multiplier}
                    showAnimation={showMultiplierAnimation}
                  />
                }
              />
            </StatsContainer>

            <Countdown value={countdown} variant="dark" />

            {isPaused && countdown === 0 && <PauseOverlay onResume={onResume} />}

            {countdown === 0 && !isPaused && (
              <div className="absolute inset-0">
                {shuttles.map((shuttle, index) => (
                  <ShuttleSprite
                    key={index}
                    x={shuttle.x}
                    y={shuttle.y}
                    direction={shuttle.direction}
                    visible={showShuttles}
                  />
                ))}

                {feedback && <FeedbackIndicator type={feedback} />}
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {(["left", "up", "down", "right"] as Direction[]).map((dir) => (
                <Button
                  key={dir}
                  variant="outline"
                  size="small"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  onClick={() => onAnswer(dir)}
                >
                  <ArrowIcon direction={dir} />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
