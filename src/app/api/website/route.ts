import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DEFAULT_SECTIONS } from "@/app/negocio/website-types"
import type { WebsiteSection, WebsiteData } from "@/app/negocio/website-types"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true, websiteEnabled: true, websiteSections: true },
  })

  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  const data: WebsiteData = {
    enabled: company.websiteEnabled,
    sections: (company.websiteSections as WebsiteSection[]) ?? DEFAULT_SECTIONS,
  }

  const isNew = company.websiteSections === null

  return NextResponse.json({ ...data, isNew })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  const body = await request.json()
  const { enabled, sections } = body as WebsiteData

  await prisma.company.update({
    where: { id: company.id },
    data: {
      websiteEnabled: enabled,
      websiteSections: JSON.parse(JSON.stringify(sections)),
    },
  })

  return NextResponse.json({ success: true })
}
