import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "success" | "danger"
  size?: "sm" | "md" | "lg"
}

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90",
  secondary:
    "border border-white/10 bg-white/5 text-foreground hover:bg-white/10",
  ghost: "text-muted-foreground hover:bg-white/5 hover:text-foreground",
  success:
    "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400",
  danger:
    "bg-rose-500/90 text-white shadow-lg shadow-rose-500/25 hover:bg-rose-400",
}

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-12 px-8 text-lg",
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
