"use client"

import { useId } from "react"

type Props = {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className, orientation = "horizontal" }: Props) {
  const id = useId()
  const pct = ((value[0] - min) / (max - min)) * 100

  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      className={`relative ${orientation === "vertical" ? "w-6 h-40" : "w-full h-6"} flex items-center ${className ?? ""}`}
    >
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onValueChange([Number(e.target.value)])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div
        className={`absolute bg-zinc-200 dark:bg-zinc-600 rounded-full ${
          orientation === "vertical" ? "w-1.5 h-full left-1/2 -translate-x-1/2" : "h-1.5 w-full"
        }`}
      >
        <div
          className="bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all"
          style={
            orientation === "vertical"
              ? { width: "100%", height: `${pct}%`, alignSelf: "flex-end" }
              : { height: "100%", width: `${pct}%` }
          }
        />
      </div>
      <div
        className={`absolute bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 w-4 h-4 rounded-full shadow-sm pointer-events-none transition-all ${
          orientation === "vertical"
            ? `left-1/2 -translate-x-1/2 -translate-y-1/2`
            : `top-1/2 -translate-y-1/2 -translate-x-1/2`
        }`}
        style={
          orientation === "vertical"
            ? { bottom: `${pct}%` }
            : { left: `${pct}%` }
        }
      />
    </div>
  )
}
