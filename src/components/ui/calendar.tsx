"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

// Mirrors the Figma Calendar page: `calendar` (Variant 1/2/3 months, month/year),
// `calendar/header` and `calendar/day` (State default|selected|active|disabled,
// Position left|middle|right|single for ranges). Built on react-day-picker; the
// selected day binds `--ds-color-primary`, today gets a strong border, range fills
// use the brand-muted token.
const navButton =
  "inline-flex size-7 items-center justify-center rounded-md outline-none transition-colors [color:var(--ds-color-content-secondary)] hover:[background-color:var(--ds-color-muted)] focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-40"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames()
  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-fit", defaults.root),
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex w-full flex-col gap-4",
        month_caption: "flex h-9 items-center justify-center px-9",
        caption_label: "text-sm font-medium [color:var(--ds-color-content-primary)]",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between px-1",
        button_previous: navButton,
        button_next: navButton,
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-xs font-normal [color:var(--ds-color-content-tertiary)]",
        week: "mt-2 flex w-full",
        day: "relative size-9 p-0 text-center text-sm",
        day_button:
          "inline-flex size-9 items-center justify-center rounded-md font-normal outline-none transition-colors [color:var(--ds-color-content-primary)] hover:[background-color:var(--ds-color-muted)] focus-visible:ring-2 focus-visible:ring-ring/50",
        selected:
          "[&>button]:[background-color:var(--ds-color-primary)] [&>button]:[color:var(--ds-color-primary-foreground)] [&>button]:hover:[background-color:var(--ds-color-primary-hover)]",
        today: "[&>button]:border [&>button]:[border-color:var(--ds-color-border-strong)]",
        outside: "[&>button]:[color:var(--ds-color-content-disabled)] [&>button]:opacity-50",
        disabled: "[&>button]:opacity-40 [&>button]:pointer-events-none",
        range_start: "[&>button]:rounded-r-none",
        range_end: "[&>button]:rounded-l-none",
        range_middle:
          "[background-color:var(--ds-color-primary-muted)] [&>button]:rounded-none [&>button]:[background-color:transparent] [&>button]:[color:var(--ds-color-content-primary)]",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: cl }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", cl)} />
          ) : (
            <ChevronRight className={cn("size-4", cl)} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
