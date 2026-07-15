import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agente de IA — Berize",
  description: "Configure o agente de inteligência artificial do seu negócio.",
}

export default function AgenteIaPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Agente de IA
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          Configure o assistente de inteligência artificial do seu negócio.
        </p>
      </div>
    </div>
  )
}
