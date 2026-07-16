import { PrismaClient, TenantRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const USER_ID = "6a56294d107ea6ff10f59f41"

const businessCategories = [
  { name: "Barbearia", description: "Barbearia tradicional ou moderna, cortes masculinos e barba", icon: "Scissors", color: "#f97316", slug: "barbearia", sortOrder: 1 },
  { name: "Salão de Beleza", description: "Salão feminino e masculino, cabelo, unhas e estética", icon: "Sparkles", color: "#ec4899", slug: "salao-beleza", sortOrder: 2 },
  { name: "Clínica de Estética", description: "Procedimentos estéticos avançados, limpeza de pele, laser", icon: "Heart", color: "#8b5cf6", slug: "clinica-estetica", sortOrder: 3 },
  { name: "Studio de Tatuagem", description: "Tatuagem, piercings e body art", icon: "Droplet", color: "#06b6d4", slug: "studio-tatuagem", sortOrder: 4 },
  { name: "Studio de Sobrancelhas", description: "Design de sobrancelhas, micropigmentação e henna", icon: "Eye", color: "#d946ef", slug: "studio-sobrancelhas", sortOrder: 5 },
  { name: "Clínica Odontológica", description: "Consultório e clínica dentária", icon: "Smile", color: "#14b8a6", slug: "clinica-odontologica", sortOrder: 6 },
  { name: "Academia", description: "Academia de musculação, crossfit e funcional", icon: "Dumbbell", color: "#ef4444", slug: "academia", sortOrder: 7 },
  { name: "Estúdio de Pilates", description: "Pilates solo e aparelhos, reabilitação e condicionamento", icon: "Activity", color: "#22c55e", slug: "studio-pilates", sortOrder: 8 },
  { name: "Clínica de Fisioterapia", description: "Fisioterapia, quiropraxia e reabilitação", icon: "Bone", color: "#3b82f6", slug: "clinica-fisioterapia", sortOrder: 9 },
  { name: "Spá", description: "Spá relaxante, massagens e tratamentos corporais", icon: "Flower2", color: "#a855f7", slug: "spa", sortOrder: 10 },
  { name: "Restaurante", description: "Restaurante, bistro e serviços de alimentação", icon: "Utensils", color: "#eab308", slug: "restaurante", sortOrder: 11 },
  { name: "Cafeteria", description: "Cafeteria, café especial e drinks", icon: "Coffee", color: "#92400e", slug: "cafeteria", sortOrder: 12 },
  { name: "Pet Shop", description: "Banho e tosa, cuidados veterinários e produtos pet", icon: "Dog", color: "#f97316", slug: "petshop", sortOrder: 13 },
  { name: "Clínica Veterinária", description: "Consultas, cirurgias e exames veterinários", icon: "Stethoscope", color: "#10b981", slug: "clinica-veterinaria", sortOrder: 14 },
  { name: "Estúdio de Yoga", description: "Yoga, meditação e bem-estar", icon: "Leaf", color: "#84cc16", slug: "studio-yoga", sortOrder: 15 },
  { name: "Oficina Mecânica", description: "Mecânica automotiva, revisão e reparos", icon: "Wrench", color: "#64748b", slug: "oficina-mecanica", sortOrder: 16 },
  { name: "Borracheiro", description: "Borracheiro, alinhamento e balanceamento", icon: "CircleDot", color: "#1e293b", slug: "borracheiro", sortOrder: 17 },
  { name: "Lava-Rápido", description: "Lavagem automotiva, higienização e detalhamento", icon: "Car", color: "#0ea5e9", slug: "lava-rapido", sortOrder: 18 },
  { name: "Escola / Curso", description: "Escola de idiomas, música, dança ou cursos livres", icon: "BookOpen", color: "#6366f1", slug: "escola-curso", sortOrder: 19 },
  { name: "Studio de Massagem", description: "Massoterapia, quick massage e drenagem linfática", icon: "Hand", color: "#db2777", slug: "studio-massagem", sortOrder: 20 },
  { name: "Nutrição", description: "Consultório de nutrição e dietética", icon: "Apple", color: "#65a30d", slug: "nutricao", sortOrder: 21 },
  { name: "Psicologia", description: "Consultório de psicologia e terapia", icon: "Brain", color: "#7c3aed", slug: "psicologia", sortOrder: 22 },
  { name: "Agência de Turismo", description: "Agência de viagens e turismo", icon: "Plane", color: "#0284c7", slug: "agencia-turismo", sortOrder: 23 },
  { name: "Imobiliária", description: "Corretagem de imóveis, aluguel e vendas", icon: "Building", color: "#d97706", slug: "imobiliaria", sortOrder: 24 },
  { name: "Consultório Médico", description: "Consultório particular de especialidades médicas", icon: "Stethoscope", color: "#059669", slug: "consultorio-medico", sortOrder: 25 },
]

const professionalCategories = [
  { name: "Cabeleireiro(a)", description: "Profissional especializado em cabelos femininos e masculinos", icon: "Scissors", color: "#ec4899", slug: "cabeleireiro", sortOrder: 1 },
  { name: "Barbeiro", description: "Profissional especializado em cortes masculinos e barba", icon: "Scissors", color: "#f97316", slug: "barbeiro", sortOrder: 2 },
  { name: "Manicure / Pedicure", description: "Profissional de unhas, alongamento e nail art", icon: "Hand", color: "#db2777", slug: "manicure-pedicure", sortOrder: 3 },
  { name: "Maquiador(a)", description: "Maquiagem social, artística e noivas", icon: "Paintbrush", color: "#d946ef", slug: "maquiador", sortOrder: 4 },
  { name: "Esteticista", description: "Profissional de estética facial e corporal", icon: "Sparkles", color: "#a855f7", slug: "esteticista", sortOrder: 5 },
  { name: "Tatuador(a)", description: "Tatuador profissional", icon: "Droplet", color: "#06b6d4", slug: "tatuador", sortOrder: 6 },
  { name: "Piercer", description: "Profissional de perfurações corporais", icon: "CircleDot", color: "#14b8a6", slug: "piercer", sortOrder: 7 },
  { name: "Designer de Sobrancelhas", description: "Design de sobrancelhas, micropigmentação e henna", icon: "Eye", color: "#d946ef", slug: "designer-sobrancelhas", sortOrder: 8 },
  { name: "Dentista", description: "Cirurgião-dentista", icon: "Smile", color: "#14b8a6", slug: "dentista", sortOrder: 9 },
  { name: "Fisioterapeuta", description: "Fisioterapeuta e quiropraxista", icon: "Bone", color: "#3b82f6", slug: "fisioterapeuta", sortOrder: 10 },
  { name: "Massoterapeuta", description: "Massoterapeuta, quick massage e drenagem", icon: "Hand", color: "#db2777", slug: "massoterapeuta", sortOrder: 11 },
  { name: "Personal Trainer", description: "Personal trainer, musculação e funcional", icon: "Dumbbell", color: "#ef4444", slug: "personal-trainer", sortOrder: 12 },
  { name: "Instrutor de Pilates", description: "Instrutor de pilates solo e aparelhos", icon: "Activity", color: "#22c55e", slug: "instrutor-pilates", sortOrder: 13 },
  { name: "Instrutor de Yoga", description: "Instrutor de yoga e meditação", icon: "Leaf", color: "#84cc16", slug: "instrutor-yoga", sortOrder: 14 },
  { name: "Nutricionista", description: "Nutricionista clínico e esportivo", icon: "Apple", color: "#65a30d", slug: "nutricionista", sortOrder: 15 },
  { name: "Psicólogo(a)", description: "Psicólogo clínico e terapeuta", icon: "Brain", color: "#7c3aed", slug: "psicologo", sortOrder: 16 },
  { name: "Médico(a)", description: "Médico de especialidades clínicas", icon: "Stethoscope", color: "#059669", slug: "medico", sortOrder: 17 },
  { name: "Veterinário(a)", description: "Médico veterinário", icon: "Dog", color: "#10b981", slug: "veterinario", sortOrder: 18 },
  { name: "Tosador(a)", description: "Tosador e banhista pet", icon: "Dog", color: "#f97316", slug: "tosador", sortOrder: 19 },
  { name: "Cozinheiro(a) / Chef", description: "Chef de cozinha e auxiliar", icon: "Utensils", color: "#eab308", slug: "chef", sortOrder: 20 },
  { name: "Barista", description: "Barista especializado em café", icon: "Coffee", color: "#92400e", slug: "barista", sortOrder: 21 },
  { name: "Mecânico(a)", description: "Mecânico automotivo", icon: "Wrench", color: "#64748b", slug: "mecanico", sortOrder: 22 },
  { name: "Professor(a)", description: "Professor de cursos, idiomas ou música", icon: "BookOpen", color: "#6366f1", slug: "professor", sortOrder: 23 },
  { name: "Depilador(a)", description: "Profissional de depilação com cera e laser", icon: "Zap", color: "#c026d3", slug: "depilador", sortOrder: 24 },
  { name: "Podólogo(a)", description: "Podólogo clínico", icon: "Foot", color: "#0891b2", slug: "podologo", sortOrder: 25 },
]

async function main() {
  const email = "lucianofpaula@gmail.com"
  const rawPassword = "221274lu"

  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    const password = await bcrypt.hash(rawPassword, 10)
    user = await prisma.user.create({
      data: { email, name: "Luciano", password },
    })
    console.log("Usuário criado:", user.email)
  } else {
    console.log("Usuário já existe:", user.email)
  }

  let company = await prisma.company.findFirst({
    where: { ownerId: user.id },
  })

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: "Barbearia do Canhoto",
        slug: "barbearia-do-canhoto",
        status: "ACTIVE",
        ownerId: user.id,
      },
    })
    console.log("Empresa criada para:", user.email)
  } else {
    console.log("Empresa já existe para:", user.email)
  }

  const ownerMember = await prisma.tenantMember.upsert({
    where: {
      userId_companyId: { userId: user.id, companyId: company.id },
    },
    update: { role: TenantRole.OWNER },
    create: {
      userId: user.id,
      companyId: company.id,
      role: TenantRole.OWNER,
    },
  })
  console.log("Membro dono vinculado:", ownerMember.id)

  const barbeiros = [
    { email: "ricardo.barbeiro@email.com", name: "Ricardo Oliveira", specialty: ["Corte masculino", "Barba"], commission: 40 },
    { email: "gabriel.barbeiro@email.com", name: "Gabriel Costa", specialty: ["Degradê", "Corte infantil"], commission: 45 },
    { email: "bruno.barbeiro@email.com", name: "Bruno Henrique", specialty: ["Hidratação capilar", "Barboterapia"], commission: 35 },
  ]

  for (const barbeiro of barbeiros) {
    let barberUser = await prisma.user.findUnique({ where: { email: barbeiro.email } })

    if (!barberUser) {
      const password = await bcrypt.hash("123456", 10)
      barberUser = await prisma.user.create({
        data: { email: barbeiro.email, name: barbeiro.name, password },
      })
      console.log("Barbeiro criado:", barberUser.email)
    }

    const member = await prisma.tenantMember.upsert({
      where: {
        userId_companyId: { userId: barberUser.id, companyId: company.id },
      },
      update: { role: TenantRole.BARBER },
      create: {
        userId: barberUser.id,
        companyId: company.id,
        role: TenantRole.BARBER,
      },
    })

    await prisma.barberProfile.upsert({
      where: { tenantMemberId: member.id },
      update: {
        specialty: barbeiro.specialty,
        commissionRate: barbeiro.commission,
        isActive: true,
      },
      create: {
        tenantMemberId: member.id,
        specialty: barbeiro.specialty,
        commissionRate: barbeiro.commission,
        isActive: true,
      },
    })

    console.log("Perfil de barbeiro vinculado:", barbeiro.name)
  }

  const clientes = [
    { email: "joao.cliente@email.com", name: "João Silva", whatsapp: "11911111111" },
    { email: "pedro.cliente@email.com", name: "Pedro Santos", whatsapp: "11922222222" },
    { email: "lucas.cliente@email.com", name: "Lucas Almeida", whatsapp: "11933333333" },
  ]

  for (const cli of clientes) {
    let cliUser = await prisma.user.findUnique({ where: { email: cli.email } })
    if (!cliUser) {
      const password = await bcrypt.hash("123456", 10)
      cliUser = await prisma.user.create({
        data: { email: cli.email, name: cli.name, whatsapp: cli.whatsapp, password },
      })
    }

    await prisma.tenantMember.upsert({
      where: { userId_companyId: { userId: cliUser.id, companyId: company.id } },
      update: { role: TenantRole.CLIENT },
      create: { userId: cliUser.id, companyId: company.id, role: TenantRole.CLIENT },
    })
    console.log("Cliente vinculado:", cli.name)
  }

  const planos = [
    {
      name: "Básico",
      description: "Acesso aos serviços essenciais da barbearia",
      price: 49.90,
      badge: null,
      sortOrder: 1,
      commissionTiers: [
        { level: 1, percentage: 20 },
        { level: 2, percentage: 10 },
        { level: 3, percentage: 5 },
      ],
    },
    {
      name: "Premium",
      description: "Experiência completa com prioridade no agendamento",
      price: 99.90,
      badge: "Recomendado",
      sortOrder: 2,
      commissionTiers: [
        { level: 1, percentage: 20 },
        { level: 2, percentage: 5 },
        { level: 3, percentage: 5 },
        { level: 4, percentage: 5 },
        { level: 5, percentage: 5 },
      ],
    },
    {
      name: "VIP",
      description: "Benefícios exclusivos e descontos em todos os serviços",
      price: 199.90,
      badge: "Mais popular",
      sortOrder: 3,
      commissionTiers: [
        { level: 1, percentage: 25 },
        { level: 2, percentage: 10 },
        { level: 3, percentage: 5 },
        { level: 4, percentage: 5 },
        { level: 5, percentage: 5 },
      ],
    },
  ]

  for (const plano of planos) {
    await prisma.plan.upsert({
      where: {
        companyId_name: { companyId: company.id, name: plano.name },
      },
      update: {
        description: plano.description,
        price: plano.price,
        badge: plano.badge,
        sortOrder: plano.sortOrder,
        commissionTiers: plano.commissionTiers,
      },
      create: {
        companyId: company.id,
        ...plano,
      },
    })
    console.log("Plano criado:", plano.name)
  }

  const servicos = [
    { name: "Corte masculino", description: "Corte tesoura e máquina com acabamento", price: 45.00, duration: 40, category: "Corte", sortOrder: 1, commissionTiers: [{ level: 1, percentage: 20 }] },
    { name: "Barba completa", description: "Aparação e modelagem de barba com navalha", price: 30.00, duration: 25, category: "Barba", sortOrder: 2, commissionTiers: [{ level: 1, percentage: 20 }] },
    { name: "Degradê", description: "Corte degradê do 0 ao 5 com máquina e tesoura", price: 55.00, duration: 45, category: "Corte", sortOrder: 3, commissionTiers: [{ level: 1, percentage: 25 }] },
    { name: "Hidratação capilar", description: "Hidratação profunda com queratina e óleos", price: 60.00, duration: 50, category: "Tratamento", sortOrder: 4, commissionTiers: [{ level: 1, percentage: 15 }] },
    { name: "Barboterapia", description: "Tratamento relaxante com toalhas quentes e pós-barba", price: 50.00, duration: 35, category: "Barba", sortOrder: 5, commissionTiers: [{ level: 1, percentage: 20 }] },
    { name: "Corte infantil", description: "Corte infantil com paciência e carinho", price: 35.00, duration: 30, category: "Corte", sortOrder: 6, commissionTiers: [{ level: 1, percentage: 20 }] },
    { name: "Combo Corte + Barba", description: "Corte masculino + barba completa com desconto", price: 65.00, duration: 60, category: "Combo", sortOrder: 7, commissionTiers: [{ level: 1, percentage: 20 }] },
    { name: "Sobrancelha", description: "Design de sobrancelha com pinça e navalha", price: 20.00, duration: 15, category: "Estética", sortOrder: 8, commissionTiers: [{ level: 1, percentage: 20 }] },
  ]

  for (const servico of servicos) {
    await prisma.service.upsert({
      where: {
        companyId_name: { companyId: company.id, name: servico.name },
      },
      update: {
        description: servico.description,
        price: servico.price,
        duration: servico.duration,
        category: servico.category,
        sortOrder: servico.sortOrder,
        commissionTiers: servico.commissionTiers,
      },
      create: {
        companyId: company.id,
        ...servico,
      },
    })
    console.log("Serviço criado:", servico.name)
  }

  // ─── CATEGORIAS ───

  for (const cat of businessCategories) {
    await prisma.businessCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        ...cat,
        createdById: USER_ID,
        isActive: true,
      },
    })
  }
  console.log(`Seed: ${businessCategories.length} categorias de estabelecimento`)

  for (const cat of professionalCategories) {
    await prisma.professionalCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        ...cat,
        createdById: USER_ID,
        isActive: true,
      },
    })
  }
  console.log(`Seed: ${professionalCategories.length} categorias de profissional`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
