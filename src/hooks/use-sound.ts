import { useCallback, useEffect, useRef, useState } from "react"

export type SoundId =
  | "spin"
  | "tick"
  | "success"
  | "fail"
  | "win"
  | "click"
  | "timer_end"

const STORAGE_KEY = "arabic-movie-game-sound"

type SoundHook = {
  play: (id: SoundId) => void
  setEnabled: (enabled: boolean) => void
  toggle: () => void
  enabled: boolean
}

function loadEnabled() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === null ? true : raw === "true"
  } catch {
    return true
  }
}

function saveEnabled(enabled: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled))
  } catch {
    // ignore
  }
}

export function useSound(): SoundHook {
  const [enabled, setEnabledState] = useState(loadEnabled)
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  useEffect(() => {
    saveEnabled(enabled)
  }, [enabled])

  const tone = useCallback(
    (
      frequency: number,
      duration: number,
      type: OscillatorType = "sine",
      volume = 0.08,
      when = 0,
    ) => {
      const ctx = getCtx()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.value = frequency
      gain.gain.value = volume
      osc.connect(gain)
      gain.connect(ctx.destination)

      const start = ctx.currentTime + when
      gain.gain.setValueAtTime(volume, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration)

      osc.start(start)
      osc.stop(start + duration + 0.02)
    },
    [getCtx],
  )

  const play = useCallback(
    (id: SoundId) => {
      if (!enabled) return

      switch (id) {
        case "click":
          tone(620, 0.06, "triangle", 0.07)
          break
        case "tick":
          tone(880, 0.05, "square", 0.04)
          break
        case "timer_end":
          tone(220, 0.18, "sawtooth", 0.06)
          tone(180, 0.22, "sawtooth", 0.05, 0.12)
          break
        case "success":
          tone(523, 0.1, "sine", 0.07)
          tone(659, 0.1, "sine", 0.07, 0.08)
          tone(784, 0.14, "sine", 0.08, 0.16)
          break
        case "fail":
          tone(330, 0.12, "triangle", 0.07)
          tone(247, 0.18, "triangle", 0.07, 0.1)
          break
        case "spin":
          tone(400, 0.08, "sine", 0.05)
          tone(520, 0.08, "sine", 0.05, 0.06)
          tone(640, 0.1, "sine", 0.05, 0.12)
          break
        case "win":
          ;[523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, "sine", 0.07, i * 0.1))
          break
        default:
          break
      }
    },
    [enabled, tone],
  )

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next)
  }, [])

  const toggle = useCallback(() => {
    setEnabledState((prev) => !prev)
  }, [])

  return { play, setEnabled, toggle, enabled }
}
