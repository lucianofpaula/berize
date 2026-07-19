import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/components/landing/session-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Check if the user has access to the barbearia panel:
  // - must own a company OR be a TenantMember with role OWNER
  const [ownedCompany, memberCompany] = await Promise.all([
    prisma.company.findFirst({
      where: { ownerId: session.user.id },
      select: { name: true, logo: true, slug: true },
    }),
    prisma.tenantMember.findFirst({
      where: { userId: session.user.id, role: "OWNER" },
      include: {
        company: { select: { name: true, logo: true, slug: true } },
      },
    }),
  ])

  const company = ownedCompany ?? memberCompany?.company ?? null

  if (!company) {
    redirect("/")
  }

  const user = {
    name: session.user.name ?? "Sem nome",
    email: session.user.email ?? "",
    avatar: session.user.image ?? "",
  };

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
          <SessionProvider>{children}</SessionProvider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
