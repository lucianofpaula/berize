import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
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
  const { nome, email, whatsapp, especialidades, comissao, bio, fotoUrl, disponibilidade } = body

  if (!nome || !email) {
    return NextResponse.json({ error: "Nome e email são obrigatórios." }, { status: 400 })
  }

  if (!especialidades || especialidades.length === 0) {
    return NextResponse.json({ error: "Adicione pelo menos uma especialidade." }, { status: 400 })
  }

  if (!disponibilidade || Object.keys(disponibilidade).length === 0) {
    return NextResponse.json({ error: "Defina a disponibilidade semanal." }, { status: 400 })
  }

  // Busca ou cria o usuário
  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    const password = await bcrypt.hash("123456", 10)
    user = await prisma.user.create({
      data: { email, name: nome, whatsapp, password },
    })
  } else {
    // Atualiza whatsapp se não tiver
    if (whatsapp && !user.whatsapp) {
      await prisma.user.update({ where: { id: user.id }, data: { whatsapp } })
    }
  }

  // Verifica se já é membro desta empresa
  const existingMember = await prisma.tenantMember.findUnique({
    where: { userId_companyId: { userId: user.id, companyId: company.id } },
  })

  if (existingMember) {
    return NextResponse.json({ error: "Este usuário já está vinculado a esta empresa." }, { status: 409 })
  }

  // Cria TenantMember com role BARBER + BarberProfile + disponibilidade
  const member = await prisma.tenantMember.create({
    data: {
      userId: user.id,
      companyId: company.id,
      role: "BARBER",
      barberProfile: {
        create: {
          specialty: especialidades,
          commissionRate: comissao ?? 40,
          bio: bio ?? null,
          photoUrl: fotoUrl ?? null,
          availability: {
            create: Object.entries(disponibilidade).flatMap(([dia, slots]: [string, any]) =>
              slots.map((slot: { start: string; end: string }) => ({
                dayOfWeek: Number(dia),
                startTime: slot.start,
                endTime: slot.end,
              }))
            ),
          },
        },
      },
    },
  })

  return NextResponse.json({ id: member.id })
}
