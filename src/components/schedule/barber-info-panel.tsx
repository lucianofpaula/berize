"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { Barber } from "@/lib/schedule-types"

type BarberStats = Record<string, {
  weekAppointments: number
  weekRevenue: number
  weekCommission: number
  monthAppointments: number
  monthRevenue: number
  monthCommission: number
}>

interface BarberInfoPanelProps {
  barber: Barber | null
  stats: BarberStats | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BarberInfoPanel({ barber, stats, open, onOpenChange }: BarberInfoPanelProps) {
  if (!barber) return null

  const barberStat = stats?.[barber.id]
  const initials = barber.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const rows = [
    { label: "Cortes", week: barberStat?.weekAppointments ?? 0, month: barberStat?.monthAppointments ?? 0 },
    { label: "Faturamento", week: `R$ ${(barberStat?.weekRevenue ?? 0).toFixed(2)}`, month: `R$ ${(barberStat?.monthRevenue ?? 0).toFixed(2)}` },
    { label: "Comissão", week: `R$ ${(barberStat?.weekCommission ?? 0).toFixed(2)}`, month: `R$ ${(barberStat?.monthCommission ?? 0).toFixed(2)}` },
  ]

  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={false} disablePointerDismissal swipeDirection="right">
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Informações</DrawerTitle>
            <DrawerClose type="button" className="rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X className="size-4" />
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="flex items-center gap-3">
            {barber.fotoUrl ? (
              <img
                src={barber.fotoUrl}
                alt={barber.nome}
                className="size-12 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="size-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{barber.nome}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{barber.cargo}</p>
            </div>
            <span className="size-2.5 rounded-full bg-emerald-500 shrink-0" title="Online" />
          </div>

          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900">
                  <th className="text-left px-3 py-2 font-medium text-zinc-500 dark:text-zinc-400" />
                  <th className="text-right px-3 py-2 font-medium text-zinc-500 dark:text-zinc-400">Semana</th>
                  <th className="text-right px-3 py-2 font-medium text-zinc-500 dark:text-zinc-400">Mês</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-3 py-2.5 text-zinc-500 dark:text-zinc-400">{row.label}</td>
                    <td className="px-3 py-2.5 text-right font-medium">{row.week}</td>
                    <td className="px-3 py-2.5 text-right font-medium">{row.month}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <DrawerFooter>
          <Button type="button" className="w-full">
            <svg className="size-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            Informações
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
