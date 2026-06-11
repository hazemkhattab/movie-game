"use client"

import { Minus, Plus, Trophy } from "lucide-react"

export type Team = {
  id: number
  name: string
  score: number
}

type ScoreboardProps = {
  teams: Team[]
  activeTeamId: number
  onAdjust: (teamId: number, delta: number) => void
}

export function Scoreboard({ teams, activeTeamId, onAdjust }: ScoreboardProps) {
  const max = Math.max(...teams.map((t) => t.score), 0)

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
      {teams.map((team) => {
        const isActive = team.id === activeTeamId
        const isLeader = team.score === max && max > 0
        return (
          <div
            key={team.id}
            className={`relative rounded-2xl border p-5 transition-all sm:p-6 ${
              isActive
                ? "border-primary bg-card shadow-lg ring-2 ring-primary/40"
                : "border-border bg-card/60"
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="truncate text-sm font-bold text-card-foreground">
                {team.name}
              </span>
              {isLeader && <Trophy className="size-4 shrink-0 text-primary" />}
            </div>

            <div className="mb-3 font-mono text-4xl font-extrabold tabular-nums text-card-foreground">
              {team.score}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="إنقاص النقاط"
                onClick={() => onAdjust(team.id, -1)}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
              >
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                aria-label="زيادة النقاط"
                onClick={() => onAdjust(team.id, 1)}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-secondary text-secondary-foreground transition-colors hover:bg-accent"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {isActive && (
              <span className="absolute -top-2 left-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                الدور الحالي
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
