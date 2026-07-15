"use client"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { ColumnsIcon, FilterIcon, PlusIcon, RowsIcon } from "lucide-react"

interface ScheduleHeaderProps {
  data: string
  onDataChange: (data: string) => void
  onHoje: () => void
  onNovoAgendamento?: () => void
  viewMode: "single" | "multi"
  onViewModeChange: (mode: "single" | "multi") => void
}

export function ScheduleHeader({ data, onDataChange, onHoje, onNovoAgendamento, viewMode, onViewModeChange }: ScheduleHeaderProps) {
  const hoje = new Date().toISOString().split("T")[0]
  const isHoje = data === hoje

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Visualize os horários disponíveis e gerencie os agendamentos.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-0.5 rounded-lg border border-zinc-300 dark:border-zinc-700 p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange("single")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
              viewMode === "single"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title="Visão individual"
          >
            <RowsIcon className="size-3.5" />
            <span className="hidden sm:inline">Individual</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("multi")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
              viewMode === "multi"
                ? "bg-orange-500 text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title="Visão em colunas"
          >
            <ColumnsIcon className="size-3.5" />
            <span className="hidden sm:inline">Colunas</span>
          </button>
        </div>
        <DatePicker value={data} onChange={onDataChange} />
        <Button variant={isHoje ? "secondary" : "outline"} size="sm" onClick={onHoje}>
          Hoje
        </Button>
        <Button variant="outline" size="sm">
          <FilterIcon className="size-4" />
          <span className="hidden sm:inline ml-1">Filtros</span>
        </Button>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={onNovoAgendamento}>
          <PlusIcon className="size-4" />
          <span className="hidden sm:inline ml-1">Novo Agendamento</span>
        </Button>
      </div>
    </div>
  )
}
