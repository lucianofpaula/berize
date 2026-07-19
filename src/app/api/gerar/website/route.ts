import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { groqChat } from "@/lib/groq"
import { NextResponse } from "next/server"
import { createHash } from "crypto"

function generateSeed(companyId: string, companyName: string): string {
  const hash = createHash("sha256").update(`${companyId}-${companyName}-${Date.now()}`).digest("hex")
  return hash.slice(0, 16)
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: {
      id: true,
      name: true,
      description: true,
      phone: true,
      whatsapp: true,
      email: true,
      address: true,
      socialMedia: true,
      services: {
        where: { status: "ACTIVE" },
        orderBy: { sortOrder: "asc" },
        select: { name: true, price: true, description: true, duration: true },
      },
    },
  })

  if (!company) {
    return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 })
  }

  const address = company.address as Record<string, string> | null
  const socialMedia = company.socialMedia as Record<string, string> | null
  const seed = generateSeed(company.id, company.name)

  const prompt = `SEED:${seed}

VOCÊ É UM DIRETOR DE ARTE E UX/UI DESIGNER. Crie o DESIGN VISUAL COMPLETO + CONTEÚDO de uma landing page para a barbearia abaixo.

REGRAS:
- Design visualmente DIFERENTE a cada execução (use o SEED)
- Escolha UMA paleta e aplique em TODAS as seções
- Gere cores, tamanhos e alinhamentos COERENTES

PALETAS (escolha 1):
1. "dark-premium": fundos escuros #080808-#1A1A1A, acentos dourados #C89B3C ou laranja #F97316, texto branco
2. "light-elegant": fundos branco/off-white #FFFFFF-#F8F8F8, acentos charcoal #1A1A1A ou navy #1E3A5F, texto escuro
3. "warm-natural": fundos bege/quentes #FFF8F0-#F5F0E8, acentos terracota #C8673C ou âmbar #D97706, texto marrom
4. "bold-modern": alto contraste, acentos vibrantes #FF6B35 ou #7C3AED, tipografia grande
5. "clean-minimal": fundos neutros #F0EDE8-#E8E8E8, acentos sutis #52525B, espaço negativo

EMPRESA: ${company.name}
DESCRIÇÃO: ${company.description ?? "N/A"}
CONTATO: ${company.phone ?? "N/A"} | ${company.whatsapp ?? "N/A"} | ${company.email ?? "N/A"}
ENDEREÇO: ${address ? `${address.street ?? ""}, ${address.number ?? ""} - ${address.neighborhood ?? ""}, ${address.city ?? ""}/${address.state ?? ""}`.trim() : "N/A"}
INSTA: ${socialMedia?.instagram ?? "N/A"} | FB: ${socialMedia?.facebook ?? "N/A"}
SERVIÇOS: ${company.services.map((s) => `${s.name} R$${(s.price ?? 0).toFixed(2)} ${s.duration ?? 30}min`).join(" | ") || "N/A"}

Retorne JSON. Use português brasileiro. Conteúdo ORIGINAL e CRIATIVO.

FORMATO (gere TODOS os campos de estilo em TODAS as seções):
{
  "sections": {
    "hero": { "designVariant":"", "bgColor":"hex", "titleColor":"hex", "titleSize":"4xl|5xl", "titleAlign":"center", "descColor":"hex", "descSize":"lg|xl", "descAlign":"center", "overlay":"hex", "heightVh":85, "title":"headline máx 8 palavras", "subtitle":"frase máx 20 palavras", "ctaText":"AGENDAR AGORA", "secondaryCta":"Conheça a Experiência", "years":"10+", "clients":"5.000+", "satisfaction":"98%" },
    "about": { "bgColor":"hex", "titleColor":"hex", "titleSize":"2xl|3xl|4xl|5xl", "titleAlign":"left|center|right", "descColor":"hex", "descSize":"sm|base|lg|xl", "descAlign":"left|center|right", "title":"Sobre", "text":"história 2 parágrafos", "stats":[{ "label":"", "value":"" }] },
    "services": { "bgColor":"hex", "titleColor":"hex", "titleSize":"2xl|3xl|4xl|5xl", "titleAlign":"left|center|right", "title":"Serviços" },
    "team": { "bgColor":"hex", "titleColor":"hex", "titleSize":"2xl|3xl|4xl|5xl", "titleAlign":"left|center|right", "title":"Equipe" },
    "gallery": { "bgColor":"hex", "titleColor":"hex", "titleSize":"2xl|3xl|4xl|5xl", "titleAlign":"left|center|right", "title":"Galeria" },
    "testimonials": { "bgColor":"hex", "titleColor":"hex", "titleSize":"2xl|3xl|4xl|5xl", "titleAlign":"left|center|right", "descColor":"hex", "descSize":"sm|base|lg|xl", "descAlign":"left|center|right", "title":"Depoimentos", "items":[{ "name":"", "text":"" }] },
    "hours": { "bgColor":"hex", "titleColor":"hex", "titleSize":"2xl|3xl|4xl|5xl", "titleAlign":"left|center|right", "title":"Horários" },
    "contact": { "bgColor":"hex", "titleColor":"hex", "titleSize":"2xl|3xl|4xl|5xl", "titleAlign":"left|center|right", "title":"Contato" },
    "booking": { "bgColor":"hex", "titleColor":"hex", "titleSize":"2xl|3xl|4xl|5xl", "titleAlign":"left|center|right", "descColor":"hex", "descSize":"sm|base|lg|xl", "descAlign":"left|center|right", "title":"Agendamento", "ctaText":"Agende Online" }
  }
}`

  try {
    const content = await groqChat(prompt)
    const parsed = JSON.parse(content)
    const sections = parsed.sections as Record<string, Record<string, unknown>>

    function pick<T>(obj: Record<string, unknown> | undefined, key: string, fallback: T): T {
      return (obj?.[key] as T) ?? fallback
    }

    const result = [
      {
        id: "hero",
        type: "hero" as const,
        title: "Hero",
        enabled: true,
        content: {
          title: pick(sections.hero, "title", ""),
          subtitle: pick(sections.hero, "subtitle", ""),
          ctaText: pick(sections.hero, "ctaText", "Agende Agora"),
          secondaryCta: pick(sections.hero, "secondaryCta", "Conheça a Experiência"),
          backgroundUrl: null,
          overlay: pick(sections.hero, "overlay", "#00000066"),
          heightVh: pick(sections.hero, "heightVh", 85),
          years: pick(sections.hero, "years", "10+"),
          clients: pick(sections.hero, "clients", "5.000+"),
          satisfaction: pick(sections.hero, "satisfaction", "98%"),
          bgColor: pick(sections.hero, "bgColor", "#080808"),
          titleColor: pick(sections.hero, "titleColor", "#FFFFFF"),
          titleSize: pick(sections.hero, "titleSize", "5xl"),
          titleAlign: pick(sections.hero, "titleAlign", "center"),
          descColor: pick(sections.hero, "descColor", "#FFFFFF99"),
          descSize: pick(sections.hero, "descSize", "lg"),
          descAlign: pick(sections.hero, "descAlign", "center"),
        },
      },
      {
        id: "about",
        type: "about" as const,
        title: "Sobre",
        enabled: true,
        content: {
          title: pick(sections.about, "title", "Sobre Nós"),
          text: pick(sections.about, "text", ""),
          imageUrl: null,
          stats: pick(sections.about, "stats", []),
          bgColor: pick(sections.about, "bgColor", "#FFFFFF"),
          titleColor: pick(sections.about, "titleColor", "#111111"),
          titleSize: pick(sections.about, "titleSize", "3xl"),
          titleAlign: pick(sections.about, "titleAlign", "center"),
          descColor: pick(sections.about, "descColor", "#52525B"),
          descSize: pick(sections.about, "descSize", "base"),
          descAlign: pick(sections.about, "descAlign", "center"),
        },
      },
      {
        id: "services",
        type: "services" as const,
        title: "Serviços",
        enabled: true,
        content: {
          title: pick(sections.services, "title", "Nossos Serviços"),
          bgColor: pick(sections.services, "bgColor", "#FFFFFF"),
          titleColor: pick(sections.services, "titleColor", "#111111"),
          titleSize: pick(sections.services, "titleSize", "3xl"),
          titleAlign: pick(sections.services, "titleAlign", "center"),
        },
      },
      {
        id: "team",
        type: "team" as const,
        title: "Equipe",
        enabled: true,
        content: {
          title: pick(sections.team, "title", "Nossa Equipe"),
          bgColor: pick(sections.team, "bgColor", "#FFFFFF"),
          titleColor: pick(sections.team, "titleColor", "#111111"),
          titleSize: pick(sections.team, "titleSize", "3xl"),
          titleAlign: pick(sections.team, "titleAlign", "center"),
        },
      },
      {
        id: "gallery",
        type: "gallery" as const,
        title: "Galeria",
        enabled: true,
        content: {
          title: pick(sections.gallery, "title", "Galeria"),
          images: [],
          bgColor: pick(sections.gallery, "bgColor", "#FFFFFF"),
          titleColor: pick(sections.gallery, "titleColor", "#111111"),
          titleSize: pick(sections.gallery, "titleSize", "3xl"),
          titleAlign: pick(sections.gallery, "titleAlign", "center"),
        },
      },
      {
        id: "testimonials",
        type: "testimonials" as const,
        title: "Depoimentos",
        enabled: true,
        content: {
          title: pick(sections.testimonials, "title", "Depoimentos"),
          items: pick(sections.testimonials, "items", []),
          bgColor: pick(sections.testimonials, "bgColor", "#FFFFFF"),
          titleColor: pick(sections.testimonials, "titleColor", "#111111"),
          titleSize: pick(sections.testimonials, "titleSize", "3xl"),
          titleAlign: pick(sections.testimonials, "titleAlign", "center"),
          descColor: pick(sections.testimonials, "descColor", "#52525B"),
          descSize: pick(sections.testimonials, "descSize", "base"),
          descAlign: pick(sections.testimonials, "descAlign", "center"),
        },
      },
      {
        id: "hours",
        type: "hours" as const,
        title: "Horários",
        enabled: true,
        content: {
          title: pick(sections.hours, "title", "Horários"),
          bgColor: pick(sections.hours, "bgColor", "#FFFFFF"),
          titleColor: pick(sections.hours, "titleColor", "#111111"),
          titleSize: pick(sections.hours, "titleSize", "3xl"),
          titleAlign: pick(sections.hours, "titleAlign", "center"),
        },
      },
      {
        id: "contact",
        type: "contact" as const,
        title: "Contato",
        enabled: true,
        content: {
          title: pick(sections.contact, "title", "Contato"),
          showMap: false,
          bgColor: pick(sections.contact, "bgColor", "#FFFFFF"),
          titleColor: pick(sections.contact, "titleColor", "#111111"),
          titleSize: pick(sections.contact, "titleSize", "3xl"),
          titleAlign: pick(sections.contact, "titleAlign", "center"),
        },
      },
      {
        id: "booking",
        type: "booking" as const,
        title: "Agendamento",
        enabled: true,
        content: {
          title: pick(sections.booking, "title", "Pronto para Agendar?"),
          ctaText: pick(sections.booking, "ctaText", "Agende Online"),
          bgColor: pick(sections.booking, "bgColor", "#FFFFFF"),
          titleColor: pick(sections.booking, "titleColor", "#111111"),
          titleSize: pick(sections.booking, "titleSize", "3xl"),
          titleAlign: pick(sections.booking, "titleAlign", "center"),
          descColor: pick(sections.booking, "descColor", "#52525B"),
          descSize: pick(sections.booking, "descSize", "base"),
          descAlign: pick(sections.booking, "descAlign", "center"),
        },
      },
    ]

    return NextResponse.json({ sections: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
