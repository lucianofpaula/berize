import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { BarbeiroForm } from "@/app/barbeiros/barbeiro-form"

export default async function EditarBarbeiroPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const { id } = await params

  const member = await prisma.tenantMember.findFirst({
    where: { id, company: { ownerId: session.user.id } },
    include: {
      user: { select: { name: true, email: true, whatsapp: true } },
      barberProfile: { include: { availability: true } },
    },
  })

  if (!member || !member.barberProfile) {
    redirect("/barbeiros")
  }

  const disponibilidade = member.barberProfile.availability.reduce<
    Record<number, { start: string; end: string }[]>
  >((acc, a) => {
    if (!acc[a.dayOfWeek]) acc[a.dayOfWeek] = []
    acc[a.dayOfWeek].push({ start: a.startTime, end: a.endTime })
    return acc
  }, {})

  const initialData = {
    nome: member.user.name ?? "",
    email: member.user.email ?? "",
    whatsapp: member.user.whatsapp ?? "",
    bio: member.barberProfile.bio ?? "",
    especialidades: member.barberProfile.specialty,
    comissao: member.barberProfile.commissionRate,
    foto: member.barberProfile.photoUrl ?? null,
    disponibilidade,
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Editar barbeiro
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          {member.user.name}
        </p>
      </div>
      <BarbeiroForm modo="editar" initialData={initialData} memberId={id} />
    </div>
  )
}
