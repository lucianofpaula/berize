import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Website — Berize",
  description: "Gerencie o site do seu negócio.",
}

export default function WebsitePage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      <div className="px-1 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Website
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
          Personalize o site institucional do seu negócio.
        </p>
      </div>
    </div>
  )
}
