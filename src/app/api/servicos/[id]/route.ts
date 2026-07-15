import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const { id } = await params

  const service = await prisma.service.findFirst({
    where: { id, company: { ownerId: session.user.id } },
  })

  if (!service) {
    return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 })
  }

  return NextResponse.json({
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
    category: service.category,
    commissionTiers: service.commissionTiers as { level: number; percentage: number }[],
    status: service.status as "ACTIVE" | "INACTIVE",
    sortOrder: service.sortOrder,
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

  const service = await prisma.service.findFirst({
    where: { id, company: { ownerId: session.user.id } },
    include: { company: { select: { id: true } } },
  })

  if (!service) {
    return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 })
  }

  const body = await request.json()
  const { name, description, price, duration, category, commissionTiers, status, sortOrder } = body

  if (!name || !price || !duration) {
    return NextResponse.json({ error: "Nome, preço e duração são obrigatórios." }, { status: 400 })
  }

  const updated = await prisma.service.update({
    where: { id },
    data: {
      name,
      description: description ?? null,
      price,
      duration,
      category: category ?? null,
      commissionTiers: commissionTiers ?? [],
      status: status ?? "ACTIVE",
      sortOrder: sortOrder ?? 0,
    },
  })

  return NextResponse.json({ id: updated.id })
}
