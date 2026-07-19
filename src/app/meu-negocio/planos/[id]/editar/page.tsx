import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PlanoForm } from "@/app/planos/plano-form"

export default async function EditarPlanoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const { id } = await params

  const plan = await prisma.plan.findFirst({
    where: { id, company: { ownerId: session.user.id } },
    include: { company: { select: { id: true } } },
  })

  if (!plan) {
    redirect("/planos")
  }

  const servicos = await prisma.service.findMany({
    where: { companyId: plan.company.id, status: "ACTIVE" },
    select: { id: true, name: true, price: true },
  })

  const initialData = {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    badge: plan.badge,
    includedServiceIds: plan.includedServiceIds as string[],
    commissionTiers: plan.commissionTiers as { level: number; percentage: number }[],
    status: plan.status as "ACTIVE" | "INACTIVE",
    sortOrder: plan.sortOrder,
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Editar plano
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          {plan.name}
        </p>
      </div>
      <PlanoForm initialData={initialData} servicosDisponiveis={servicos} />
    </div>
  )
}
