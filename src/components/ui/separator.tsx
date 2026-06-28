import * as React from "react"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma `separator` set (449:1463): Direction × Spacing scale
// (0/4/8/12/16/24/32). The rule is 1px `--ds-color-border`; `spacing` adds equal
// margin on the cross axis (block for horizontal, inline for vertical), pulled
// from the `--ds-spacing-*` scale. Direction maps to Base UI's `orientation`.
const separatorVariants = cva(
  "shrink-0 [background-color:var(--ds-color-border)]",
  {
    variants: {
      orientation: {
        horizontal: "h-px w-full [margin-block:var(--sep-gap,var(--ds-spacing-0))]",
        vertical: "w-px min-h-4 self-stretch [margin-inline:var(--sep-gap,var(--ds-spacing-0))]",
      },
      spacing: {
        0: "[--sep-gap:var(--ds-spacing-0)]",
        4: "[--sep-gap:var(--ds-spacing-4)]",
        8: "[--sep-gap:var(--ds-spacing-8)]",
        12: "[--sep-gap:var(--ds-spacing-12)]",
        16: "[--sep-gap:var(--ds-spacing-16)]",
        24: "[--sep-gap:var(--ds-spacing-24)]",
        32: "[--sep-gap:var(--ds-spacing-32)]",
      },
    },
    defaultVariants: { orientation: "horizontal", spacing: 0 },
  }
)

type SeparatorProps = Omit<SeparatorPrimitive.Props, "orientation"> &
  VariantProps<typeof separatorVariants> & {
    decorative?: boolean
  }

function Separator({
  className,
  orientation = "horizontal",
  spacing,
  decorative = false,
  ...props
}: SeparatorProps) {
  const classes = cn(separatorVariants({ orientation, spacing }), className)
  if (decorative) {
    return (
      <div
        data-slot="separator"
        role="none"
        aria-hidden
        className={classes}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      />
    )
  }
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation ?? "horizontal"}
      className={classes}
      {...props}
    />
  )
}

export { Separator, separatorVariants }
