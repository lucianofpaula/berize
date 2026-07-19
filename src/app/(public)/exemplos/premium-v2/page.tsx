import Link from "next/link"

export default function PremiumV2Page() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Modelo Premium v2</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">Este modelo está sendo atualizado.</p>
        <Link href="/exemplos" className="text-amber-600 hover:underline text-sm">Voltar</Link>
      </div>
    </div>
  )
}
