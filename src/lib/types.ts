import type { CategoryId, Question } from "./game-data"
import type { Rule } from "./rules-engine"

export type Team = {
  id: number
  name: string
  score: number
  skipNextTurn?: boolean
}

export type SpinnerOptionId = CategoryId | "choose_any"

export type GamePhase = "home" | "playing" | "ended"

export type RoundPhase = "idle" | "spinning" | "acting" | "spin_again"

export type GameCard = {
  id: string
  movie: Question
  series: Question
  play: Question
  song: Question
  rule: Rule
}

export type PersistedGameState = {
  phase: GamePhase
  teams: Team[]
  activeTeamIndex: number
  usedCardIds: string[]
  roundPhase: RoundPhase
  selectedOption: SpinnerOptionId | null
  currentCard: GameCard | null
  targetScore: number
  timerSeconds: number
}

export const MIN_TEAMS = 2
export const MAX_TEAMS = 6
export const DEFAULT_TARGET_SCORE = 15
export const MIN_TURN_SECONDS = 10
export const MAX_TURN_SECONDS = 120
export const DEFAULT_TURN_SECONDS = 30
