import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

type GlassCardProps = HTMLMotionProps<"div"> & {
  glow?: string
}

export function GlassCard({ className, glow, children, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl",
        className,
      )}
      style={
        glow
          ? { boxShadow: `0 0 40px -8px rgba(${glow}, 0.35), inset 0 1px 0 rgba(255,255,255,0.08)` }
          : undefined
      }
      {...props}
    >
      <div className="glass-shine pointer-events-none absolute inset-0" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
