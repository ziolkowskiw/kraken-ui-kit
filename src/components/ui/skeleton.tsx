import * as React from "react"

import { cn } from "@/lib/utils"

// Mirrors the Figma `Skeleton` component (1808:15417): a muted, pulsing
// placeholder block. Footprint (width/height/shape) is supplied by the consumer
// via className so it can stand in for any element.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse [border-radius:var(--ds-radius-md)] [background-color:var(--ds-color-muted)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
