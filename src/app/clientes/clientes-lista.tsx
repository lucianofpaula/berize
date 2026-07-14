"use client"

import { useState, useMemo } from "react"
import {
  SearchIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  ScissorsIcon,
  CreditCardIcon,
  CheckCircle2Icon,
  CircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

type Cliente = {
  id: string
  nome: string
  email: string
  telefone: string
  status: "ativo" | "inativo"
  assinatura: boolean
  ultimaVisita: string
  totalVisitas: number
  desde: string
}

const mockClientes: Cliente[] = [
  {
    id: "1",
    nome: "Carlos Almeida",
    email: "carlos.almeida@email.com",
    telefone: "(11) 99999-0001",
    status: "ativo",
    assinatura: true,
    ultimaVisita: "12/07/2026",
    totalVisitas: 34,
    desde: "Jan/2024",
  },
  {
    id: "2",
    nome: "Mariana Costa",
    email: "mariana.costa@email.com",
    telefone: "(11) 99999-0002",
    status: "ativo",
    assinatura: false,
    ultimaVisita: "10/07/2026",
    totalVisitas: 12,
    desde: "Mar/2025",
  },
  {
    id: "3",
    nome: "Roberto Lima",
    email: "roberto.lima@email.com",
    telefone: "(11) 99999-0003",
    status: "inativo",
    assinatura: false,
    ultimaVisita: "15/05/2026",
    totalVisitas: 8,
    desde: "Jun/2024",
  },
  {
    id: "4",
    nome: "Ana Beatriz Santos",
    email: "ana.santos@email.com",
    telefone: "(11) 99999-0004",
    status: "ativo",
    assinatura: true,
    ultimaVisita: "14/07/2026",
    totalVisitas: 52,
    desde: "Fev/2023",
  },
  {
    id: "5",
    nome: "Pedro Henrique Oliveira",
    email: "pedro.oliveira@email.com",
    telefone: "(11) 99999-0005",
    status: "ativo",
    assinatura: true,
    ultimaVisita: "13/07/2026",
    totalVisitas: 27,
    desde: "Set/2024",
  },
  {
    id: "6",
    nome: "Juliana Ferreira",
    email: "juliana.ferreira@email.com",
    telefone: "(11) 99999-0006",
    status: "inativo",
    assinatura: false,
    ultimaVisita: "20/04/2026",
    totalVisitas: 5,
    desde: "Nov/2025",
  },
  {
    id: "7",
    nome: "Lucas Mendes",
    email: "lucas.mendes@email.com",
    telefone: "(11) 99999-0007",
    status: "ativo",
    assinatura: false,
    ultimaVisita: "11/07/2026",
    totalVisitas: 18,
    desde: "Ago/2024",
  },
  {
    id: "8",
    nome: "Fernanda Rocha",
    email: "fernanda.rocha@email.com",
    telefone: "(11) 99999-0008",
    status: "ativo",
    assinatura: true,
    ultimaVisita: "14/07/2026",
    totalVisitas: 41,
    desde: "Mar/2023",
  },
  {
    id: "9",
    nome: "Thiago Barbosa",
    email: "thiago.barbosa@email.com",
    telefone: "(11) 99999-0009",
    status: "inativo",
    assinatura: true,
    ultimaVisita: "02/03/2026",
    totalVisitas: 15,
    desde: "Out/2024",
  },
  {
    id: "10",
    nome: "Larissa Cardoso",
    email: "larissa.cardoso@email.com",
    telefone: "(11) 99999-0010",
    status: "ativo",
    assinatura: false,
    ultimaVisita: "09/07/2026",
    totalVisitas: 7,
    desde: "Jan/2026",
  },
]

const ITENS_POR_PAGINA = 9

function getInitials(nome: string) {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
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
              {cliente.status === "ativo" ? "Desativar" : "Reativar"}
            </button>
          </div>
        </>
      )}

      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 text-white dark:text-zinc-900 text-sm font-semibold">
          {getInitials(cliente.nome)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {cliente.nome}
            </h3>
            {cliente.status === "ativo" ? (
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
            {cliente.assinatura && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-400">
                <CreditCardIcon className="size-2.5" />
                Assinante
              </span>
            )}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 truncate">
              <MailIcon className="size-3 shrink-0" />
              {cliente.email}
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <PhoneIcon className="size-3 shrink-0" />
              {cliente.telefone}
            </span>
            <span className="flex items-center gap-1.5">
              <ScissorsIcon className="size-3 shrink-0" />
              {cliente.totalVisitas} visitas
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-3 shrink-0" />
              Última: {cliente.ultimaVisita}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ClientesLista() {
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroAssinatura, setFiltroAssinatura] = useState<string>("todos")
  const [pagina, setPagina] = useState(1)
  const [menuId, setMenuId] = useState<string | null>(null)

  const filtrados = useMemo(() => {
    return mockClientes.filter((c) => {
      const matchBusca =
        !busca ||
        c.nome.toLowerCase().includes(busca.toLowerCase()) ||
        c.email.toLowerCase().includes(busca.toLowerCase())

      const matchStatus =
        filtroStatus === "todos" || c.status === filtroStatus

      const matchAssinatura =
        filtroAssinatura === "todos" ||
        (filtroAssinatura === "com" && c.assinatura) ||
        (filtroAssinatura === "sem" && !c.assinatura)

      return matchBusca && matchStatus && matchAssinatura
    })
  }, [busca, filtroStatus, filtroAssinatura])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITENS_POR_PAGINA))
  const paginaSegura = Math.min(pagina, totalPaginas)
  const inicio = (paginaSegura - 1) * ITENS_POR_PAGINA
  const paginaAtual = filtrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value)
              setPagina(1)
            }}
            placeholder="Buscar por nome ou email..."
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filtroStatus}
              onChange={(e) => {
                setFiltroStatus(e.target.value)
                setPagina(1)
              }}
              className="appearance-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer transition-colors"
            >
              <option value="todos">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={filtroAssinatura}
              onChange={(e) => {
                setFiltroAssinatura(e.target.value)
                setPagina(1)
              }}
              className="appearance-none w-full sm:w-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer transition-colors"
            >
              <option value="todos">Todas assinaturas</option>
              <option value="com">Com assinatura</option>
              <option value="sem">Sem assinatura</option>
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {(busca || filtroStatus !== "todos" || filtroAssinatura !== "todos") && (
            <button
              onClick={() => {
                setBusca("")
                setFiltroStatus("todos")
                setFiltroAssinatura("todos")
                setPagina(1)
              }}
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
        {paginaAtual.map((cliente) => (
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

      {paginaAtual.length === 0 && (
        <div className="py-12 text-center text-sm text-zinc-400">
          Nenhum cliente encontrado.
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 order-2 sm:order-1">
            Mostrando {inicio + 1}–
            {Math.min(inicio + ITENS_POR_PAGINA, filtrados.length)} de{" "}
            {filtrados.length} clientes
          </p>
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaSegura <= 1}
              className="flex size-8 items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
              (p) => (
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
              ),
            )}
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaSegura >= totalPaginas}
              className="flex size-8 items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
