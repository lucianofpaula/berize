import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CampaignForm } from "@/app/campanhas/campanha-form"
import { ChevronLeftIcon } from "lucide-react"
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

  const initialData = {
    id: campaign.id,
    title: campaign.title,
    subtitle: campaign.subtitle ?? "",
    description: campaign.description ?? "",
    highlightTitle: campaign.highlightTitle ?? "",
    badge: campaign.badge ?? "",
    buttonText: campaign.buttonText,
    buttonUrl: campaign.buttonUrl ?? "",
    titleColor: campaign.titleColor,
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
      <CampaignForm initialData={initialData} />
    </div>
  )
}
