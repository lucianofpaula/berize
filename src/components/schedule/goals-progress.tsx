"use client"

import { TargetIcon, DollarSignIcon } from "lucide-react"

interface GoalsProgressProps {
  dailyAppointmentGoal: number
  dailyRevenueGoal: number
  currentAppointments: number
  currentRevenue: number
}

export function GoalsProgress({
  dailyAppointmentGoal,
  dailyRevenueGoal,
  currentAppointments,
  currentRevenue,
}: GoalsProgressProps) {
  const hasGoals = dailyAppointmentGoal > 0 || dailyRevenueGoal > 0
  if (!hasGoals) return null

  const apptPercent = dailyAppointmentGoal > 0
    ? Math.min(Math.round((currentAppointments / dailyAppointmentGoal) * 100), 100)
    : 100

  const revenuePercent = dailyRevenueGoal > 0
    ? Math.min(Math.round((currentRevenue / dailyRevenueGoal) * 100), 100)
    : 100

  const apptColor = apptPercent >= 100
    ? "bg-emerald-500"
    : apptPercent >= 70 ? "bg-amber-500" : "bg-orange-500"

  const revenueColor = revenuePercent >= 100
    ? "bg-emerald-500"
    : revenuePercent >= 70 ? "bg-amber-500" : "bg-orange-500"

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <TargetIcon className="size-3.5" />
            Agendamentos
          </span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {currentAppointments}{dailyAppointmentGoal > 0 ? ` / ${dailyAppointmentGoal}` : ""}
          </span>
        </div>
        <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${apptColor}`}
            style={{ width: `${apptPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <DollarSignIcon className="size-3.5" />
            Faturamento
          </span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            R$ {currentRevenue.toFixed(2)}{dailyRevenueGoal > 0 ? ` / R$ ${dailyRevenueGoal.toFixed(2)}` : ""}
          </span>
        </div>
        <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${revenueColor}`}
            style={{ width: `${revenuePercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
