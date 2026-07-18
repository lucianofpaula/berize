import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { BarbeirosLista } from "@/app/barbeiros/barbeiros-lista"

export type BarbeiroData = {
  id: string
  nome: string
  email: string
  whatsapp: string | null
  especialidades: string[]
  comissao: number
  foto: string | null
  bio: string | null
  status: "ativo" | "inativo"
}

export default async function BarbeirosPage() {
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

  const members = await prisma.tenantMember.findMany({
    where: { companyId: company.id, role: "BARBER" },
    include: {
      user: { select: { name: true, email: true, whatsapp: true } },
      barberProfile: true,
    },
  })

  const barbeiros: BarbeiroData[] = members.map((m) => ({
    id: m.id,
    nome: m.user.name ?? "Sem nome",
    email: m.user.email ?? "",
    whatsapp: m.user.whatsapp ?? null,
    especialidades: m.barberProfile?.specialty ?? [],
    comissao: m.barberProfile?.commissionRate ?? 0,
    foto: m.barberProfile?.photoUrl ?? null,
    bio: m.barberProfile?.bio ?? null,
    status: m.barberProfile?.isActive ? "ativo" : "inativo",
  }))

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Barbeiros
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Gerencie os barbeiros da sua empresa. Cadastre, vincule ou desative profissionais.
        </p>
      </div>
      <BarbeirosLista data={barbeiros} />
    </div>
  )
}
