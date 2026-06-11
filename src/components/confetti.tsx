import { useEffect } from "react"
import confetti from "canvas-confetti"

type ConfettiProps = {
  active: boolean
}

export function Confetti({ active }: ConfettiProps) {
  useEffect(() => {
    if (!active) return

    const duration = 3500
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#f5c542", "#3b82f6", "#22c55e", "#a855f7", "#f97316"],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#f5c542", "#3b82f6", "#22c55e", "#a855f7", "#f97316"],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.55 },
      colors: ["#f5c542", "#3b82f6", "#22c55e", "#a855f7", "#f97316"],
    })

    frame()
  }, [active])

  return null
}
