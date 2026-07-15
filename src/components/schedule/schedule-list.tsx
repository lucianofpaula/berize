"use client"

import { Clock } from "lucide-react"
import { getLocalDateString, type Client, type Service } from "@/lib/schedule-types"

interface SlotData {
  hora: string
  status: "disponivel" | "agendado" | "noshow" | "cancelado" | "bloqueado" | "intervalo"
  agendamento?: {
    id: string
    cliente: Client
    servicos: Service[]
    status: string
    observacoes?: string
    horaInicio: string
    horaFim: string
  }
}

interface MergedSlot extends SlotData {
  colspan: number
}

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string; border: string; cursor: string }> = {
  disponivel: {
    label: "Disponível",
    dot: "bg-emerald-500",
    bg: "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50",
    text: "text-emerald-950 dark:text-white",
    border: "border-emerald-300 dark:border-emerald-700",
    cursor: "cursor-pointer",
  },
  agendado: {
    label: "Agendado",
    dot: "bg-violet-500",
    bg: "bg-violet-100 hover:bg-violet-200 dark:bg-violet-950/30 dark:hover:bg-violet-950/50",
    text: "text-violet-950 dark:text-white",
    border: "border-violet-300 dark:border-violet-700",
    cursor: "cursor-pointer",
  },
  noshow: {
    label: "Não compareceu",
    dot: "bg-zinc-400",
    bg: "bg-zinc-200/70 hover:bg-zinc-300/70 dark:bg-zinc-800/50",
    text: "text-zinc-700 dark:text-zinc-200",
    border: "border-zinc-300 dark:border-zinc-600",
    cursor: "cursor-pointer",
  },
  cancelado: {
    label: "Cancelado",
    dot: "bg-zinc-400",
    bg: "bg-zinc-200/70 hover:bg-zinc-300/70 dark:bg-zinc-800/50",
    text: "text-zinc-700 dark:text-zinc-200",
    border: "border-zinc-300 dark:border-zinc-600",
    cursor: "cursor-pointer",
  },
  bloqueado: {
    label: "Bloqueado",
    dot: "bg-zinc-400",
    bg: "bg-zinc-100 dark:bg-zinc-800/40",
    text: "text-zinc-500 dark:text-zinc-400",
    border: "border-zinc-200 dark:border-zinc-700",
    cursor: "cursor-not-allowed",
  },
  intervalo: {
    label: "Intervalo",
    dot: "bg-amber-400",
    bg: "bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/30 dark:hover:bg-amber-950/50",
    text: "text-amber-950 dark:text-white",
    border: "border-amber-300 dark:border-amber-700",
    cursor: "cursor-not-allowed",
  },
}

interface ScheduleListProps {
  slots: SlotData[]
  selectedSlot: string | null
  onSelectSlot: (hora: string) => void
  data: string
}

function mergeSlots(slots: SlotData[]): MergedSlot[] {
  const result: MergedSlot[] = []
  let i = 0
  while (i < slots.length) {
    const slot = slots[i]
    if (slot.agendamento && (slot.status === "agendado" || slot.status === "noshow" || slot.status === "cancelado")) {
      let count = 1
      while (i + count < slots.length && slots[i + count].agendamento?.id === slot.agendamento.id) {
        count++
      }
      result.push({ ...slot, colspan: count })
      i += count
    } else {
      result.push({ ...slot, colspan: 1 })
      i++
    }
  }
  return result
}

export function ScheduleList({ slots, selectedSlot, onSelectSlot, data }: ScheduleListProps) {
  const agora = new Date()
  const hojeStr = getLocalDateString(agora)
  const isDataPassada = data < hojeStr
  const isDataFutura = data > hojeStr
  const horaAtual = `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`

  const mergedSlots = mergeSlots(slots)

  return (
    <div className="space-y-1">
      {mergedSlots.map((slot) => {
        const config = statusConfig[slot.status] ?? statusConfig.bloqueado
        const isPast = isDataPassada || (!isDataFutura && slot.hora < horaAtual)
        const isSelected = slot.hora === selectedSlot
        const podeClicar = (slot.status === "disponivel" && !isPast) || slot.status === "agendado" || slot.status === "noshow" || slot.status === "cancelado"

        return (
          <div
            key={slot.hora}
            onClick={() => podeClicar && onSelectSlot(slot.hora)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all ${config.bg} ${config.border} ${config.cursor} ${isPast ? "opacity-40" : ""} ${
              isSelected ? "ring-2 ring-orange-500 ring-offset-2" : ""
            } ${
              (slot.status === "agendado" || slot.status === "noshow" || slot.status === "cancelado") && !isPast
                ? "ring-2 ring-orange-500 ring-offset-2 shadow-md"
                : ""
            }`}
            style={slot.colspan > 1 ? { minHeight: `${slot.colspan * 44 - 4}px` } : undefined}
          >
            <div className="flex items-center gap-2 w-20 shrink-0 self-start mt-0.5">
              <Clock className={`size-3.5 ${config.text}`} />
              <span className={`text-sm font-medium ${config.text}`}>
                {slot.agendamento ? `${slot.agendamento.horaInicio}-${slot.agendamento.horaFim}` : slot.hora}
              </span>
            </div>

            {slot.status === "disponivel" && (
              <span className={`text-xs ${config.text}`}>
                {isPast ? "Indisponível" : "Disponível"}
              </span>
            )}

            {(slot.status === "agendado" || slot.status === "noshow" || slot.status === "cancelado") && slot.agendamento && (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {slot.agendamento.cliente.fotoUrl ? (
                  <div className="group/avatar relative shrink-0 self-start mt-0.5">
                    <img
                      src={slot.agendamento.cliente.fotoUrl}
                      alt={slot.agendamento.cliente.nome}
                      className="size-7 rounded-full object-cover transition-all duration-200 group-hover/avatar:scale-[3] group-hover/avatar:z-50 group-hover/avatar:shadow-xl group-hover/avatar:ring-2 group-hover/avatar:ring-orange-400"
                    />
                  </div>
                ) : (
                  <div className={`size-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 self-start mt-0.5 ${
                    slot.status === "agendado"
                      ? "bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                  }`}>
                    {slot.agendamento.cliente.nome.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-medium ${
                      slot.status === "agendado"
                        ? "text-violet-950 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-200"
                    }`}>
                      {slot.agendamento.cliente.nome}
                    </p>
                    {slot.status === "noshow" && (
                      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                        Não compareceu
                      </span>
                    )}
                    {slot.status === "cancelado" && (
                      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-300">
                        Cancelado
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {slot.agendamento.servicos.map((svc) => (
                      <span
                        key={svc.id}
                        className="inline-flex items-center gap-1 rounded-full bg-violet-200/70 dark:bg-violet-900/50 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-300"
                      >
                        {svc.nome}
                        <span className="text-violet-500 dark:text-violet-400">({svc.duracao}min)</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(slot.status === "bloqueado" || slot.status === "intervalo") && (
              <span className={`text-xs ${config.text}`}>
                {config.label}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
