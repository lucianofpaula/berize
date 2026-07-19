"use client"

import { useState } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const COLOR_SWATCHES = [
  { label: "Branco", value: "#FFFFFF" },
  { label: "Laranja", value: "#F97316" },
  { label: "Preto", value: "#111111" },
  { label: "Azul", value: "#3B82F6" },
  { label: "Verde", value: "#22C55E" },
  { label: "Vermelho", value: "#EF4444" },
  { label: "Roxo", value: "#A855F7" },
  { label: "Rosa", value: "#EC4899" },
  { label: "Âmbar", value: "#F59E0B" },
  { label: "Ciano", value: "#06B6D4" },
  { label: "Dourado", value: "#D4A853" },
  { label: "Cinza", value: "#71717A" },
]

export function ColorPickerPopover({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (color: string) => void
  label?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger className="cursor-pointer">
        <span
          className="block size-7 shrink-0 rounded-md border border-zinc-300 dark:border-zinc-600 shadow-sm transition-all hover:scale-110 hover:shadow-md"
          style={{ backgroundColor: value || "#FFFFFF" }}
          title={label || "Alterar cor"}
        />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner align="start" sideOffset={6}>
          <PopoverPopup>
            <div className="w-56 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 shadow-xl">
              {label && (
                <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  {label}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    type="button"
                    key={swatch.value}
                    onClick={() => { onChange(swatch.value); setOpen(false) }}
                    title={swatch.label}
                    className={cn(
                      "size-7 rounded-full border-2 transition-all hover:scale-110",
                      value === swatch.value
                        ? "border-orange-500 scale-110 shadow-md"
                        : "border-transparent",
                    )}
                    style={{ backgroundColor: swatch.value }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-400">#</span>
                <input
                  type="text"
                  value={value.replace("#", "")}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6)
                    onChange(v ? `#${v.toUpperCase()}` : "#")
                  }}
                  placeholder="FFFFFF"
                  className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-xs font-mono text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
            </div>
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  )
}

export function DualColorPopover({
  valueA,
  onChangeA,
  labelA,
  valueB,
  onChangeB,
  labelB,
}: {
  valueA: string
  onChangeA: (color: string) => void
  labelA: string
  valueB: string
  onChangeB: (color: string) => void
  labelB: string
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"a" | "b">("a")

  const currentValue = tab === "a" ? valueA : valueB
  const currentOnChange = tab === "a" ? onChangeA : onChangeB
  const currentLabel = tab === "a" ? labelA : labelB

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger className="cursor-pointer">
        <span
          className="block size-7 shrink-0 rounded-md border border-zinc-300 dark:border-zinc-600 shadow-sm transition-all hover:scale-110 hover:shadow-md overflow-hidden"
          title={labelA}
        >
          <span className="flex size-full">
            <span className="flex-1" style={{ backgroundColor: valueA }} />
            <span className="flex-1" style={{ backgroundColor: valueB }} />
          </span>
        </span>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner align="start" sideOffset={6}>
          <PopoverPopup>
            <div className="w-56 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 shadow-xl">
              {/* Tabs */}
              <div className="flex gap-1 mb-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setTab("a")}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                    tab === "a"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300",
                  )}
                >
                  {labelA}
                </button>
                <button
                  type="button"
                  onClick={() => setTab("b")}
                  className={cn(
                    "flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                    tab === "b"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300",
                  )}
                >
                  {labelB}
                </button>
              </div>

              <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                {currentLabel}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    type="button"
                    key={swatch.value}
                    onClick={() => { currentOnChange(swatch.value); setOpen(false) }}
                    title={swatch.label}
                    className={cn(
                      "size-7 rounded-full border-2 transition-all hover:scale-110",
                      currentValue === swatch.value
                        ? "border-orange-500 scale-110 shadow-md"
                        : "border-transparent",
                    )}
                    style={{ backgroundColor: swatch.value }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-400">#</span>
                <input
                  type="text"
                  value={currentValue.replace("#", "")}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6)
                    currentOnChange(v ? `#${v.toUpperCase()}` : "#")
                  }}
                  placeholder="FFFFFF"
                  className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-xs font-mono text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
            </div>
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  )
}
