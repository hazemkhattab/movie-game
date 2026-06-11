import { getRandomQuestion, type CategoryId } from "./game-data"
import { getRandomRule } from "./rules-engine"
import type { GameCard } from "./types"

function cardSignature(movie: string, series: string, play: string, song: string) {
  return `${movie}|${series}|${play}|${song}`
}

export function generateCard(usedSignatures: string[]): GameCard | null {
  const maxAttempts = 80

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const usedTitles = new Set<string>()

    const movie = getRandomQuestion("movie", [...usedTitles])
    usedTitles.add(movie.title)
    const series = getRandomQuestion("series", [...usedTitles])
    usedTitles.add(series.title)
    const play = getRandomQuestion("play", [...usedTitles])
    usedTitles.add(play.title)
    const song = getRandomQuestion("song", [...usedTitles])

    const signature = cardSignature(movie.title, series.title, play.title, song.title)
    if (usedSignatures.includes(signature)) continue

    const rule = getRandomRule()

    return {
      id: signature,
      movie,
      series,
      play,
      song,
      rule,
    }
  }

  return null
}

export function getQuestionForCategory(card: GameCard, category: CategoryId) {
  return card[category]
}

export function remainingCardsEstimate(usedCount: number) {
  const movies = 18
  const series = 20
  const plays = 14
  const songs = 16
  const theoretical = movies * series * plays * songs
  return Math.max(0, theoretical - usedCount)
}
