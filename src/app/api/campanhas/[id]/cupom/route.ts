import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { findOrCreateTenantClient } from "@/lib/tenant-client"

function gerarCodigo(prefixo?: string): string {
  const prefix = prefixo ? prefixo.toUpperCase().replace(/[^A-Z0-9]/g, "") : "CUPOM"
  const sufixo = crypto.randomBytes(3).toString("hex").toUpperCase()
  return `${prefix}-${sufixo}`
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { clientName, clientPhone } = body

  const campaign = await prisma.campaign.findFirst({
    where: { id, company: { ownerId: session.user.id } },
  })

  if (!campaign) {
    return NextResponse.json({ error: "Campanha não encontrada." }, { status: 404 })
  }

  if (campaign.redemptionType === "unique") {
    const existing = await prisma.coupon.findFirst({
      where: {
        campaignId: id,
        clientPhone: clientPhone || null,
        status: { in: ["ACTIVE", "USED"] },
      },
    })
    if (existing && clientPhone) {
      return NextResponse.json(
        { error: "Este cliente já retirou um cupom para esta campanha.", coupon: existing },
        { status: 409 },
      )
    }
  }

  let code = gerarCodigo(campaign.couponPrefix || undefined)
  let tentativas = 0
  while (await prisma.coupon.findUnique({ where: { code } })) {
    code = gerarCodigo(campaign.couponPrefix || undefined)
    tentativas++
    if (tentativas > 10) {
      return NextResponse.json({ error: "Erro ao gerar código único." }, { status: 500 })
    }
  }

  const coupon = await prisma.coupon.create({
    data: {
      campaignId: id,
      code,
      clientName: clientName || null,
      clientPhone: clientPhone || null,
      status: "ACTIVE",
    },
  })

  if (clientName || clientPhone) {
    const company = await prisma.company.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true },
    })
    if (company) {
      const { member } = await findOrCreateTenantClient({
        companyId: company.id,
        name: clientName,
        phone: clientPhone,
      })
      if (!member.campaignSourceId) {
        await prisma.tenantMember.update({
          where: { id: member.id },
          data: { campaignSourceId: id },
        })
      }
    }
  }

  return NextResponse.json({ coupon })
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

  const campaign = await prisma.campaign.findFirst({
    where: { id, company: { ownerId: session.user.id } },
  })

  if (!campaign) {
    return NextResponse.json({ error: "Campanha não encontrada." }, { status: 404 })
  }

  const coupons = await prisma.coupon.findMany({
    where: { campaignId: id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ coupons })
}
