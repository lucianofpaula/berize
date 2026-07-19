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
    include: { hours: { orderBy: { dayOfWeek: "asc" } } },
  })

  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  return NextResponse.json({
    id: company.id,
    name: company.name,
    slug: company.slug,
    logo: company.logo,
    description: company.description,
    phone: company.phone,
    whatsapp: company.whatsapp,
    email: company.email,
    address: company.address as Record<string, string> | null,
    socialMedia: company.socialMedia as Record<string, string> | null,
    customDomain: company.customDomain,
    domainVerified: company.domainVerified,
    timezone: company.timezone,
    appointmentLeadTime: company.appointmentLeadTime,
    appointmentInterval: company.appointmentInterval,
    dailyAppointmentGoal: company.dailyAppointmentGoal ?? 0,
    dailyRevenueGoal: company.dailyRevenueGoal ?? 0,
    loyaltyEnabled: company.loyaltyEnabled,
    loyaltyStampsRequired: company.loyaltyStampsRequired,
    loyaltyRewardDescription: company.loyaltyRewardDescription,
    hours: company.hours.map((h) => ({
      id: h.id,
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isOpen: h.isOpen,
    })),
  })
}

export async function PUT(request: Request) {
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
    name,
    logo,
    description,
    phone,
    whatsapp,
    email,
    address,
    socialMedia,
    customDomain,
    timezone,
    appointmentLeadTime,
    appointmentInterval,
    dailyAppointmentGoal,
    dailyRevenueGoal,
    loyaltyEnabled,
    loyaltyStampsRequired,
    loyaltyRewardDescription,
    brandPalette,
    hours,
  } = body

  const updateData: Record<string, unknown> = {}

  if (name !== undefined) updateData.name = name
  if (logo !== undefined) updateData.logo = logo
  if (description !== undefined) updateData.description = description
  if (phone !== undefined) updateData.phone = phone
  if (whatsapp !== undefined) updateData.whatsapp = whatsapp
  if (email !== undefined) updateData.email = email
  if (address !== undefined) updateData.address = address
  if (socialMedia !== undefined) updateData.socialMedia = socialMedia
  if (customDomain !== undefined) updateData.customDomain = customDomain || null
  if (timezone !== undefined) updateData.timezone = timezone
  if (appointmentLeadTime !== undefined) updateData.appointmentLeadTime = appointmentLeadTime
  if (appointmentInterval !== undefined) updateData.appointmentInterval = appointmentInterval
  if (dailyAppointmentGoal !== undefined) updateData.dailyAppointmentGoal = dailyAppointmentGoal
  if (dailyRevenueGoal !== undefined) updateData.dailyRevenueGoal = dailyRevenueGoal
  if (loyaltyEnabled !== undefined) updateData.loyaltyEnabled = loyaltyEnabled
  if (loyaltyStampsRequired !== undefined) updateData.loyaltyStampsRequired = loyaltyStampsRequired
  if (loyaltyRewardDescription !== undefined) updateData.loyaltyRewardDescription = loyaltyRewardDescription
  if (brandPalette !== undefined) updateData.brandPalette = brandPalette

  if (Object.keys(updateData).length > 0) {
    await prisma.company.update({
      where: { id: company.id },
      data: updateData,
    })
  }

  if (hours !== undefined && Array.isArray(hours)) {
    await prisma.companyHours.deleteMany({ where: { companyId: company.id } })

    if (hours.length > 0) {
      await prisma.companyHours.createMany({
        data: hours.map((h: { dayOfWeek: number; openTime: string; closeTime: string; isOpen?: boolean }) => ({
          companyId: company.id,
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isOpen: h.isOpen ?? true,
        })),
      })
    }
  }

  return NextResponse.json({ success: true })
}
