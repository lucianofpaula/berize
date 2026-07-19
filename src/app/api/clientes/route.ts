import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") ?? ""
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)))

  const where: Record<string, unknown> = {
    companyId: company.id,
    role: "CLIENT",
  }

  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { user: { whatsapp: { contains: search } } },
    ]
  }

  const [total, members] = await Promise.all([
    prisma.tenantMember.count({ where: where as any }),
    prisma.tenantMember.findMany({
      where: where as any,
      include: {
        user: { select: { id: true, name: true, email: true, whatsapp: true, image: true } },
        clientAppointments: {
          select: { id: true, date: true, status: true },
          orderBy: { date: "desc" as const },
        },
        campaignSource: {
          select: { title: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { user: { name: "asc" as const } },
    }),
  ])

  const clients = members.map((m) => {
    const totalVisitas = m.clientAppointments.length
    const ultimo = m.clientAppointments[0]
    return {
      id: m.id,
      userId: m.user.id,
      nome: m.user.name ?? "Sem nome",
      email: m.user.email ?? "",
      whatsapp: m.user.whatsapp ?? "",
      fotoUrl: m.user.image,
      totalVisitas,
      ultimaVisita: ultimo ? ultimo.date.toISOString().split("T")[0] : null,
      status: "ativo" as const,
      campanhaOrigem: (m as any).campaignSource?.title ?? null,
    }
  })

  return NextResponse.json({
    clients,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
