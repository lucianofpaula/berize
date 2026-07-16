"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  SearchIcon,
  ChevronDownIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  PhoneIcon,
  UserIcon,
  RefreshCwIcon,
  TicketIcon,
  MegaphoneIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type CouponItem = {
  id: string
  code: string
  clientName: string | null
  clientPhone: string | null
  status: "ACTIVE" | "USED" | "EXPIRED" | "CANCELLED"
  campaignTitle: string
  campaignId: string
  usedAt: string | null
  createdAt: string
}

const STATUS_MAP: Record<string, { label: string; icon: React.ElementType; class: string }> = {
  ACTIVE: { label: "Ativo", icon: CheckCircle2Icon, class: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" },
  USED: { label: "Utilizado", icon: CheckCircle2Icon, class: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30" },
  EXPIRED: { label: "Expirado", icon: ClockIcon, class: "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800" },
  CANCELLED: { label: "Cancelado", icon: XCircleIcon, class: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30" },
}

export function CuponsLista({ data }: { data: CouponItem[] }) {
  const router = useRouter()
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroCampanha, setFiltroCampanha] = useState<string>("todas")
  const [expandido, setExpandido] = useState<string | null>(null)
  const [alterando, setAlterando] = useState<string | null>(null)

  const campanhas = useMemo(() => {
    const nomes = new Set(data.map((c) => c.campaignTitle))
    return Array.from(nomes).sort()
  }, [data])

  const filtrados = useMemo(() => {
    return data.filter((c) => {
      const matchBusca =
        !busca ||
        c.code.toLowerCase().includes(busca.toLowerCase()) ||
        c.clientName?.toLowerCase().includes(busca.toLowerCase()) ||
        c.clientPhone?.includes(busca)
      const matchStatus = filtroStatus === "todos" || c.status === filtroStatus
      const matchCampanha = filtroCampanha === "todas" || c.campaignTitle === filtroCampanha
      return matchBusca && matchStatus && matchCampanha
    })
  }, [busca, filtroStatus, filtroCampanha, data])

  async function alterarStatus(couponId: string, status: string) {
    setAlterando(couponId)
    const res = await fetch("/api/campanhas/cupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponId, status }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      setAlterando(null)
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR")
  }

  function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleString("pt-BR")
  }

  function formatPhone(phone: string | null) {
    if (!phone) return "—"
    const digits = phone.replace(/\D/g, "")
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    }
    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }
    return phone
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por código, nome ou telefone..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="appearance-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer"
            >
              <option value="todos">Todos status</option>
              <option value="ACTIVE">Ativos</option>
              <option value="USED">Utilizados</option>
              <option value="EXPIRED">Expirados</option>
              <option value="CANCELLED">Cancelados</option>
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filtroCampanha}
              onChange={(e) => setFiltroCampanha(e.target.value)}
              className="appearance-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer"
            >
              <option value="todas">Todas campanhas</option>
              {campanhas.map((nome) => (
                <option key={nome} value={nome}>{nome}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <TicketIcon className="size-3" />
          {data.length} total
        </span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2Icon className="size-3" />
          {data.filter((c) => c.status === "ACTIVE").length} ativos
        </span>
        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
          <CheckCircle2Icon className="size-3" />
          {data.filter((c) => c.status === "USED").length} utilizados
        </span>
        <span className="flex items-center gap-1 text-zinc-400">
          <ClockIcon className="size-3" />
          {data.filter((c) => c.status === "EXPIRED").length} expirados
        </span>
      </div>

      {/* List */}
      {filtrados.length === 0 ? (
        <div className="py-16 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-4">
            <TicketIcon className="size-6 text-zinc-400" />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Nenhum cupom encontrado.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtrados.map((cupom) => {
            const statusInfo = STATUS_MAP[cupom.status]
            const StatusIcon = statusInfo.icon
            const isExpanded = expandido === cupom.id

            return (
              <div
                key={cupom.id}
                className={cn(
                  "rounded-xl border transition-all bg-white dark:bg-zinc-900",
                  isExpanded
                    ? "border-zinc-300 dark:border-zinc-700 shadow-md"
                    : "border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md",
                )}
              >
                {/* Main row - clickable */}
                <button
                  onClick={() => setExpandido(isExpanded ? null : cupom.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  <div className={cn(
                    "flex size-10 items-center justify-center rounded-xl",
                    cupom.status === "ACTIVE" ? "bg-emerald-50 dark:bg-emerald-950/30" :
                    cupom.status === "USED" ? "bg-blue-50 dark:bg-blue-950/30" :
                    cupom.status === "EXPIRED" ? "bg-zinc-100 dark:bg-zinc-800" :
                    "bg-red-50 dark:bg-red-950/30",
                  )}>
                    <TicketIcon className={cn(
                      "size-5",
                      cupom.status === "ACTIVE" ? "text-emerald-600 dark:text-emerald-400" :
                      cupom.status === "USED" ? "text-blue-600 dark:text-blue-400" :
                      cupom.status === "EXPIRED" ? "text-zinc-400" :
                      "text-red-500",
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 font-mono tracking-wide">
                        {cupom.code}
                      </span>
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        statusInfo.class,
                      )}>
                        <StatusIcon className="size-2.5" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MegaphoneIcon className="size-3" />
                        {cupom.campaignTitle}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="size-3" />
                        {formatDate(cupom.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-400">
                    {cupom.clientName ? (
                      <span className="flex items-center gap-1">
                        <UserIcon className="size-3" />
                        {cupom.clientName}
                      </span>
                    ) : (
                      <span className="text-zinc-300 dark:text-zinc-600">Sem cliente</span>
                    )}
                  </div>

                  <ChevronDownIcon
                    className={cn(
                      "size-4 text-zinc-400 transition-transform shrink-0",
                      isExpanded && "rotate-180",
                    )}
                  />
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-zinc-100 dark:border-zinc-800 px-5 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Cliente</p>
                        <div className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-50">
                          <UserIcon className="size-3.5 text-zinc-400" />
                          {cupom.clientName || "Não informado"}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Telefone</p>
                        <div className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-50">
                          <PhoneIcon className="size-3.5 text-zinc-400" />
                          {formatPhone(cupom.clientPhone)}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Campanha</p>
                        <div className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-50">
                          <MegaphoneIcon className="size-3.5 text-zinc-400" />
                          {cupom.campaignTitle}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Data de Retirada</p>
                        <div className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-50">
                          <CalendarIcon className="size-3.5 text-zinc-400" />
                          {formatDateTime(cupom.createdAt)}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Data de Uso</p>
                        <div className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-50">
                          <CalendarIcon className="size-3.5 text-zinc-400" />
                          {cupom.usedAt ? formatDateTime(cupom.usedAt) : "—"}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Status</p>
                        <span className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          statusInfo.class,
                        )}>
                          <StatusIcon className="size-3" />
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      {cupom.status === "ACTIVE" && (
                        <>
                          <button
                            onClick={() => alterarStatus(cupom.id, "USED")}
                            disabled={alterando === cupom.id}
                            className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-all disabled:opacity-50"
                          >
                            <CheckCircle2Icon className="size-3.5" />
                            Marcar como utilizado
                          </button>
                          <button
                            onClick={() => alterarStatus(cupom.id, "CANCELLED")}
                            disabled={alterando === cupom.id}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all disabled:opacity-50"
                          >
                            <XCircleIcon className="size-3.5" />
                            Cancelar
                          </button>
                        </>
                      )}
                      {cupom.status === "USED" && (
                        <button
                          onClick={() => alterarStatus(cupom.id, "ACTIVE")}
                          disabled={alterando === cupom.id}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
                        >
                          <RefreshCwIcon className="size-3.5" />
                          Reativar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


