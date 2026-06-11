import { motion } from "framer-motion"
import { Clapperboard, Minus, Play, Plus, Sparkles, Timer, Users, X } from "lucide-react"
import type { PersistedGameState } from "@/lib/types"
import { MAX_TEAMS, MIN_TEAMS, MAX_TURN_SECONDS, MIN_TURN_SECONDS } from "@/lib/types"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"

type HomeScreenProps = {
  teamCount: number
  teamNames: string[]
  targetScore: number
  timerSeconds: number
  savedGame: PersistedGameState | null
  onTeamCountChange: (count: number) => void
  onTeamNameChange: (index: number, name: string) => void
  onTargetScoreChange: (score: number) => void
  onTimerSecondsChange: (seconds: number) => void
  onStart: () => void
  onResume: () => void
  onDiscardSaved: () => void
}

export function HomeScreen({
  teamCount,
  teamNames,
  targetScore,
  timerSeconds,
  savedGame,
  onTeamCountChange,
  onTeamNameChange,
  onTargetScoreChange,
  onTimerSecondsChange,
  onStart,
  onResume,
  onDiscardSaved,
}: HomeScreenProps) {
  const canStart = teamNames.slice(0, teamCount).every((n) => n.trim().length > 0)
  const leader = savedGame
    ? [...savedGame.teams].sort((a, b) => b.score - a.score)[0]
    : null

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-1/4 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 size-80 rounded-full bg-cat-movie/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cat-any/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md space-y-6"
      >
        {/* Title */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-4 flex size-20 items-center justify-center rounded-3xl bg-primary/20 shadow-2xl ring-1 ring-primary/30 backdrop-blur-md"
          >
            <Clapperboard className="size-10 text-primary" />
          </motion.div>
          <h1 className="mb-2 text-4xl font-black tracking-tight sm:text-5xl">
            خمّن!
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            لعبة حفلات لتخمين الأفلام والمسلسلات والمسرحيات والأغاني
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            عجلة · بطاقات · قواعد مضحكة
          </div>
        </div>

        {savedGame && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard glow="245,197,66" className="border-primary/20">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="mb-1 text-xs font-semibold text-primary">لعبة محفوظة</p>
                  <p className="font-extrabold">استمر من حيث توقفت</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {savedGame.teams.length} فرق
                    {leader ? ` · المتصدر: ${leader.name} (${leader.score})` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onDiscardSaved}
                  className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="حذف اللعبة المحفوظة"
                >
                  <X className="size-4" />
                </button>
              </div>
              <Button size="lg" className="mt-4 w-full" onClick={onResume}>
                <Play className="size-5" />
                استمر في اللعبة
              </Button>
            </GlassCard>
          </motion.div>
        )}

        {/* Team count */}
        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <h2 className="font-extrabold">عدد الفرق</h2>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="تقليل الفرق"
              onClick={() => onTeamCountChange(teamCount - 1)}
              disabled={teamCount <= MIN_TEAMS}
              className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              <Minus className="size-5" />
            </button>

            <motion.span
              key={teamCount}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-12 text-center font-mono text-4xl font-black"
            >
              {teamCount}
            </motion.span>

            <button
              type="button"
              aria-label="زيادة الفرق"
              onClick={() => onTeamCountChange(teamCount + 1)}
              disabled={teamCount >= MAX_TEAMS}
              className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              <Plus className="size-5" />
            </button>
          </div>
        </GlassCard>

        {/* Team names */}
        <GlassCard>
          <h2 className="mb-4 font-extrabold">أسماء الفرق</h2>
          <div className="space-y-3">
            {teamNames.slice(0, teamCount).map((name, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                  فريق {i + 1}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => onTeamNameChange(i, e.target.value)}
                  placeholder={`اسم الفريق ${i + 1}`}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base font-semibold outline-none ring-primary/40 transition-shadow placeholder:text-muted-foreground/50 focus:ring-2"
                />
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Target score */}
        <GlassCard>
          <h2 className="mb-3 font-extrabold">نقاط الفوز</h2>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={targetScore}
              onChange={(e) => onTargetScoreChange(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-primary"
            />
            <span className="w-10 font-mono text-2xl font-black">{targetScore}</span>
          </div>
        </GlassCard>

        {/* Timer duration */}
        <GlassCard>
          <div className="mb-3 flex items-center gap-2">
            <Timer className="size-5 text-primary" />
            <h2 className="font-extrabold">مدة الدور</h2>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={MIN_TURN_SECONDS}
              max={MAX_TURN_SECONDS}
              step={5}
              value={timerSeconds}
              onChange={(e) => onTimerSecondsChange(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-primary"
            />
            <span className="w-14 text-center font-mono text-xl font-black">{timerSeconds}ث</span>
          </div>
        </GlassCard>

        <Button
          size="lg"
          variant={savedGame ? "secondary" : "primary"}
          className="w-full text-lg"
          disabled={!canStart}
          onClick={onStart}
        >
          {savedGame ? "ابدأ لعبة جديدة" : "ابدأ اللعبة"}
        </Button>
      </motion.div>
    </div>
  )
}
