"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Building2, User } from "lucide-react"
import { Button } from "@/components/landing/ui/button"
import { Input } from "@/components/landing/ui/input"

export function SearchWidget() {
  const router = useRouter()
  const [tab, setTab] = useState<"establishments" | "professionals">("establishments")
  const [query, setQuery] = useState("")

  function handleSearch() {
    if (!query.trim()) return
    router.push(`/exemplos`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div className="bg-ld-card rounded-xl p-2 md:p-3 shadow-[0_10px_40px_-10px_rgba(255,107,0,0.1)] max-w-4xl mx-auto w-full">
      <div className="flex gap-1 p-1 bg-ld-surface-variant/5 rounded-lg w-full md:w-fit mx-auto mb-4 overflow-x-auto">
        <button
          onClick={() => setTab("establishments")}
          className={`flex items-center justify-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-2.5 rounded-lg transition-all font-button-text text-xs md:text-button-text whitespace-nowrap flex-1 md:flex-none ${
            tab === "establishments"
              ? "bg-gradient-to-r from-ld-primary-container to-orange-600 text-white"
              : "text-ld-on-secondary-container hover:bg-ld-surface-variant/10"
          }`}
        >
          <Building2 className="h-4 w-4 md:h-5 md:w-5" />
          Estabelecimentos
        </button>
        <button
          onClick={() => setTab("professionals")}
          className={`flex items-center justify-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-2.5 rounded-lg transition-all font-button-text text-xs md:text-button-text whitespace-nowrap flex-1 md:flex-none ${
            tab === "professionals"
              ? "bg-gradient-to-r from-ld-primary-container to-orange-600 text-white"
              : "text-ld-on-secondary-container hover:bg-ld-surface-variant/10"
          }`}
        >
          <User className="h-4 w-4 md:h-5 md:w-5" />
          Profissionais
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 px-2 pb-2">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-ld-on-secondary-container/60 transition-colors group-focus-within:text-ld-primary-container" />
          <Input
            className="pl-10 md:pl-12 border-white/15"
            placeholder="O que você está procurando?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex-1 w-full relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-ld-on-secondary-container/60 transition-colors group-focus-within:text-ld-primary-container" />
          <Input className="pl-10 md:pl-12" defaultValue="Araruama, RJ" readOnly />
        </div>
        <Button variant="primary" className="w-full md:w-auto" onClick={handleSearch}>
          Buscar
        </Button>
      </div>
    </div>
  )
}
