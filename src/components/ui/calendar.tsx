"use client"

import { useMemo } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface CalendarProps {
  month: Date
  selected: Date | undefined
  onSelect: (date: Date) => void
  onMonthChange: (date: Date) => void
}

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function Calendar({ month, selected, onSelect, onMonthChange }: CalendarProps) {
  const weeks = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
    const days: Date[][] = []
    let current = start
    while (current <= end) {
      const week: Date[] = []
      for (let i = 0; i < 7; i++) {
        week.push(current)
        current = addDays(current, 1)
      }
      days.push(week)
    }
    return days
  }, [month])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => onMonthChange(subMonths(month, 1))}
          className="size-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {format(month, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="size-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-xs font-medium text-zinc-400 py-1.5">
            {day}
          </div>
        ))}

        {weeks.map((week, i) => (
          week.map((date) => {
            const isSelected = selected && isSameDay(date, selected)
            const isCurrentMonth = isSameMonth(date, month)
            const isCurrentDay = isToday(date)

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => onSelect(date)}
                disabled={!isCurrentMonth}
                className={cn(
                  "size-9 rounded-lg text-sm transition-colors",
                  !isCurrentMonth && "text-zinc-300 dark:text-zinc-700",
                  isCurrentMonth && !isSelected && "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  isSelected && "bg-orange-500 text-white hover:bg-orange-600 shadow-sm",
                  isCurrentDay && !isSelected && "border border-orange-300 dark:border-orange-700",
                )}
              >
                {format(date, "d")}
              </button>
            )
          })
        ))}
      </div>
    </div>
  )
}
