import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import dynamic from "next/dynamic"
import "./globals.css"

const ThemeProvider = dynamic(
  () => import("next-themes").then((m) => m.ThemeProvider),
  { ssr: false },
)

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Berize",
  description: "Painel de gestão",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
