"use client"

import { useState } from "react"
import { PaletteIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CompanyConfigForm } from "@/app/configuracao/config-form"
import { PaletteForm } from "./palette-form"

type Address = {
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

type SocialMedia = {
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
}

type InitialData = {
  id: string
  name: string
  slug: string
  logo: string | null
  description: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: Address | null
  socialMedia: SocialMedia | null
  customDomain: string | null
  domainVerified: boolean
  timezone: string
  appointmentLeadTime: number
  appointmentInterval: number
  dailyAppointmentGoal: number
  dailyRevenueGoal: number
  loyaltyEnabled: boolean
  loyaltyStampsRequired: number
  loyaltyRewardDescription: string
  brandPalette: string
  hours: { id: string; dayOfWeek: number; openTime: string; closeTime: string; isOpen: boolean }[]
}

export function ConfigPageClient({ initialData }: { initialData: InitialData }) {
  const [tab, setTab] = useState("dados")

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="dados">Dados do negócio</TabsTrigger>
        <TabsTrigger value="cores">
          <PaletteIcon className="w-3.5 h-3.5 mr-1" />
          Estilo de cores
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dados">
        <CompanyConfigForm initialData={initialData} />
      </TabsContent>

      <TabsContent value="cores">
        <PaletteForm currentPalette={initialData.brandPalette ?? "classic"} />
      </TabsContent>
    </Tabs>
  )
}
