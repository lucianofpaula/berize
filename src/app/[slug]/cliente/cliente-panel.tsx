"use client"

import { useState, useEffect, useRef } from "react"
import {
  Home,
  Calendar,
  Star,
  Crown,
  Settings,
  Copy,
  Check,
  LogOut,
  ChevronRight,
  Scissors,
  Award,
  Clock,
  UserPlus,
  Gift,
  Loader2,
  Upload,
  X,
  Sparkles,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type Appointment = {
  id: string
  date: string
  status: string
  service: string
}

type Sponsored = {
  name: string
  createdAt: string
}

type Member = {
  id: string
  name: string
  email: string
  whatsapp: string
  image: string | null
  subscriptionStatus: string
  loyaltyPoints: number
  appointments: Appointment[]
  appointmentsCount: number
  sponsoredCount: number
  sponsored: Sponsored[]
}

type Props = {
  companyName: string
  companyLogo: string | null
  member: Member
}

export default function ClientePanel({ companyName, companyLogo, member }: Props) {
  const isPremium = member.subscriptionStatus === "premium"
  const [showEditModal, setShowEditModal] = useState(false)
  const [tab, setTab] = useState("home")

  return (
    <div className="h-dvh bg-zinc-50 lg:bg-zinc-100 lg:flex lg:items-center lg:justify-center">
      <div className="flex flex-col h-dvh bg-zinc-50 lg:bg-white lg:max-w-md lg:w-full lg:rounded-2xl lg:shadow-xl lg:border lg:border-zinc-200 lg:h-[95dvh] lg:overflow-hidden">
      {showEditModal && (
        <EditProfileModal
          member={member}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Profile header */}
      <div className="bg-gradient-to-b from-[var(--brand-accent)] to-white px-6 pt-8 pb-4 text-center">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto bg-zinc-100">
            {member.image ? (
              <img src={member.image} alt="" className="w-full h-full object-cover" />
            ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--brand-accent-light)] text-[var(--brand-border)] text-3xl font-bold">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--brand-primary)] rounded-full flex items-center justify-center shadow-md hover:bg-[var(--brand-primary-hover)] transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-black" />
          </button>
        </div>

        <h1 className="text-lg font-bold text-zinc-900 mt-3">{member.name}</h1>

        <div
          className={`inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${
            isPremium
              ? "bg-[var(--brand-accent)] border-[var(--brand-premium-border)] text-[var(--brand-primary)]"
              : "bg-white border-zinc-200 text-zinc-500"
          }`}
        >
          {isPremium ? (
            <>
              <Crown className="w-3.5 h-3.5" />
              <span>Membro Premium</span>
            </>
          ) : (
            <>
              <span className="w-3.5 h-3.5 rounded-full bg-zinc-300 flex items-center justify-center text-[8px] text-white font-bold">
                C
              </span>
              <span>Cliente Padrão</span>
            </>
          )}
        </div>
      </div>

      {/* Premium upsell — fixo em qualquer tab */}
      {!isPremium && (
        <div className="mx-4 mb-2 bg-gradient-to-br from-[var(--brand-premium-card-from)] to-[var(--brand-premium-card-to)] rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--brand-primary)]/20 flex items-center justify-center flex-shrink-0">
              <Crown className="w-4.5 h-4.5 text-[var(--brand-primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white">Seja Membro Premium</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Benefícios exclusivos e agendamento prioritário.
              </p>
              <button className="mt-2 px-3 py-1 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-text-on-primary)] text-xs font-bold rounded-lg transition-colors">
                Saiba mais
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
        <TabsList className="px-4">
          <TabsTrigger value="home">
            <Home className="w-4 h-4" />
            Início
          </TabsTrigger>
          <TabsTrigger value="agenda">
            <Calendar className="w-4 h-4" />
            Agenda
          </TabsTrigger>
          <TabsTrigger value="fila">
            <Clock className="w-4 h-4" />
            Fila
          </TabsTrigger>
          {isPremium && (
            <TabsTrigger value="assinaturas">
              <Crown className="w-4 h-4" />
              Assinaturas
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="home">
            <HomeTab member={member} companyName={companyName} />
          </TabsContent>
          <TabsContent value="agenda">
            <AgendaTab appointments={member.appointments} />
          </TabsContent>
          <TabsContent value="fila">
            <FilaTab />
          </TabsContent>
          {isPremium && (
            <TabsContent value="assinaturas">
              <AssinaturasTab member={member} companyName={companyName} />
            </TabsContent>
          )}
        </div>
      </Tabs>

      {/* Logout */}
      <div className="px-4 pb-6 pt-2 text-center">
        <button
          onClick={() => signOut({ callbackUrl: `/${window.location.pathname.split("/")[1]}` })}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sair
        </button>
      </div>
    </div>
    </div>
  )
}

// ─── HOME TAB ───

function HomeTab({ member, companyName }: { member: Member; companyName: string }) {
  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center shadow-sm">
          <Calendar className="w-5 h-5 text-[var(--brand-primary)] mx-auto mb-1" />
          <p className="text-xl font-bold text-zinc-900">{member.appointmentsCount}</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Agendamentos</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center shadow-sm">
          <UserPlus className="w-5 h-5 text-[var(--brand-primary)] mx-auto mb-1" />
          <p className="text-xl font-bold text-zinc-900">{member.sponsoredCount}</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Indicações</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-100 p-4 text-center shadow-sm">
          <Star className="w-5 h-5 text-[var(--brand-primary)] mx-auto mb-1" />
          <p className="text-xl font-bold text-zinc-900">{member.loyaltyPoints}</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Selos</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
          Ações rápidas
        </h3>
        <ActionRow icon={Calendar} label="Novo agendamento" />
        <ActionRow icon={UserPlus} label="Indicar amigo" />
        <ActionRow icon={Gift} label="Ver benefícios" />
      </div>

      {/* Referral Card */}
      <ReferralCard memberId={member.id} />

    </div>
  )
}

function ActionRow({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 bg-white rounded-xl border border-zinc-100 px-4 py-3 shadow-sm hover:border-zinc-200 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-[var(--brand-accent)] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[var(--brand-primary)]" />
      </div>
      <span className="text-sm font-medium text-zinc-700 flex-1 text-left">{label}</span>
      <ChevronRight className="w-4 h-4 text-zinc-300" />
    </button>
  )
}

// ─── REFERRAL CARD ───

function ReferralCard({ memberId }: { memberId: string }) {
  const [copied, setCopied] = useState(false)
  const [refLink, setRefLink] = useState("")

  useEffect(() => {
    setRefLink(`${window.location.origin}/${window.location.pathname.split("/")[1]}/cadastro?ref=${memberId}`)
  }, [memberId])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(refLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const input = document.createElement("input")
      input.value = refLink
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm">
      <label className="text-xs font-medium text-zinc-500 mb-2 block">
        Seu link de indicação
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={refLink}
          className="flex-1 text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-600 truncate focus:outline-none"
        />
        <button
          onClick={copyLink}
          className="px-3 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-text-on-primary)] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 flex-shrink-0"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5" /> Copiado</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copiar</>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── AGENDA TAB ───

function AgendaTab({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <Calendar className="w-12 h-12 text-zinc-300 mb-4" />
        <h3 className="text-base font-semibold text-zinc-700">Nenhum agendamento</h3>
        <p className="text-sm text-zinc-400 mt-1 max-w-xs">
          Você ainda não tem agendamentos nesta barbearia.
        </p>
        <button className="mt-6 px-6 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-text-on-primary)] font-bold rounded-xl text-sm transition-all shadow-sm">
          Agendar agora
        </button>
      </div>
    )
  }

  const STATUS_LABEL: Record<string, string> = {
    AGENDADO: "Agendado",
    CONFIRMADO: "Confirmado",
    EM_ATENDIMENTO: "Em atendimento",
    CONCLUIDO: "Realizado",
    NOSHOW: "Não compareceu",
    CANCELADO: "Cancelado",
  }

  const STATUS_COLOR: Record<string, string> = {
    AGENDADO: "text-[var(--brand-border)] bg-[var(--brand-accent)]",
    CONFIRMADO: "text-emerald-600 bg-emerald-50",
    EM_ATENDIMENTO: "text-blue-600 bg-blue-50",
    CONCLUIDO: "text-zinc-600 bg-zinc-100",
    NOSHOW: "text-red-600 bg-red-50",
    CANCELADO: "text-red-600 bg-red-50",
  }

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="space-y-3">
        {appointments.map((a) => {
          const date = new Date(a.date)
          const day = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
          const color = STATUS_COLOR[a.status] ?? "text-zinc-600 bg-zinc-100"
          const label = STATUS_LABEL[a.status] ?? a.status
          return (
            <div key={a.id} className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-700">{a.service}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}`}>
                  {label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {day}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <button className="w-full mt-4 py-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-text-on-primary)] font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm">
        <Calendar className="w-4 h-4" />
        Novo agendamento
      </button>
    </div>
  )
}

// ─── FILA TAB ───

type MockAppt = { time: string; service: string; duration: number; barber: string; client: string; isPremium: boolean }

const MOCK_SERVICES: { name: string; duration: number }[] = [
  { name: "Corte de cabelo", duration: 30 },
  { name: "Barba", duration: 45 },
  { name: "Corte + Barba", duration: 60 },
  { name: "Corte infantil", duration: 30 },
  { name: "Hidratação", duration: 45 },
  { name: "Pezinho", duration: 15 },
  { name: "Sobrancelha", duration: 15 },
  { name: "Barba Completa", duration: 60 },
]

const MOCK_BARBERS = ["Carlos", "Pedro", "Ana", "Lucas"]

const MOCK_CLIENTS = [
  { name: "João", premium: false }, { name: "Maria", premium: true }, { name: "Lucas", premium: false },
  { name: "Miguel", premium: false }, { name: "Julia", premium: true }, { name: "Rafael", premium: false },
  { name: "Ana", premium: false }, { name: "Pedro", premium: true }, { name: "Camila", premium: false },
  { name: "Bruno", premium: false }, { name: "Felipe", premium: true }, { name: "Thiago", premium: false },
]

function generateMockAppointments(): MockAppt[] {
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`
  const startHour = 8
  const endHour = 18
  const appts: MockAppt[] = []
  let timeIdx = 0
  const usedBarbers = new Set<string>()

  while (appts.length < 6) {
    const hour = startHour + Math.floor(timeIdx * 0.5)
    const minute = timeIdx % 2 === 0 ? "00" : "30"
    if (hour >= endHour) break
    const time = `${String(hour).padStart(2,"0")}:${minute}`
    const svc = MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)]
    let barber = MOCK_BARBERS[Math.floor(Math.random() * MOCK_BARBERS.length)]
    let attempts = 0
    while (usedBarbers.has(`${barber}-${time}`) && attempts < 10) {
      barber = MOCK_BARBERS[Math.floor(Math.random() * MOCK_BARBERS.length)]
      attempts++
    }
    usedBarbers.add(`${barber}-${time}`)
    const c = MOCK_CLIENTS[Math.floor(Math.random() * MOCK_CLIENTS.length)]
    appts.push({ time, service: svc.name, duration: svc.duration, barber, client: c.name, isPremium: c.premium })
    timeIdx++
  }
  return appts
}

function calculateOccupation(appts: MockAppt[], openHour = 8, closeHour = 18) {
  const slots: { time: string; occupied: boolean; appt?: MockAppt; endTime?: string }[] = []

  for (let h = openHour; h < closeHour; h++) {
    for (const m of ["00", "30"]) {
      const time = `${String(h).padStart(2,"0")}:${m}`
      let occupied = false
      let occupant: MockAppt | undefined
      let endTime: string | undefined

      for (const a of appts) {
        const [ah, am] = a.time.split(":").map(Number)
        const startMin = ah * 60 + am
        const endMin = startMin + a.duration
        const slotMin = h * 60 + parseInt(m)
        if (slotMin >= startMin && slotMin < endMin) {
          occupied = true
          occupant = a
          const endH = Math.floor(endMin / 60)
          const endM = endMin % 60
          endTime = `${String(endH).padStart(2,"0")}:${String(endM).padStart(2,"0")}`
          break
        }
      }
      slots.push({ time, occupied, appt: occupant, endTime })
    }
  }
  return slots
}

function getCurrentTimeSlot() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`
}

function isPast(time: string) {
  const now = new Date()
  const [h, m] = time.split(":").map(Number)
  return h < now.getHours() || (h === now.getHours() && m < now.getMinutes())
}

function FilaTab() {
  const [appts] = useState(generateMockAppointments)
  const slots = calculateOccupation(appts)
  const now = getCurrentTimeSlot()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [])

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Fila de atendimento</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Agora</p>
          <p className="text-sm font-bold text-zinc-800">{now}</p>
        </div>
      </div>

      {/* Barbers legend */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {MOCK_BARBERS.map((b) => (
          <span key={b} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {b}
          </span>
        ))}
      </div>

      {/* Timeline com scroll personalizado */}
      <div
        ref={scrollRef}
        className="space-y-1 max-h-[420px] overflow-y-auto scroll-smooth pr-1
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-[var(--brand-border)]/20
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:hover:bg-[var(--brand-border)]/40
          [&::-webkit-scrollbar-thumb]:transition-colors"
        >
        {slots.map((slot) => {
          const past = isPast(slot.time) && !slot.occupied
          const now_ish = slot.time === now.slice(0, 5) || (
            // Highlight current half-hour
            Math.abs(
              parseInt(slot.time.split(":")[0]) * 60 + parseInt(slot.time.split(":")[1]) -
              parseInt(now.split(":")[0]) * 60 + parseInt(now.split(":")[1])
            ) < 30
          )

          // Skip rendering occupied slots that are part of a multi-slot appointment (render only once per appt)
          const isFirstSlot = slot.occupied &&
            slot.appt &&
            slot.time === slot.appt.time

          if (slot.occupied && !isFirstSlot) return null

          return (
            <div key={slot.time}>
              {isFirstSlot ? (
                slot.appt!.isPremium ? (
                  /* Premium occupied block — dark + brand accent */
                  <div className="bg-gradient-to-br from-[var(--brand-premium-card-from)] to-[var(--brand-premium-card-to)] border-2 border-[var(--brand-premium-border)] rounded-xl p-3 shadow-lg shadow-[var(--brand-premium-border)]/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[var(--brand-premium-border)]">
                        {slot.time} — {slot.endTime}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[var(--brand-premium-border)] text-[var(--brand-text-on-primary)] px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Crown className="w-3 h-3" /> Premium
                        </span>
                        <span className="text-[10px] font-semibold text-[var(--brand-premium-border)] bg-[var(--brand-premium-border)]/10 px-1.5 py-0.5 rounded">
                          {slot.appt!.duration}min
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded-full bg-[var(--brand-premium-border)] flex items-center justify-center text-[10px] font-bold text-[var(--brand-text-on-primary)] ring-2 ring-[var(--brand-premium-border)]/50">
                        {slot.appt!.client.charAt(0)}
                      </div>
                      <span className="font-semibold text-[var(--brand-premium-border)] brightness-150">{slot.appt!.client}</span>
                      <Crown className="w-3 h-3 text-[var(--brand-premium-border)]" />
                      <span className="text-zinc-500">|</span>
                      <Scissors className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-400">{slot.appt!.service}</span>
                      <span className="text-zinc-500">|</span>
                      <span className="text-zinc-500">{slot.appt!.barber}</span>
                    </div>
                  </div>
                ) : (
                  /* Regular occupied block */
                  <div className="bg-[var(--brand-accent)] border border-[var(--brand-border)] rounded-xl p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[var(--brand-primary)]">
                        {slot.time} — {slot.endTime}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--brand-border)] bg-[var(--brand-accent-light)] px-1.5 py-0.5 rounded">
                        {slot.appt!.duration}min
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-5 h-5 rounded-full bg-[var(--brand-border)] flex items-center justify-center text-[9px] font-bold text-white">
                        {slot.appt!.client.charAt(0)}
                      </div>
                      <span className="font-medium text-zinc-700">{slot.appt!.client}</span>
                      <span className="text-zinc-300">|</span>
                      <Scissors className="w-3 h-3 text-zinc-400" />
                      <span className="text-zinc-500">{slot.appt!.service}</span>
                      <span className="text-zinc-300">|</span>
                      <span className="text-zinc-400">{slot.appt!.barber}</span>
                    </div>
                  </div>
                )
              ) : (
                /* Available slot */
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border border-dashed transition-colors ${
                    now_ish
                      ? "border-[var(--brand-border)] bg-[var(--brand-accent)]/50"
                      : past
                        ? "border-zinc-100 bg-zinc-50 opacity-40"
                        : "border-zinc-200 hover:border-[var(--brand-border)] hover:bg-[var(--brand-accent)]/30"
                  }`}
                >
                  <span className={`text-xs font-mono w-10 ${
                    now_ish ? "text-[var(--brand-border)] font-bold" : past ? "text-zinc-300" : "text-zinc-500"
                  }`}>
                    {slot.time}
                  </span>
                  <span className={`flex-1 text-[11px] ${
                    now_ish
                      ? "text-[var(--brand-border)] font-medium"
                      : past
                        ? "text-zinc-300"
                        : "text-zinc-400"
                  }`}>
                    {past ? "—" : now_ish ? "● Agora" : "Livre"}
                  </span>
                  {now_ish && (
                    <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ASSINATURAS TAB ───

function AssinaturasTab({ member, companyName }: { member: Member; companyName: string }) {
  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      {/* Current plan card */}
      <div className="bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-border)] rounded-2xl p-6 shadow-lg text-[var(--brand-text-on-primary)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
              Plano atual
            </p>
            <p className="text-xl font-bold mt-0.5">Premium</p>
          </div>
          <Crown className="w-8 h-8 opacity-40" />
        </div>

        <div className="space-y-2">
          <BenefitRow icon={Calendar} text="Agendamento prioritário" />
          <BenefitRow icon={Star} text="Selos em dobro no cartão fidelidade" />
          <BenefitRow icon={Gift} text="Brinde exclusivo a cada 5 agendamentos" />
          <BenefitRow icon={Sparkles} text="Descontos especiais em serviços" />
        </div>
      </div>

      {/* Fidelity card */}
      <FidelityCard points={member.loyaltyPoints} />

      {/* Sponsored list */}
      {member.sponsored.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-1">
            Quem você indicou
          </h3>
          <div className="space-y-2">
            {member.sponsored.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-zinc-100 px-4 py-3 flex items-center gap-3 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-500">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-700">{s.name}</p>
                  <p className="text-[10px] text-zinc-400">
                    {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Award className="w-4 h-4 text-[var(--brand-primary)]" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BenefitRow({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="w-4 h-4 opacity-70" />
      <span className="opacity-90">{text}</span>
    </div>
  )
}

// ─── FIDELITY CARD ───

function FidelityCard({ points }: { points: number }) {
  const totalStamps = 10
  const progress = Math.min(points, totalStamps)
  const percent = (progress / totalStamps) * 100

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Cartão Fidelidade</p>
          <p className="text-xs text-zinc-300 mt-0.5">
            {points} de {totalStamps} selos
          </p>
        </div>
        <Star className="w-5 h-5 text-[var(--brand-primary)]" fill="var(--brand-primary)" />
      </div>

      <div className="grid grid-cols-5 gap-2 mb-3">
        {Array.from({ length: totalStamps }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all ${
              i < progress
                ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-[var(--brand-text-on-primary)]"
                : "bg-zinc-800 border-zinc-600 text-zinc-600"
            }`}
          >
            {i < progress ? "★" : i + 1}
          </div>
        ))}
      </div>

      <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--brand-primary)] rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

// ─── EDIT PROFILE MODAL ───

function EditProfileModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const [name, setName] = useState(member.name)
  const [whatsapp, setWhatsapp] = useState(member.whatsapp)
  const [image, setImage] = useState(member.image)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleUploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "berize/avatars")
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) setImage(data.url)
    } catch {
      setError("Erro ao enviar foto.")
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, whatsapp, image }),
      })
      if (!res.ok) {
        setError("Erro ao salvar. Tente novamente.")
        return
      }
      onClose()
      window.location.reload()
    } catch {
      setError("Erro ao salvar. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90dvh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-zinc-100">
          <h3 className="text-base font-bold text-zinc-900">Editar perfil</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-200">
                {image ? (
                  <img src={image} alt="" className="w-full h-full object-cover" />
                ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--brand-accent-light)] text-[var(--brand-border)] text-3xl font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--brand-primary)] rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-[var(--brand-primary-hover)] transition-colors">
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 text-black animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-black" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadPhoto}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">WhatsApp</label>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Email</label>
            <input
              value={member.email}
              readOnly
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-400 bg-zinc-50 cursor-not-allowed"
            />
            <p className="text-[10px] text-zinc-400 mt-1">O email não pode ser alterado.</p>
          </div>
        </div>

        <div className="px-5 pb-5 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-[var(--brand-text-on-primary)] font-bold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
