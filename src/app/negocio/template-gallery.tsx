"use client"

import { useState } from "react"
import { getTemplates } from "./templates"
import type { Template } from "./templates"
import TemplatePreviewModal from "./template-preview-modal"
import { Globe } from "lucide-react"

type Props = {
  onSelect: (template: Template) => void
}

export default function TemplateGallery({ onSelect }: Props) {
  const [preview, setPreview] = useState<Template | null>(null)
  const templates = getTemplates()

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-full p-8">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-6 shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              Escolha um modelo para começar
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Selecione um template e seus dados serão carregados automaticamente
              (serviços, equipe, horários, contato). Depois é só ajustar do seu jeito.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setPreview(t)}
                className="group text-left bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className={`h-32 bg-gradient-to-br ${t.previewGradient} flex items-center justify-center relative`}>
                  <span className="text-4xl opacity-30 select-none">{t.previewIcon}</span>
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex gap-1 mb-2.5">
                    {t.palette.map((cor, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: cor }} />
                    ))}
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                    {t.description}
                  </p>
                  <div className="mt-3 text-[10px] uppercase tracking-wider text-amber-600 font-medium flex items-center gap-1">
                    <span>Visualizar</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>

      {preview && (
        <TemplatePreviewModal
          template={preview}
          onClose={() => setPreview(null)}
          onSelect={() => { onSelect(preview); setPreview(null) }}
        />
      )}
    </>
  )
}
