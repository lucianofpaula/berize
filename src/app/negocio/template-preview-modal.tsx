"use client"

import { useEffect, useState } from "react"
import type { Template } from "./templates"
import { X, ExternalLink } from "lucide-react"
import TradicionalPage from "@/app/(public)/exemplos/tradicional/page"
import ContemporaneoPage from "@/app/(public)/exemplos/contemporaneo/page"
import PremiumPage from "@/app/(public)/exemplos/premium/page"
import FotograficoPage from "@/app/(public)/exemplos/fotografico/page"
import GptPage from "@/app/(public)/exemplos/gpt/page"
import GptCompletoPage from "@/app/(public)/exemplos/gpt-completo/page"
import Premium3Page from "@/app/(public)/exemplos/premium-3/page"

type Props = {
  template: Template
  onClose: () => void
  onSelect: () => void
}

function renderFullPage(templateId: string) {
  switch (templateId) {
    case "classic": return <TradicionalPage />
    case "urban": return <ContemporaneoPage />
    case "premium": return <PremiumPage />
    case "photographic": return <FotograficoPage />
    case "gpt-dark": return <GptPage />
    case "gpt-completo": return <GptCompletoPage />
    case "premium-3": return <Premium3Page />
    default: return <TradicionalPage />
  }
}

export default function TemplatePreviewModal({ template, onClose, onSelect }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-6xl max-h-[95vh] m-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">{template.name}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview scrollable */}
        <div className="flex-1 overflow-y-auto bg-white">
          {renderFullPage(template.id)}
        </div>

        {/* Sticky footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
          <div className="flex items-center gap-2">
            {template.palette.map((cor, i) => (
              <div key={i} className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: cor }} />
            ))}
            <a href={`/exemplos/${template.id === "gpt-dark" ? "gpt" : template.id === "gpt-completo" ? "gpt-completo" : template.id === "classic" ? "tradicional" : template.id}`} target="_blank" rel="noopener noreferrer" className="ml-2 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors" title="Abrir em nova aba">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <button
            onClick={onSelect}
            className="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
          >
            Usar este modelo
          </button>
        </div>
      </div>
    </div>
  )
}
