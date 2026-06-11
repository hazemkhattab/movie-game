"use client"

import { useState } from "react"
import { SpinnerWheel } from "@/components/spinner-wheel"
import { QuestionCard } from "@/components/question-card"
import { Scoreboard, type Team } from "@/components/scoreboard"
import {
  CATEGORIES,
  CATEGORY_MAP,
  getRandomQuestion,
  type CategoryId,
  type Question,
} from "@/lib/game-data"
import { Film, RotateCcw } from "lucide-react"

const INITIAL_TEAMS: Team[] = [
  { id: 1, name: "الفريق الأزرق", score: 0 },
  { id: 2, name: "الفريق الأحمر", score: 0 },
]

export default function Page() {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS)
  const [activeTeamId, setActiveTeamId] = useState(1)
  const [landed, setLanded] = useState<CategoryId | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [askedTitles, setAskedTitles] = useState<string[]>([])

  const activeTeam = teams.find((t) => t.id === activeTeamId)!

  function handleResult(category: CategoryId) {
    setLanded(category)
    const q = getRandomQuestion(category, askedTitles)
    setQuestion(q)
    setAskedTitles((prev) => [...prev, q.title])
  }

  function adjust(teamId: number, delta: number) {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId ? { ...t, score: Math.max(0, t.score + delta) } : t,
      ),
    )
  }

  function nextTurn() {
    setQuestion(null)
    setLanded(null)
    setActiveTeamId((id) => (id === 1 ? 2 : 1))
  }

  function award() {
    adjust(activeTeamId, 1)
    nextTurn()
  }

  function resetGame() {
    setTeams(INITIAL_TEAMS)
    setActiveTeamId(1)
    setQuestion(null)
    setLanded(null)
    setAskedTitles([])
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Film className="size-5" />
            </span>
            <div className="leading-tight">
              <h1 className="text-lg font-extrabold text-foreground">خمّن!</h1>
              <p className="text-[11px] text-muted-foreground">
                لعبة تخمين الأفلام والمسلسلات
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetGame}
            className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-accent"
          >
            <RotateCcw className="size-3.5" />
            جولة جديدة
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
        {/* Scoreboard */}
        <section aria-label="نقاط الفرق">
          <Scoreboard
            teams={teams}
            activeTeamId={activeTeamId}
            onAdjust={adjust}
          />
        </section>

        {/* Category legend */}
        <section className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((c) => (
            <div
              key={c.id}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/50 py-2.5"
            >
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: c.colorVar }}
              />
              <span className="text-xs font-bold text-card-foreground">
                {c.label}
              </span>
            </div>
          ))}
        </section>

        {/* Wheel or Question */}
        <section className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card/40 p-6">
          {question && landed ? (
            <QuestionCard
              question={question}
              activeTeam={activeTeam.name}
              onAward={award}
              onSkip={nextTurn}
            />
          ) : (
            <>
              <p className="text-center text-sm text-muted-foreground">
                أدر العجلة لتحديد الفئة، ثم خمّن الإجابة لتربح نقطة لفريقك
              </p>
              <SpinnerWheel onResult={handleResult} />
              {landed && (
                <p className="text-sm font-semibold text-foreground">
                  وقعت على:{" "}
                  <span style={{ color: CATEGORY_MAP[landed].colorVar }}>
                    {CATEGORY_MAP[landed].label}
                  </span>
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}
