import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import WebsiteBuilder from "@/app/negocio/website-builder"

export const metadata = {
  title: "Website — Berize",
  description: "Gerencie o site do seu negócio.",
}

export default async function WebsitePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    include: {
      services: {
        where: { status: "ACTIVE" },
        orderBy: { sortOrder: "asc" },
        select: { name: true, price: true },
      },
      members: {
        where: { role: "BARBER" },
        include: {
          user: { select: { name: true, image: true } },
          barberProfile: { select: { photoUrl: true } },
        },
      },
      hours: { orderBy: { dayOfWeek: "asc" } },
    },
  })

  if (!company) {
    return (
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
        <p className="text-sm text-zinc-500">Nenhuma empresa encontrada.</p>
      </div>
    )
  }

  const barbers = company.members.map((tm) => ({
    name: tm.user.name ?? "Barbeiro",
    image: tm.barberProfile?.photoUrl ?? tm.user.image ?? null,
  }))

  const services = company.services.map((s) => ({
    name: s.name,
    price: s.price,
  }))

  const hours = company.hours.map((h) => ({
    dayOfWeek: h.dayOfWeek,
    openTime: h.openTime,
    closeTime: h.closeTime,
    isOpen: h.isOpen,
  }))

  const address = company.address as Record<string, string> | null
  const socialMedia = company.socialMedia as Record<string, string> | null

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <WebsiteBuilder
        companyName={company.name}
        companySlug={company.slug}
        companyDescription={company.description}
        companyPhone={company.phone}
        companyWhatsapp={company.whatsapp}
        companyEmail={company.email}
        companyAddress={address}
        companySocialMedia={socialMedia}
        services={services}
        barbers={barbers}
        hours={hours}
      />
    </div>
  )
}
