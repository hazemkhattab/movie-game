import { useCallback, useEffect, useRef, useState } from "react"

type UseTimerOptions = {
  seconds: number
  active: boolean
  resetKey?: number
  onComplete?: () => void
  onTick?: (remaining: number) => void
}

export function useTimer({
  seconds,
  active,
  resetKey = 0,
  onComplete,
  onTick,
}: UseTimerOptions) {
  const [remaining, setRemaining] = useState(seconds)
  const onCompleteRef = useRef(onComplete)
  const onTickRef = useRef(onTick)

  onCompleteRef.current = onComplete
  onTickRef.current = onTick

  const reset = useCallback(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (!active) return

    setRemaining(seconds)
    const interval = window.setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1
        onTickRef.current?.(next)
        if (next <= 0) {
          window.clearInterval(interval)
          onCompleteRef.current?.()
          return 0
        }
        return next
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [active, seconds, resetKey])

  const progress = remaining / seconds

  return { remaining, progress, reset, isExpired: remaining === 0 && active }
}
