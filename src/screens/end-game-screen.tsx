import { motion } from "framer-motion"
import { Crown, Home, RotateCcw, Trophy } from "lucide-react"
import type { Team } from "@/lib/types"
import { Confetti } from "@/components/confetti"
import { Scoreboard } from "@/components/scoreboard"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"

type EndGameScreenProps = {
  teams: Team[]
  winner: Team | null
  onPlayAgain: () => void
  onHome: () => void
}

export function EndGameScreen({
  teams,
  winner,
  onPlayAgain,
  onHome,
}: EndGameScreenProps) {
  const sorted = [...teams].sort((a, b) => b.score - a.score)

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <Confetti active={!!winner} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 size-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="relative z-10 w-full max-w-md space-y-6"
      >
        <div className="text-center">
          {winner ? (
            <>
              <motion.div
                animate={{ rotate: [0, -8, 8, -4, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
                className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/30"
              >
                <Trophy className="size-12 text-primary" />
              </motion.div>
              <h1 className="mb-2 text-3xl font-black sm:text-4xl">مبروك!</h1>
              <p className="text-lg font-extrabold text-primary">{winner.name}</p>
              <p className="text-sm text-muted-foreground">الفريق الفائز</p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-white/10">
                <Crown className="size-10 text-muted-foreground" />
              </div>
              <h1 className="mb-2 text-3xl font-black">انتهت اللعبة</h1>
              <p className="text-sm text-muted-foreground">تعادل بين الفرق!</p>
            </>
          )}
        </div>

        <GlassCard glow="245,197,66">
          <h2 className="mb-4 text-center font-extrabold">النتيجة النهائية</h2>
          <div className="space-y-2">
            {sorted.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-xs font-black">
                    {i + 1}
                  </span>
                  <span className="font-bold">{team.name}</span>
                </div>
                <span className="font-mono text-2xl font-black">{team.score}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <Scoreboard teams={sorted} />

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onHome}>
            <Home className="size-4" />
            الرئيسية
          </Button>
          <Button className="flex-1" onClick={onPlayAgain}>
            <RotateCcw className="size-4" />
            لعب جديد
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
