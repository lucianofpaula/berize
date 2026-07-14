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
    select: { id: true, name: true },
  })

  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  const prompt = `Você é um consultor especializado em barbearias. Primeiro, pesquise mentalmente os serviços mais comuns e os nomes mais usados por barbearias no Brasil (ex: Corte masculino, Degradê, Barba, Barboterapia, Hidratação, Sobrancelha, Combo Corte+Barba, etc.). Depois, com base nessa pesquisa, gere serviços para a barbearia "${company.name}".

Crie de 8 a 12 serviços com preços e durações realistas para o mercado brasileiro.
Cada serviço deve ter: nome, descrição curta, preço (entre R$ 15 e R$ 80), duração em minutos, e uma categoria (ex: "Corte", "Barba", "Tratamento", "Estética", "Combo").

Responda APENAS com um JSON no formato:
{
  "servicos": [
    { "name": "Nome do serviço", "description": "Descrição", "price": 45.00, "duration": 40, "category": "Corte" }
  ]
}

Não inclua campos de comissão ou multinível. Apenas nome, descrição, preço, duração e categoria.`

  try {
    const content = await groqChat(prompt)
    const parsed = JSON.parse(content)
    const servicos = parsed.servicos as { name: string; description: string; price: number; duration: number; category: string }[]

    const nomesExistentes = new Set(
      (await prisma.service.findMany({
        where: { companyId: company.id },
        select: { name: true },
      })).map((s) => s.name),
    )

    const novos = servicos.filter((s) => !nomesExistentes.has(s.name))

    const created: Array<{ id: string; name: string }> = []
    let sortOrder = await prisma.service.count({ where: { companyId: company.id } })
    for (const servico of novos) {
      sortOrder++
      const s = await prisma.service.create({
        data: {
          companyId: company.id,
          name: servico.name,
          description: servico.description,
          price: servico.price,
          duration: servico.duration,
          category: servico.category ?? null,
          commissionTiers: [],
          sortOrder,
        },
      })
      created.push({ id: s.id, name: s.name })
    }

    return NextResponse.json({ servicos: created, ignorados: servicos.length - novos.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
