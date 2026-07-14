import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PlanosLista } from "@/app/planos/planos-lista"

export default async function PlanosPage() {
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

  const [planos, servicos] = await Promise.all([
    prisma.plan.findMany({
      where: { companyId: company.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.service.findMany({
      where: { companyId: company.id, status: "ACTIVE" },
      select: { id: true, name: true, price: true },
    }),
  ])

  const servicoMap = new Map(servicos.map((s) => [s.id, s]))

  const data = planos.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    badge: p.badge,
    includedServices: (p.includedServiceIds as string[])
      .map((id) => servicoMap.get(id))
      .filter(Boolean)
      .map((s) => ({ id: s!.id, name: s!.name, price: s!.price })),
    commissionTiers: p.commissionTiers as { level: number; percentage: number }[],
    status: p.status as "ACTIVE" | "INACTIVE",
  }))

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Planos de assinatura
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          Gerencie os planos de assinatura da sua empresa
        </p>
      </div>
      <PlanosLista data={data} />
    </div>
  )
}
