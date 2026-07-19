"use client"

import { useState, useEffect, useRef } from "react"
import { Bold, Italic, X, Palette, BoxSelect, Trash2, Move } from "lucide-react"

type Props = {
  element: HTMLElement
  position: { x: number; y: number }
  onClose: () => void
  onDeleteElement?: (el: HTMLElement) => void
  onMoveElement?: (el: HTMLElement) => void
}

const PRESET_COLORS = [
  "#FFFFFF", "#F4F4F5", "#E4E4E7", "#A1A1AA", "#71717A", "#52525B",
  "#27272A", "#18181B", "#09090B", "#000000",
  "#F59E0B", "#D97706", "#B45309",
  "#783F1D", "#C8673C", "#A15C33",
  "#FF6B35", "#7C3AED", "#1E3A5F", "#FFD700",
]

const BORDER_PRESETS = ["#FFFFFF", "#A1A1AA", "#71717A", "#52525B", "#27272A", "#000000", "#F59E0B", "#D97706", "#7C3AED"]

function rgbToHex(rgb: string) {
  const m = rgb.match(/\d+/g)
  if (!m) return "#ffffff"
  const r = parseInt(m[0]), g = parseInt(m[1]), b = parseInt(m[2])
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}

export default function FloatingToolbar({ element, position, onClose, onDeleteElement, onMoveElement }: Props) {
  const isAdded = !!element.closest(".added-element")
  const [color, setColor] = useState("#ffffff")
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [fontSizePx, setFontSizePx] = useState(16)
  const [hasBorder, setHasBorder] = useState(false)
  const [borderColor, setBorderColor] = useState("#ffffff")
  const [borderWidth, setBorderWidth] = useState(1.5)
  const initialized = useRef(false)

  useEffect(() => {
    const computed = getComputedStyle(element)
    setColor(rgbToHex(computed.color))
    setBold(computed.fontWeight === "700" || computed.fontWeight === "bold")
    setItalic(computed.fontStyle === "italic")
    setFontSizePx(Math.round(parseFloat(computed.fontSize)))
    const bw = element.style.borderWidth
    if (bw && bw !== "0px" && bw !== "") {
      setHasBorder(true)
      setBorderWidth(parseFloat(bw))
      setBorderColor(rgbToHex(computed.borderColor))
    } else {
      setHasBorder(false)
    }
    initialized.current = true
  }, [element])

  function handleColor(v: string) {
    setColor(v)
    if (!initialized.current) return
    element.style.color = v
  }
  function handleBold() {
    const v = !bold
    setBold(v)
    if (initialized.current) element.style.fontWeight = v ? "700" : ""
  }
  function handleItalic() {
    const v = !italic
    setItalic(v)
    if (initialized.current) element.style.fontStyle = v ? "italic" : ""
  }
  function handleFontSize(v: number) {
    setFontSizePx(v)
    if (initialized.current) element.style.fontSize = v + "px"
  }
  function handleBorder() {
    const v = !hasBorder
    setHasBorder(v)
    if (!initialized.current) return
    if (v) {
      element.style.border = `${borderWidth}px solid ${borderColor}`
    } else {
      element.style.border = "none"
    }
  }
  function handleBorderColor(v: string) {
    setBorderColor(v)
    if (!initialized.current) return
    element.style.borderColor = v
  }
  function handleBorderWidth(v: number) {
    setBorderWidth(v)
    if (!initialized.current) return
    element.style.borderWidth = v + "px"
  }

  const x = Math.min(position.x, window.innerWidth - 340)
  const y = Math.max(8, position.y - 56)

  return (
    <div
      data-floating-toolbar
      className="fixed z-[100] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl"
      style={{ left: x, top: y }}
    >
      {/* Linha 1: controles principais */}
      <div className="flex items-center gap-1 px-2 py-1.5">
        <button onClick={onClose} className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-5 bg-zinc-800 mx-0.5" />

        <input
          type="color"
          value={color}
          onChange={(e) => handleColor(e.target.value)}
          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 p-0.5"
          title="Cor personalizada"
        />

        <div className="w-px h-5 bg-zinc-800 mx-0.5" />

        <div className="flex items-center gap-1">
          <input
            type="range"
            min={10}
            max={128}
            value={fontSizePx}
            onChange={(e) => handleFontSize(Number(e.target.value))}
            className="w-20 h-1.5 accent-amber-500 cursor-pointer"
            title="Tamanho da fonte"
          />
          <span className="text-[10px] text-zinc-400 w-6 text-right tabular-nums">{fontSizePx}</span>
        </div>

        <div className="w-px h-5 bg-zinc-800 mx-0.5" />

        <button
          onClick={handleBold}
          className={`p-1.5 rounded transition-colors ${bold ? "bg-amber-500/20 text-amber-500" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"}`}
          title="Negrito"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleItalic}
          className={`p-1.5 rounded transition-colors ${italic ? "bg-amber-500/20 text-amber-500" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"}`}
          title="Itálico"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-5 bg-zinc-800 mx-0.5" />

        <button
          onClick={handleBorder}
          className={`p-1.5 rounded transition-colors ${hasBorder ? "bg-amber-500/20 text-amber-500" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"}`}
          title="Borda"
        >
          <BoxSelect className="w-3.5 h-3.5" />
        </button>

        {!isAdded && (
          <>
            <div className="w-px h-5 bg-zinc-800 mx-0.5" />
            <button
              onClick={() => onDeleteElement?.(element)}
              className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors"
              title="Excluir elemento"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onMoveElement?.(element)}
              className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              title="Mover elemento"
            >
              <Move className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Linha 2: paleta de cores pré-definidas */}
      <div className="flex items-center gap-1 px-2 pb-2">
        <Palette className="w-3 h-3 text-zinc-500 shrink-0" />
        <div className="flex gap-0.5 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => handleColor(c)}
              className="w-4 h-4 rounded-full border border-zinc-700 hover:scale-125 transition-transform shrink-0"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Linha 3: controles da borda (só aparece quando borda está ativa) */}
      {hasBorder && (
        <div className="flex items-center gap-1 px-2 pb-2 border-t border-zinc-800 pt-1.5">
          <BoxSelect className="w-3 h-3 text-zinc-500 shrink-0" />
          <input
            type="color"
            value={borderColor}
            onChange={(e) => handleBorderColor(e.target.value)}
            className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0.5"
            title="Cor da borda"
          />
          <div className="flex gap-0.5">
            {BORDER_PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => handleBorderColor(c)}
                className="w-3.5 h-3.5 rounded-full border border-zinc-600 hover:scale-125 transition-transform shrink-0"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
          <div className="w-px h-4 bg-zinc-800 mx-0.5" />
          <input
            type="range"
            min={0.5}
            max={8}
            step={0.5}
            value={borderWidth}
            onChange={(e) => handleBorderWidth(Number(e.target.value))}
            className="w-16 h-1.5 accent-amber-500 cursor-pointer"
            title="Espessura da borda"
          />
          <span className="text-[10px] text-zinc-400 w-6 text-right tabular-nums">{borderWidth}px</span>
        </div>
      )}
    </div>
  )
}
