"use client"

import { useMemo } from "react"
import { ScheduleList } from "@/components/schedule/schedule-list"
import type { Barber } from "@/lib/schedule-types"
import type { BarberStats } from "@/app/(dashboard)/agendamentos/agenda/agenda-content"
import type { SlotData } from "@/app/(dashboard)/agendamentos/agenda/agenda-content"

interface MultiBarberViewProps {
  barbers: Barber[]
  slotsMap: Record<string, SlotData[]>
  selectedSlotHora: string | null
  selectedBarberId: string
  onSelectSlot: (barberId: string, hora: string) => void
  data: string
  barberStats: BarberStats
  onInfoOpen: (barberId: string) => void
}

export function MultiBarberView({
  barbers,
  slotsMap,
  selectedSlotHora,
  selectedBarberId,
  onSelectSlot,
  data,
  barberStats,
  onInfoOpen,
}: MultiBarberViewProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-3 px-3">
      {barbers.map((barber) => {
        const slots = slotsMap[barber.id] ?? []
        const stats = barberStats[barber.id]
        const isSelected = barber.id === selectedBarberId

        return (
          <div
            key={barber.id}
            className={`flex-shrink-0 w-72 sm:w-80 rounded-xl border transition-all ${
              isSelected
                ? "border-orange-300 dark:border-orange-700 ring-1 ring-orange-400/30"
                : "border-zinc-200 dark:border-zinc-800"
            } bg-white dark:bg-zinc-950`}
          >
            {/* Barber card header */}
            <div className="flex items-center gap-3 p-3 border-b border-zinc-100 dark:border-zinc-800">
              {barber.fotoUrl ? (
                <img
                  src={barber.fotoUrl}
                  alt={barber.nome}
                  className="size-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="size-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {barber.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{barber.nome}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{barber.cargo}</p>
              </div>
              {stats && (
                <button
                  type="button"
                  onClick={() => onInfoOpen(barber.id)}
                  className="size-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Informações"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Stats row */}
            {stats && (
              <div className="grid grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-800">
                <div className="bg-white dark:bg-zinc-950 p-2 text-center">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">{stats.weekAppointments}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Semana</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 p-2 text-center">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">R$ {stats.weekRevenue.toFixed(0)}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Faturamento</p>
                </div>
                <div className="bg-white dark:bg-zinc-950 p-2 text-center">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">R$ {stats.weekCommission.toFixed(0)}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Comissão</p>
                </div>
              </div>
            )}

            {/* Schedule slots */}
            <div className="p-2 max-h-[600px] overflow-y-auto">
              <ScheduleList
                slots={slots}
                selectedSlot={isSelected ? selectedSlotHora : null}
                onSelectSlot={(hora) => onSelectSlot(barber.id, hora)}
                data={data}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
