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
    select: { name: true },
  })

  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  const { title } = await request.json()

  if (!title || title.trim().length === 0) {
    return NextResponse.json({ error: "O título é obrigatório para gerar a campanha." }, { status: 400 })
  }

  const prompt = `Você é um redator publicitário especializado em marketing para barbearias e salões de beleza.

A barbearia "${company.name}" está criando uma campanha de marketing com o título: "${title}".

Com base neste título, gere os seguintes campos criativos e persuasivos:

1. **subtitle**: Um subtítulo curto e impactante (máximo 80 caracteres) que complemente o título.
2. **description**: Uma descrição convincente (2 a 3 frases, máximo 250 caracteres) explicando a campanha, com tom persuasivo e chamativo.
3. **highlightTitle**: Uma frase de destaque curta (máximo 60 caracteres) que funcione como um chamariz, algo como "Por tempo limitado!" ou "Não perca esta oportunidade!".
4. **buttonText**: Um texto curto para o botão de call-to-action (máximo 25 caracteres), como "Pegue seu cupom", "Saiba mais", "Garanta já", "Agende agora".
5. **badge**: Uma tag/label curta (máximo 20 caracteres) para destacar a campanha, como "Novidade", "Tempo Limitado", "Exclusivo", "Imperdível", "Promoção".

Regras:
- Seja criativo e persuasivo, mas mantenha a relevância com o título e o segmento de barbearia.
- Use linguagem que gere urgência e desejo.
- Não use aspas ou caracteres especiais nos textos.
- Responda APENAS no formato JSON, sem explicações adicionais.

Formato de resposta:
{
  "subtitle": "...",
  "description": "...",
  "highlightTitle": "...",
  "buttonText": "...",
  "badge": "..."
}`

  try {
    const content = await groqChat(prompt)

    let data: {
      subtitle?: string
      description?: string
      highlightTitle?: string
      buttonText?: string
      badge?: string
    }

    try {
      data = JSON.parse(content)
    } catch {
      return NextResponse.json({ error: "Erro ao processar resposta da IA." }, { status: 500 })
    }

    return NextResponse.json({
      subtitle: data.subtitle ?? "",
      description: data.description ?? "",
      highlightTitle: data.highlightTitle ?? "",
      buttonText: data.buttonText ?? "Saiba Mais",
      badge: data.badge ?? "",
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
