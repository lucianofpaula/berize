"use client"

import { useState, useEffect } from "react"
import { GiftIcon, StarIcon, UsersIcon, TrendingUpIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"

type FidelityData = {
  enabled: boolean
  stampsRequired: number
  rewardDescription: string
  activeClients: number
  completedCycles: number
}

export function FidelityCard() {
  const [data, setData] = useState<FidelityData | null>(null)

  useEffect(() => {
    fetch("/api/fidelidade")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  if (!data) return null

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/30">
            <GiftIcon className="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Cartão Fidelidade
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {data.enabled ? "Programa ativo" : "Programa inativo"}
            </p>
          </div>
        </div>
        <Link
          href="/negocio/configuracao"
          className="flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <SettingsIcon className="size-3" />
          Configurar
        </Link>
      </div>

      {data.enabled ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 px-4 py-3">
            <GiftIcon className="size-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold">{data.stampsRequired} selos</span> ={" "}
              {data.rewardDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-1">
                <StarIcon className="size-3.5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Clientes Ativos</span>
              </div>
              <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {data.activeClients}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-1">
                <TrendingUpIcon className="size-3.5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Recompensas</span>
              </div>
              <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {data.completedCycles}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-5 text-center">
          <GiftIcon className="size-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Programa de fidelidade desativado
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Ative nas configurações do negócio para começar
          </p>
        </div>
      )}
    </div>
  )
}
