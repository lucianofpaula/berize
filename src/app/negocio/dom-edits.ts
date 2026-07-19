export type EditEntry = {
  tag: string
  index: number
  text?: string
  style?: Record<string, string>
}

/** Aplica edições salvas a uma seção do preview */
export function reapplyEdits(wrapper: HTMLElement, edits: EditEntry[]) {
  for (const edit of edits) {
    const els = wrapper.querySelectorAll(edit.tag)
    const el = els[edit.index] as HTMLElement | undefined
    if (!el) continue
    // Não sobrescreve texto que o usuário está editando ativamente
    if (edit.text != null && !el.hasAttribute("data-edited")) {
      el.textContent = edit.text
    }
    if (edit.style) {
      for (const [prop, val] of Object.entries(edit.style)) {
        if (val) (el.style as any)[prop] = val
        else (el.style as any)[prop] = ""
      }
    }
  }
}

/** Captura edições de texto e estilos inline do DOM de uma seção */
export function captureEdits(wrapper: HTMLElement): EditEntry[] {
  const TEXT_TAGS = ["h1","h2","h3","h4","h5","h6","p","span","strong","em","blockquote","small","li","label"]
  const edits: EditEntry[] = []

  for (const tag of TEXT_TAGS) {
    const els = wrapper.querySelectorAll(tag)
    els.forEach((el, index) => {
      const htmlEl = el as HTMLElement
      const hasInlineStyle = htmlEl.hasAttribute("style")
      const wasEdited = htmlEl.getAttribute("data-edited") === "true"
      if (!hasInlineStyle && !wasEdited) return

      const text = htmlEl.textContent?.trim()
      if (!text) return

      const style: Record<string, string> = {}
      const s = htmlEl.style
      if (s.color) style.color = s.color
      if (s.fontSize) style.fontSize = s.fontSize
      if (s.fontWeight) style.fontWeight = s.fontWeight
      if (s.fontStyle) style.fontStyle = s.fontStyle

      edits.push({ tag, index, text, ...(Object.keys(style).length ? { style } : {}) })
    })
  }

  return edits
}
