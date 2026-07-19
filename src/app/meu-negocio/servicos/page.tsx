import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ServicosLista } from "@/app/servicos/servicos-lista"

export default async function ServicosPage() {
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

  const servicos = await prisma.service.findMany({
    where: { companyId: company.id },
    orderBy: { sortOrder: "asc" },
  })

  const data = servicos.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    price: s.price,
    duration: s.duration,
    category: s.category,
    commissionTiers: s.commissionTiers as { level: number; percentage: number }[],
    status: s.status as "ACTIVE" | "INACTIVE",
  }))

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Serviços
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          Gerencie os serviços oferecidos pela sua empresa
        </p>
      </div>
      <ServicosLista data={data} />
    </div>
  )
}
