import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const user = {
    name: session.user.name ?? "Sem nome",
    email: session.user.email ?? "",
    avatar: session.user.image ?? "",
  }

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: { name: true, logo: true, slug: true },
  })

  return (
    <SidebarProvider>
      <AppSidebar user={user} company={company} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <BreadcrumbNav />
          </div>
        </header>
        <div className="flex flex-1 flex-col bg-gray-100 dark:bg-zinc-950">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
