import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "./prisma"

const loginSchema = z.object({
  email: z.string().min(1).email().max(254),
  password: z.string().min(1),
})

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        })

        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { ownedCompanies: true },
        })

        if (!user?.password) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        const hasCompany = user.ownedCompanies.length > 0
        if (!hasCompany) {
          throw new Error("Você não tem uma empresa vinculada a você")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
}
