import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

async function getCompany(sessionUserId: string) {
  const company = await prisma.company.findFirst({
    where: { ownerId: sessionUserId },
    select: { id: true },
  })
  if (!company) throw new Error("Empresa não encontrada.")
  return company
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const { id } = await params

  const member = await prisma.tenantMember.findFirst({
    where: { id, company: { ownerId: session.user.id } },
    include: {
      user: { select: { name: true, email: true, whatsapp: true } },
      barberProfile: { include: { availability: true } },
    },
  })

  if (!member || !member.barberProfile) {
    return NextResponse.json({ error: "Barbeiro não encontrado." }, { status: 404 })
  }

  return NextResponse.json({
    nome: member.user.name ?? "",
    email: member.user.email ?? "",
    whatsapp: member.user.whatsapp ?? "",
    especialidades: member.barberProfile.specialty,
    comissao: member.barberProfile.commissionRate,
    bio: member.barberProfile.bio ?? "",
    foto: member.barberProfile.photoUrl ?? null,
    disponibilidade: member.barberProfile.availability.reduce<Record<number, { start: string; end: string }[]>>(
      (acc, a) => {
        if (!acc[a.dayOfWeek]) acc[a.dayOfWeek] = []
        acc[a.dayOfWeek].push({ start: a.startTime, end: a.endTime })
        return acc
      },
      {},
    ),
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const { id } = await params

  const member = await prisma.tenantMember.findFirst({
    where: { id, company: { ownerId: session.user.id } },
    include: { barberProfile: true },
  })

  if (!member || !member.barberProfile) {
    return NextResponse.json({ error: "Barbeiro não encontrado." }, { status: 404 })
  }

  const profileId = member.barberProfile.id
  const body = await request.json()
  const { nome, email, whatsapp, especialidades, comissao, bio, fotoUrl, disponibilidade } = body

  if (!nome || !email) {
    return NextResponse.json({ error: "Nome e email são obrigatórios." }, { status: 400 })
  }
  if (!especialidades || especialidades.length === 0) {
    return NextResponse.json({ error: "Adicione pelo menos uma especialidade." }, { status: 400 })
  }
  if (!disponibilidade || Object.keys(disponibilidade).length === 0) {
    return NextResponse.json({ error: "Defina a disponibilidade semanal." }, { status: 400 })
  }

  // Atualiza dados do usuário
  await prisma.user.update({
    where: { id: member.userId },
    data: { name: nome, email, ...(whatsapp ? { whatsapp } : {}) },
  })

  // Atualiza BarberProfile
  await prisma.barberProfile.update({
    where: { id: member.barberProfile.id },
    data: {
      specialty: especialidades,
      commissionRate: comissao ?? 40,
      bio: bio ?? null,
      photoUrl: fotoUrl ?? null,
    },
  })

  // Substitui disponibilidade: deleta tudo e recria
  await prisma.barberAvailability.deleteMany({
    where: { barberProfileId: profileId },
  })

  await prisma.barberAvailability.createMany({
    data: Object.entries(disponibilidade).flatMap(([dia, slots]: [string, any]) =>
      slots.map((slot: { start: string; end: string }) => ({
        barberProfileId: profileId,
        dayOfWeek: Number(dia),
        startTime: slot.start,
        endTime: slot.end,
      }))
    ),
  })

  return NextResponse.json({ id: member.id })
}
