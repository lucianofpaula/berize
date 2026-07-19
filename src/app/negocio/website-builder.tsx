"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { WebsiteData, WebsiteSection } from "./website-types"
import { DEFAULT_SECTIONS } from "./website-types"
import WebsitePreview from "./website-preview"
import WebsiteEditorPanel from "./website-editor-panel"
import TemplateGallery from "./template-gallery"
import { applyTemplateData, getTemplateById } from "./templates"
import type { Template } from "./templates"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Smartphone, Monitor, Globe, LayoutTemplate } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import FloatingToolbar from "./floating-toolbar"
import SectionToolbar from "./section-toolbar"
import ImageEditDialog from "./image-edit-dialog"
import { captureEdits } from "./dom-edits"

type Props = {
  companyName: string
  companySlug: string
  companyDescription: string | null
  companyPhone: string | null
  companyWhatsapp: string | null
  companyEmail: string | null
  companyAddress: Record<string, string> | null
  companySocialMedia: Record<string, string> | null
  services: { name: string; price: number | null }[]
  barbers: { name: string; image: string | null }[]
  hours: { dayOfWeek: number; openTime: string | null; closeTime: string | null; isOpen: boolean }[]
}

export default function WebsiteBuilder({
  companyName, companySlug, companyDescription, companyPhone, companyWhatsapp, companyEmail,
  companyAddress, companySocialMedia, services, barbers, hours,
}: Props) {
  const [data, setData] = useState<WebsiteData>({ enabled: false, sections: DEFAULT_SECTIONS })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 })
  const [sectionMenuTarget, setSectionMenuTarget] = useState<string | null>(null)
  const [sectionMenuPos, setSectionMenuPos] = useState({ x: 0, y: 0 })
  const [lastAddedSection, setLastAddedSection] = useState<string | null>(null)
  const [clickedElement, setClickedElement] = useState<HTMLElement | null>(null)
  const [imageEditTarget, setImageEditTarget] = useState<HTMLElement | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLElement | null>(null)
  const snapshotRef = useRef<WebsiteSection[] | null>(null)
  const { setOpen } = useSidebar()

  const takeSnapshot = useCallback(() => {
    snapshotRef.current = JSON.parse(JSON.stringify(data.sections))
  }, [data.sections])

  const undo = useCallback(() => {
    if (!snapshotRef.current) return
    setData((prev) => ({ ...prev, sections: snapshotRef.current! }))
    snapshotRef.current = null
    toast.success("Ação desfeita!")
    setSelectedElement(null)
    setSectionMenuTarget(null)
    setClickedElement(null)
    setImageEditTarget(null)
  }, [])

  // Refs para acessar takeSnapshot/undo dentro do useEffect sem recriar listeners
  const takeSnapshotRef = useRef(takeSnapshot)
  takeSnapshotRef.current = takeSnapshot
  const undoRef = useRef(undo)
  undoRef.current = undo

  useEffect(() => {
    setOpen(false)
    fetch("/api/website")
      .then((r) => r.json())
      .then((json) => {
        if (json.sections) {
          setData({ enabled: json.enabled, sections: json.sections })
          setIsNew(json.isNew ?? false)
        }
      })
      .catch(() => toast.error("Erro ao carregar website"))
      .finally(() => setLoading(false))
  }, [setOpen])

  const updateSections = useCallback((sections: WebsiteSection[]) => {
    setData((prev) => ({ ...prev, sections }))
  }, [])

  const save = useCallback(async () => {
    setSaving(true)
    try {
      // Captura edições do DOM e mescla no payload (sem setData para evitar flash)
      const sections = data.sections.map((s) => {
        const wrapper = previewRef.current?.querySelector(`[data-section-id="${s.id}"]`)
        if (!wrapper) return s
        const edits = captureEdits(wrapper as HTMLElement)
        const hasHtml = !!(s.content as Record<string, unknown>)._html
        return {
          ...s,
          content: {
            ...s.content,
            ...(edits.length ? { _edits: edits } : {}),
            ...(hasHtml ? { _html: wrapper.innerHTML } : {}),
          },
        }
      })
      const payload = { ...data, sections }

      const res = await fetch("/api/website", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success("Website salvo com sucesso!")
    } catch {
      toast.error("Erro ao salvar website")
    } finally {
      setSaving(false)
    }
  }, [data])

  const handleTemplateSelect = useCallback((template: Template) => {
    const sections = applyTemplateData(template, {
      name: companyName,
      description: companyDescription,
      phone: companyPhone,
      whatsapp: companyWhatsapp,
      email: companyEmail,
      address: companyAddress,
      socialMedia: companySocialMedia,
      services,
      barbers,
      hours,
    })
    setData({ enabled: true, sections })
    setIsNew(false)
    toast.success(`Template "${template.name}" aplicado!`)
  }, [companyName, companyDescription, companyPhone, companyWhatsapp, companyEmail, companyAddress, companySocialMedia, services, barbers, hours])

  // Extrai o HTML efetivo de dentro da seção (ignora o wrapper .section-html)
  const getEffectiveHtml = useCallback((sectionId: string): string => {
    const wrapper = previewRef.current?.querySelector(`[data-section-id="${sectionId}"]`)
    if (!wrapper) return ""
    const sectionHtmlDiv = wrapper.querySelector(":scope > .section-html") as HTMLElement | null
    return sectionHtmlDiv ? sectionHtmlDiv.innerHTML : wrapper.innerHTML
  }, [])

  const handleAddElement = useCallback((sectionId: string, type: string) => {
    const wrapper = previewRef.current?.querySelector(`[data-section-id="${sectionId}"]`)
    if (!wrapper) return

    const wrapperRect = wrapper.getBoundingClientRect()
    const relX = sectionMenuPos.x - wrapperRect.left
    const relY = sectionMenuPos.y - wrapperRect.top

    const innerHtml: Record<string, string> = {
      text: '<p data-edited="true" data-added="true" class="text-base text-zinc-700 leading-relaxed m-0">Novo texto</p>',
      heading: '<h2 data-edited="true" data-added="true" class="text-3xl font-bold text-zinc-900 tracking-tight m-0">Novo título</h2>',
      badge: '<span data-edited="true" data-added="true" class="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full">Novo badge</span>',
      button: '<button data-edited="true" data-added="true" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-sm transition-all">Novo botão</button>',
      divider: '<hr data-edited="true" data-added="true" class="border-t border-zinc-200 my-0 w-full" />',
    }

    const content = innerHtml[type]
    if (!content) return

    const elementHtml = `<div class="added-element" style="position:absolute;left:${relX}px;top:${relY}px;z-index:10;display:inline-block">
      <div class="drag-handle" style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);width:24px;height:16px;display:flex;align-items:center;justify-content:center;cursor:grab;background:rgba(245,158,11,0.85);border-radius:4px;color:#fff;font-size:10px;line-height:1;user-select:none;box-shadow:0 1px 3px rgba(0,0,0,0.3)">⠿</div>
      <button data-added-remove style="position:absolute;top:-14px;right:50%;margin-right:14px;width:16px;height:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(239,68,68,0.85);border-radius:4px;color:#fff;font-size:10px;line-height:1;border:none;padding:0">✕</button>
      ${content}
    </div>`

    // Constrói o _html sem injeção direta no DOM (evita duplicação)
    const currentHtml = getEffectiveHtml(sectionId)
    const newHtml = currentHtml + elementHtml

    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, content: { ...s.content, _html: newHtml } }
          : s
      ),
    }))
    setLastAddedSection(sectionId)
    setSectionMenuTarget(null)
    toast.success(`${type === "text" ? "Texto" : type === "heading" ? "Título" : type === "badge" ? "Badge" : type === "button" ? "Botão" : "Linha"} adicionado!`)
  }, [sectionMenuPos, getEffectiveHtml])

  // Exclui um elemento do template (remove do DOM e persiste via _html)
  const handleDeleteTemplateElement = useCallback((el: HTMLElement) => {
    const sectionId = el.closest("[data-section-id]")?.getAttribute("data-section-id")
    if (!sectionId) return
    takeSnapshot()
    el.remove()
    setClickedElement(null)
    setSectionMenuTarget(null)

    const wrapper = previewRef.current?.querySelector(`[data-section-id="${sectionId}"]`)
    if (!wrapper) return
    const sectionHtmlDiv = wrapper.querySelector(":scope > .section-html") as HTMLElement | null
    const effectiveHtml = sectionHtmlDiv ? sectionHtmlDiv.innerHTML : wrapper.innerHTML
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId
          ? { ...s, content: { ...s.content, _html: effectiveHtml } }
          : s
      ),
    }))
    toast("Elemento removido!", { action: { label: "Desfazer", onClick: () => undo() } })
  }, [takeSnapshot, undo])

  // Ativa modo arrasto para elemento do template
  const handleMoveTemplateElement = useCallback((el: HTMLElement) => {
    const origCursor = el.style.cursor
    el.style.cursor = "grab"
    el.style.userSelect = "none"
    setClickedElement(null)
    setSectionMenuTarget(null)

    const match = el.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)
    const origX = match ? parseFloat(match[1]) : 0
    const origY = match ? parseFloat(match[2]) : 0

    const onSelfMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      el.style.cursor = "grabbing"
      const startX = e.clientX
      const startY = e.clientY

      const onMove = (ev: MouseEvent) => {
        ev.preventDefault()
        const dx = ev.clientX - startX
        const dy = ev.clientY - startY
        el.style.transform = `translate(${origX + dx}px, ${origY + dy}px)`
      }

      const onUp = () => {
        el.style.cursor = origCursor || ""
        el.style.userSelect = ""
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
        el.removeEventListener("mousedown", onSelfMouseDown)
        // Persiste posição capturando _html
        const sectionId = el.closest("[data-section-id]")?.getAttribute("data-section-id")
        if (sectionId) {
          const wrapper = previewRef.current?.querySelector(`[data-section-id="${sectionId}"]`)
          if (wrapper) {
            const sectionHtmlDiv = wrapper.querySelector(":scope > .section-html") as HTMLElement | null
            const effectiveHtml = sectionHtmlDiv ? sectionHtmlDiv.innerHTML : wrapper.innerHTML
            setData((prev) => ({
              ...prev,
              sections: prev.sections.map((s) =>
                s.id === sectionId
                  ? { ...s, content: { ...s.content, _html: effectiveHtml } }
                  : s
              ),
            }))
          }
        }
      }

      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
      el.removeEventListener("mousedown", onSelfMouseDown)
    }

    el.addEventListener("mousedown", onSelfMouseDown)
  }, [])

  // Abre diálogo para alterar imagem
  const handleChangeImage = useCallback((el: HTMLElement) => {
    setImageEditTarget(el)
    setClickedElement(null)
    setSectionMenuTarget(null)
  }, [])

  // Fecha diálogo de imagem e persiste alteração
  const handleImageUpdate = useCallback((newSrc: string) => {
    if (!imageEditTarget) return
    takeSnapshot()
    imageEditTarget.setAttribute("src", newSrc)
    const sectionId = imageEditTarget.closest("[data-section-id]")?.getAttribute("data-section-id")
    if (sectionId) {
      const wrapper = previewRef.current?.querySelector(`[data-section-id="${sectionId}"]`)
      if (wrapper) {
        const sectionHtmlDiv = wrapper.querySelector(":scope > .section-html") as HTMLElement | null
        const effectiveHtml = sectionHtmlDiv ? sectionHtmlDiv.innerHTML : wrapper.innerHTML
        setData((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId
              ? { ...s, content: { ...s.content, _html: effectiveHtml } }
              : s
          ),
        }))
      }
    }
    setImageEditTarget(null)
    toast("Imagem alterada!", { action: { label: "Desfazer", onClick: () => undo() } })
  }, [imageEditTarget, takeSnapshot, undo])

  const handleChangeTemplate = useCallback(() => {
    setIsNew(true)
    setData({ enabled: false, sections: DEFAULT_SECTIONS })
  }, [])

  // Sync ref and clear outline when selection changes
  useEffect(() => {
    if (selectedRef.current && selectedRef.current !== selectedElement) {
      selectedRef.current.style.outline = ""
      selectedRef.current.style.outlineOffset = ""
      selectedRef.current.style.cursor = ""
      selectedRef.current.removeAttribute("contenteditable")
    }
    selectedRef.current = selectedElement
  }, [selectedElement])

  // Auto-foco no elemento adicionado após render
  useEffect(() => {
    if (!lastAddedSection) return
    const wrapper = previewRef.current?.querySelector(`[data-section-id="${lastAddedSection}"]`)
    if (!wrapper) return
    const addedElements = wrapper.querySelectorAll(".added-element")
    const last = addedElements[addedElements.length - 1] as HTMLElement | undefined
    if (last) {
      previewRef.current?.querySelectorAll(".added-element.focused").forEach((el) => el.classList.remove("focused"))
      last.classList.add("focused")
    }
    setLastAddedSection(null)
  }, [lastAddedSection])

  // Text editing — detecta clique em texto no preview
  useEffect(() => {
    if (loading || isNew) return

    // Estilos para drag handles
    const styleEl = document.createElement("style")
    styleEl.textContent = ".added-element.focused .drag-handle,.added-element.focused [data-added-remove]{opacity:1;pointer-events:auto!important}.drag-handle,[data-added-remove]{opacity:0;pointer-events:none;transition:opacity 0.15s}"
    document.head.appendChild(styleEl)
    const preview = previewRef.current
    if (!preview) return

const TEXT_TAGS = new Set(["h1","h2","h3","h4","h5","h6","p","span","strong","em","blockquote","small","li","label"])
    const isEditableText = (el: HTMLElement) => {
      if (el.closest("[data-no-edit]")) return false
      const tag = el.tagName.toLowerCase()
      if (tag === "a" || tag === "button") return false
      return TEXT_TAGS.has(tag) && !!el.textContent?.trim()
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("[data-floating-toolbar]") || target.closest("[data-section-toolbar]") || target.closest(".drag-handle")) return
      if (!preview.contains(target)) { setSelectedElement(null); setSectionMenuTarget(null); setClickedElement(null); return }

      // Botão de excluir elemento adicionado
      if (target.closest("[data-added-remove]")) {
        const addedEl = target.closest(".added-element") as HTMLElement | null
        if (addedEl) {
          takeSnapshotRef.current()
          const sectionId = addedEl.closest("[data-section-id]")?.getAttribute("data-section-id")
          addedEl.remove()
          setSelectedElement(null)
          setSectionMenuTarget(null)
          if (sectionId) {
            const wrapper = preview.querySelector(`[data-section-id="${sectionId}"]`)
            if (wrapper) {
              const sectionHtmlDiv = wrapper.querySelector(":scope > .section-html") as HTMLElement | null
              const effectiveHtml = sectionHtmlDiv ? sectionHtmlDiv.innerHTML : wrapper.innerHTML
              setData((prev) => ({
                ...prev,
                sections: prev.sections.map((s) =>
                  s.id === sectionId
                    ? { ...s, content: { ...s.content, _html: effectiveHtml } }
                    : s
                ),
              }))
            }
          }
          toast("Elemento removido!", { action: { label: "Desfazer", onClick: () => undoRef.current() } })
        }
        return
      }

      // Foco no elemento adicionado (mostra alça de arrasto e botão de excluir)
      const parentAddedEl = target.closest(".added-element") as HTMLElement | null
      if (parentAddedEl) {
        preview.querySelectorAll(".added-element.focused").forEach((el) => el.classList.remove("focused"))
        parentAddedEl.classList.add("focused")
        if (!isEditableText(target)) {
          setSelectedElement(null)
          setSectionMenuTarget(null)
          setClickedElement(null)
          return
        }
        // Se for texto editável, cai no fluxo abaixo (abre toolbar de texto + mantém foco)
      }

      // Se for texto editável → toolbar de texto
      if (isEditableText(target)) {
        setSectionMenuTarget(null)
        setClickedElement(null)
        target.setAttribute("contenteditable", "true")
        target.setAttribute("data-edited", "true")
        target.focus()
        setSelectedElement(target)
        const rect = target.getBoundingClientRect()
        setToolbarPos({ x: rect.left + rect.width / 2, y: rect.top + window.scrollY })
        return
      }
      // Se for clique numa seção (não-texto) → toolbar de seção
      const sectionWrapper = target.closest("[data-section-id]") as HTMLElement | null
      if (sectionWrapper) {
        preview.querySelectorAll(".added-element.focused").forEach((el) => el.classList.remove("focused"))
        setSelectedElement(null)
        const id = sectionWrapper.getAttribute("data-section-id")
        if (id) {
          // Detecta elemento do template sob o cursor
          let contextEl: HTMLElement | null = null
          if (!target.closest(".added-element") && !isEditableText(target)) {
            // Usa o próprio target como elemento de contexto (img, div, etc.)
            // Exclui apenas o container principal (.section-html e filho direto do wrapper)
            const mainContainer = sectionWrapper.querySelector(":scope > .section-html, :scope > div")
            if (target !== sectionWrapper && target !== mainContainer) {
              contextEl = target
            }
          }
          setClickedElement(contextEl)
          setSectionMenuTarget(id)
          setSectionMenuPos({ x: e.clientX, y: e.clientY })
        }
        return
      }
      // Clique em área neutra do preview
      preview.querySelectorAll(".added-element.focused").forEach((el) => el.classList.remove("focused"))
      setSelectedElement(null)
      setSectionMenuTarget(null)
      setClickedElement(null)
    }

    // Drag dos elementos adicionados via section-toolbar
    const handleDragStart = (e: MouseEvent) => {
      const handle = (e.target as HTMLElement).closest(".drag-handle") as HTMLElement | null
      if (!handle) return
      e.preventDefault()
      const el = handle.closest(".added-element") as HTMLElement
      if (!el) return

      const startX = e.clientX
      const startY = e.clientY
      const origLeft = parseFloat(el.style.left) || 0
      const origTop = parseFloat(el.style.top) || 0
      const preview = previewRef.current

      const onMove = (ev: MouseEvent) => {
        if (!preview) return
        const previewRect = preview.getBoundingClientRect()
        const newLeft = origLeft + ev.clientX - startX
        const newTop = origTop + ev.clientY - startY
        el.style.left = Math.max(0, Math.min(newLeft, previewRect.width - 20)) + "px"
        el.style.top = Math.max(0, newTop) + "px"
      }

      const onUp = () => {
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
      }

      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    }

    document.addEventListener("mousedown", handleDragStart)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!preview.contains(target)) return
      if (isEditableText(target) && selectedRef.current !== target) {
        target.style.outline = "2px dashed rgba(245,158,11,0.4)"
        target.style.outlineOffset = "2px"
        target.style.cursor = "pointer"
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      target.style.outline = ""
      target.style.outlineOffset = ""
      target.style.cursor = ""
    }

    document.addEventListener("click", handleClick)
    preview.addEventListener("mouseover", handleMouseOver, true)
    preview.addEventListener("mouseout", handleMouseOut, true)

    return () => {
      styleEl.remove()
      document.removeEventListener("click", handleClick)
      document.removeEventListener("mousedown", handleDragStart)
      preview.removeEventListener("mouseover", handleMouseOver, true)
      preview.removeEventListener("mouseout", handleMouseOut, true)
    }
  }, [loading, isNew])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>
  }

  // Empty state — mostra galeria de templates
  if (isNew && !data.enabled) {
    return (
      <TemplateGallery
        onSelect={handleTemplateSelect}
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 shrink-0 bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch checked={data.enabled} onCheckedChange={(en) => setData((prev) => ({ ...prev, enabled: en }))} />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{data.enabled ? "Ativo" : "Inativo"}</span>
          </div>
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
          <button onClick={() => setMobile(false)} className={`p-1.5 rounded transition-colors ${!mobile ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-800" : "text-zinc-400 hover:text-zinc-600"}`}>
            <Monitor className="w-4 h-4" />
          </button>
          <button onClick={() => setMobile(true)} className={`p-1.5 rounded transition-colors ${mobile ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-800" : "text-zinc-400 hover:text-zinc-600"}`}>
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleChangeTemplate} title="Trocar template">
            <LayoutTemplate className="w-4 h-4 mr-1" />
            Templates
          </Button>
          <Button onClick={save} disabled={saving} size="sm">
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Salvar
          </Button>
        </div>
      </div>

      {/* Split content */}
      <div className="flex-1 flex gap-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
          <div
            ref={previewRef}
            className={`bg-white rounded-xl shadow-lg transition-all relative ${mobile ? "w-[375px] max-h-[812px] overflow-y-auto" : "w-full overflow-hidden"}`}
          >
            <WebsitePreview
              data={data}
              companyName={companyName}
              companySlug={companySlug}
              companyDescription={companyDescription}
              companyPhone={companyPhone}
              companyWhatsapp={companyWhatsapp}
              companyEmail={companyEmail}
              companyAddress={companyAddress}
              companySocialMedia={companySocialMedia}
              services={services}
              barbers={barbers}
              hours={hours}
            />
          </div>
          {selectedElement && (
            <FloatingToolbar
              element={selectedElement}
              position={toolbarPos}
              onClose={() => setSelectedElement(null)}
              onDeleteElement={handleDeleteTemplateElement}
              onMoveElement={handleMoveTemplateElement}
            />
          )}
          {sectionMenuTarget && (
            <SectionToolbar
              sectionId={sectionMenuTarget}
              position={sectionMenuPos}
              onAdd={handleAddElement}
              onClose={() => { setSectionMenuTarget(null); setClickedElement(null) }}
              element={clickedElement}
              onDeleteElement={handleDeleteTemplateElement}
              onMoveElement={handleMoveTemplateElement}
              onChangeImage={handleChangeImage}
            />
          )}
          {imageEditTarget && (
            <ImageEditDialog
              element={imageEditTarget}
              onUpdate={handleImageUpdate}
              onClose={() => setImageEditTarget(null)}
            />
          )}
        </div>
        <div className="w-80 border-l border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 overflow-y-auto shrink-0">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Seções do Site</h3>
          <p className="text-xs text-zinc-400 mb-4">Arraste para reordenar. Ative/desative cada seção.</p>
          <WebsiteEditorPanel sections={data.sections} onChange={updateSections} />
        </div>
      </div>
    </div>
  )
}
