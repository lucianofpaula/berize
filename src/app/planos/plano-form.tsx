"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeftIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  DollarSignIcon,
  StarIcon,
  TagIcon,
  FileTextIcon,
  TrendingUpIcon,
  ScissorsIcon,
  XIcon,
  PlusIcon,
  Trash2Icon,
  HashIcon,
} from "lucide-react"

type CommissionTier = { level: number; percentage: number }

type InitialData = {
  id: string
  name: string
  description: string | null
  price: number
  badge: string | null
  includedServiceIds: string[]
  commissionTiers: CommissionTier[]
  status: "ACTIVE" | "INACTIVE"
  sortOrder: number
}

export function PlanoForm({
  initialData,
  servicosDisponiveis,
}: {
  initialData: InitialData
  servicosDisponiveis: { id: string; name: string; price: number }[]
}) {
  const router = useRouter()

  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [name, setName] = useState(initialData.name)
  const [description, setDescription] = useState(initialData.description ?? "")
  const [price, setPrice] = useState(String(initialData.price))
  const [badge, setBadge] = useState(initialData.badge ?? "")
  const [includedServiceIds, setIncludedServiceIds] = useState<string[]>(initialData.includedServiceIds)
  const [commissionTiers, setCommissionTiers] = useState<CommissionTier[]>(initialData.commissionTiers)
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">(initialData.status)
  const [sortOrder, setSortOrder] = useState(String(initialData.sortOrder))

  function addTier() {
    const nextLevel = commissionTiers.length > 0
      ? Math.max(...commissionTiers.map((t) => t.level)) + 1
      : 1
    setCommissionTiers([...commissionTiers, { level: nextLevel, percentage: 10 }])
  }

  function removeTier(level: number) {
    setCommissionTiers(commissionTiers.filter((t) => t.level !== level))
  }

  function updateTier(level: number, field: "level" | "percentage", value: number) {
    setCommissionTiers(
      commissionTiers.map((t) => (t.level === level ? { ...t, [field]: value } : t)),
    )
  }

  function toggleService(svcId: string) {
    setIncludedServiceIds((prev) =>
      prev.includes(svcId) ? prev.filter((id) => id !== svcId) : [...prev, svcId],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!name || !price || parseFloat(price) <= 0) return

    setEnviando(true)

    const res = await fetch(`/api/planos/${initialData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || null,
        price: parseFloat(price),
        badge: badge || null,
        includedServiceIds,
        commissionTiers,
        status,
        sortOrder: parseInt(sortOrder) || 0,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setErro(data.error ?? "Erro ao salvar plano.")
      setEnviando(false)
      return
    }

    setEnviando(false)
    router.push("/planos")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {erro && (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertTriangleIcon className="size-4 shrink-0" />
          {erro}
        </div>
      )}

      {/* Dados básicos */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Dados do plano</h3>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Nome <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do plano"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descrição</label>
          <div className="relative">
            <FileTextIcon className="absolute left-3 top-3 size-4 text-zinc-400" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do plano"
              rows={3}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Preço (R$) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.90"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Badge</label>
            <div className="relative">
              <StarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ex: Recomendado, Mais popular"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ordenação</label>
            <div className="relative">
              <HashIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="number"
                min="0"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-9 pr-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
            >
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Serviços incluídos */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <ScissorsIcon className="size-4 text-zinc-400" />
            Serviços incluídos
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Selecione os serviços que fazem parte deste plano
          </p>
        </div>

        {servicosDisponiveis.length === 0 ? (
          <p className="text-xs text-zinc-400">Nenhum serviço disponível. Crie serviços primeiro.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {servicosDisponiveis.map((svc) => (
              <button
                key={svc.id}
                type="button"
                onClick={() => toggleService(svc.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  includedServiceIds.includes(svc.id)
                    ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-50"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                {svc.name}
                <span className="opacity-60">R$ {svc.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comissões por nível */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <TrendingUpIcon className="size-4 text-zinc-400" />
              Comissões por nível
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Defina porcentagens de comissão para cada nível de afiliado
            </p>
          </div>
          <button
            type="button"
            onClick={addTier}
            className="flex items-center gap-1 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            <PlusIcon className="size-3" />
            Adicionar nível
          </button>
        </div>

        {commissionTiers.length === 0 && (
          <p className="text-xs text-zinc-400">Nenhum nível de comissão configurado.</p>
        )}

        {commissionTiers.map((tier) => (
          <div key={tier.level} className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-1">Nível</label>
              <input
                type="number"
                min={1}
                value={tier.level}
                onChange={(e) => updateTier(tier.level, "level", Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-1">Porcentagem (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={tier.percentage}
                onChange={(e) => updateTier(tier.level, "percentage", Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50"
              />
            </div>
            <button
              type="button"
              onClick={() => removeTier(tier.level)}
              className="mt-5 flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ChevronLeftIcon className="size-4" />
          Voltar
        </button>

        <button
          type="submit"
          disabled={enviando || !name || !price || parseFloat(price) <= 0}
          className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 px-6 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
        >
          {enviando ? (
            <>
              <div className="size-4 animate-spin rounded-full border-2 border-white dark:border-zinc-900 border-t-transparent" />
              Salvando...
            </>
          ) : (
            <>
              <CheckCircle2Icon className="size-4" />
              Salvar alterações
            </>
          )}
        </button>
      </div>
    </form>
  )
}
