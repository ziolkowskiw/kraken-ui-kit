"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

// Mirrors the Figma `Progress` component (1792:1815): a rounded track + indicator
// with an optional label row (Label on the left, percentage Value on the right).
// Track = `--ds-color-muted` (12px), indicator = `--ds-color-primary`; labels 16px.
function Progress({
  className,
  value,
  label,
  showLabels = false,
  ...props
}: ProgressPrimitive.Root.Props & {
  label?: React.ReactNode
  showLabels?: boolean
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn("flex w-full flex-col gap-[var(--ds-spacing-12)]", className)}
      {...props}
    >
      {showLabels && (
        <div className="flex items-center justify-between [color:var(--ds-input-value)] [font-size:var(--ds-typography-bodymd-fontsize)] [line-height:var(--ds-typography-labellg-lineheight)]">
          <ProgressPrimitive.Label data-slot="progress-label">{label}</ProgressPrimitive.Label>
          <ProgressPrimitive.Value data-slot="progress-value">
            {(_, value) => (value == null ? null : `${Math.round(value)}%`)}
          </ProgressPrimitive.Value>
        </div>
      )}
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="relative w-full overflow-hidden [height:var(--ds-spacing-12)] [border-radius:var(--ds-radius-full)] [background-color:var(--ds-color-muted)]"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full [background-color:var(--ds-color-primary)] transition-all duration-300 ease-out"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
