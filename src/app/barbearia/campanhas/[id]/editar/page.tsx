import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CampaignForm } from "@/app/campanhas/campanha-form"
import { ChevronLeftIcon, TicketIcon, UsersIcon, TrendingUpIcon } from "lucide-react"
import Link from "next/link"

export default async function EditarCampanhaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const { id } = await params

  const campaign = await prisma.campaign.findFirst({
    where: { id, company: { ownerId: session.user.id } },
  })

  if (!campaign) {
    redirect("/campanhas")
  }

  const [totalCoupons, usedCoupons, acquiredCustomers] = await Promise.all([
    prisma.coupon.count({ where: { campaignId: id } }),
    prisma.coupon.count({ where: { campaignId: id, status: "USED" } }),
    prisma.tenantMember.count({ where: { companyId: campaign.companyId, campaignSourceId: id } }),
  ])

  const initialData = {
    id: campaign.id,
    title: campaign.title,
    subtitle: campaign.subtitle ?? "",
    description: campaign.description ?? "",
    highlightTitle: campaign.highlightTitle ?? "",
    badge: campaign.badge ?? "",
    badgeColor: campaign.badgeColor,
    badgeTextColor: campaign.badgeTextColor,
    buttonText: campaign.buttonText,
    buttonUrl: campaign.buttonUrl ?? "",
    titleColor: campaign.titleColor,
    subtitleColor: campaign.subtitleColor,
    descriptionColor: campaign.descriptionColor,
    highlightColor: campaign.highlightColor,
    titleSize: campaign.titleSize,
    buttonColor: campaign.buttonColor,
    buttonTextColor: campaign.buttonTextColor,
    cardStyle: campaign.cardStyle,
    textAlign: campaign.textAlign,
    cardBackground: campaign.cardBackground ?? "",
    gradientStart: campaign.gradientStart ?? "",
    gradientEnd: campaign.gradientEnd ?? "",
    gradientDirection: campaign.gradientDirection,
    borderEnabled: campaign.borderEnabled,
    borderColor: campaign.borderColor ?? "",
    borderWidth: campaign.borderWidth,
    animation: campaign.animation,
    redemptionType: campaign.redemptionType,
    requiresCoupon: campaign.requiresCoupon,
    couponPrefix: campaign.couponPrefix ?? "",
    startDate: campaign.startDate.toISOString().split("T")[0],
    endDate: campaign.endDate.toISOString().split("T")[0],
    isActive: campaign.isActive,
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <Link
          href="/campanhas"
          className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-2 transition-colors"
        >
          <ChevronLeftIcon className="size-3" />
          Voltar para campanhas
        </Link>
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Editar Campanha
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          {campaign.title}
        </p>
      </div>
      {/* Analytics */}
      <div className="px-1 sm:px-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <TicketIcon className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{totalCoupons}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Cupons emitidos</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <TrendingUpIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{usedCoupons}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Cupons utilizados</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30">
              <UsersIcon className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{acquiredCustomers}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Clientes adquiridos</p>
            </div>
          </div>
        </div>
      </div>
      <CampaignForm initialData={initialData} />
    </div>
  )
}
