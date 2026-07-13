"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma `toggle` set (2010:3650): Variant=outline|ghost × Active.
// Active maps to Base UI's pressed state (`data-pressed`) — not a styling prop;
// only `disabled` is a real prop. Reuses the secondary-button Layer-3 tokens.
const toggleVariants = cva(
  [
    "group/toggle inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap border transition-colors outline-none cursor-pointer",
    "[color:var(--ds-button-secondary-content)]",
    "hover:[background-color:var(--ds-button-secondary-fillhover)]",
    "data-[pressed]:[background-color:var(--ds-button-secondary-fillactive)]",
    "focus-visible:[border-color:var(--ds-color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        outline: "[border-color:var(--ds-button-secondary-border)]",
        ghost: "border-transparent",
      },
      size: {
        sm: "[height:var(--ds-button-size-sm-height)] [padding-inline:var(--ds-button-size-sm-paddingx)] [border-radius:var(--ds-button-size-sm-radius)] [font-size:var(--ds-button-size-sm-fontsize)] [&_svg]:size-3.5",
        md: "[height:var(--ds-button-size-md-height)] [padding-inline:var(--ds-button-size-md-paddingx)] [border-radius:var(--ds-button-size-md-radius)] [font-size:var(--ds-button-size-md-fontsize)] [&_svg]:size-4",
        lg: "[height:var(--ds-button-size-lg-height)] [padding-inline:var(--ds-button-size-lg-paddingx)] [border-radius:var(--ds-button-size-lg-radius)] [font-size:var(--ds-button-size-lg-fontsize)] [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
