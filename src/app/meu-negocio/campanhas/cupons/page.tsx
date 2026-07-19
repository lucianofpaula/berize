import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { CuponsLista } from "@/app/campanhas/cupons-lista"
import { TicketIcon } from "lucide-react"

export default async function CuponsPage() {
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

  const coupons = await prisma.coupon.findMany({
    where: { campaign: { companyId: company.id } },
    include: {
      campaign: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const data = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    clientName: c.clientName,
    clientPhone: c.clientPhone,
    status: c.status as "ACTIVE" | "USED" | "EXPIRED" | "CANCELLED",
    campaignTitle: c.campaign.title,
    campaignId: c.campaign.id,
    usedAt: c.usedAt?.toISOString() ?? null,
    createdAt: c.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm">
            <TicketIcon className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Cupons de Campanhas
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Gerencie todos os cupons gerados pelas campanhas
            </p>
          </div>
        </div>
      </div>
      <CuponsLista data={data} />
    </div>
  )
}
