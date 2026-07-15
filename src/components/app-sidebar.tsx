"use client"

import { usePathname } from "next/navigation"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { UsersIcon, ScissorsIcon, CreditCardIcon, BriefcaseIcon, CalendarIcon, ListIcon, ChevronDownIcon, Building2Icon, SettingsIcon, GlobeIcon, BotIcon, ShoppingCartIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const navItems = [
  { title: "Clientes", href: "/clientes", icon: UsersIcon },
  { title: "Barbeiros", href: "/barbeiros", icon: ScissorsIcon },
  { title: "Planos", href: "/planos", icon: CreditCardIcon },
  { title: "Serviços", href: "/servicos", icon: BriefcaseIcon },
]

const agendamentosSub = [
  { title: "Agenda", href: "/agendamentos/agenda", icon: CalendarIcon },
  { title: "Fila", href: "/agendamentos/fila", icon: ListIcon },
]

const negocioSub = [
  { title: "Configuração", href: "/negocio/configuracao", icon: SettingsIcon },
  { title: "Website", href: "/negocio/website", icon: GlobeIcon },
  { title: "Meios de Pagamento", href: "/negocio/pagamentos", icon: CreditCardIcon },
  { title: "Commerce Hub", href: "/negocio/commerce", icon: ShoppingCartIcon },
  { title: "Agente de IA", href: "/negocio/agente-ia", icon: BotIcon },
]

export function AppSidebar({
  user,
  company,
}: {
  user: { name: string; email: string; avatar: string }
  company: { name: string; logo: string | null; slug: string } | null
}) {
  const pathname = usePathname()
  const agendamentosActive = pathname.startsWith("/agendamentos")
  const negocioActive = pathname.startsWith("/negocio")
  const [open, setOpen] = useState(agendamentosActive)
  const [negocioOpen, setNegocioOpen] = useState(negocioActive)

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

          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${
                agendamentosActive
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <CalendarIcon className="size-4 shrink-0" />
              <span className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                Agendamentos
              </span>
              <ChevronDownIcon
                className={`size-3 transition-transform group-data-[collapsible=icon]:hidden ${
                  open ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-2 flex flex-col gap-0.5 border-l border-zinc-200 dark:border-zinc-800 pl-3 group-data-[collapsible=icon]:hidden">
                {agendamentosSub.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all ${
                        active
                          ? "bg-orange-500/50 text-white font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <item.icon className="size-3.5 shrink-0" />
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="mt-3 mb-1 px-3 group-data-[collapsible=icon]:hidden">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Negócio
            </p>
          </div>

          <Collapsible open={negocioOpen} onOpenChange={setNegocioOpen}>
            <CollapsibleTrigger
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${
                negocioActive
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Building2Icon className="size-4 shrink-0" />
              <span className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                Meu Negócio
              </span>
              <ChevronDownIcon
                className={`size-3 transition-transform group-data-[collapsible=icon]:hidden ${
                  negocioOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-2 flex flex-col gap-0.5 border-l border-zinc-200 dark:border-zinc-800 pl-3 group-data-[collapsible=icon]:hidden">
                {negocioSub.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all ${
                        active
                          ? "bg-orange-500/50 text-white font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <item.icon className="size-3.5 shrink-0" />
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-0.5 p-1">
          <ThemeToggle />
        </div>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
