"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

// Figma `li:circle-question-mark-filled` (tooltip/icon 2115:1280): lucide's
// circle-question-mark drawn solid with the "?" knocked out. Lucide ships no
// filled variant, so the Figma glyph is inlined; it inherits currentColor.
function CircleQuestionMarkFilled(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="-0.667 -0.667 16 16" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 7.33333C0 3.28325 3.28325 0 7.33333 0C11.3834 0 14.6667 3.28325 14.6667 7.33333C14.6667 11.3834 11.3834 14.6667 7.33333 14.6667C3.28325 14.6667 0 11.3834 0 7.33333ZM7.50544 4.6829C7.19509 4.62966 6.87592 4.68798 6.60445 4.84753C6.33298 5.00707 6.12674 5.25754 6.02225 5.55458C5.90007 5.90191 5.51946 6.08442 5.17213 5.96224C4.8248 5.84006 4.64229 5.45945 4.76447 5.11212C4.97345 4.51805 5.38594 4.0171 5.92887 3.69802C6.47181 3.37893 7.11015 3.26229 7.73085 3.36875C8.35154 3.47522 8.91453 3.79792 9.32009 4.2797C9.72554 4.76134 9.9475 5.37089 9.94669 6.00046C9.94648 7.02079 9.19001 7.69459 8.64983 8.05472C8.3594 8.24833 8.07373 8.39069 7.86328 8.48422C7.75712 8.53141 7.66771 8.56722 7.60329 8.59176C7.57103 8.60405 7.54487 8.61358 7.52583 8.62035L7.50267 8.62846L7.4953 8.63097L7.4927 8.63185L7.49168 8.63219C7.49168 8.63219 7.49084 8.63247 7.28003 8.00002L7.49084 8.63247C7.14155 8.7489 6.764 8.56013 6.64757 8.21083C6.53129 7.862 6.71942 7.48498 7.06784 7.36802L7.06885 7.36767L7.07915 7.36406C7.0894 7.36041 7.10621 7.35432 7.12863 7.34577C7.17359 7.32865 7.24044 7.30196 7.32177 7.26581C7.48632 7.19267 7.70065 7.08504 7.91023 6.94532C8.36996 6.63883 8.61336 6.31277 8.61336 6.00002V5.99902C8.61383 5.68414 8.50284 5.37926 8.30006 5.13837C8.09728 4.89748 7.81578 4.73613 7.50544 4.6829ZM7.33333 10C6.96514 10 6.66667 10.2985 6.66667 10.6667C6.66667 11.0349 6.96514 11.3333 7.33333 11.3333H7.34C7.70819 11.3333 8.00667 11.0349 8.00667 10.6667C8.00667 10.2985 7.70819 10 7.34 10H7.33333Z"
      />
    </svg>
  )
}

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
          aria-label="More information"
          className={cn(
            "inline-flex shrink-0 items-center justify-center [color:var(--ds-input-helper)]",
            className
          )}
          {...props}
        >
          <CircleQuestionMarkFilled className="size-4" aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent side={side} sideOffset={sideOffset}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Tooltip, TooltipContent, TooltipIcon, TooltipProvider, TooltipTrigger }
