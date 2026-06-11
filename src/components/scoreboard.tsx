import { motion } from "framer-motion"
import { Crown, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Team } from "@/lib/types"

type ScoreboardProps = {
  teams: Team[]
  activeTeamId?: number
  compact?: boolean
}

export function Scoreboard({ teams, activeTeamId, compact }: ScoreboardProps) {
  const max = Math.max(...teams.map((t) => t.score), 0)

  return (
    <div
      className={cn(
        "grid gap-4",
        compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
      )}
    >
      {teams.map((team, i) => {
        const isActive = team.id === activeTeamId
        const isLeader = team.score === max && max > 0

        return (
          <motion.div
            key={team.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "relative rounded-2xl border p-5 backdrop-blur-md transition-all sm:p-6",
              isActive
                ? "border-primary/60 bg-primary/10 ring-2 ring-primary/30"
                : "border-white/10 bg-white/[0.04]",
            )}
          >
            {isActive && (
              <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-extrabold text-primary-foreground shadow-lg">
                الدور الحالي
              </span>
            )}

            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="truncate text-sm font-bold">{team.name}</span>
              {isLeader ? (
                <Trophy className="size-4 shrink-0 text-primary" />
              ) : (
                <Crown className="size-4 shrink-0 text-white/10" />
              )}
            </div>

            <motion.div
              key={team.score}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-mono text-3xl font-black tabular-nums sm:text-4xl"
            >
              {team.score}
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
