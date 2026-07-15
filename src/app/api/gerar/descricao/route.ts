import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { groqChat } from "@/lib/groq"
import { NextResponse } from "next/server"

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: { name: true },
  })

  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  const prompt = `Você é um redator publicitário especializado em barbearias. 
    Crie uma descrição curta e profissional para a barbearia "${company.name}".

    A descrição deve ter no máximo 2 parágrafos e 250 caracteres, ser atrativa para clientes, 
    mencionar o tipo de serviço oferecido (cortes masculinos, barba, etc.) e o diferencial da barbearia.

    Responda APENAS com um JSON no formato:
    { "descricao": "texto da descrição aqui" }`

  try {
    const content = await groqChat(prompt)
    const parsed = JSON.parse(content)
    const descricao = parsed.descricao as string

    return NextResponse.json({ descricao })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
