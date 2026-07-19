import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-label-sm text-label-sm px-3 py-1 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-ld-primary text-ld-primary-foreground",
        secondary: "bg-ld-secondary text-ld-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-ld-border-subtle text-ld-foreground",
        primary: "bg-ld-primary-container text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
