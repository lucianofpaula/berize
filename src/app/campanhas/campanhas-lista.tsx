"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CampaignCardPreview } from "@/app/campanhas/campanha-card-preview"
import {
  SearchIcon,
  ChevronDownIcon,
  PlusIcon,
  AlertTriangleIcon,
  PencilIcon,
  Trash2Icon,
  CheckCircle2Icon,
  CircleIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type CampaignItem = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  highlightTitle: string | null
  badge: string | null
  buttonText: string
  titleColor: string
  subtitleColor: string
  descriptionColor: string
  highlightColor: string
  titleSize: string
  badgeColor: string
  badgeTextColor: string
  buttonColor: string
  buttonTextColor: string
  cardStyle: string
  textAlign: string
  cardBackground: string | null
  gradientStart: string | null
  gradientEnd: string | null
  gradientDirection: string
  borderEnabled: boolean
  borderColor: string | null
  borderWidth: string
  animation: string
  startDate: string
  endDate: string
  isActive: boolean
  sortOrder: number
  createdAt: string
}

export function CampanhasLista({ data }: { data: CampaignItem[] }) {
  const router = useRouter()
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todas")
  const [excluindo, setExcluindo] = useState<string | null>(null)

  const filtradas = useMemo(() => {
    return data.filter((c) => {
      const matchBusca =
        !busca || c.title.toLowerCase().includes(busca.toLowerCase())
      const matchStatus =
        filtroStatus === "todas" ||
        (filtroStatus === "ativas" && c.isActive) ||
        (filtroStatus === "inativas" && !c.isActive)
      return matchBusca && matchStatus
    })
  }, [busca, filtroStatus, data])

  async function toggleStatus(campaign: CampaignItem) {
    const res = await fetch(`/api/campanhas/${campaign.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !campaign.isActive }),
    })
    if (res.ok) {
      router.refresh()
    }
  }

  async function excluir(id: string) {
    setExcluindo(id)
    const res = await fetch(`/api/campanhas/${id}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    } else {
      setExcluindo(null)
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString("pt-BR")
  }

  function isExpired(endDate: string) {
    return new Date(endDate) < new Date()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar campanha..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="appearance-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer"
            >
              <option value="todas">Todas</option>
              <option value="ativas">Ativas</option>
              <option value="inativas">Inativas</option>
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>

          <Link
            href="/campanhas/nova"
            className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
          >
            <PlusIcon className="size-4" />
            Nova campanha
          </Link>
        </div>
      </div>

      {filtradas.length === 0 ? (
        <div className="py-16 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
            <AlertTriangleIcon className="size-6 text-zinc-400" />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {busca || filtroStatus !== "todas"
              ? "Nenhuma campanha encontrada com esses filtros."
              : "Nenhuma campanha criada ainda. Crie sua primeira campanha!"}
          </p>
          {!busca && filtroStatus === "todas" && (
            <Link
              href="/campanhas/nova"
              className="inline-flex items-center gap-2 mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              <PlusIcon className="size-4" />
              Criar campanha
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filtradas.map((campanha) => (
            <div
              key={campanha.id}
              className={cn(
                "group relative rounded-2xl border transition-all overflow-hidden",
                campanha.isActive
                  ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 opacity-75",
              )}
            >
              <div className={cn(
                "h-1",
                campanha.isActive ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700",
              )} />

              <div className="p-4">
                <div className="scale-[0.85] origin-top-left -m-3 pointer-events-none">
                  <CampaignCardPreview
                    data={{
                      title: campanha.title,
                      subtitle: campanha.subtitle,
                      description: campanha.description,
                      highlightTitle: campanha.highlightTitle,
                      badge: campanha.badge,
                      badgeColor: campanha.badgeColor,
                      badgeTextColor: campanha.badgeTextColor,
                      buttonText: campanha.buttonText,
                      titleColor: campanha.titleColor,
                      subtitleColor: campanha.subtitleColor,
                      descriptionColor: campanha.descriptionColor,
                      highlightColor: campanha.highlightColor,
                      titleSize: campanha.titleSize,
                      buttonColor: campanha.buttonColor,
                      buttonTextColor: campanha.buttonTextColor,
                      cardStyle: campanha.cardStyle,
                      textAlign: campanha.textAlign,
                      cardBackground: campanha.cardBackground,
                      gradientStart: campanha.gradientStart,
                      gradientEnd: campanha.gradientEnd,
                      gradientDirection: campanha.gradientDirection,
                      borderEnabled: campanha.borderEnabled,
                      borderColor: campanha.borderColor,
                      borderWidth: campanha.borderWidth,
                      animation: campanha.animation,
                      endDate: campanha.endDate,
                    }}
                  />
                </div>
              </div>

              <div className="px-4 pb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                  <CalendarIcon className="size-3" />
                  <span>{formatDate(campanha.startDate)} - {formatDate(campanha.endDate)}</span>
                  {isExpired(campanha.endDate) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500">
                      <ClockIcon className="size-2.5" />
                      Expirada
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleStatus(campanha)}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
                    campanha.isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700",
                  )}
                >
                  {campanha.isActive ? (
                    <CheckCircle2Icon className="size-2.5" />
                  ) : (
                    <CircleIcon className="size-2.5" />
                  )}
                  {campanha.isActive ? "Ativa" : "Inativa"}
                </button>
              </div>

              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/campanhas/${campanha.id}/editar`}
                  className="flex size-8 items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 shadow-sm hover:shadow transition-all"
                >
                  <PencilIcon className="size-3.5" />
                </Link>
                <button
                  onClick={() => excluir(campanha.id)}
                  disabled={excluindo === campanha.id}
                  className="flex size-8 items-center justify-center rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 shadow-sm hover:shadow transition-all"
                >
                  <Trash2Icon className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-2">
        <span className="flex items-center gap-1">
          <CheckCircle2Icon className="size-3 text-emerald-500" />
          {data.filter((c) => c.isActive).length} ativas
        </span>
        <span className="flex items-center gap-1">
          <CircleIcon className="size-3 text-zinc-400" />
          {data.filter((c) => !c.isActive).length} inativas
        </span>
        <span className="flex items-center gap-1">
          <CalendarIcon className="size-3" />
          {data.filter((c) => isExpired(c.endDate)).length} expiradas
        </span>
      </div>
    </div>
  )
}
