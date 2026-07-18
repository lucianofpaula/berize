import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AgendaContent } from "./agenda-content"
import type { Barber, Client, Service } from "@/lib/schedule-types"

function inicioSemana(d: Date): Date {
  const dia = d.getDay()
  const diff = d.getDate() - dia + (dia === 0 ? -6 : 1)
  return new Date(d.getFullYear(), d.getMonth(), diff, 0, 0, 0, 0)
}

function inicioMes(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
}

export type BarberStats = Record<string, {
  weekAppointments: number
  weekRevenue: number
  weekCommission: number
  monthAppointments: number
  monthRevenue: number
  monthCommission: number
}>

export default async function AgendaPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: {
      id: true,
      dailyAppointmentGoal: true,
      dailyRevenueGoal: true,
      appointmentInterval: true,
      hours: { orderBy: { dayOfWeek: "asc" } },
    },
  })
  if (!company) redirect("/")

  const [barberMembers, services, clientMembers] = await Promise.all([
    prisma.tenantMember.findMany({
      where: { companyId: company.id, role: "BARBER", barberProfile: { isNot: null } },
      include: {
        user: { select: { id: true, name: true, whatsapp: true, image: true } },
        barberProfile: { select: { photoUrl: true, specialty: true, commissionRate: true } },
      },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.service.findMany({
      where: { companyId: company.id, status: "ACTIVE" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.tenantMember.findMany({
      where: { companyId: company.id, role: "CLIENT" },
      include: {
        user: { select: { id: true, name: true, whatsapp: true, image: true } },
      },
      orderBy: { user: { name: "asc" } },
    }),
  ])

  const hoje = new Date()
  const inicioSemanaDate = inicioSemana(hoje)
  const inicioMesDate = inicioMes(hoje)

  const barberIds = barberMembers.map((m) => m.id)

  const [agendamentosSemana, agendamentosMes] = await Promise.all([
    prisma.agendamento.findMany({
      where: { companyId: company.id, date: { gte: inicioSemanaDate } },
    }),
    prisma.agendamento.findMany({
      where: { companyId: company.id, date: { gte: inicioMesDate } },
    }),
  ])

  const precoMap = new Map(services.map((s) => [s.id, s.price]))

  const barberStats: BarberStats = {}
  for (const m of barberMembers) {
    const weekApps = agendamentosSemana.filter(
      (a) => a.barberId === m.id && a.status !== "CANCELADO"
    )
    const monthApps = agendamentosMes.filter(
      (a) => a.barberId === m.id && a.status !== "CANCELADO"
    )

    const weekRevenue = weekApps.reduce(
      (sum, a) => sum + a.serviceIds.reduce((s, id) => s + (precoMap.get(id) ?? 0), 0),
      0
    )
    const monthRevenue = monthApps.reduce(
      (sum, a) => sum + a.serviceIds.reduce((s, id) => s + (precoMap.get(id) ?? 0), 0),
      0
    )

    const commissionRate = barberMembers.find((bm) => bm.id === m.id)?.barberProfile?.commissionRate ?? 0

    barberStats[m.id] = {
      weekAppointments: weekApps.length,
      weekRevenue,
      weekCommission: weekRevenue * (commissionRate / 100),
      monthAppointments: monthApps.length,
      monthRevenue,
      monthCommission: monthRevenue * (commissionRate / 100),
    }
  }

  const barbers: Barber[] = barberMembers.map((m) => ({
    id: m.id,
    nome: m.user.name ?? "Sem nome",
    cargo: m.barberProfile?.specialty?.[0] ?? "Barbeiro",
    fotoUrl: m.barberProfile?.photoUrl ?? null,
    status: "online" as const,
  }))

  const servicesFormatted: Service[] = services.map((s) => ({
    id: s.id,
    nome: s.name,
    preco: s.price,
    duracao: s.duration,
    categoria: s.category,
  }))

  const clients: Client[] = clientMembers.map((c) => ({
    id: c.id,
    nome: c.user.name ?? "Sem nome",
    whatsapp: c.user.whatsapp ?? "",
    fotoUrl: c.user.image,
  }))

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <AgendaContent
        companyId={company.id}
        barbers={barbers}
        services={servicesFormatted}
        clients={clients}
        barberStats={barberStats}
        dailyAppointmentGoal={company.dailyAppointmentGoal}
        dailyRevenueGoal={company.dailyRevenueGoal}
        appointmentInterval={company.appointmentInterval}
        companyHours={company.hours.map((h) => ({
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isOpen: h.isOpen,
        }))}
      />
    </div>
  )
}
