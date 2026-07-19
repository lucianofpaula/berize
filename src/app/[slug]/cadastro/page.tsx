import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import CadastroForm from "./cadastro-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const company = await prisma.company.findUnique({
    where: { slug },
    select: { name: true },
  })
  return { title: `Cadastro - ${company?.name ?? slug}` }
}

export default async function CadastroPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}) {
  const { slug } = await params
  const { ref } = await searchParams

  const company = await prisma.company.findUnique({
    where: { slug },
    select: { name: true, logo: true },
  })
  if (!company) notFound()

  return (
    <div className="min-h-screen bg-[var(--brand-accent-light)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {company.logo && (
          <img
            src={company.logo}
            alt={company.name}
            className="h-12 mx-auto mb-6"
          />
        )}
        <h1 className="text-2xl font-bold text-center text-[var(--brand-text)] mb-1">
          {company.name}
        </h1>
        <p className="text-sm text-[var(--brand-muted)] text-center mb-8">
          Crie sua conta para agendar horários
        </p>
        <div className="bg-[var(--brand-accent)] rounded-xl shadow-sm border border-[var(--brand-border)]/20 p-8">
          <CadastroForm slug={slug} refCode={ref ?? null} companyName={company.name} />
        </div>
      </div>
    </div>
  )
}
