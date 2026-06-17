"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { CircleQuestionMark } from "lucide-react"

import { cn } from "@/lib/utils"

function TooltipProvider({ ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" {...props} />
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 8,
  children,
  ...props
}: Omit<TooltipPrimitive.Popup.Props, "side" | "sideOffset"> &
  Pick<TooltipPrimitive.Positioner.Props, "side" | "sideOffset">) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset}>
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            [
              "[background-color:var(--ds-color-inverse)] [color:var(--ds-color-inverse-foreground)]",
              "[font-size:var(--ds-tooltip-fontsize)] [border-radius:var(--ds-tooltip-radius)]",
              "[padding-inline:var(--ds-tooltip-paddingx)] [padding-block:var(--ds-tooltip-paddingy)]",
              "[max-width:var(--ds-tooltip-maxwidth)]",
              "animate-in fade-in-0 zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            ].join(" "),
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow
            data-slot="tooltip-arrow"
            className="[fill:var(--ds-color-inverse)]"
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

function TooltipIcon({
  side = "top",
  sideOffset = 8,
  delay = 0,
  content,
  className,
  ...props
}: Omit<TooltipPrimitive.Trigger.Props, "content"> & {
  side?: "top" | "bottom" | "left" | "right"
  sideOffset?: number
  /** Open delay in ms. Defaults to 0 so the help tooltip appears instantly. */
  delay?: number
  content: React.ReactNode
}) {
  return (
    <TooltipProvider delay={delay}>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "inline-flex shrink-0 items-center justify-center [color:var(--ds-color-muted-foreground)] hover:[color:var(--ds-color-foreground)] transition-colors",
            className
          )}
          {...props}
        >
          <CircleQuestionMark className="size-4" aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent side={side} sideOffset={sideOffset}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Tooltip, TooltipContent, TooltipIcon, TooltipProvider, TooltipTrigger }
