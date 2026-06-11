import { AnimatePresence, motion } from "framer-motion"
import { Flag, Layers, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react"
import { CATEGORY_MAP, SPINNER_OPTIONS } from "@/lib/game-data"
import type { GameCard, RoundPhase, SpinnerOptionId, Team } from "@/lib/types"
import { CountdownTimer } from "@/components/countdown-timer"
import { GameCard as GameCardView } from "@/components/game-card"
import { Scoreboard } from "@/components/scoreboard"
import { SpinnerWheel } from "@/components/spinner-wheel"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"

type GameScreenProps = {
  teams: Team[]
  activeTeam: Team
  roundPhase: RoundPhase
  selectedOption: SpinnerOptionId | null
  currentCard: GameCard | null
  timerSeconds: number
  timerKey: number
  remainingCards: number
  soundEnabled: boolean
  onToggleSound: () => void
  onSpinStart: () => void
  onSpinComplete: (option: SpinnerOptionId) => void
  onSuccess: () => void
  onFail: () => void
  onEndGame: () => void
  onReset: () => void
  onTimerTick: (remaining: number) => void
  onTimerEnd: () => void
  onContinueSpinAgain: () => void
}

function getOptionLabel(id: SpinnerOptionId) {
  if (id === "choose_any") return "اختر أي"
  return CATEGORY_MAP[id]?.label ?? id
}

function getOptionColor(id: SpinnerOptionId) {
  const opt = SPINNER_OPTIONS.find((o) => o.id === id)
  return opt?.color ?? "var(--primary)"
}

export function GameScreen({
  teams,
  activeTeam,
  roundPhase,
  selectedOption,
  currentCard,
  timerSeconds,
  timerKey,
  remainingCards,
  soundEnabled,
  onToggleSound,
  onSpinStart,
  onSpinComplete,
  onSuccess,
  onFail,
  onEndGame,
  onReset,
  onTimerTick,
  onTimerEnd,
  onContinueSpinAgain,
}: GameScreenProps) {
  const showCard = roundPhase === "acting" && currentCard && selectedOption

  return (
    <div className="relative min-h-dvh pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-20 size-64 rounded-full bg-cat-series/10 blur-3xl" />
        <div className="absolute -left-16 bottom-32 size-72 rounded-full bg-cat-song/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">الدور الحالي</p>
            <motion.p
              key={activeTeam.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-extrabold"
            >
              {activeTeam.name}
            </motion.p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground sm:inline-flex">
              <Layers className="size-3" />
              {remainingCards} بطاقة
            </span>
            <button
              type="button"
              onClick={onToggleSound}
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={soundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
            >
              {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="إعادة تعيين"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              type="button"
              onClick={onEndGame}
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="إنهاء اللعبة"
            >
              <Flag className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-lg flex-col gap-5 px-6 py-5">
        <Scoreboard teams={teams} activeTeamId={activeTeam.id} compact />

        <p className="flex items-center justify-center gap-1 text-xs font-semibold text-muted-foreground sm:hidden">
          <Layers className="size-3.5" />
          {remainingCards} بطاقة متبقية
        </p>

        {showCard && (
          <CountdownTimer
            seconds={timerSeconds}
            active
            timerKey={timerKey}
            onTick={onTimerTick}
            onComplete={onTimerEnd}
          />
        )}

        <AnimatePresence mode="wait">
          {showCard ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {selectedOption && (
                <div className="mb-3 text-center">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-extrabold"
                    style={{
                      backgroundColor: `color-mix(in oklch, ${getOptionColor(selectedOption)} 22%, transparent)`,
                      color: getOptionColor(selectedOption),
                    }}
                  >
                    <Sparkles className="size-3.5" />
                    {getOptionLabel(selectedOption)}
                  </span>
                </div>
              )}
              <GameCardView
                card={currentCard}
                selectedOption={selectedOption!}
                activeTeamName={activeTeam.name}
                onSuccess={onSuccess}
                onFail={onFail}
              />
            </motion.div>
          ) : (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              <GlassCard className="flex flex-col items-center gap-8 px-8 py-14">
                {roundPhase === "spin_again" ? (
                  <div className="text-center">
                    <p className="mb-1 text-lg font-extrabold text-primary">أدر مرة أخرى!</p>
                    <p className="text-sm text-muted-foreground">
                      قاعدة البطاقة تمنح {activeTeam.name} دوراً إضافياً
                    </p>
                  </div>
                ) : (
                  <p className="max-w-xs text-center text-sm text-muted-foreground">
                    أدر العجلة لتحديد الفئة، ثم مثّل البطاقة قبل انتهاء الوقت
                  </p>
                )}
                <SpinnerWheel
                  onResult={onSpinComplete}
                  onSpinStart={onSpinStart}
                  disabled={roundPhase === "spinning"}
                />
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {roundPhase === "spin_again" && (
          <Button variant="secondary" onClick={onContinueSpinAgain} className="w-full">
            متابعة للعجلة
          </Button>
        )}
      </div>
    </div>
  )
}
