"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import {
  SearchIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  ScissorsIcon,
  UserIcon,
  MegaphoneIcon,
} from "lucide-react"

type Cliente = {
  id: string
  userId: string
  nome: string
  email: string
  whatsapp: string
  fotoUrl: string | null
  totalVisitas: number
  ultimaVisita: string | null
  status: "ativo"
  campanhaOrigem: string | null
}

const ITENS_POR_PAGINA = 20

function getInitials(nome: string) {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatTelefone(whatsapp: string) {
  const d = whatsapp.replace(/\D/g, "")
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return whatsapp
}

function formatData(iso: string | null) {
  if (!iso) return "—"
  const d = new Date(iso + "T12:00:00")
  return d.toLocaleDateString("pt-BR")
}

function CardCliente({
  cliente,
  onToggleMenu,
  menuAberto,
}: {
  cliente: Cliente
  onToggleMenu: () => void
  menuAberto: boolean
}) {
  return (
    <div className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700">
      <button
        onClick={onToggleMenu}
        className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
      >
        <MoreHorizontalIcon className="size-4" />
      </button>

      {menuAberto && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggleMenu} />
          <div className="absolute top-10 right-3 z-20 w-44 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-1 shadow-lg">
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <EyeIcon className="size-3.5" />
              Ver detalhes
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <PencilIcon className="size-3.5" />
              Editar
            </button>
            <div className="mx-2 my-1 border-t border-zinc-200 dark:border-zinc-700" />
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <Trash2Icon className="size-3.5" />
              Desativar
            </button>
          </div>
        </>
      )}

      <div className="flex items-start gap-4">
        {cliente.fotoUrl ? (
          <img
            src={cliente.fotoUrl}
            alt={cliente.nome}
            className="size-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 text-white dark:text-zinc-900 text-sm font-semibold">
            {getInitials(cliente.nome)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {cliente.nome}
            </h3>
          </div>

          {cliente.campanhaOrigem && (
            <div className="mt-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:text-purple-400">
                <MegaphoneIcon className="size-2.5" />
                Campanha: {cliente.campanhaOrigem}
              </span>
            </div>
          )}
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 truncate">
              <MailIcon className="size-3 shrink-0" />
              {cliente.email || "—"}
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <PhoneIcon className="size-3 shrink-0" />
              {cliente.whatsapp ? formatTelefone(cliente.whatsapp) : "—"}
            </span>
            <span className="flex items-center gap-1.5">
              <ScissorsIcon className="size-3 shrink-0" />
              {cliente.totalVisitas} visitas
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-3 shrink-0" />
              Última: {formatData(cliente.ultimaVisita)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ClientesLista() {
  const [busca, setBusca] = useState("")
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [total, setTotal] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const reqId = useRef(0)

  const temMais = pagina < totalPaginas

  const carregarPagina = useCallback(async (p: number, search: string, append: boolean) => {
    const id = ++reqId.current
    setCarregando(true)
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(ITENS_POR_PAGINA) })
      if (search) params.set("search", search)
      const res = await fetch(`/api/clientes?${params}`)
      const json = await res.json()
      if (id !== reqId.current) return // resposta obsoleta
      setClientes((prev) => (append ? [...prev, ...json.clients] : json.clients))
      setTotal(json.total)
      setTotalPaginas(json.totalPages)
      setPagina(p)
    } finally {
      if (id === reqId.current) setCarregando(false)
    }
  }, [])

  // Carrega primeira página ao montar ou quando a busca muda
  useEffect(() => {
    setClientes([])
    setPagina(1)
    setTotalPaginas(0)
    setTotal(0)
    carregarPagina(1, busca, false)
  }, [busca, carregarPagina])

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !temMais || carregando) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && temMais && !carregando) {
          carregarPagina(pagina + 1, busca, true)
        }
      },
      { rootMargin: "200px" },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [temMais, carregando, pagina, busca, carregarPagina])

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, email ou whatsapp..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {busca && (
            <button
              onClick={() => setBusca("")}
              className="flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <XIcon className="size-3.5" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {clientes.map((cliente) => (
          <CardCliente
            key={cliente.id}
            cliente={cliente}
            menuAberto={menuId === cliente.id}
            onToggleMenu={() =>
              setMenuId(menuId === cliente.id ? null : cliente.id)
            }
          />
        ))}
      </div>

      {!carregando && clientes.length === 0 && (
        <div className="py-12 text-center text-sm text-zinc-400">
          Nenhum cliente encontrado.
        </div>
      )}

      {/* Sentinel para infinite scroll */}
      <div ref={sentinelRef} className="h-4" />

      {/* Loading spinner */}
      {carregando && (
        <div className="flex items-center justify-center py-4">
          <div className="size-6 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-50 animate-spin" />
        </div>
      )}

      {/* Info */}
      {total > 0 && (
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 pb-4">
          {clientes.length} de {total} clientes carregados
        </p>
      )}
    </div>
  )
}
