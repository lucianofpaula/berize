import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CampanhasLista } from "@/app/campanhas/campanhas-lista"
import { MegaphoneIcon } from "lucide-react"

export default async function CampanhasPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  if (!company) {
    return (
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        <p className="text-sm text-zinc-500">Nenhuma empresa encontrada.</p>
      </div>
    )
  }

  const campaigns = await prisma.campaign.findMany({
    where: { companyId: company.id },
    orderBy: { sortOrder: "asc" },
  })

  const data = campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    highlightTitle: c.highlightTitle,
    badge: c.badge,
    buttonText: c.buttonText,
    titleColor: c.titleColor,
    titleSize: c.titleSize,
    buttonColor: c.buttonColor,
    buttonTextColor: c.buttonTextColor,
    cardStyle: c.cardStyle,
    textAlign: c.textAlign,
    cardBackground: c.cardBackground,
    gradientStart: c.gradientStart,
    gradientEnd: c.gradientEnd,
    gradientDirection: c.gradientDirection,
    borderEnabled: c.borderEnabled,
    borderColor: c.borderColor,
    borderWidth: c.borderWidth,
    animation: c.animation,
    startDate: c.startDate.toISOString(),
    endDate: c.endDate.toISOString(),
    isActive: c.isActive,
    sortOrder: c.sortOrder,
    createdAt: c.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-sm">
            <MegaphoneIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Campanhas
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Crie e gerencie campanhas de marketing para o seu negócio
            </p>
          </div>
        </div>
      </div>
      <CampanhasLista data={data} />
    </div>
  )
}
