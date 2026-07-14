"use client"

import { usePathname } from "next/navigation"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { UsersIcon, ScissorsIcon, CreditCardIcon, BriefcaseIcon } from "lucide-react"
import Link from "next/link"

const navItems = [
  { title: "Clientes", href: "/clientes", icon: UsersIcon },
  { title: "Barbeiros", href: "/barbeiros", icon: ScissorsIcon },
  { title: "Planos", href: "/planos", icon: CreditCardIcon },
  { title: "Serviços", href: "/servicos", icon: BriefcaseIcon },
]

export function AppSidebar({
  user,
  company,
}: {
  user: { name: string; email: string; avatar: string }
  company: { name: string; logo: string | null; slug: string } | null
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="bg-white dark:bg-zinc-950">
      <SidebarHeader>
        <TeamSwitcher company={company} />
      </SidebarHeader>
      <SidebarContent>
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0`}
              >
                <item.icon className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </Link>
            )
          })}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
