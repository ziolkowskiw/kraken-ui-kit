"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

// Mirrors the Figma `Progress` component (1792:1815): a rounded track + indicator
// with an optional label row (Label on the left, percentage Value on the right).
// Track = `--ds-color-muted`, indicator = `--ds-color-primary`.
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
      className={cn("flex w-full flex-col gap-[var(--ds-spacing-component-sm)]", className)}
      {...props}
    >
      {showLabels && (
        <div className="flex items-center justify-between [color:var(--ds-color-content-secondary)] [font-family:var(--ds-typography-labelsm-fontfamily)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)]">
          <ProgressPrimitive.Label>{label}</ProgressPrimitive.Label>
          <ProgressPrimitive.Value>
            {(_, value) => (value == null ? null : `${Math.round(value)}%`)}
          </ProgressPrimitive.Value>
        </div>
      )}
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="relative w-full overflow-hidden [height:var(--ds-spacing-2)] [border-radius:var(--ds-radius-full)] [background-color:var(--ds-color-muted)]"
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
