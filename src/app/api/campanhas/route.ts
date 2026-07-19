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

  const campaigns = await prisma.campaign.findMany({
    where: { companyId: company.id },
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json({ campaigns })
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
  const {
    title, subtitle, description, highlightTitle, badge,
    buttonText, buttonUrl,
    titleColor, subtitleColor, descriptionColor, highlightColor,
    titleSize, buttonColor, buttonTextColor, textAlign,
    badgeColor, badgeTextColor,
    cardStyle, cardBackground, gradientStart, gradientEnd, gradientDirection,
    borderEnabled, borderColor, borderWidth,
    animation,
    redemptionType, requiresCoupon, couponPrefix,
    startDate, endDate, isActive,
  } = body

  if (!title || !startDate || !endDate) {
    return NextResponse.json({ error: "Título, data de início e data de fim são obrigatórios." }, { status: 400 })
  }

  const count = await prisma.campaign.count({ where: { companyId: company.id } })

  const campaign = await prisma.campaign.create({
    data: {
      companyId: company.id,
      title,
      subtitle: subtitle || null,
      description: description || null,
      highlightTitle: highlightTitle || null,
      badge: badge || null,
      badgeColor: badgeColor || "#F97316",
      badgeTextColor: badgeTextColor || "#FFFFFF",
      buttonText: buttonText || "Saiba Mais",
      buttonUrl: buttonUrl || null,
      titleColor: titleColor || "#FFFFFF",
      subtitleColor: subtitleColor || "#FFFFFF",
      descriptionColor: descriptionColor || "#FFFFFF",
      highlightColor: highlightColor || "#FFFFFF",
      titleSize: titleSize || "text-3xl",
      buttonColor: buttonColor || "#F97316",
      buttonTextColor: buttonTextColor || "#FFFFFF",
      textAlign: textAlign || "left",
      cardStyle: cardStyle || "premium",
      cardBackground: cardBackground || null,
      gradientStart: gradientStart || null,
      gradientEnd: gradientEnd || null,
      gradientDirection: gradientDirection || "to-br",
      borderEnabled: borderEnabled ?? true,
      borderColor: borderColor || null,
      borderWidth: borderWidth || "border",
      animation: animation || "none",
      redemptionType: redemptionType || "unique",
      requiresCoupon: requiresCoupon ?? false,
      couponPrefix: couponPrefix || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: isActive ?? true,
      sortOrder: count,
    },
  })

  return NextResponse.json({ campaign })
}
