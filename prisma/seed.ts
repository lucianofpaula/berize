import { PrismaClient, TenantRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

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

  // Cria TenantMember para o dono
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

  // Cria alguns barbeiros de exemplo
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

  // ─── CLIENTES ───
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

  // ─── PLANOS ───
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

  // ─── SERVIÇOS ───
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
