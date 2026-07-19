import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CampaignForm } from "@/app/campanhas/campanha-form"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"

export default async function NovaCampanhaPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <Link
          href="/campanhas"
          className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-2 transition-colors"
        >
          <ChevronLeftIcon className="size-3" />
          Voltar para campanhas
        </Link>
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Nova Campanha
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          Crie uma campanha de marketing personalizada para atrair mais clientes
        </p>
      </div>
      <CampaignForm />
    </div>
  )
}
