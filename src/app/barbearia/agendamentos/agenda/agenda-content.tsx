"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { ScheduleHeader } from "@/components/schedule/schedule-header"
import { BarberCarousel } from "@/components/schedule/barber-carousel"
import { ScheduleList } from "@/components/schedule/schedule-list"
import { MultiBarberView } from "@/components/schedule/multi-barber-view"
import { CreateAppointmentDrawer } from "@/components/schedule/create-appointment-drawer"
import { BarberInfoPanel } from "@/components/schedule/barber-info-panel"
import { GoalsProgress } from "@/components/schedule/goals-progress"
import { getLocalDateString, type Barber, type Client, type Service } from "@/lib/schedule-types"
import type { BarberStats } from "./page"

export type { BarberStats }

type CompanyHour = {
  dayOfWeek: number
  openTime: string
  closeTime: string
  isOpen: boolean
}

interface AgendaContentProps {
  companyId: string
  barbers: Barber[]
  services: Service[]
  clients: Client[]
  barberStats: BarberStats
  dailyAppointmentGoal: number
  dailyRevenueGoal: number
  appointmentInterval: number
  companyHours: CompanyHour[]
}

export interface SlotData {
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

function buildBaseSlots(hours: CompanyHour[], data: string, interval: number): SlotData[] {
  const dayOfWeek = new Date(data + "T12:00:00").getDay()
  const dayHour = hours.find((h) => h.dayOfWeek === dayOfWeek)

  if (!dayHour || !dayHour.isOpen) {
    return []
  }

  const [openH, openM] = dayHour.openTime.split(":").map(Number)
  const [closeH, closeM] = dayHour.closeTime.split(":").map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  const slots: SlotData[] = []
  for (let m = openMinutes; m < closeMinutes; m += interval) {
    const h = Math.floor(m / 60)
    const min = m % 60
    slots.push({
      hora: `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
      status: "disponivel",
    })
  }

  // Last slot as blocked (closing time)
  slots.push({
    hora: `${String(closeH).padStart(2, "0")}:${String(closeM).padStart(2, "0")}`,
    status: "bloqueado",
  })

  return slots
}

function computeSlotsForBarber(
  barberId: string,
  baseSlots: SlotData[],
  appointments: Record<string, { id: string; startTime: string; endTime: string; clientId: string; serviceIds: string[]; notes?: string; status: string }[]>,
  clients: Client[],
  services: Service[],
): SlotData[] {
  const barberAppts = appointments[barberId] ?? []
  return baseSlots.map((slot) => {
    const appt = barberAppts.find(
      (a) => slot.hora >= a.startTime && slot.hora < a.endTime,
    )
    if (!appt) return slot
    const cliente = clients.find((c) => c.id === appt.clientId) ?? clients[0]
    const servicos = appt.serviceIds
      .map((id: string) => services.find((s) => s.id === id))
      .filter(Boolean) as Service[]
    const slotStatus: SlotData["status"] =
      appt.status === "NOSHOW" ? "noshow"
      : appt.status === "CANCELADO" ? "cancelado"
      : "agendado"
    return {
      hora: slot.hora,
      status: slotStatus,
      agendamento: {
        id: appt.id,
        cliente: cliente ?? { id: "", nome: "Desconhecido", whatsapp: "", fotoUrl: null },
        servicos: servicos.length > 0 ? servicos : [services[0]!],
        status: appt.status ?? "AGENDADO",
        observacoes: appt.notes,
        horaInicio: appt.startTime,
        horaFim: appt.endTime,
      },
    }
  })
}

export function AgendaContent({
  companyId,
  barbers,
  services,
  clients,
  barberStats,
  dailyAppointmentGoal,
  dailyRevenueGoal,
  appointmentInterval,
  companyHours,
}: AgendaContentProps) {
  const hoje = getLocalDateString()
  const [data, setData] = useState(hoje)
  const [viewMode, setViewMode] = useState<"single" | "multi">("single")
  const [selectedBarberId, setSelectedBarberId] = useState(barbers[0]?.id ?? "")
  const [selectedSlotHora, setSelectedSlotHora] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [infoBarberId, setInfoBarberId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [appointments, setAppointments] = useState<
    Record<string, {
      id: string
      startTime: string
      endTime: string
      clientId: string
      serviceIds: string[]
      notes?: string
      status: string
    }[]>
  >({})

  useEffect(() => {
    if (!data) return
    setLoading(true)
    fetch(`/api/agendamentos?data=${data}`)
      .then((r) => r.json())
      .then((json) => {
        const grouped: Record<string, {
          id: string
          startTime: string
          endTime: string
          clientId: string
          serviceIds: string[]
          notes?: string
          status: string
        }[]> = {}
        for (const appt of json) {
          const pid = appt.barberId
          if (!grouped[pid]) grouped[pid] = []
          grouped[pid].push({
            id: appt.id,
            startTime: appt.startTime,
            endTime: appt.endTime,
            clientId: appt.clientId,
            serviceIds: appt.serviceIds,
            notes: appt.notes ?? undefined,
            status: appt.status ?? "AGENDADO",
          })
        }
        setAppointments(grouped)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [companyId, data])

  const baseSlots = useMemo(
    () => buildBaseSlots(companyHours, data, appointmentInterval),
    [companyHours, data, appointmentInterval],
  )

  const slots: SlotData[] = useMemo(
    () => computeSlotsForBarber(selectedBarberId, baseSlots, appointments, clients, services),
    [baseSlots, appointments, selectedBarberId, clients, services],
  )

  const multiSlots = useMemo(() => {
    const map: Record<string, SlotData[]> = {}
    for (const b of barbers) {
      map[b.id] = computeSlotsForBarber(b.id, baseSlots, appointments, clients, services)
    }
    return map
  }, [baseSlots, appointments, barbers, clients, services])

  const selectedSlot = useMemo<SlotData | null>(
    () => slots.find((s) => s.hora === selectedSlotHora) ?? null,
    [slots, selectedSlotHora],
  )

  const currentAppointments = useMemo(
    () => Object.values(appointments).flat().filter((a) => a.status !== "CANCELADO").length,
    [appointments],
  )

  const currentRevenue = useMemo(() => {
    const allIds = Object.values(appointments).flat().filter((a) => a.status !== "CANCELADO").flatMap((a) => a.serviceIds)
    return services
      .filter((s) => allIds.includes(s.id))
      .reduce((sum, s) => sum + s.preco, 0)
  }, [appointments, services])

  const selectedBarber = useMemo(
    () => barbers.find((b) => b.id === (infoBarberId ?? selectedBarberId)) ?? null,
    [barbers, selectedBarberId, infoBarberId],
  )

  const handleSelectSlot = useCallback((barberId: string, hora: string) => {
    setSelectedBarberId(barberId)
    setSelectedSlotHora(hora)
    setDrawerOpen(true)
  }, [])

  const handleSingleSelectSlot = useCallback((hora: string) => {
    handleSelectSlot(selectedBarberId, hora)
  }, [handleSelectSlot, selectedBarberId])

  const handleUpdateAppointment = useCallback(
    async (appointmentId: string, serviceIds: string[], notes: string, dataAgenda: string, startTime: string) => {
      try {
        const res = await fetch(`/api/agendamentos/${appointmentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceIds, notes, date: dataAgenda, startTime }),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? "Erro ao atualizar agendamento")
        }
        const atualizado = await res.json()
        setAppointments((prev) => {
          const barberAppts = [...(prev[selectedBarberId] ?? [])]
          const idx = barberAppts.findIndex((a) => a.id === appointmentId)
          if (idx === -1) return prev
          barberAppts[idx] = {
            id: atualizado.id,
            startTime: atualizado.startTime,
            endTime: atualizado.endTime,
            clientId: atualizado.clientId,
            serviceIds: atualizado.serviceIds,
            notes: atualizado.notes ?? undefined,
            status: atualizado.status ?? "AGENDADO",
          }
          return { ...prev, [selectedBarberId]: barberAppts }
        })
        setSelectedSlotHora(null)
        setDrawerOpen(false)
      } catch (err) {
        console.error(err)
      }
    },
    [selectedBarberId],
  )

  const handleChangeStatus = useCallback(
    async (appointmentId: string, status: string) => {
      try {
        const res = await fetch(`/api/agendamentos/${appointmentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
        if (!res.ok) throw new Error("Erro ao alterar status")
        setAppointments((prev) => {
          const barberAppts = (prev[selectedBarberId] ?? []).map((a) =>
            a.id === appointmentId ? { ...a, status } : a,
          )
          return { ...prev, [selectedBarberId]: barberAppts }
        })
        setSelectedSlotHora(null)
        setDrawerOpen(false)
      } catch (err) {
        console.error(err)
      }
    },
    [selectedBarberId],
  )

  const handleCreateAppointment = useCallback(
    async (barberId: string, clientId: string, serviceIds: string[], notes: string, dataAgenda: string, startTime: string, quickAddName?: string) => {
      try {
        const body: Record<string, unknown> = { barberId, serviceIds, notes, date: dataAgenda, startTime }
        if (quickAddName) {
          body.quickAddName = quickAddName
        } else {
          body.clientId = clientId
        }
        const res = await fetch("/api/agendamentos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Erro ao criar agendamento")
        const novo = await res.json()
        setAppointments((prev) => ({
          ...prev,
          [barberId]: [
            ...(prev[barberId] ?? []),
            {
              id: novo.id,
              startTime: novo.startTime,
              endTime: novo.endTime,
              clientId: novo.clientId,
              serviceIds: novo.serviceIds,
              notes: novo.notes ?? undefined,
              status: novo.status ?? "AGENDADO",
            },
          ],
        }))
        setSelectedSlotHora(null)
        setDrawerOpen(false)
      } catch (err) {
        console.error(err)
      }
    },
    [],
  )

  const dataObj = data ? new Date(data + "T12:00:00") : new Date()
  const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
  const diaSemana = diasSemana[dataObj.getDay()]
  const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
    day: "numeric", month: "long", year: "numeric",
  })

  const statusCounts = slots.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      <ScheduleHeader
        data={data}
        onDataChange={setData}
        onHoje={() => setData(hoje)}
        onNovoAgendamento={() => {
          if (viewMode === "multi" && barbers.length > 0) {
            setSelectedBarberId(barbers[0].id)
          }
          setDrawerOpen(true)
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <GoalsProgress
        dailyAppointmentGoal={dailyAppointmentGoal}
        dailyRevenueGoal={dailyRevenueGoal}
        currentAppointments={currentAppointments}
        currentRevenue={currentRevenue}
      />

      {viewMode === "single" ? (
        <>
          <BarberCarousel
            barbers={barbers}
            selectedId={selectedBarberId}
            onSelect={(id) => {
              setSelectedBarberId(id)
              setSelectedSlotHora(null)
            }}
          />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-zinc-900 dark:text-zinc-50">{diaSemana}</span>
            <span className="hidden sm:inline">{dataFormatada}</span>
            <span className="text-zinc-400/40 hidden sm:inline">|</span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-violet-500" /> Agendado
              <span className="ml-1 text-zinc-500">({statusCounts.agendado ?? 0})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" /> Disponível
              <span className="ml-1">({statusCounts.disponivel ?? 0})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-zinc-400" /> Não compareceu
              <span className="ml-1 text-zinc-500">({statusCounts.noshow ?? 0})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-zinc-400" /> Cancelado
              <span className="ml-1 text-zinc-500">({statusCounts.cancelado ?? 0})</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-zinc-400" /> Bloqueado
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-amber-400" /> Intervalo
            </span>
            <span className="hidden lg:flex items-center ml-auto">
              <button
                type="button"
                onClick={() => {
                  setInfoBarberId(selectedBarberId)
                  setInfoOpen(true)
                }}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                Info barbeiro
              </button>
            </span>
          </div>

          {loading && (
            <div className="text-center text-sm text-zinc-400 py-4">Carregando...</div>
          )}

          <ScheduleList
            slots={slots}
            selectedSlot={selectedSlotHora}
            onSelectSlot={handleSingleSelectSlot}
            data={data}
          />

          {/* Mobile FAB */}
          <button
            type="button"
            onClick={() => {
              setInfoBarberId(selectedBarberId)
              setInfoOpen(true)
            }}
            className="lg:hidden fixed bottom-4 right-4 z-40 size-12 rounded-full bg-orange-500 text-white shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
            aria-label="Informações do barbeiro"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </button>

        </>
      ) : (
        <>
          {loading && (
            <div className="text-center text-sm text-zinc-400 py-4">Carregando...</div>
          )}

          <MultiBarberView
            barbers={barbers}
            slotsMap={multiSlots}
            selectedSlotHora={selectedSlotHora}
            selectedBarberId={selectedBarberId}
            onSelectSlot={handleSelectSlot}
            data={data}
            barberStats={barberStats}
            onInfoOpen={(barberId) => {
              setInfoBarberId(barberId)
              setInfoOpen(true)
            }}
          />
        </>
      )}

      <BarberInfoPanel
        barber={selectedBarber}
        stats={barberStats}
        open={infoOpen}
        onOpenChange={(open) => {
          setInfoOpen(open)
          if (!open) setInfoBarberId(null)
        }}
      />

      <CreateAppointmentDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        barber={selectedBarber}
        selectedSlot={selectedSlot}
        data={data}
        services={services}
        clients={clients}
        onSubmit={handleCreateAppointment}
        onUpdate={handleUpdateAppointment}
        onStatusChange={handleChangeStatus}
        allSlots={slots}
      />
    </div>
  )
}
