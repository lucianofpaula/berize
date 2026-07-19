import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const cadastroSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100),
  email: z.string().email("Email inválido").max(254),
  whatsapp: z.string().min(8, "WhatsApp inválido").max(20),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(100),
  photoUrl: z.string().url().optional(),
  ref: z.string().optional(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const body = await request.json()
  const parsed = cadastroSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { name, email, whatsapp, password, photoUrl, ref } = parsed.data

  const company = await prisma.company.findUnique({
    where: { slug },
    select: { id: true, name: true },
  })
  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })
  if (existingUser) {
    return NextResponse.json(
      { error: "Este email já está cadastrado. Faça login." },
      { status: 409 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      whatsapp,
      image: photoUrl ?? null,
      password: hashedPassword,
    },
  })

  let sponsorId: string | null = null
  let ancestors: string[] = []

  if (ref) {
    const sponsor = await prisma.tenantMember.findUnique({
      where: { id: ref },
      select: { id: true, ancestors: true, companyId: true },
    })
    if (sponsor && sponsor.companyId === company.id) {
      sponsorId = sponsor.id
      ancestors = [...sponsor.ancestors, sponsor.id]
    }
  }

  const member = await prisma.tenantMember.create({
    data: {
      userId: user.id,
      companyId: company.id,
      role: "CLIENT",
      sponsorId,
      ancestors,
    },
    select: { id: true },
  })

  return NextResponse.json({
    id: member.id,
    name: user.name,
    email: user.email,
  })
}
