import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params

  const existente = await prisma.agendamento.findFirst({
    where: { id, companyId: company.id },
  })
  if (!existente) {
    return NextResponse.json({ error: "Agendamento não encontrado." }, { status: 404 })
  }

  const body = await request.json()

  if (body.status) {
    const atualizado = await prisma.agendamento.update({
      where: { id },
      data: { status: body.status },
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
    return NextResponse.json(atualizado)
  }

  const { serviceIds, notes, date, startTime } = body

  if (!serviceIds?.length || !date || !startTime) {
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

  const conflito = await prisma.agendamento.findFirst({
    where: {
      id: { not: id },
      companyId: company.id,
      barberId: existente.barberId,
      date: new Date(date + "T12:00:00.000Z"),
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  })
  if (conflito) {
    return NextResponse.json({ error: "Horário conflitante com outro agendamento." }, { status: 409 })
  }

  const atualizado = await prisma.agendamento.update({
    where: { id },
    data: {
      serviceIds,
      date: new Date(date + "T12:00:00.000Z"),
      startTime,
      endTime,
      notes: notes || null,
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

  return NextResponse.json(atualizado)
}
