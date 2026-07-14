"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, GlobeIcon, DatabaseIcon, Building2Icon } from "lucide-react"

export function TeamSwitcher({
  company,
}: {
  company: { name: string; logo: string | null; slug: string } | null
}) {
  const { isMobile, state } = useSidebar()
  const [open, setOpen] = useState(false)

  const name = company?.name ?? "Sem empresa"
  const logo = company?.logo
  const collapsed = state === "collapsed"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs ring-sidebar-ring outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!">
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {logo ? (
                <img src={logo} alt={name} className="size-6 rounded" />
              ) : (
                <Building2Icon className="size-5" />
              )}
            </div>
            <div className={`grid flex-1 text-left text-sm leading-tight ${collapsed ? "hidden" : ""}`}>
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs">Enterprise</span>
            </div>
            <ChevronsUpDownIcon className={`ml-auto size-4 shrink-0 ${collapsed ? "hidden" : ""}`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Menu
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <GlobeIcon className="size-4" />
              Web Site
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DatabaseIcon className="size-4" />
              Dados
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
