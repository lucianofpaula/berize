export type BarberStatus = "online" | "em-atendimento" | "folga" | "ausente" | "bloqueado"

export interface Barber {
  id: string
  nome: string
  cargo: string
  fotoUrl: string | null
  status: BarberStatus
}

export interface Client {
  id: string
  nome: string
  whatsapp: string
  fotoUrl?: string | null
}

export interface Service {
  id: string
  nome: string
  preco: number
  duracao: number
  categoria?: string | null
}

export type SlotStatus = "disponivel" | "agendado" | "bloqueado" | "intervalo"

export interface Appointment {
  id: string
  cliente: Client
  servicos: Service[]
  observacoes?: string | null
  status: string
}

export interface ScheduleSlot {
  hora: string
  status: SlotStatus
  agendamento?: Appointment
}

export type AgendaData = Record<string, ScheduleSlot[]>

export function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}
