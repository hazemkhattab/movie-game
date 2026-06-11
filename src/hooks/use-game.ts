import { useCallback, useEffect, useMemo, useState } from "react"
import { generateCard, remainingCardsEstimate } from "@/lib/card-generator"
import { resolveRound } from "@/lib/rules-engine"
import { clearGameState, loadGameState, saveGameState } from "@/lib/storage"
import {
  DEFAULT_TARGET_SCORE,
  DEFAULT_TURN_SECONDS,
  MAX_TEAMS,
  MIN_TEAMS,
  type GameCard,
  type GamePhase,
  type PersistedGameState,
  type RoundPhase,
  type SpinnerOptionId,
  type Team,
} from "@/lib/types"

function defaultTeamNames(count: number) {
  const palette = ["الأزرق", "الأحمر", "الأخضر", "الذهبي", "البنفسجي", "البرتقالي"]
  return Array.from({ length: count }, (_, i) => `الفريق ${palette[i]}`)
}

function createTeams(names: string[]): Team[] {
  return names.map((name, i) => ({
    id: i + 1,
    name: name.trim() || `فريق ${i + 1}`,
    score: 0,
  }))
}

function nextTeamIndex(teams: Team[], current: number, steps = 1) {
  let index = current
  for (let step = 0; step < steps; step++) {
    index = (index + 1) % teams.length
    while (teams[index]?.skipNextTurn) {
      teams[index] = { ...teams[index], skipNextTurn: false }
      index = (index + 1) % teams.length
    }
  }
  return index
}

export function useGame() {
  const [phase, setPhase] = useState<GamePhase>("home")
  const [teamCount, setTeamCount] = useState(2)
  const [teamNames, setTeamNames] = useState(defaultTeamNames(2))
  const [teams, setTeams] = useState<Team[]>([])
  const [activeTeamIndex, setActiveTeamIndex] = useState(0)
  const [roundPhase, setRoundPhase] = useState<RoundPhase>("idle")
  const [selectedOption, setSelectedOption] = useState<SpinnerOptionId | null>(null)
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null)
  const [usedCardIds, setUsedCardIds] = useState<string[]>([])
  const [targetScore, setTargetScore] = useState(DEFAULT_TARGET_SCORE)
  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TURN_SECONDS)
  const [timerKey, setTimerKey] = useState(0)
  const [savedGame, setSavedGame] = useState<PersistedGameState | null>(null)

  const activeTeam = teams[activeTeamIndex] ?? null
  const winner = useMemo(() => {
    if (phase !== "ended" || teams.length === 0) return null
    const max = Math.max(...teams.map((t) => t.score))
    const leaders = teams.filter((t) => t.score === max)
    return leaders.length === 1 ? leaders[0] : null
  }, [phase, teams])

  const remainingCards = useMemo(
    () => remainingCardsEstimate(usedCardIds.length),
    [usedCardIds.length],
  )

  const persist = useCallback(
    (overrides: Partial<PersistedGameState> = {}) => {
      if (phase === "home") return
      saveGameState({
        phase,
        teams,
        activeTeamIndex,
        usedCardIds,
        roundPhase,
        selectedOption,
        currentCard,
        targetScore,
        timerSeconds,
        ...overrides,
      })
    },
    [
      phase,
      teams,
      activeTeamIndex,
      usedCardIds,
      roundPhase,
      selectedOption,
      currentCard,
      targetScore,
      timerSeconds,
    ],
  )

  useEffect(() => {
    const saved = loadGameState()
    if (!saved || saved.phase === "home") return

    setSavedGame(saved)
    setTeamCount(saved.teams.length)
    setTeamNames(saved.teams.map((t) => t.name))
    setTargetScore(saved.targetScore)
    if (saved.timerSeconds) setTimerSeconds(saved.timerSeconds)
  }, [])

  useEffect(() => {
    if (phase !== "home") persist()
  }, [phase, teams, activeTeamIndex, usedCardIds, roundPhase, selectedOption, currentCard, targetScore, timerSeconds, persist])

  const setTeamsOnHome = useCallback((count: number) => {
    const clamped = Math.min(MAX_TEAMS, Math.max(MIN_TEAMS, count))
    setTeamCount(clamped)
    setTeamNames((prev) => {
      const next = [...prev]
      while (next.length < clamped) {
        next.push(defaultTeamNames(clamped)[next.length] ?? `فريق ${next.length + 1}`)
      }
      return next.slice(0, clamped)
    })
  }, [])

  const updateTeamName = useCallback((index: number, name: string) => {
    setTeamNames((prev) => prev.map((n, i) => (i === index ? name : n)))
  }, [])

  const startGame = useCallback(() => {
    const built = createTeams(teamNames.slice(0, teamCount))
    setTeams(built)
    setActiveTeamIndex(0)
    setUsedCardIds([])
    setRoundPhase("idle")
    setSelectedOption(null)
    setCurrentCard(null)
    setPhase("playing")
    setSavedGame(null)
    clearGameState()
    saveGameState({
      phase: "playing",
      teams: built,
      activeTeamIndex: 0,
      usedCardIds: [],
      roundPhase: "idle",
      selectedOption: null,
      currentCard: null,
      targetScore,
      timerSeconds,
    })
  }, [teamCount, teamNames, targetScore, timerSeconds])

  const resumeGame = useCallback(() => {
    if (!savedGame) return

    setPhase(savedGame.phase)
    setTeams(savedGame.teams)
    setActiveTeamIndex(savedGame.activeTeamIndex)
    setUsedCardIds(savedGame.usedCardIds)
    setRoundPhase(savedGame.roundPhase)
    setSelectedOption(savedGame.selectedOption)
    setCurrentCard(savedGame.currentCard)
    setTargetScore(savedGame.targetScore)
    setTimerSeconds(savedGame.timerSeconds ?? DEFAULT_TURN_SECONDS)
    setTeamCount(savedGame.teams.length)
    setTeamNames(savedGame.teams.map((t) => t.name))
    setSavedGame(null)
  }, [savedGame])

  const discardSavedGame = useCallback(() => {
    clearGameState()
    setSavedGame(null)
  }, [])

  const beginSpin = useCallback(() => {
    setRoundPhase("spinning")
    setSelectedOption(null)
    setCurrentCard(null)
  }, [])

  const onSpinComplete = useCallback(
    (option: SpinnerOptionId) => {
      const card = generateCard(usedCardIds)
      if (!card) {
        setPhase("ended")
        setRoundPhase("idle")
        return
      }

      setSelectedOption(option)
      setCurrentCard(card)
      setUsedCardIds((prev) => [...prev, card.id])
      setRoundPhase("acting")
      setTimerKey((k) => k + 1)
    },
    [usedCardIds],
  )

  const resolveTurn = useCallback(
    (success: boolean) => {
      if (!currentCard || !activeTeam) return { spinAgain: false }

      const resolution = resolveRound(currentCard.rule, success)
      const teamId = activeTeam.id

      const updated = teams.map((t) => {
        if (t.id !== teamId) return t
        return {
          ...t,
          score: Math.max(0, t.score + resolution.points),
          skipNextTurn: resolution.skipNextTurn ? true : t.skipNextTurn,
        }
      })

      setTeams(updated)

      if (updated.some((t) => t.score >= targetScore)) {
        setPhase("ended")
        setRoundPhase("idle")
        setSelectedOption(null)
        setCurrentCard(null)
        return { spinAgain: false }
      }

      if (resolution.spinAgain) {
        setRoundPhase("spin_again")
        setSelectedOption(null)
        setCurrentCard(null)
        return { spinAgain: true }
      }

      const teamsCopy = updated.map((t) => ({ ...t }))
      setActiveTeamIndex(nextTeamIndex(teamsCopy, activeTeamIndex))
      setRoundPhase("idle")
      setSelectedOption(null)
      setCurrentCard(null)
      return { spinAgain: false }
    },
    [activeTeam, activeTeamIndex, currentCard, targetScore, teams],
  )

  const endGame = useCallback(() => {
    setPhase("ended")
    setRoundPhase("idle")
  }, [])

  const resetAll = useCallback(() => {
    clearGameState()
    setPhase("home")
    setTeams([])
    setActiveTeamIndex(0)
    setRoundPhase("idle")
    setSelectedOption(null)
    setCurrentCard(null)
    setUsedCardIds([])
    setSavedGame(null)
    setTeamCount(2)
    setTeamNames(defaultTeamNames(2))
  }, [])

  const continueFromSpinAgain = useCallback(() => {
    setRoundPhase("idle")
  }, [])

  return {
    phase,
    teamCount,
    teamNames,
    teams,
    activeTeam,
    activeTeamIndex,
    roundPhase,
    selectedOption,
    currentCard,
    usedCardIds,
    targetScore,
    timerSeconds,
    timerKey,
    winner,
    savedGame,
    remainingCards,
    setTeamsOnHome,
    updateTeamName,
    setTargetScore,
    setTimerSeconds,
    startGame,
    resumeGame,
    discardSavedGame,
    beginSpin,
    onSpinComplete,
    resolveTurn,
    endGame,
    resetAll,
    continueFromSpinAgain,
  }
}
