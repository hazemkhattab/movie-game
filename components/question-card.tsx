"use client"

import { useState } from "react"
import { CATEGORY_MAP, type Question } from "@/lib/game-data"
import { Lightbulb, Eye, X } from "lucide-react"

type QuestionCardProps = {
  question: Question
  activeTeam: string
  onAward: () => void
  onSkip: () => void
}

export function QuestionCard({
  question,
  activeTeam,
  onAward,
  onSkip,
}: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const cat = CATEGORY_MAP[question.category]

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border bg-card p-6 shadow-2xl"
      style={{ borderColor: cat.colorVar }}
    >
      {/* top color bar */}
      <div
        className="absolute inset-x-0 top-0 h-2"
        style={{ backgroundColor: cat.colorVar }}
      />

      <div className="mb-5 mt-2 flex items-center justify-between">
        <span
          className="rounded-full px-4 py-1.5 text-sm font-extrabold text-background"
          style={{ backgroundColor: cat.colorVar }}
        >
          {cat.label}
        </span>
        <span className="text-sm font-semibold text-muted-foreground">
          دور: {activeTeam}
        </span>
      </div>

      <p className="mb-2 text-pretty text-xl font-bold leading-relaxed text-card-foreground sm:text-2xl">
        {question.title}
      </p>
      {question.year && (
        <p className="mb-4 font-mono text-sm text-muted-foreground">
          {question.year}
        </p>
      )}

      {/* Hint */}
      {showHint && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-secondary p-3 text-sm text-secondary-foreground">
          <Lightbulb className="mt-0.5 size-4 shrink-0" style={{ color: cat.colorVar }} />
          <span>{question.hint}</span>
        </div>
      )}

      {/* Answer */}
      {showAnswer && (
        <div
          className="mb-4 rounded-xl p-4 text-center"
          style={{ backgroundColor: `color-mix(in oklch, ${cat.colorVar} 18%, transparent)` }}
        >
          <span className="block text-xs font-semibold text-muted-foreground">
            الإجابة
          </span>
          <span className="text-2xl font-extrabold" style={{ color: cat.colorVar }}>
            {question.answer}
          </span>
        </div>
      )}

      {/* Reveal controls */}
      <div className="mb-5 flex gap-2">
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent"
        >
          <Lightbulb className="size-4" />
          تلميح
        </button>
        <button
          type="button"
          onClick={() => setShowAnswer((v) => !v)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent"
        >
          <Eye className="size-4" />
          {showAnswer ? "إخفاء الإجابة" : "إظهار الإجابة"}
        </button>
      </div>

      {/* Scoring */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onAward}
          className="flex-1 rounded-xl px-4 py-3 text-base font-bold text-background shadow-lg transition-transform active:scale-95"
          style={{ backgroundColor: cat.colorVar }}
        >
          إجابة صحيحة +1
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="flex items-center justify-center gap-1 rounded-xl border border-border bg-secondary px-4 py-3 text-base font-semibold text-secondary-foreground transition-colors hover:bg-accent"
        >
          <X className="size-4" />
          تخطٍّ
        </button>
      </div>
    </div>
  )
}
