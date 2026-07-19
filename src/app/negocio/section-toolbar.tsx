"use client"

import { Type, Heading, Hash, Square, Minus, X, Trash2, Move, ImageIcon } from "lucide-react"

type Props = {
  sectionId: string
  position: { x: number; y: number }
  onAdd: (sectionId: string, type: string) => void
  onClose: () => void
  element?: HTMLElement | null
  onDeleteElement?: (el: HTMLElement) => void
  onMoveElement?: (el: HTMLElement) => void
  onChangeImage?: (el: HTMLElement) => void
}

const ITEMS = [
  { type: "text", icon: Type, label: "Texto" },
  { type: "heading", icon: Heading, label: "Título" },
  { type: "badge", icon: Hash, label: "Badge" },
  { type: "button", icon: Square, label: "Botão" },
  { type: "divider", icon: Minus, label: "Linha" },
]

export default function SectionToolbar({ sectionId, position, onAdd, onClose, element, onDeleteElement, onMoveElement, onChangeImage }: Props) {
  const x = Math.min(position.x, window.innerWidth - 260)
  const y = Math.max(8, position.y - 50)
  const isImg = element?.tagName === "IMG"

  return (
    <div
      data-section-toolbar
      className="fixed z-[100] bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl px-2 py-1.5"
      style={{ left: x, top: y }}
    >
      {/* Element actions (template element context) */}
      {element && (
        <div className="flex items-center gap-0.5 pb-1.5 mb-1.5 border-b border-zinc-800">
          <button
            onClick={() => onDeleteElement?.(element)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-zinc-800 text-red-400 hover:text-red-300 transition-colors text-xs"
            title="Excluir elemento"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir</span>
          </button>
          <button
            onClick={() => onMoveElement?.(element)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-xs"
            title="Mover elemento"
          >
            <Move className="w-3.5 h-3.5" />
            <span>Mover</span>
          </button>
          {isImg && (
            <button
              onClick={() => onChangeImage?.(element)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-xs"
              title="Alterar imagem"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Imagem</span>
            </button>
          )}
        </div>
      )}
      {/* Add buttons */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-5 bg-zinc-800 mx-1" />
        {ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.type}
              onClick={() => onAdd(sectionId, item.type)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-xs"
              title={item.label}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
