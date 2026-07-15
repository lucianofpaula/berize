"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

function PopoverTrigger({
  className,
  ...props
}: PopoverPrimitive.Trigger.Props) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      className={cn("cursor-default", className)}
      {...props}
    />
  )
}

function PopoverPositioner({
  className,
  ...props
}: PopoverPrimitive.Positioner.Props) {
  return (
    <PopoverPrimitive.Positioner
      data-slot="popover-positioner"
      className={cn("outline-none", className)}
      {...props}
    />
  )
}

function PopoverPopup({
  className,
  ...props
}: PopoverPrimitive.Popup.Props) {
  return (
    <PopoverPrimitive.Popup
      data-slot="popover-popup"
      className={cn(
        "z-50 min-w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-lg outline-none",
        "origin-[var(--transform-origin)] transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  )
}

function PopoverArrow({
  className,
  ...props
}: PopoverPrimitive.Arrow.Props) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className={cn("fill-zinc-200 dark:fill-zinc-800", className)}
      {...props}
    />
  )
}

function Popover({
  open,
  onOpenChange,
  modal = true,
  ...props
}: PopoverPrimitive.Root.Props) {
  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverPositioner,
  PopoverPopup,
  PopoverArrow,
}
