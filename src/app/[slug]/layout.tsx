import { SessionProvider } from "@/components/landing/session-provider"

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
