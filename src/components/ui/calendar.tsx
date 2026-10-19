"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

// The day-cell button, exported for customization (badges, tooltips, custom
// data-attrs). Styling stays on the Calendar's `day_button`/modifier classNames,
// so overriding this does not fork the look. Keeps the default focus-follow
// behavior from react-day-picker.
function CalendarDayButton({
  day,
  modifiers,
  className,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])
  return (
    <button
      ref={ref}
      data-slot="calendar-day-button"
      data-day={day.date.toLocaleDateString()}
      className={className}
      {...props}
    />
  )
}

// Mirrors the Figma Calendar page: `calendar` (Variant 1/2/3 months, month/year),
// `calendar/header` and `calendar/day` (State default|active|selected|disabled,
// Position left|middle|right|single for ranges). Built on react-day-picker.
// Day cells are 32px (button/size/sm/height), radius/sm corners.
// active=selected endpoint (primary fill), selected=range-middle (secondary-fillhover).
const navButton =
  "inline-flex size-7 items-center justify-center rounded-md outline-none transition-colors [color:var(--ds-color-content-secondary)] hover:[background-color:var(--ds-color-muted)] focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-40"

function Calendar({
  className,
  classNames,
  components,
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
        // Figma: plain caption is tertiary; dropdown captions (captionLayout="dropdown*")
        // read as ghost-button text with a chevron-down, the native <select> overlaid.
        caption_label: "inline-flex items-center gap-1 [font-size:var(--ds-typography-labelmd-fontsize)] [color:var(--ds-color-content-tertiary)]",
        dropdowns: "flex items-center gap-2 [font-size:var(--ds-typography-labelmd-fontsize)] [color:var(--ds-color-content-tertiary)]",
        dropdown_root: "relative inline-flex items-center [&>span]:[color:var(--ds-button-ghost-content)]",
        dropdown: "absolute inset-0 cursor-pointer opacity-0",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between px-1",
        button_previous: navButton,
        button_next: navButton,
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-8 text-center [font-size:var(--ds-typography-labelsm-fontsize)] font-normal [color:var(--ds-color-content-secondary)]",
        week: "mt-2 flex w-full",
        day: "relative size-8 p-0 text-center text-sm",
        day_button:
          "inline-flex size-8 items-center justify-center [border-radius:var(--ds-radius-sm)] font-normal outline-none transition-colors [color:var(--ds-color-content-primary)] hover:[background-color:var(--ds-button-ghost-fillhover)] focus-visible:ring-2 focus-visible:ring-ring/50",
        selected:
          "[&>button]:[background-color:var(--ds-button-primary-fill)] [&>button]:[color:var(--ds-button-primary-content)] [&>button]:hover:[background-color:var(--ds-button-primary-fillhover)]",
        today: "[&>button]:border [&>button]:[border-color:var(--ds-color-border-strong)]",
        outside: "[&>button]:[color:var(--ds-color-content-tertiary)]",
        disabled: "[&>button]:opacity-50 [&>button]:pointer-events-none [&>button]:[color:var(--ds-button-ghost-contentdisabled)]",
        range_start: "[&>button]:rounded-l-[var(--ds-radius-sm)] [&>button]:rounded-r-none",
        range_end: "[&>button]:rounded-r-[var(--ds-radius-sm)] [&>button]:rounded-l-none",
        range_middle:
          "[background-color:var(--ds-button-secondary-fillhover)] [&>button]:rounded-none [&>button]:[background-color:transparent] [&>button]:[color:var(--ds-button-secondary-content)]",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: cl }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", cl)} />
          ) : orientation === "down" ? (
            <ChevronDown className={cn("size-3.5", cl)} />
          ) : (
            <ChevronRight className={cn("size-4", cl)} />
          ),
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
