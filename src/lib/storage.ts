import type { PersistedGameState } from "./types"

const STORAGE_KEY = "arabic-movie-game-state-v1"

export function saveGameState(state: PersistedGameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // quota or private mode
  }
}

export function loadGameState(): PersistedGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedGameState
  } catch {
    return null
  }
}

export function clearGameState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
