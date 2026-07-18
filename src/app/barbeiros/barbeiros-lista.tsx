"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

import type { BarbeiroData } from "@/app/barbearia/barbeiros/page"
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
  MailIcon,
  PhoneIcon,
  ScissorsIcon,
  PercentIcon,
  TagIcon,
} from "lucide-react"
import Image from "next/image"

const ITENS_POR_PAGINA = 9

function getInitials(nome: string) {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function BarbeirosLista({ data }: { data: BarbeiroData[] }) {
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [pagina, setPagina] = useState(1)
  const [menuId, setMenuId] = useState<string | null>(null)

  const filtrados = useMemo(() => {
    return data.filter((b) => {
      const matchBusca =
        !busca ||
        b.nome.toLowerCase().includes(busca.toLowerCase()) ||
        b.email.toLowerCase().includes(busca.toLowerCase())

      const matchStatus =
        filtroStatus === "todos" || b.status === filtroStatus

      return matchBusca && matchStatus
    })
  }, [busca, filtroStatus, data])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITENS_POR_PAGINA))
  const paginaSegura = Math.min(pagina, totalPaginas)
  const inicio = (paginaSegura - 1) * ITENS_POR_PAGINA
  const paginaAtual = filtrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  return (
    <div className="space-y-4">
      {/* Cabeçalho + ação */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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

        <div className="flex items-stretch sm:items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filtroStatus}
              onChange={(e) => {
                setFiltroStatus(e.target.value)
                setPagina(1)
              }}
              className="appearance-none w-full sm:w-auto rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 cursor-pointer transition-colors"
            >
              <option value="todos">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
            <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
          </div>

          <Link
            href="/barbeiros/novo"
            className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors whitespace-nowrap"
          >
            <PlusIcon className="size-4" />
            <span className="hidden sm:inline">Novo barbeiro</span>
          </Link>
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {paginaAtual.map((barbeiro) => (
          <CardBarbeiro
            key={barbeiro.id}
            barbeiro={barbeiro}
            menuAberto={menuId === barbeiro.id}
            onToggleMenu={() =>
              setMenuId(menuId === barbeiro.id ? null : barbeiro.id)
            }
          />
        ))}
      </div>

      {paginaAtual.length === 0 && (
        <div className="py-12 text-center text-sm text-zinc-400">
          Nenhum barbeiro encontrado.
        </div>
      )}

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 order-2 sm:order-1">
            Mostrando {inicio + 1}–
            {Math.min(inicio + ITENS_POR_PAGINA, filtrados.length)} de{" "}
            {filtrados.length} barbeiros
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

function CardBarbeiro({
  barbeiro,
  onToggleMenu,
  menuAberto,
}: {
  barbeiro: BarbeiroData
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
            <Link
              href={`/barbeiros/${barbeiro.id}/editar`}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <PencilIcon className="size-3.5" />
              Editar
            </Link>
            <div className="mx-2 my-1 border-t border-zinc-200 dark:border-zinc-700" />
            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <Trash2Icon className="size-3.5" />
              {barbeiro.status === "ativo" ? "Desativar" : "Reativar"}
            </button>
          </div>
        </>
      )}

      <div className="flex items-start gap-4">
        {/* Avatar ou iniciais */}
        {barbeiro.foto ? (
          <div className="relative size-12 shrink-0 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700">
            <Image src={barbeiro.foto} alt={barbeiro.nome} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-300 text-white dark:text-amber-950 text-sm font-semibold">
            {getInitials(barbeiro.nome)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
              {barbeiro.nome}
            </h3>
            {barbeiro.status === "ativo" ? (
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

          {/* Especialidades em badges */}
          {barbeiro.especialidades.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {barbeiro.especialidades.map((esp) => (
                <span
                  key={esp}
                  className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400"
                >
                  <TagIcon className="size-2.5" />
                  {esp}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5 truncate">
              <MailIcon className="size-3 shrink-0" />
              {barbeiro.email}
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <PhoneIcon className="size-3 shrink-0" />
              {barbeiro.whatsapp ?? "-"}
            </span>
            <span className="flex items-center gap-1.5">
              <PercentIcon className="size-3 shrink-0" />
              {barbeiro.comissao}% comissão
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
