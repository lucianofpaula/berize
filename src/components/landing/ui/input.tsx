import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-lg bg-ld-surface-variant/5 border border-transparent px-4 py-4 font-body-md text-body-md text-ld-foreground outline-none transition-all placeholder:text-ld-muted-foreground/60 focus:border-ld-primary-container focus:ring-4 focus:ring-ld-accent-glow disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
