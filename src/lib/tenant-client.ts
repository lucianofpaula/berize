import { prisma } from "@/lib/prisma"

export async function findOrCreateTenantClient({
  companyId,
  name,
  phone,
}: {
  companyId: string
  name?: string | null
  phone?: string | null
}) {
  let user = phone
    ? await prisma.user.findFirst({ where: { whatsapp: phone } })
    : null

  if (!user && name) {
    user = await prisma.user.findFirst({ where: { name } })
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: name || "Cliente",
        whatsapp: phone || null,
      },
    })
  }

  let member = await prisma.tenantMember.findFirst({
    where: { userId: user.id, companyId, role: "CLIENT" },
  })

  if (!member) {
    member = await prisma.tenantMember.create({
      data: {
        userId: user.id,
        companyId,
        role: "CLIENT",
      },
    })
  }

  return { user, member }
}

export async function getCampaignSourceName(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { title: true },
  })
  return campaign?.title ?? null
}
