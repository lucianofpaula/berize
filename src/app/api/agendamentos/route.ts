import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })
  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const data = searchParams.get("data")

  const where: Record<string, unknown> = { companyId: company.id }
  if (data) {
    const start = new Date(data + "T00:00:00.000Z")
    const end = new Date(data + "T23:59:59.999Z")
    where.date = { gte: start, lte: end }
  }

  const agendamentos = await prisma.agendamento.findMany({
    where,
    include: {
      barber: {
        include: {
          user: { select: { id: true, name: true, whatsapp: true, image: true } },
          barberProfile: { select: { photoUrl: true, specialty: true } },
        },
      },
      client: {
        include: {
          user: { select: { id: true, name: true, whatsapp: true, image: true } },
        },
      },
    },
    orderBy: { startTime: "asc" },
  })

  return NextResponse.json(agendamentos)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })
  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  const body = await request.json()
  let { barberId, clientId, serviceIds, notes, date, startTime, quickAddName } = body

  // Cadastro rápido: cria cliente na hora se só tiver o nome
  if (!clientId && quickAddName) {
    const quickName = (quickAddName as string).trim()
    if (!quickName) {
      return NextResponse.json({ error: "Nome do cliente é obrigatório." }, { status: 400 })
    }
    const user = await prisma.user.create({ data: { name: quickName } })
    const member = await prisma.tenantMember.create({
      data: { userId: user.id, companyId: company.id, role: "CLIENT" },
    })
    clientId = member.id
  }

  if (!barberId || !clientId || !serviceIds?.length || !date || !startTime) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 })
  }

  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds }, companyId: company.id },
  })

  const tempoTotal = services.reduce((acc, s) => acc + s.duration, 0)
  const [h, m] = startTime.split(":").map(Number)
  const totalMinutos = h * 60 + m + tempoTotal
  const hFim = Math.floor(totalMinutos / 60)
  const mFim = totalMinutos % 60
  const endTime = `${String(hFim).padStart(2, "0")}:${String(mFim).padStart(2, "0")}`

  const agendamento = await prisma.agendamento.create({
    data: {
      companyId: company.id,
      barberId,
      clientId,
      serviceIds,
      date: new Date(date + "T12:00:00.000Z"),
      startTime,
      endTime,
      notes: notes || null,
      status: "AGENDADO",
    },
    include: {
      barber: {
        include: {
          user: { select: { id: true, name: true, whatsapp: true, image: true } },
          barberProfile: { select: { photoUrl: true, specialty: true } },
        },
      },
      client: {
        include: {
          user: { select: { id: true, name: true, whatsapp: true, image: true } },
        },
      },
    },
  })

  return NextResponse.json(agendamento, { status: 201 })
}
