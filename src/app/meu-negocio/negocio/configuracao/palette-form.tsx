"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2Icon, AlertTriangleIcon, PaletteIcon, Loader2Icon } from "lucide-react"
import { BRAND_PALETTES, type BrandPalette } from "@/lib/brand-palettes"
import { PaletteCard } from "@/components/ui/palette-card"

type Props = {
  currentPalette: string
}

export function PaletteForm({ currentPalette }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState(currentPalette)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    if (selected === currentPalette) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      return
    }

    setSaving(true)
    setError(null)

    const res = await fetch("/api/empresa/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandPalette: selected }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Erro ao salvar paleta.")
      setSaving(false)
      return
    }

    setSaving(false)
    setSuccess(true)
    router.refresh()
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertTriangleIcon className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2Icon className="size-4 shrink-0" />
          Paleta salva com sucesso!
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <PaletteIcon className="size-4 text-zinc-400" />
          Estilo de cores
        </h3>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Escolha a paleta de cores que será usada no site público e no painel do cliente.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.values(BRAND_PALETTES).map((palette: BrandPalette) => (
            <PaletteCard
              key={palette.name}
              palette={palette}
              selected={selected === palette.name}
              onSelect={() => setSelected(palette.name)}
            />
          ))}
        </div>

        {/* Preview */}
        {selected && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Pré-visualização
            </p>
            <div className="flex items-center gap-2">
              {(["primary", "secondary", "accent"] as const).map((key) => {
                const p = BRAND_PALETTES[selected]
                const colorKey = key === "primary" ? "primary" : key === "secondary" ? "secondary" : "accent"
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm border border-black/10"
                      style={{ backgroundColor: p[colorKey] as string }}
                    />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                      {key === "primary" ? "Principal" : key === "secondary" ? "Secundário" : "Destaque"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 px-6 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <CheckCircle2Icon className="size-4" />
              Salvar paleta
            </>
          )}
        </button>
      </div>
    </div>
  )
}
