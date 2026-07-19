"use client"

import { useState, useCallback } from "react"
import type { WebsiteSection } from "./website-types"
import { SECTION_LABELS } from "./website-types"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, GripVertical } from "lucide-react"
import {
  HeroForm,
  AboutForm,
  ServicesForm,
  TeamForm,
  GalleryForm,
  TestimonialsForm,
  HoursForm,
  ContactForm,
  BookingForm,
  TeamCarouselForm,
  FullPageForm,
} from "./website-section-forms"

type Props = {
  sections: WebsiteSection[]
  onChange: (sections: WebsiteSection[]) => void
}

export default function WebsiteEditorPanel({ sections, onChange }: Props) {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  const updateSection = useCallback(
    (idx: number, updated: WebsiteSection) => {
      const next = [...sections]
      next[idx] = updated
      onChange(next)
    },
    [sections, onChange]
  )

  const toggleEnabled = useCallback(
    (idx: number) => {
      const next = [...sections]
      next[idx] = { ...next[idx], enabled: !next[idx].enabled }
      onChange(next)
    },
    [sections, onChange]
  )

  const handleDragStart = (idx: number) => {
    setDragIdx(idx)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const next = [...sections]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(idx, 0, moved)
    onChange(next)
    setDragIdx(idx)
  }

  const handleDragEnd = () => {
    setDragIdx(null)
  }

  // Helper to determine which form component to render
  const renderForm = (section: WebsiteSection, idx: number) => {
    const props = {
      section,
      onChange: (updated: WebsiteSection) => updateSection(idx, updated),
    }
    switch (section.type) {
      case "hero":
        return <HeroForm {...props} />
      case "about":
        return <AboutForm {...props} />
      case "services":
        return <ServicesForm {...props} />
      case "team":
        return <TeamForm {...props} />
      case "team-carousel":
        return <TeamCarouselForm {...props} />
      case "gallery":
        return <GalleryForm {...props} />
      case "testimonials":
        return <TestimonialsForm {...props} />
      case "hours":
        return <HoursForm {...props} />
      case "contact":
        return <ContactForm {...props} />
      case "booking":
        return <BookingForm {...props} />
      case "full-page":
        return <FullPageForm {...props} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-2 max-h-full overflow-y-auto pr-1">
      {sections.map((section, idx) => (
        <div
          key={section.id}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDragEnd={handleDragEnd}
          className={`rounded-lg border transition-colors ${
            dragIdx === idx ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20" : "border-zinc-200 dark:border-zinc-700"
          }`}
        >
          <Collapsible
            open={openSection === section.id}
            onOpenChange={(open) => setOpenSection(open ? section.id : null)}
          >
            <div className="flex items-center gap-2 px-3 py-2.5">
              <div className="cursor-grab text-zinc-400 hover:text-zinc-600">
                <GripVertical className="w-4 h-4" />
              </div>
              <CollapsibleTrigger className="flex-1 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                  {SECTION_LABELS[section.type]}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform ${
                    openSection === section.id ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <Switch
                checked={section.enabled}
                onCheckedChange={() => toggleEnabled(idx)}
                className="shrink-0"
              />
            </div>
            <CollapsibleContent>
              <div className="px-3 pb-3 pt-1 border-t border-zinc-100 dark:border-zinc-700">
                {renderForm(section, idx)}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
    </div>
  )
}
