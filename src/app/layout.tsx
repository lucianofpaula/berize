import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"

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
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
