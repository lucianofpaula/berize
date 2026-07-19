import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import type { WebsiteData, WebsiteSection } from "@/app/negocio/website-types"
import WebsitePreview from "@/app/negocio/website-preview"
import type { Metadata } from "next"

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
  return { title: company?.name ?? slug }
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const company = await prisma.company.findUnique({
    where: { slug },
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

  if (!company) notFound()

  const sections = (company.websiteSections as WebsiteSection[]) ?? []

  if (!company.websiteEnabled || sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-800">{company.name}</h1>
          <p className="text-zinc-500 mt-2">Site em construção</p>
        </div>
      </div>
    )
  }

  const data: WebsiteData = {
    enabled: true,
    sections,
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
    <div className="min-h-screen bg-white">
      <WebsitePreview
        data={data}
        companyName={company.name}
        companySlug={slug}
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
