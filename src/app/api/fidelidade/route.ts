import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: {
      id: true,
      loyaltyEnabled: true,
      loyaltyStampsRequired: true,
      loyaltyRewardDescription: true,
    },
  })

  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  const [activeClients, completedCycles] = await Promise.all([
    prisma.tenantMember.count({
      where: {
        companyId: company.id,
        role: "CLIENT",
        loyaltyPoints: { gt: 0 },
      },
    }),
    prisma.tenantMember.aggregate({
      where: { companyId: company.id, role: "CLIENT" },
      _sum: { loyaltyPoints: true },
    }),
  ])

  const stampsRequired = company.loyaltyStampsRequired || 10
  const totalPoints = completedCycles._sum.loyaltyPoints || 0
  const totalCycles = Math.floor(totalPoints / stampsRequired)

  return NextResponse.json({
    enabled: company.loyaltyEnabled,
    stampsRequired,
    rewardDescription: company.loyaltyRewardDescription,
    activeClients,
    completedCycles: totalCycles,
  })
}
