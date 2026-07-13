"use client"

import * as React from "react"
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card"

import { cn } from "@/lib/utils"

// Mirrors the Figma `Hover Card` component (1595:20118): Title + Copy shown on
// hover/focus of a trigger. Built on Base UI's PreviewCard. Surface =
// `--ds-color-popover`.
function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

function HoverCardContent({
  className,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<PreviewCardPrimitive.Positioner.Props, "side" | "align" | "sideOffset" | "alignOffset">) {
  return (
    <PreviewCardPrimitive.Portal>
      <PreviewCardPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} className="isolate z-50">
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            "w-64 origin-(--transform-origin) p-4 outline-none",
            "[border-radius:var(--ds-radius-lg)] [background-color:var(--ds-color-popover)] [color:var(--ds-color-popover-foreground)]",
            "shadow-md ring-1 ring-foreground/10",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  )
}

function HoverCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hover-card-title"
      className={cn(
        "[color:var(--ds-color-content-primary)] [font-family:var(--ds-typography-labellg-fontfamily)] [font-size:var(--ds-typography-labellg-fontsize)] [font-weight:var(--ds-typography-labellg-fontweight)] [line-height:var(--ds-typography-labellg-lineheight)]",
        className
      )}
      {...props}
    />
  )
}

function HoverCardCopy({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="hover-card-copy"
      className={cn(
        "[color:var(--ds-color-content-secondary)] [font-family:var(--ds-typography-bodysm-fontfamily)] [font-size:var(--ds-typography-bodysm-fontsize)] [line-height:var(--ds-typography-bodysm-lineheight)]",
        className
      )}
      {...props}
    />
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardTitle, HoverCardCopy }
