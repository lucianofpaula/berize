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
        })

        if (!user?.password) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

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
      if (user) {
        token.id = user.id
        token.isOwner = false
        try {
          const [owned, member] = await Promise.all([
            prisma.company.findFirst({ where: { ownerId: user.id }, select: { id: true } }),
            prisma.tenantMember.findFirst({ where: { userId: user.id, role: "OWNER" }, select: { id: true } }),
          ])
          token.isOwner = !!(owned ?? member)
        } catch {
          // fallback: assume não-owner
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.isOwner = token.isOwner as boolean
      }
      return session
    },
  },
}
