"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  SearchIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  CheckCircle2Icon,
  CircleIcon,
  DollarSignIcon,
  StarIcon,
  TrendingUpIcon,
  SparklesIcon,
  AlertTriangleIcon,
  ScissorsIcon,
  XIcon,
  CoinsIcon,
} from "lucide-react"

type PlanoData = {
  id: string
  name: string
  description: string | null
  price: number
  badge: string | null
  includedServices: { id: string; name: string; price: number }[]
  commissionTiers: { level: number; percentage: number }[]
  status: "ACTIVE" | "INACTIVE"
}

export function PlanosLista({ data }: { data: PlanoData[] }) {
  const router = useRouter()
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [mostrarModalPreco, setMostrarModalPreco] = useState(false)
  const [precoBaseInput, setPrecoBaseInput] = useState("49.90")
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const filtrados = useMemo(() => {
    return data.filter((p) => {
      const matchBusca =
        !busca || p.name.toLowerCase().includes(busca.toLowerCase())
      const matchStatus =
        filtroStatus === "todos" || p.status === filtroStatus
      return matchBusca && matchStatus
    })
  }, [busca, filtroStatus, data])

  async function gerarPlanos(precoBase: number) {
    setGerando(true)
    setErro(null)
    setMostrarModalPreco(false)
    try {
      const res = await fetch("/api/gerar/planos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ precoBase }),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Erro ao gerar planos")
      }
      router.refresh()
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setGerando(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Modal de preço base */}
      {mostrarModalPreco && (
        <>
          <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setMostrarModalPreco(false)} />
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  Qual o valor do plano mais barato?
                </h2>
                <button
                  onClick={() => setMostrarModalPreco(false)}
                  className="flex size-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <XIcon className="size-4" />
                </button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                A IA usará este valor como base para definir os preços dos demais planos.
              </p>
              <div className="relative mb-5">
                <CoinsIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={precoBaseInput}
                  onChange={(e) => setPrecoBaseInput(e.target.value)}
                  placeholder="49.90"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
              <button
                onClick={() => {
                  const valor = parseFloat(precoBaseInput)
                  if (valor > 0) gerarPlanos(valor)
                }}
                disabled={gerando || !precoBaseInput || parseFloat(precoBaseInput) <= 0}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2.5 text-sm font-medium text-white hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all shadow-sm"
              >
                <SparklesIcon className={`size-4 ${gerando ? "animate-pulse" : ""}`} />
                {gerando ? "Gerando..." : "Gerar planos"}
              </button>
            </div>
          </div>
        </>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar plano..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
          />
        </div>

        <div className="flex items-stretch sm:items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="appearance-none w-full sm:w-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="ACTIVE">Ativos</option>
              <option value="INACTIVE">Inativos</option>
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setMostrarModalPreco(true)}
            disabled={gerando}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all whitespace-nowrap shadow-sm"
          >
            <SparklesIcon className="size-4" />
            Gerar planos com IA
          </button>
        </div>
      </div>

      {erro && (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertTriangleIcon className="size-4 shrink-0" />
          {erro}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((plano) => (
          <CardPlano key={plano.id} plano={plano} />
        ))}
      </div>

      {filtrados.length === 0 && !gerando && (
        <div className="py-12 text-center text-sm text-zinc-400">
          Nenhum plano encontrado. Clique em "Gerar planos com IA" para criar.
        </div>
      )}
    </div>
  )
}

function CardPlano({ plano }: { plano: PlanoData }) {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700">
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
      >
        <MoreHorizontalIcon className="size-4" />
      </button>

      {menuAberto && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuAberto(false)} />
          <div className="absolute top-10 right-3 z-20 w-44 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-1 shadow-lg">
            <Link
              href={`/planos/${plano.id}/editar`}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <PencilIcon className="size-3.5" />
              Editar
            </Link>
            <div className="mx-2 my-1 border-t border-zinc-200 dark:border-zinc-700" />
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <Trash2Icon className="size-3.5" />
              {plano.status === "ACTIVE" ? "Desativar" : "Reativar"}
            </button>
          </div>
        </>
      )}

      <div className="pr-6">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {plano.name}
          </h3>
          {plano.badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
              <StarIcon className="size-2.5" />
              {plano.badge}
            </span>
          )}
          {plano.status === "ACTIVE" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2Icon className="size-2.5" />
              Ativo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              <CircleIcon className="size-2.5" />
              Inativo
            </span>
          )}
        </div>

        {plano.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">
            {plano.description}
          </p>
        )}

        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            R$ {plano.price.toFixed(2)}
          </span>
          <span className="text-xs text-zinc-400">/mês</span>
        </div>

        {/* Serviços incluídos */}
        {plano.includedServices.length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <ScissorsIcon className="size-3" />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Serviços incluídos</span>
              <span className="text-zinc-400">({plano.includedServices.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {plano.includedServices.map((sv) => (
                <span
                  key={sv.id}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400"
                >
                  {sv.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {plano.commissionTiers.length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <TrendingUpIcon className="size-3" />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Comissões por nível</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {plano.commissionTiers.map((tier) => (
                <span
                  key={tier.level}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400"
                >
                  N{tier.level}: {tier.percentage}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Botão editar visível */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href={`/planos/${plano.id}/editar`}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <PencilIcon className="size-3" />
            Editar plano
          </Link>
        </div>
      </div>
    </div>
  )
}
