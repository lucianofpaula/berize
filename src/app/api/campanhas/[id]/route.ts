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

  const campaign = await prisma.campaign.findFirst({
    where: { id, company: { ownerId: session.user.id } },
  })

  if (!campaign) {
    return NextResponse.json({ error: "Campanha não encontrada." }, { status: 404 })
  }

  return NextResponse.json({ campaign })
}

export async function PATCH(
  request: Request,
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

  const body = await request.json()
  const setValue = <T>(key: string, transform?: (v: unknown) => T): Record<string, unknown> =>
    body[key] !== undefined ? { [key]: transform ? transform(body[key]) : body[key] } : {}

  const data: Record<string, unknown> = {
    ...setValue("title"),
    ...setValue("subtitle", (v) => v || null),
    ...setValue("description", (v) => v || null),
    ...setValue("highlightTitle", (v) => v || null),
    ...setValue("badge", (v) => v || null),
    ...setValue("badgeColor"),
    ...setValue("badgeTextColor"),
    ...setValue("buttonText"),
    ...setValue("buttonUrl", (v) => v || null),
    ...setValue("titleColor"),
    ...setValue("subtitleColor"),
    ...setValue("descriptionColor"),
    ...setValue("highlightColor"),
    ...setValue("titleSize"),
    ...setValue("buttonColor"),
    ...setValue("buttonTextColor"),
    ...setValue("textAlign"),
    ...setValue("cardStyle"),
    ...setValue("cardBackground", (v) => v || null),
    ...setValue("gradientStart", (v) => v || null),
    ...setValue("gradientEnd", (v) => v || null),
    ...setValue("gradientDirection"),
    ...setValue("borderEnabled"),
    ...setValue("borderColor", (v) => v || null),
    ...setValue("borderWidth"),
    ...setValue("animation"),
    ...setValue("redemptionType"),
    ...setValue("requiresCoupon"),
    ...setValue("couponPrefix", (v) => v || null),
    ...setValue("isActive"),
    ...setValue("sortOrder"),
    ...setValue("startDate", (v) => new Date(v as string)),
    ...setValue("endDate", (v) => new Date(v as string)),
  }

  const updated = await prisma.campaign.update({ where: { id }, data })
  return NextResponse.json({ campaign: updated })
}

export async function DELETE(
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

  await prisma.campaign.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
