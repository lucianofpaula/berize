import { PrismaClient } from "@prisma/client"
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

  const company = await prisma.company.findFirst({
    where: { ownerId: user.id },
  })

  if (!company) {
    await prisma.company.create({
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
