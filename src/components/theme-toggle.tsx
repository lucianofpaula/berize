"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { state } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const collapsed = state === "collapsed"

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className={`flex items-center ${collapsed ? "justify-center size-8" : "gap-3 px-3 py-2"}`}>
        <div className="size-4" />
      </div>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`flex w-full items-center rounded-lg text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
        collapsed ? "justify-center size-8 p-2" : "gap-3 px-3 py-2"
      }`}
      title={isDark ? "Modo claro" : "Modo escuro"}
    >
      {isDark ? <SunIcon className="size-4 shrink-0" /> : <MoonIcon className="size-4 shrink-0" />}
      <span className={`${collapsed ? "hidden" : ""}`}>
        {isDark ? "Modo claro" : "Modo escuro"}
      </span>
    </button>
  )
}
