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

  const plan = await prisma.plan.findFirst({
    where: { id, company: { ownerId: session.user.id } },
  })

  if (!plan) {
    return NextResponse.json({ error: "Plano não encontrado." }, { status: 404 })
  }

  return NextResponse.json({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    badge: plan.badge,
    includedServiceIds: plan.includedServiceIds as string[],
    commissionTiers: plan.commissionTiers as { level: number; percentage: number }[],
    status: plan.status as "ACTIVE" | "INACTIVE",
    sortOrder: plan.sortOrder,
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

  const plan = await prisma.plan.findFirst({
    where: { id, company: { ownerId: session.user.id } },
    include: { company: { select: { id: true } } },
  })

  if (!plan) {
    return NextResponse.json({ error: "Plano não encontrado." }, { status: 404 })
  }

  const body = await request.json()
  const { name, description, price, badge, includedServiceIds, commissionTiers, status, sortOrder } = body

  if (!name || !price) {
    return NextResponse.json({ error: "Nome e preço são obrigatórios." }, { status: 400 })
  }

  const updated = await prisma.plan.update({
    where: { id },
    data: {
      name,
      description: description ?? null,
      price,
      badge: badge ?? null,
      includedServiceIds: includedServiceIds ?? [],
      commissionTiers: commissionTiers ?? [],
      status: status ?? "ACTIVE",
      sortOrder: sortOrder ?? 0,
    },
  })

  return NextResponse.json({ id: updated.id })
}
