import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { groqChat } from "@/lib/groq"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
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

  const body = await request.json()
  const precoBase = body.precoBase as number

  if (!precoBase || precoBase <= 0) {
    return NextResponse.json({ error: "Informe o valor do plano mais barato." }, { status: 400 })
  }

  // Busca serviços existentes para a IA decidir quais incluir em cada plano
  const servicos = await prisma.service.findMany({
    where: { companyId: company.id, status: "ACTIVE" },
    select: { id: true, name: true, price: true, category: true },
    orderBy: { sortOrder: "asc" },
  })

  const servicosStr = servicos
    .map((s) => `- ${s.name} (R$ ${s.price.toFixed(2)}) [${s.category ?? "Sem categoria"}]`)
    .join("\n")

  const prompt = `Você é um consultor especializado em barbearias. Primeiro, pesquise mentalmente os nomes de planos de assinatura mais comuns e eficientes usados por barbearias no Brasil (ex: Básico, Premium, VIP, Ouro, Prata, Bronze, Black, Top, Master, executivo, etc.). Depois, com base nessa pesquisa, gere planos de assinatura mensal para a barbearia "${company.name}".

A barbearia oferece os seguintes serviços:
${servicosStr || "(nenhum serviço cadastrado ainda)"}

IMPORTANTE: O plano mais barato custa EXATAMENTE R$ ${precoBase.toFixed(2)}. Use este valor como base para definir os preços dos demais planos.
Crie de 3 a 4 planos sendo que o primeiro (mais barato) custa R$ ${precoBase.toFixed(2)}. Os planos intermediários e o mais caro devem ter preços progressivos e realistas com base no valor base.
Cada plano deve ter: nome, descrição curta, preço, um badge opcional (ex: "Recomendado", "Mais popular", "Premium"), e uma lista de serviços incluídos (usando os NOMES EXATOS dos serviços listados acima).

Regras para inclusão de serviços:
- Planos mais baratos devem incluir APENAS os serviços mais básicos e essenciais (ex: corte simples, barba)
- Planos intermediários incluem uma seleção maior de serviços
- Planos mais caros (Premium, VIP) incluem TODOS ou quase todos os serviços
- Se não houver serviços cadastrados, retorne lista vazia em "servicosIncluidos"

Responda APENAS com um JSON no formato:
{
  "planos": [
    {
      "name": "Nome do plano",
      "description": "Descrição",
      "price": 49.90,
      "badge": null,
      "servicosIncluidos": ["Nome exato do serviço 1", "Nome exato do serviço 2"]
    }
  ]
}

Não inclua campos de comissão ou multinível. Apenas nome, descrição, preço, badge e servicosIncluidos.`

  try {
    const content = await groqChat(prompt)
    const parsed = JSON.parse(content)
    const planos = parsed.planos as {
      name: string
      description: string
      price: number
      badge: string | null
      servicosIncluidos: string[]
    }[]

    // Mapa de nome do serviço → id
    const servicoMap = new Map(servicos.map((s) => [s.name, s]))

    const nomesExistentes = new Set(
      (await prisma.plan.findMany({
        where: { companyId: company.id },
        select: { name: true },
      })).map((p) => p.name),
    )

    const novos = planos.filter((p) => !nomesExistentes.has(p.name))

    const created: Array<{ id: string; name: string }> = []
    let sortOrder = await prisma.plan.count({ where: { companyId: company.id } })

    for (const plano of novos) {
      sortOrder++

      // Resolve nomes dos serviços para IDs (ignora nomes que não existem)
      const includedIds = (plano.servicosIncluidos ?? [])
        .map((nome) => servicoMap.get(nome)?.id)
        .filter((id): id is string => !!id)

      const p = await prisma.plan.create({
        data: {
          companyId: company.id,
          name: plano.name,
          description: plano.description,
          price: plano.price,
          badge: plano.badge ?? null,
          includedServiceIds: includedIds,
          commissionTiers: [],
          sortOrder,
        },
      })
      created.push({ id: p.id, name: p.name })
    }

    return NextResponse.json({ planos: created, ignorados: planos.length - novos.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
