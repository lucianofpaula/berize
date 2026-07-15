"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { Barber, Client, Service } from "@/lib/schedule-types"
import { Clock, UserIcon, Scissors, X } from "lucide-react"

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

interface CreateAppointmentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  barber: Barber | null
  selectedSlot: SlotData | null
  data: string
  services: Service[]
  clients: Client[]
  onSubmit: (professionalId: string, clienteId: string, servicoIds: string[], observacoes: string, data: string, horaInicio: string, quickAddName?: string) => Promise<void>
  onUpdate?: (appointmentId: string, servicoIds: string[], observacoes: string, data: string, horaInicio: string) => Promise<void>
  onStatusChange?: (appointmentId: string, status: string) => Promise<void>
  allSlots?: SlotData[]
}

export function CreateAppointmentDrawer({
  open,
  onOpenChange,
  barber,
  selectedSlot,
  data,
  services,
  clients,
  onSubmit,
  onUpdate,
  onStatusChange,
  allSlots,
}: CreateAppointmentDrawerProps) {
  const [clienteQuery, setClienteQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [quickAdd, setQuickAdd] = useState(false)
  const [quickAddName, setQuickAddName] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [observacoes, setObservacoes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [editHora, setEditHora] = useState("")

  const isEditing = selectedSlot?.status === "agendado" && selectedSlot?.agendamento !== undefined

  useEffect(() => {
    if (!open) return
    if (isEditing && selectedSlot?.agendamento) {
      const appt = selectedSlot.agendamento
      setSelectedClient(appt.cliente)
      setClienteQuery(appt.cliente.nome)
      setSelectedServices(appt.servicos.map((s) => s.id))
      setObservacoes(appt.observacoes ?? "")
      setEditHora(appt.horaInicio)
    } else {
      setClienteQuery("")
      setSelectedClient(null)
      setQuickAdd(false)
      setQuickAddName("")
      setSelectedServices([])
      setObservacoes("")
      setEditHora("")
    }
  }, [open, isEditing, selectedSlot])

  const filteredClients = clienteQuery
    ? clients.filter((c) =>
        c.nome.toLowerCase().includes(clienteQuery.toLowerCase())
      )
    : []

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const servicosSelecionados = services.filter((s) =>
    selectedServices.includes(s.id)
  )

  const tempoTotal = servicosSelecionados.reduce((acc, s) => acc + s.duracao, 0)
  const valorTotal = servicosSelecionados.reduce((acc, s) => acc + s.preco, 0)

  const horas = Math.floor(tempoTotal / 60)
  const minutos = tempoTotal % 60
  const tempoFormatado = horas > 0 ? `${horas}h${minutos}min` : `${minutos}min`

  const horarioRef = isEditing ? editHora : (selectedSlot?.hora ?? "")
  const calcularHoraFim = () => {
    if (!horarioRef) return ""
    const [h, m] = horarioRef.split(":").map(Number)
    const totalMinutos = h * 60 + m + tempoTotal
    const hFim = Math.floor(totalMinutos / 60)
    const mFim = totalMinutos % 60
    return `${String(hFim).padStart(2, "0")}:${String(mFim).padStart(2, "0")}`
  }

  const horaFimCalculada = calcularHoraFim()

  const conflitos = allSlots?.filter((s) => {
    if (s.status !== "agendado" || !s.agendamento) return false
    if (isEditing && s.agendamento.id === selectedSlot?.agendamento?.id) return false
    if (!editHora || !horaFimCalculada) return false
    return s.hora >= editHora && s.hora < horaFimCalculada
  }) ?? []

  const dataObj = data ? new Date(data + "T12:00:00") : new Date()
  const diasSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
  const diaSemana = diasSemana[dataObj.getDay()]
  const dataFormatada = dataObj.toLocaleDateString("pt-BR")

  const initials = barber?.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleSubmit = async () => {
    if (!barber || servicosSelecionados.length === 0) return
    if (!quickAdd && !selectedClient) return
    if (quickAdd && !quickAddName.trim()) return

    setSubmitting(true)
    try {
      const hora = isEditing ? editHora : (selectedSlot?.hora ?? "")

      if (isEditing && onUpdate && selectedSlot?.agendamento) {
        await onUpdate(selectedSlot.agendamento.id, selectedServices, observacoes, data, hora)
      } else {
        if (quickAdd && quickAddName.trim()) {
        await onSubmit(barber.id, "", selectedServices, observacoes, data, hora, quickAddName.trim())
      } else if (selectedClient) {
        await onSubmit(barber.id, selectedClient.id, selectedServices, observacoes, data, hora)
      }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (status: string) => {
    if (!onStatusChange || !selectedSlot?.agendamento) return
    setSubmitting(true)
    try {
      await onStatusChange(selectedSlot.agendamento.id, status)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      modal={false}
      disablePointerDismissal
      swipeDirection="right"
    >
      <DrawerContent className="flex flex-col max-w-md right-0 left-auto">
        <DrawerHeader className="flex flex-row items-center justify-between shrink-0">
          <DrawerTitle>{isEditing ? "Editar Agendamento" : "Novo Agendamento"}</DrawerTitle>
          <DrawerClose type="button" className="rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="size-4" />
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {barber && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
              {barber.fotoUrl ? (
                <img
                  src={barber.fotoUrl}
                  alt={barber.nome}
                  className="size-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="size-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{barber.nome}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{barber.cargo}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <Clock className="size-4" />
            <span>{diaSemana}, {dataFormatada}</span>
          </div>

          <Separator />

          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="size-7 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center text-xs font-medium text-orange-700 dark:text-orange-300">
                  {selectedClient?.nome.charAt(0)}
                </div>
                <span className="text-sm font-medium">{selectedClient?.nome}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Cliente</label>
                <button
                  type="button"
                  onClick={() => {
                    setQuickAdd(!quickAdd)
                    setClienteQuery("")
                    setSelectedClient(null)
                    setQuickAddName("")
                  }}
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  {quickAdd ? "Pesquisar cliente" : "Cadastro rápido"}
                </button>
              </div>

              {quickAdd ? (
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Nome do cliente..."
                    value={quickAddName}
                    onChange={(e) => setQuickAddName(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-50"
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar cliente..."
                      value={clienteQuery}
                      onChange={(e) => {
                        setClienteQuery(e.target.value)
                        setSelectedClient(null)
                      }}
                      className="w-full h-9 pl-9 pr-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-50"
                    />
                  </div>
                  {clienteQuery && !selectedClient && (
                    <div className="border rounded-md divide-y max-h-40 overflow-y-auto">
                      {filteredClients.length === 0 ? (
                        <div className="p-3 text-sm text-center text-zinc-500">Nenhum cliente encontrado</div>
                      ) : (
                        filteredClients.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setSelectedClient(c)
                              setClienteQuery(c.nome)
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left"
                          >
                            <div className="size-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-xs font-medium text-orange-700 dark:text-orange-300">
                              {c.nome.charAt(0)}
                            </div>
                            {c.nome}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                  {selectedClient && (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                      <div className="size-7 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center text-xs font-medium text-orange-700 dark:text-orange-300">
                        {selectedClient.nome.charAt(0)}
                      </div>
                      <span className="text-sm font-medium flex-1">{selectedClient.nome}</span>
                      <button
                        onClick={() => {
                          setSelectedClient(null)
                          setClienteQuery("")
                        }}
                        className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
                      >
                        Trocar
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {isEditing && allSlots && (
            <>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium">Horário</label>
                <select
                  value={editHora}
                  onChange={(e) => setEditHora(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-50"
                >
                  {allSlots
                    .filter((s) => s.status === "disponivel" || (s.agendamento?.id === selectedSlot?.agendamento?.id))
                    .map((s) => (
                      <option key={s.hora} value={s.hora}>
                        {s.hora} — {s.status === "disponivel" ? "Disponível" : "Atual"}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium">Serviços</label>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {services.map((svc) => {
                const isSelected = selectedServices.includes(svc.id)
                return (
                  <label
                    key={svc.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? "border-orange-300 bg-orange-50 dark:bg-orange-950/20"
                        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleService(svc.id)}
                      className="size-4 accent-orange-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{svc.nome}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{svc.duracao}min</p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">
                      R$ {svc.preco.toFixed(2)}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <label className="text-sm font-medium">Observações</label>
            <Textarea
              placeholder="Alguma observação sobre o agendamento..."
              value={observacoes}
              onChange={(e) => {
                if (e.target.value.length <= 200) setObservacoes(e.target.value)
              }}
              className="resize-none"
              rows={2}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-right">
              {observacoes.length}/200
            </p>
          </div>

          <Separator />

          <div className="space-y-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Serviços</span>
              <span className="font-medium">{servicosSelecionados.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Tempo total</span>
              <span className="font-medium">{tempoFormatado}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Valor total</span>
              <span className="font-semibold text-orange-600">
                R$ {valorTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Horário</span>
              <span className="font-medium">
                {selectedSlot?.hora ?? "—"} — {calcularHoraFim()}
              </span>
            </div>
          </div>
        </div>

        <DrawerFooter className="gap-2">
          <Button
            type="button"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={(quickAdd ? !quickAddName.trim() : !selectedClient) || servicosSelecionados.length === 0 || submitting}
            onClick={handleSubmit}
          >
            <Scissors className="size-4 mr-1.5" />
            {submitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Confirmar Agendamento"}
          </Button>
          {isEditing && onStatusChange && (
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/20"
                disabled={submitting}
                onClick={() => handleStatusChange("CANCELADO")}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950/20"
                disabled={submitting}
                onClick={() => handleStatusChange("NOSHOW")}
              >
                Não Compareceu
              </Button>
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
