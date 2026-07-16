import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
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

  const coupons = await prisma.coupon.findMany({
    where: { campaign: { companyId: company.id } },
    include: {
      campaign: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ coupons })
}

export async function PATCH(request: Request) {
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
  const { couponId, status } = body

  if (!couponId || !status) {
    return NextResponse.json({ error: "couponId e status são obrigatórios." }, { status: 400 })
  }

  const validStatuses = ["ACTIVE", "USED", "EXPIRED", "CANCELLED"]
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 })
  }

  const coupon = await prisma.coupon.findFirst({
    where: { id: couponId, campaign: { companyId: company.id } },
  })

  if (!coupon) {
    return NextResponse.json({ error: "Cupom não encontrado." }, { status: 404 })
  }

  const updated = await prisma.coupon.update({
    where: { id: couponId },
    data: {
      status,
      usedAt: status === "USED" ? new Date() : status === "ACTIVE" ? null : undefined,
    },
  })

  return NextResponse.json({ coupon: updated })
}
