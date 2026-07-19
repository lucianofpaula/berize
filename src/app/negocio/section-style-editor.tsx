"use client"

import type { WebsiteSection } from "./website-types"
import { TITLE_SIZES, DESC_SIZES, ALIGN_OPTIONS, BG_COLORS } from "./website-types"
import { ColorPickerPopover } from "@/components/ui/color-picker-popover"
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"

type Props = {
  section: WebsiteSection
  onChange: (updated: WebsiteSection) => void
  showDescription?: boolean
}

export default function SectionStyleEditor({ section, onChange, showDescription = false }: Props) {
  const c = section.content
  const set = (key: string, val: unknown) => onChange({ ...section, content: { ...section.content, [key]: val } })

  const bgColor = (c.bgColor as string) ?? "#FFFFFF"
  const titleColor = (c.titleColor as string) ?? "#111111"
  const titleSize = (c.titleSize as string) ?? "3xl"
  const titleAlign = (c.titleAlign as string) ?? "center"
  const descColor = (c.descColor as string) ?? "#52525B"
  const descSize = (c.descSize as string) ?? "base"
  const descAlign = (c.descAlign as string) ?? "center"

  return (
    <div className="space-y-3 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3" onPointerDown={(e) => e.stopPropagation()}>
      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Aparência</p>

      {/* Background */}
      <div>
        <label className="text-[10px] text-zinc-400 mb-1.5 block">Fundo</label>
        <div className="flex flex-wrap gap-1">
          {BG_COLORS.map((swatch) => (
            <button
              key={swatch.value}
              onClick={() => set("bgColor", swatch.value)}
              title={swatch.label}
              type="button"
              className={`size-6 rounded-full border-2 transition-all hover:scale-110 ${
                bgColor.toUpperCase() === swatch.value ? "border-orange-500 scale-110 shadow-md" : "border-transparent"
              }`}
              style={{ backgroundColor: swatch.value }}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-[10px] text-zinc-400 block">Título</label>
        <div className="flex items-center gap-2">
          <ColorPickerPopover value={titleColor} onChange={(v) => set("titleColor", v)} />
          <div className="flex items-center gap-0.5">
            {TITLE_SIZES.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set("titleSize", opt.value)}
                type="button"
                className={`px-1.5 py-1 text-[10px] rounded transition-colors ${
                  titleSize === opt.value
                    ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 font-medium"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {ALIGN_OPTIONS.map((opt) => {
            const Icon = opt.value === "left" ? AlignLeft : opt.value === "center" ? AlignCenter : AlignRight
            return (
              <button
                key={opt.value}
                onClick={() => set("titleAlign", opt.value)}
                title={opt.label}
                type="button"
                className={`p-1 rounded transition-colors ${
                  titleAlign === opt.value
                    ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Description */}
      {showDescription && (
        <div className="space-y-1.5">
          <label className="text-[10px] text-zinc-400 block">Descrição</label>
          <div className="flex items-center gap-2">
            <ColorPickerPopover value={descColor} onChange={(v) => set("descColor", v)} />
            <div className="flex items-center gap-0.5">
              {DESC_SIZES.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("descSize", opt.value)}
                  type="button"
                  className={`px-1.5 py-1 text-[10px] rounded transition-colors ${
                    descSize === opt.value
                      ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 font-medium"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {ALIGN_OPTIONS.map((opt) => {
              const Icon = opt.value === "left" ? AlignLeft : opt.value === "center" ? AlignCenter : AlignRight
              return (
                <button
                  key={opt.value}
                  onClick={() => set("descAlign", opt.value)}
                  title={opt.label}
                  type="button"
                  className={`p-1 rounded transition-colors ${
                    descAlign === opt.value
                      ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
