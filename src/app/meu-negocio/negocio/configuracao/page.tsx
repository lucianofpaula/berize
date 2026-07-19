import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ConfigPageClient } from "./config-page-client"

export default async function ConfiguracaoPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    include: { hours: { orderBy: { dayOfWeek: "asc" } } },
  })

  if (!company) {
    return (
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        <p className="text-sm text-zinc-500">Nenhuma empresa encontrada.</p>
      </div>
    )
  }

  const initialData = {
    id: company.id,
    name: company.name,
    slug: company.slug,
    logo: company.logo,
    description: company.description,
    phone: company.phone,
    whatsapp: company.whatsapp,
    email: company.email,
    address: company.address as { street: string; number: string; complement: string; neighborhood: string; city: string; state: string; zipCode: string } | null,
    socialMedia: company.socialMedia as { instagram: string; facebook: string; tiktok: string; youtube: string } | null,
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
    brandPalette: company.brandPalette,
    hours: company.hours.map((h) => ({
      id: h.id,
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime,
      closeTime: h.closeTime,
      isOpen: h.isOpen,
    })),
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Configuração
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          Gerencie as configurações do seu negócio.
        </p>
      </div>
      <ConfigPageClient initialData={initialData} />
    </div>
  )
}
