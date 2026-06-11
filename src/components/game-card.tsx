import { useMemo, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Eye, EyeOff, Lightbulb, X } from "lucide-react"
import { CATEGORY_MAP, type CategoryId } from "@/lib/game-data"
import {
  applyTitleTransform,
  getActiveCategories,
  getScoreMultiplier,
} from "@/lib/rules-engine"
import type { GameCard as GameCardType } from "@/lib/types"
import type { SpinnerOptionId } from "@/lib/types"
import { cn } from "@/lib/utils"
import { GlassCard } from "./ui/glass-card"
import { Button } from "./ui/button"

type GameCardProps = {
  card: GameCardType
  selectedOption: SpinnerOptionId
  activeTeamName: string
  onSuccess: () => void
  onFail: () => void
}

const CATEGORY_ORDER: CategoryId[] = ["movie", "series", "play", "song"]

export function GameCard({
  card,
  selectedOption,
  activeTeamName,
  onSuccess,
  onFail,
}: GameCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const activeCategories = getActiveCategories(selectedOption)
  const multiplier = getScoreMultiplier(card.rule)
  const isChooseAny = selectedOption === "choose_any"

  useEffect(() => {
    setShowAnswer(false)
  }, [card.id])

  const displayTitles = useMemo(() => {
    const map = {} as Record<CategoryId, string>
    for (const cat of CATEGORY_ORDER) {
      const question = card[cat]
      map[cat] = applyTitleTransform(card.rule, question)
    }
    return map
  }, [card])

  return (
    <GlassCard className="w-full p-4 sm:p-6" glow="245,197,66">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">دور</p>
          <p className="text-lg font-extrabold">{activeTeamName}</p>
        </div>
        {isChooseAny && (
          <span className="rounded-full bg-cat-any/20 px-3 py-1 text-sm font-bold text-cat-any">
            اختر أي فئة
          </span>
        )}
      </div>

      {/* Rule banner */}
      <motion.div
        initial={{ x: -12, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3"
      >
        <div className="flex items-start gap-2">
          <span className="text-xl">{card.rule.icon}</span>
          <div>
            <p className="text-sm font-extrabold text-amber-200">{card.rule.label}</p>
            <p className="text-xs text-amber-100/70">{card.rule.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Category sections */}
      <div className="mb-5 grid gap-2.5">
        {CATEGORY_ORDER.map((catId, i) => {
          const cat = CATEGORY_MAP[catId]
          const isHighlighted = activeCategories.includes(catId)
          const question = card[catId]

          return (
            <motion.div
              key={catId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-3 transition-all sm:p-4",
                isHighlighted
                  ? "border-white/25 shadow-lg"
                  : "border-white/5 opacity-50",
              )}
              style={
                isHighlighted
                  ? {
                      backgroundColor: `color-mix(in oklch, ${cat.colorVar} 18%, transparent)`,
                      boxShadow: `0 0 24px -6px rgba(${cat.glowRgb}, 0.45)`,
                    }
                  : { backgroundColor: "rgba(255,255,255,0.03)" }
              }
            >
              {isHighlighted && (
                <motion.div
                  layoutId="highlight-pulse"
                  className="absolute inset-y-0 right-0 w-1 rounded-full"
                  style={{ backgroundColor: cat.colorVar }}
                />
              )}

              <div className="mb-1 flex items-center justify-between gap-2">
                <span
                  className="rounded-full px-3 py-0.5 text-xs font-extrabold text-background"
                  style={{ backgroundColor: cat.colorVar }}
                >
                  {cat.label}
                </span>
                {question.year && (
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {question.year}
                  </span>
                )}
              </div>

              <p className="text-base font-bold leading-relaxed sm:text-lg">
                {displayTitles[catId]}
              </p>

              {question.hint && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Lightbulb className="size-3" />
                  {question.hint}
                </p>
              )}

              {isHighlighted && (
                <div className="mt-2">
                  {showAnswer ? (
                    <p
                      className="flex items-center gap-1 text-xs font-semibold"
                      style={{ color: cat.colorVar }}
                    >
                      <Eye className="size-3" />
                      الإجابة: {question.answer}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAnswer(true)}
                      className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <EyeOff className="size-3" />
                      إظهار الإجابة
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Score actions */}
      <div className="flex gap-3">
        <Button
          variant="success"
          size="lg"
          className="flex-1"
          onClick={onSuccess}
        >
          <Check className="size-5" />
          نجح
          {multiplier > 1 && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
              +{multiplier}
            </span>
          )}
        </Button>
        <Button
          variant="danger"
          size="lg"
          className="flex-1"
          onClick={onFail}
        >
          <X className="size-5" />
          فشل
        </Button>
      </div>
    </GlassCard>
  )
}
