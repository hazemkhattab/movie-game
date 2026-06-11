"use client"

import { useState, useRef } from "react"
import { CATEGORIES, type CategoryId } from "@/lib/game-data"

type SpinnerWheelProps = {
  onResult: (category: CategoryId) => void
  disabled?: boolean
}

const SEGMENT_COLORS: Record<CategoryId, string> = {
  movie: "oklch(0.62 0.19 250)",
  series: "oklch(0.82 0.16 90)",
  play: "oklch(0.7 0.18 50)",
  song: "oklch(0.72 0.17 155)",
}

export function SpinnerWheel({ onResult, disabled }: SpinnerWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const rotationRef = useRef(0)

  const segCount = CATEGORIES.length
  const segAngle = 360 / segCount

  // Build conic gradient background
  const gradientStops = CATEGORIES.map((c, i) => {
    const start = i * segAngle
    const end = (i + 1) * segAngle
    return `${SEGMENT_COLORS[c.id]} ${start}deg ${end}deg`
  }).join(", ")

  function spin() {
    if (spinning || disabled) return
    setSpinning(true)

    const winningIndex = Math.floor(Math.random() * segCount)
    const fullSpins = 5 + Math.floor(Math.random() * 3)
    // pointer is at top (0deg). center of winning segment:
    const segCenter = winningIndex * segAngle + segAngle / 2
    // we want the wheel to land so winning segment center is under the top pointer
    const targetWithin = 360 - segCenter
    const newRotation =
      rotationRef.current +
      fullSpins * 360 +
      ((targetWithin - (rotationRef.current % 360)) + 360) % 360

    rotationRef.current = newRotation
    setRotation(newRotation)

    window.setTimeout(() => {
      setSpinning(false)
      onResult(CATEGORIES[winningIndex].id)
    }, 4200)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative aspect-square w-full max-w-[20rem]">
        {/* Pointer */}
        <div className="absolute -top-1 left-1/2 z-20 -translate-x-1/2">
          <div className="size-0 border-x-[14px] border-t-[24px] border-x-transparent border-t-foreground drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <div
          className="relative size-full rounded-full border-8 border-card shadow-2xl ring-1 ring-border transition-transform ease-out"
          style={{
            background: `conic-gradient(${gradientStops})`,
            transform: `rotate(${rotation}deg)`,
            transitionDuration: spinning ? "4200ms" : "0ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {CATEGORIES.map((c, i) => {
            const labelAngle = i * segAngle + segAngle / 2
            return (
              <div
                key={c.id}
                className="absolute left-1/2 top-1/2 origin-top -translate-x-1/2"
                style={{
                  transform: `rotate(${labelAngle}deg) translateY(14%)`,
                  height: "50%",
                }}
              >
                <span className="block whitespace-nowrap text-lg font-extrabold text-background drop-shadow-sm">
                  {c.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Center button */}
        <button
          type="button"
          onClick={spin}
          disabled={spinning || disabled}
          aria-label="أدر العجلة"
          className="absolute left-1/2 top-1/2 z-10 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-card bg-foreground text-background shadow-xl transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-90"
        >
          <span className="text-sm font-extrabold leading-none">
            {spinning ? "..." : "أدر"}
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning || disabled}
        className="rounded-full bg-primary px-8 py-3 text-base font-bold text-primary-foreground shadow-lg transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {spinning ? "العجلة تدور..." : "أدر العجلة"}
      </button>
    </div>
  )
}
