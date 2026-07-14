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
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ClockIcon,
  DollarSignIcon,
  TagIcon,
  TrendingUpIcon,
  SparklesIcon,
  AlertTriangleIcon,
} from "lucide-react"

type ServicoData = {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  category: string | null
  commissionTiers: { level: number; percentage: number }[]
  status: "ACTIVE" | "INACTIVE"
}

export function ServicosLista({ data }: { data: ServicoData[] }) {
  const router = useRouter()
  const [busca, setBusca] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const categorias = useMemo(() => {
    const cats = new Set(data.map((s) => s.category).filter((c): c is string => c !== null))
    return Array.from(cats).sort()
  }, [data])

  const filtrados = useMemo(() => {
    return data.filter((s) => {
      const matchBusca =
        !busca || s.name.toLowerCase().includes(busca.toLowerCase())
      const matchCategoria =
        filtroCategoria === "todas" || s.category === filtroCategoria
      const matchStatus =
        filtroStatus === "todos" || s.status === filtroStatus
      return matchBusca && matchCategoria && matchStatus
    })
  }, [busca, filtroCategoria, filtroStatus, data])

  const ITENS_POR_PAGINA = 12
  const [pagina, setPagina] = useState(1)
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITENS_POR_PAGINA))
  const paginaSegura = Math.min(pagina, totalPaginas)
  const inicio = (paginaSegura - 1) * ITENS_POR_PAGINA
  const paginaAtual = filtrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  async function gerarServicos() {
    setGerando(true)
    setErro(null)
    try {
      const res = await fetch("/api/gerar/servicos", { method: "POST" })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? "Erro ao gerar serviços")
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
            placeholder="Buscar serviço..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
          />
        </div>

        <div className="flex items-stretch sm:items-center gap-2 flex-wrap">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filtroCategoria}
              onChange={(e) => { setFiltroCategoria(e.target.value); setPagina(1) }}
              className="appearance-none w-full sm:w-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer"
            >
              <option value="todas">Todas categorias</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filtroStatus}
              onChange={(e) => { setFiltroStatus(e.target.value); setPagina(1) }}
              className="appearance-none w-full sm:w-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="ACTIVE">Ativos</option>
              <option value="INACTIVE">Inativos</option>
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>

          <button
            onClick={gerarServicos}
            disabled={gerando}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all whitespace-nowrap shadow-sm"
          >
            <SparklesIcon className={`size-4 ${gerando ? "animate-pulse" : ""}`} />
            {gerando ? "Gerando..." : "Gerar serviços com IA"}
          </button>
        </div>
      </div>

      {erro && (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertTriangleIcon className="size-4 shrink-0" />
          {erro}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginaAtual.map((servico) => (
          <CardServico key={servico.id} servico={servico} />
        ))}
      </div>

      {paginaAtual.length === 0 && !gerando && (
        <div className="py-12 text-center text-sm text-zinc-400">
          Nenhum serviço encontrado. Clique em "Gerar serviços com IA" para criar.
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 order-2 sm:order-1">
            Mostrando {inicio + 1}–{Math.min(inicio + ITENS_POR_PAGINA, filtrados.length)} de {filtrados.length} serviços
          </p>
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaSegura <= 1}
              className="flex size-8 items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPagina(p)}
                className={`flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === paginaSegura
                    ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                    : "border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaSegura >= totalPaginas}
              className="flex size-8 items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function CardServico({ servico }: { servico: ServicoData }) {
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
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <EyeIcon className="size-3.5" />
              Ver detalhes
            </button>
            <Link
              href={`/servicos/${servico.id}/editar`}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <PencilIcon className="size-3.5" />
              Editar
            </Link>
            <div className="mx-2 my-1 border-t border-zinc-200 dark:border-zinc-700" />
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <Trash2Icon className="size-3.5" />
              {servico.status === "ACTIVE" ? "Desativar" : "Reativar"}
            </button>
          </div>
        </>
      )}

      <div className="pr-6">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {servico.name}
          </h3>
          {servico.category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
              <TagIcon className="size-2.5" />
              {servico.category}
            </span>
          )}
          {servico.status === "ACTIVE" ? (
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

        {servico.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">
            {servico.description}
          </p>
        )}

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-baseline gap-0.5">
            <DollarSignIcon className="size-3.5 text-zinc-400" />
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {servico.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <ClockIcon className="size-3" />
            {servico.duration} min
          </div>
        </div>

        {servico.commissionTiers.length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <TrendingUpIcon className="size-3" />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Comissão</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {servico.commissionTiers.map((tier) => (
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

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Link
            href={`/servicos/${servico.id}/editar`}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <PencilIcon className="size-3" />
            Editar serviço
          </Link>
        </div>
      </div>
    </div>
  )
}
