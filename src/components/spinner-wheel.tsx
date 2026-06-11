import { useCallback, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { SPINNER_OPTIONS } from "@/lib/game-data"
import type { SpinnerOptionId } from "@/lib/types"
import { Button } from "./ui/button"

const WHEEL_COLORS = ["#3b82f6", "#eab308", "#f97316", "#22c55e", "#a855f7"]
const SEGMENT_COUNT = SPINNER_OPTIONS.length
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT
const CX = 200
const CY = 200
const OUTER_R = 188
const INNER_R = 52
const TEXT_R = (OUTER_R + INNER_R) / 2

function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = degToRad(deg)
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function segmentCenterDeg(index: number) {
  return -90 + index * SEGMENT_ANGLE
}

function describeSegment(index: number) {
  const start = segmentCenterDeg(index) - SEGMENT_ANGLE / 2
  const end = segmentCenterDeg(index) + SEGMENT_ANGLE / 2
  const outerStart = polar(CX, CY, OUTER_R, start)
  const outerEnd = polar(CX, CY, OUTER_R, end)
  const innerEnd = polar(CX, CY, INNER_R, end)
  const innerStart = polar(CX, CY, INNER_R, start)
  const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ")
}

function targetRotation(current: number, prizeIndex: number, extraSpins: number) {
  const targetMod = (360 - prizeIndex * SEGMENT_ANGLE) % 360
  const currentMod = ((current % 360) + 360) % 360
  let delta = (targetMod - currentMod + 360) % 360
  if (delta === 0) delta = 360
  return current + extraSpins * 360 + delta
}

type SpinnerWheelProps = {
  onResult: (option: SpinnerOptionId) => void
  disabled?: boolean
  onSpinStart?: () => void
}

export function SpinnerWheel({ onResult, disabled, onSpinStart }: SpinnerWheelProps) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [pendingPrize, setPendingPrize] = useState<SpinnerOptionId | null>(null)
  const spinningRef = useRef(false)

  const segments = useMemo(
    () =>
      SPINNER_OPTIONS.map((opt, i) => ({
        ...opt,
        path: describeSegment(i),
        color: WHEEL_COLORS[i],
        centerDeg: segmentCenterDeg(i),
      })),
    [],
  )

  const spin = useCallback(() => {
    if (spinning || disabled) return

    onSpinStart?.()
    setSpinning(true)
    spinningRef.current = true

    const prizeIndex = Math.floor(Math.random() * SEGMENT_COUNT)
    const extraSpins = 4 + Math.floor(Math.random() * 3)
    setPendingPrize(SPINNER_OPTIONS[prizeIndex].id)
    setRotation((prev) => targetRotation(prev, prizeIndex, extraSpins))
  }, [disabled, onSpinStart, spinning])

  const handleSpinComplete = useCallback(() => {
    if (!pendingPrize || !spinningRef.current) return
    spinningRef.current = false
    setSpinning(false)
    onResult(pendingPrize)
    setPendingPrize(null)
  }, [onResult, pendingPrize])

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-[min(100%,24rem)] aspect-square"
      >
        <motion.div
          animate={spinning ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={{ duration: 0.6, repeat: spinning ? Infinity : 0 }}
          className="absolute inset-[12%] rounded-full bg-primary/10 blur-2xl"
        />

        <div className="absolute -top-1 left-1/2 z-20 -translate-x-1/2">
          <div className="size-0 border-x-[14px] border-t-[26px] border-x-transparent border-t-primary drop-shadow-[0_4px_12px_rgba(245,197,66,0.5)]" />
        </div>

        <div className="relative size-full rounded-full bg-gradient-to-b from-white/10 to-transparent p-[3%] shadow-2xl ring-1 ring-white/15 backdrop-blur-sm">
          <motion.svg
            viewBox="0 0 400 400"
            className="size-full origin-center"
            animate={{ rotate: rotation }}
            transition={
              spinning
                ? { duration: 4.2, ease: [0.12, 0.8, 0.22, 1] }
                : { duration: 0 }
            }
            onAnimationComplete={() => {
              if (spinningRef.current) handleSpinComplete()
            }}
          >
            <defs>
              <filter id="wheel-text-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.45" />
              </filter>
            </defs>

            <circle
              cx={CX}
              cy={CY}
              r={OUTER_R + 2}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={4}
            />

            {segments.map((seg) => (
              <g key={seg.id}>
                <path
                  d={seg.path}
                  fill={seg.color}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={1}
                />
                <SegmentLabel label={seg.label} centerDeg={seg.centerDeg} />
              </g>
            ))}

            <circle
              cx={CX}
              cy={CY}
              r={INNER_R}
              fill="#0f0f14"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={3}
            />
            <circle cx={CX} cy={CY} r={10} fill="rgba(245,197,66,0.85)" />
          </motion.svg>
        </div>
      </motion.div>

      <Button
        size="lg"
        onClick={spin}
        disabled={spinning || disabled}
        className="w-full max-w-xs"
      >
        {spinning ? "العجلة تدور..." : "أدر العجلة"}
      </Button>
    </div>
  )
}

/**
 * Place label on the wedge bisector using a local rotated frame.
 * Each word sits at the geometric center of its slice band.
 */
function SegmentLabel({ label, centerDeg }: { label: string; centerDeg: number }) {
  const normalized = ((centerDeg % 360) + 360) % 360
  const flip = normalized > 90 && normalized < 270
  const frameRotation = centerDeg + 90
  const labelY = CY - TEXT_R

  return (
    <g transform={`rotate(${frameRotation}, ${CX}, ${CY})`}>
      <text
        x={CX}
        y={labelY}
        fill="#ffffff"
        fontSize={label.length > 5 ? 16 : 20}
        fontWeight={800}
        fontFamily="Cairo, sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
        filter="url(#wheel-text-shadow)"
        transform={flip ? `rotate(180, ${CX}, ${labelY})` : undefined}
      >
        {label}
      </text>
    </g>
  )
}
