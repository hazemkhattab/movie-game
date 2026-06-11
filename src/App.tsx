import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useGame } from "@/hooks/use-game"
import { useSound } from "@/hooks/use-sound"
import { EndGameScreen } from "@/screens/end-game-screen"
import { GameScreen } from "@/screens/game-screen"
import { HomeScreen } from "@/screens/home-screen"

export default function App() {
  const game = useGame()
  const { play: playSound, toggle: toggleSound, enabled: soundEnabled } = useSound()

  useEffect(() => {
    if (game.phase === "ended" && game.winner) {
      playSound("win")
    }
  }, [game.phase, game.winner?.id, playSound])

  function handleSpinStart() {
    playSound("spin")
    game.beginSpin()
  }

  function handleSpinComplete(option: Parameters<typeof game.onSpinComplete>[0]) {
    game.onSpinComplete(option)
    playSound("click")
  }

  function handleSuccess() {
    const result = game.resolveTurn(true)
    playSound("success")
    if (result.spinAgain) playSound("spin")
  }

  function handleFail() {
    const result = game.resolveTurn(false)
    playSound("fail")
    if (result.spinAgain) playSound("spin")
  }

  return (
    <AnimatePresence mode="wait">
      {game.phase === "home" && (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <HomeScreen
            teamCount={game.teamCount}
            teamNames={game.teamNames}
            targetScore={game.targetScore}
            timerSeconds={game.timerSeconds}
            savedGame={game.savedGame}
            onTeamCountChange={game.setTeamsOnHome}
            onTeamNameChange={game.updateTeamName}
            onTargetScoreChange={game.setTargetScore}
            onTimerSecondsChange={game.setTimerSeconds}
            onStart={() => {
              playSound("click")
              game.startGame()
            }}
            onResume={() => {
              playSound("click")
              game.resumeGame()
            }}
            onDiscardSaved={() => game.discardSavedGame()}
          />
        </motion.div>
      )}

      {game.phase === "playing" && game.activeTeam && (
        <motion.div
          key="game"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <GameScreen
            teams={game.teams}
            activeTeam={game.activeTeam}
            roundPhase={game.roundPhase}
            selectedOption={game.selectedOption}
            currentCard={game.currentCard}
            timerSeconds={game.timerSeconds}
            timerKey={game.timerKey}
            remainingCards={game.remainingCards}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            onSpinStart={handleSpinStart}
            onSpinComplete={handleSpinComplete}
            onSuccess={handleSuccess}
            onFail={handleFail}
            onEndGame={() => {
              playSound("click")
              game.endGame()
            }}
            onReset={() => {
              playSound("click")
              game.resetAll()
            }}
            onTimerTick={(r) => {
              if (r <= 5 && r > 0) playSound("tick")
            }}
            onTimerEnd={() => playSound("timer_end")}
            onContinueSpinAgain={() => {
              playSound("click")
              game.continueFromSpinAgain()
            }}
          />
        </motion.div>
      )}

      {game.phase === "ended" && (
        <motion.div
          key="end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <EndGameScreen
            teams={game.teams}
            winner={game.winner}
            onPlayAgain={() => {
              playSound("click")
              game.resetAll()
            }}
            onHome={() => {
              playSound("click")
              game.resetAll()
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
