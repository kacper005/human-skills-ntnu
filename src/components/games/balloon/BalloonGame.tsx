import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useBalloonGameController } from "./BalloonGameController"

import { StatsBox, StatsContainer, BalloonSprite, PoppedBalloon, CashedOutBalloon } from "../../molecules"
import { SkyBackground, GameOverScreen, GameHeader, PauseButton, PauseOverlay } from "../../organisms"


export function BalloonGame() {
  const navigate = useNavigate()
  const game = useBalloonGameController()

  useEffect(() => {
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "auto"
    }
  })

  useEffect(() => {
    game.startGame()
  }, [])

  const handleBack = () => {
    game.stopGame()
    navigate("/home")
  }

  if (game.showResult) {
    return (
      <div style={{ minHeight: "100vh", background: "#e2e8f0" }}>
        <GameHeader onBack={handleBack} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <GameOverScreen onPlayAgain={game.startGame} onHome={handleBack}>
            <p style={{ fontSize: "24px", fontWeight: "600", color: "#334155", marginBottom: "12px" }}>
              Total Score: <span style={{ color: "#ea580c" }}>{game.score}</span>
            </p>
            <p style={{ fontSize: "20px", color: "#475569", marginBottom: "8px" }}>
              Successful Balloons: {game.successfulBalloons}/{game.totalBalloons}
            </p>
            <p style={{ fontSize: "18px", color: "#64748b" }}>Average Points per Balloon: {game.avgPumps}</p>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "16px" }}>
              This game measures your risk-taking behavior and impulse control.
            </p>
          </GameOverScreen>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#e2e8f0" }}>
      <GameHeader onBack={handleBack} />

      <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ position: "relative" }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "16px", border: "2px solid #fed7aa", position: "relative" }}>
            <PauseButton isPaused={game.isPaused} onToggle={game.togglePause} />
            
            <div style={{ 
              position: "relative", 
              width: "700px", 
              height: "500px", 
              borderRadius: "8px", 
              overflow: "hidden",
              background: "linear-gradient(to bottom, #38bdf8, #7dd3fc, #bae6fd)"
            }}>
              <SkyBackground cloudCount={8} />

              <StatsContainer>
                <StatsBox label="Balloon" value={`${game.balloonNumber}/${game.totalBalloons}`} width="90px" variant="light" />
                <StatsBox label="Score" value={game.score} width="90px" variant="light" />
                <StatsBox 
                  label="This Balloon" 
                  value={<span style={{ color: "#16a34a", fontWeight: "bold" }}>{game.currentBalloonValue}</span>} 
                  width="100px" 
                  variant="light" 
                  isLast 
                />
              </StatsContainer>

              {game.countdown > 0 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, pointerEvents: "none" }}>
                  <div style={{ fontSize: "144px", fontWeight: "bold", color: "#334155", textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                    {game.countdown}
                  </div>
                </div>
              )}

              {game.isPaused && game.countdown === 0 && <PauseOverlay onResume={game.togglePause} />}

              {game.countdown === 0 && !game.isPaused && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "relative" }}>
                    {game.isPopped ? (
                      <PoppedBalloon />
                    ) : game.isCashedOut ? (
                      <CashedOutBalloon value={game.currentBalloonValue} />
                    ) : (
                      <BalloonSprite size={game.balloonSize} risk={game.risk} />
                    )}
                  </div>
                </div>
              )}

              {/* Fixed buttons at bottom */}
              {game.countdown === 0 && !game.isPaused && !game.isPopped && !game.isCashedOut && (
                <div style={{ position: "absolute", bottom: "60px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "12px" }}>
                  <Button 
                    onClick={game.handlePump} 
                    size="small"
                    variant="contained" 
                    color="warning"
                    sx={{ px: 3, py: 1 }}
                  >
                    Pump (Space)
                  </Button>
                  <Button 
                    onClick={game.handleCashOut} 
                    size="small"
                    variant="outlined" 
                    color="success"
                    disabled={game.currentBalloonValue === 0}
                    sx={{ px: 3, py: 1 }}
                  >
                    Cash Out (Enter)
                  </Button>
                </div>
              )}

              {/* Pumps counter */}
              {game.countdown === 0 && !game.isPaused && (
                <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", color: "#475569", fontSize: "14px" }}>
                  Pumps: {game.currentPumps}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "100px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
            <span style={{ background: "#f1f5f9", padding: "4px 12px", borderRadius: "9999px" }}>
              Tip: Use SPACE to pump and ENTER to cash out
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BalloonGame