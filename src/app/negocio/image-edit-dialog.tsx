"use client"

import { useState, useRef } from "react"
import { X, Upload, Link } from "lucide-react"
import { toast } from "sonner"

type Props = {
  element: HTMLElement
  onUpdate: (newSrc: string) => void
  onClose: () => void
}

export default function ImageEditDialog({ element, onUpdate, onClose }: Props) {
  const currentSrc = element.getAttribute("src") || ""
  const [url, setUrl] = useState(currentSrc)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) {
        setUrl(data.url)
        toast.success("Imagem enviada!")
      } else {
        toast.error("Erro ao enviar imagem.")
      }
    } catch {
      toast.error("Erro ao enviar imagem.")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-200">Alterar Imagem</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preview */}
        <div className="mb-3 rounded-lg overflow-hidden bg-zinc-800 h-28 flex items-center justify-center">
          {url ? (
            <img src={url} alt="preview" className="max-w-full max-h-full object-contain" />
          ) : (
            <span className="text-xs text-zinc-500">Sem imagem</span>
          )}
        </div>

        {/* URL input */}
        <div className="mb-3">
          <label className="text-[10px] text-zinc-500 uppercase tracking-wide flex items-center gap-1 mb-1">
            <Link className="w-3 h-3" /> URL da imagem
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-2 py-1.5 text-xs bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Upload */}
        <div className="mb-3">
          <label className="text-[10px] text-zinc-500 uppercase tracking-wide flex items-center gap-1 mb-1">
            <Upload className="w-3 h-3" /> Upload
          </label>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full px-2 py-1.5 text-xs bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-50"
          >
            {uploading ? "Enviando..." : "Selecionar arquivo"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(url)}
            disabled={!url || url === currentSrc}
            className="flex-1 px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors disabled:opacity-50"
          >
            Aplicar
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
