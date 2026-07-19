"use client"

import { Check } from "lucide-react"
import type { BrandPalette } from "@/lib/brand-palettes"

type Props = {
  palette: BrandPalette
  selected: boolean
  onSelect: () => void
}

export function PaletteCard({ palette, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
        selected
          ? "border-zinc-900 dark:border-zinc-50 shadow-md"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center">
          <Check className="w-3 h-3 text-white dark:text-zinc-900" />
        </div>
      )}

      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2 pr-6">
        {palette.label}
      </p>

      {/* Color swatches */}
      <div className="flex items-center gap-1 mb-2">
        <div
          className="w-5 h-5 rounded-full ring-1 ring-inset ring-black/10"
          style={{ backgroundColor: palette.primary }}
        />
        <div
          className="w-5 h-5 rounded-full ring-1 ring-inset ring-black/10"
          style={{ backgroundColor: palette.secondary }}
        />
        <div
          className="w-5 h-5 rounded-full ring-1 ring-inset ring-black/10"
          style={{ backgroundColor: palette.accent }}
        />
      </div>

      {/* Mini preview bar */}
      <div
        className="h-1.5 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
        }}
      />
    </button>
  )
}
