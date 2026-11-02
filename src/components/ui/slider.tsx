"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

// Mirrors the Figma `slider` set (1811:15452): Type=default|range × Direction
// (orientation). A range slider is just a value array → two thumbs (`slider/marker`,
// State=regular|focus). Track = `--ds-color-muted`, indicator = `--ds-color-primary`,
// thumb = white with a primary ring border.
function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  orientation = "horizontal",
  ...props
}: SliderPrimitive.Root.Props) {
  const thumbCount = React.useMemo(() => {
    if (Array.isArray(value)) return value.length
    if (Array.isArray(defaultValue)) return defaultValue.length
    return 1
  }, [value, defaultValue])

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      orientation={orientation}
      className={cn(
        "relative flex touch-none items-center select-none",
        "data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-44 data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="slider-control"
        className={cn(
          "relative flex grow items-center",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:justify-center"
        )}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "relative grow overflow-hidden [border-radius:var(--ds-radius-full)] [background-color:var(--ds-color-muted)]",
            "data-[orientation=horizontal]:[height:var(--ds-spacing-6)] data-[orientation=horizontal]:w-full",
            "data-[orientation=vertical]:[width:var(--ds-spacing-6)] data-[orientation=vertical]:h-full"
          )}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="[background-color:var(--ds-color-primary)] data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }).map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            data-slot="slider-thumb"
            aria-label={thumbCount > 1 ? (i === 0 ? "Minimum value" : "Maximum value") : "Value"}
            className={cn(
              // Figma slider/marker: 14px white disc with a 1px foreground ring
              "block size-3.5 shrink-0 border outline-none transition-[box-shadow]",
              "[border-radius:var(--ds-radius-full)] [border-color:var(--ds-color-foreground)] [background-color:var(--ds-color-control)]",
              "hover:ring-4 hover:ring-ring/20",
              "focus-visible:ring-4 focus-visible:ring-ring/50",
              "data-disabled:pointer-events-none data-disabled:opacity-50"
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
