"use client"

import { useState, useCallback } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverPositioner,
  PopoverPopup,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  className?: string
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => new Date(value + "T12:00:00"))

  const selected = new Date(value + "T12:00:00")

  const handleSelect = useCallback(
    (date: Date) => {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, "0")
      const d = String(date.getDate()).padStart(2, "0")
      onChange(`${y}-${m}-${d}`)
      setOpen(false)
    },
    [onChange],
  )

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger
        className={cn(
          "inline-flex h-7 items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-2.5 text-xs font-normal text-zinc-900 dark:text-zinc-50 shadow-sm whitespace-nowrap outline-none transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-50 [&_svg]:shrink-0",
          className,
        )}
      >
        <CalendarIcon className="size-3.5 text-zinc-400" />
        <span>{format(selected, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner align="end" sideOffset={6}>
          <PopoverPopup>
            <Calendar
              month={month}
              selected={selected}
              onSelect={handleSelect}
              onMonthChange={setMonth}
            />
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  )
}
