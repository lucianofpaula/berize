import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ServicoForm } from "@/app/servicos/servico-form"

export default async function EditarServicoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const { id } = await params

  const service = await prisma.service.findFirst({
    where: { id, company: { ownerId: session.user.id } },
  })

  if (!service) {
    redirect("/servicos")
  }

  const initialData = {
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
    category: service.category,
    commissionTiers: service.commissionTiers as { level: number; percentage: number }[],
    status: service.status as "ACTIVE" | "INACTIVE",
    sortOrder: service.sortOrder,
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Editar serviço
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          {service.name}
        </p>
      </div>
      <ServicoForm initialData={initialData} />
    </div>
  )
}
