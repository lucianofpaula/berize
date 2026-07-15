"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Barber } from "@/lib/schedule-types"

interface BarberCarouselProps {
  barbers: Barber[]
  selectedId: string
  onSelect: (id: string) => void
}

const statusColors: Record<string, string> = {
  online: "bg-emerald-500",
  "em-atendimento": "bg-amber-500",
  folga: "bg-blue-500",
  ausente: "bg-zinc-400",
  bloqueado: "bg-zinc-900",
}

const statusLabels: Record<string, string> = {
  online: "Online",
  "em-atendimento": "Em atendimento",
  folga: "Folga",
  ausente: "Ausente",
  bloqueado: "Bloqueado",
}

export function BarberCarousel({ barbers, selectedId, onSelect }: BarberCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 200
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative group">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border rounded-full p-1.5 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <ChevronLeft className="size-4" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-none pb-2 px-1"
      >
        {barbers.map((barber) => {
          const isSelected = barber.id === selectedId
          const initials = barber.nome
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()

          return (
            <button
              key={barber.id}
              onClick={() => onSelect(barber.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all shrink-0 min-w-[160px] sm:min-w-[180px] ${
                isSelected
                  ? "border-orange-500 bg-orange-500/5 shadow-md shadow-orange-500/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-300 hover:shadow-sm"
              }`}
            >
              <div className="relative">
                {barber.fotoUrl ? (
                  <img
                    src={barber.fotoUrl}
                    alt={barber.nome}
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold">
                    {initials}
                  </div>
                )}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-white dark:border-zinc-900 ${statusColors[barber.status]}`}
                />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{barber.nome}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{barber.cargo}</p>
                <p className={`text-xs font-medium mt-0.5 ${
                  barber.status === "online" ? "text-emerald-600" :
                  barber.status === "em-atendimento" ? "text-amber-600" :
                  barber.status === "folga" ? "text-blue-600" :
                  barber.status === "ausente" ? "text-zinc-400" :
                  "text-zinc-800"
                }`}>
                  {statusLabels[barber.status]}
                </p>
              </div>
            </button>
          )
        })}
      </div>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border rounded-full p-1.5 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
