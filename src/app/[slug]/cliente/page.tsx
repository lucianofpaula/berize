import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ClientePanel from "./cliente-panel"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const company = await prisma.company.findUnique({
    where: { slug },
    select: { name: true },
  })
  return { title: `Minha conta - ${company?.name ?? slug}` }
}

export default async function ClientePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect(`/${slug}/login`)

  const company = await prisma.company.findUnique({
    where: { slug },
    select: { id: true, name: true, logo: true },
  })
  if (!company) notFound()

  const member = await prisma.tenantMember.findUnique({
    where: {
      userId_companyId: { userId: session.user.id, companyId: company.id },
    },
    include: {
      user: { select: { name: true, email: true, image: true, whatsapp: true } },
      _count: { select: { sponsored: true, clientAppointments: true } },
    },
  })

  const [appointments, sponsored] = await Promise.all([
    prisma.agendamento.findMany({
      where: { clientId: member?.id, companyId: company.id },
      take: 5,
      orderBy: { date: "desc" },
      select: { id: true, date: true, status: true },
    }),
    prisma.tenantMember.findMany({
      where: { sponsorId: member?.id, companyId: company.id },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
  ])

  if (!member || member.role !== "CLIENT") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-zinc-800">Acesso restrito</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ClientePanel
      companyName={company.name}
      companyLogo={company.logo}
      member={{
        id: member.id,
        name: member.user.name ?? "",
        email: member.user.email ?? "",
        whatsapp: member.user.whatsapp ?? "",
        image: member.user.image ?? null,
        subscriptionStatus: member.subscriptionStatus ?? "free",
        loyaltyPoints: member.loyaltyPoints,
        appointments: appointments.map((a) => ({
          id: a.id,
          date: a.date.toISOString(),
          status: a.status,
          service: "Agendamento",
        })),
        appointmentsCount: member._count.clientAppointments,
        sponsoredCount: member._count.sponsored,
        sponsored: sponsored.map((s) => ({
          name: s.user.name ?? "Convidado",
          createdAt: s.createdAt.toISOString(),
        })),
      }}
    />
  )
}
