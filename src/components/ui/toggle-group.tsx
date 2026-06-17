"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma `toggle-group/button` (256 variants) and
// `toggle-group/icon-button` sets: Skin=ghost|outlined × Size × Position × Selected
// × State. A segmented control built on Base UI's ToggleGroup; Position
// (left/middle/right/single) is handled by the group's seam geometry rather than a
// prop. Skin/size flow to items via context. Selected → Base UI `data-pressed`.
const ToggleGroupContext = React.createContext<{
  skin: "ghost" | "outlined"
  size: "xs" | "sm" | "md" | "lg"
}>({ skin: "outlined", size: "md" })

const toggleGroupItemVariants = cva(
  [
    "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap border transition-colors outline-none cursor-pointer",
    "[color:var(--ds-button-secondary-content)]",
    "hover:[background-color:var(--ds-button-secondary-fillhover)]",
    "data-[pressed]:[background-color:var(--ds-button-secondary-fillactive)] data-[pressed]:z-10",
    "focus-visible:z-10 focus-visible:[border-color:var(--ds-color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      skin: {
        outlined: "[border-color:var(--ds-button-secondary-border)]",
        ghost: "border-transparent",
      },
      size: {
        xs: "[height:var(--ds-button-size-xs-height)] [padding-inline:var(--ds-button-size-xs-paddingx)] [border-radius:var(--ds-button-size-xs-radius)] [font-size:var(--ds-button-size-xs-fontsize)] [&_svg]:size-3",
        sm: "[height:var(--ds-button-size-sm-height)] [padding-inline:var(--ds-button-size-sm-paddingx)] [border-radius:var(--ds-button-size-sm-radius)] [font-size:var(--ds-button-size-sm-fontsize)] [&_svg]:size-3.5",
        md: "[height:var(--ds-button-size-md-height)] [padding-inline:var(--ds-button-size-md-paddingx)] [border-radius:var(--ds-button-size-md-radius)] [font-size:var(--ds-button-size-md-fontsize)] [&_svg]:size-4",
        lg: "[height:var(--ds-button-size-lg-height)] [padding-inline:var(--ds-button-size-lg-paddingx)] [border-radius:var(--ds-button-size-lg-radius)] [font-size:var(--ds-button-size-lg-fontsize)] [&_svg]:size-4",
      },
    },
    defaultVariants: { skin: "outlined", size: "md" },
  }
)

function ToggleGroup({
  className,
  skin = "outlined",
  size = "md",
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleGroupItemVariants>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-skin={skin}
      orientation={orientation}
      className={cn(
        "flex w-fit items-stretch",
        "data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
        // seam geometry → Position=left|middle|right|single
        "[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
        "data-[orientation=vertical]:[&>*:not(:first-child)]:ml-0 data-[orientation=vertical]:[&>*:not(:first-child)]:-mt-px",
        "data-[orientation=vertical]:[&>*:not(:first-child)]:rounded-t-none data-[orientation=vertical]:[&>*:not(:last-child)]:rounded-b-none",
        "data-[orientation=vertical]:[&>*:not(:first-child)]:rounded-l-md data-[orientation=vertical]:[&>*:not(:last-child)]:rounded-r-md",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ skin: skin!, size: size! }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  className,
  skin: skinProp,
  size: sizeProp,
  iconOnly,
  children,
  ...props
}: TogglePrimitive.Props &
  VariantProps<typeof toggleGroupItemVariants> & { iconOnly?: boolean }) {
  const ctx = React.useContext(ToggleGroupContext)
  const skin = skinProp ?? ctx.skin
  const size = sizeProp ?? ctx.size
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(toggleGroupItemVariants({ skin, size }), iconOnly && "aspect-square px-0", className)}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem, toggleGroupItemVariants }
