import { BarbeiroForm } from "@/app/barbeiros/barbeiro-form"

export default function NovoBarbeiroPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Novo barbeiro
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          Cadastre um novo barbeiro na sua empresa
        </p>
      </div>
      <BarbeiroForm modo="criar" />
    </div>
  )
}
