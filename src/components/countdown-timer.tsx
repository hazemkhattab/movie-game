import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { useTimer } from "@/hooks/use-timer"
import { cn } from "@/lib/utils"

type CountdownTimerProps = {
  seconds: number
  active: boolean
  timerKey: number
  onComplete?: () => void
  onTick?: (remaining: number) => void
}

export function CountdownTimer({
  seconds,
  active,
  timerKey,
  onComplete,
  onTick,
}: CountdownTimerProps) {
  const { remaining, progress } = useTimer({
    seconds,
    active,
    resetKey: timerKey,
    onComplete,
    onTick,
  })

  const urgent = remaining <= 10

  return (
    <motion.div
      key={timerKey}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-md",
        urgent
          ? "border-rose-500/40 bg-rose-500/10"
          : "border-white/10 bg-white/[0.05]",
      )}
    >
      <Clock className={cn("size-5", urgent ? "text-rose-400" : "text-primary")} />

      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>الوقت المتبقي</span>
          <span className={cn("font-mono text-base", urgent && "text-rose-400")}>
            {remaining}ث
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={cn(
              "h-full rounded-full",
              urgent ? "bg-rose-500" : "bg-primary",
            )}
            initial={{ width: "100%" }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
