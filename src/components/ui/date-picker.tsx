"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "./calendar"
import { Popover, PopoverTrigger, PopoverContent } from "./popover"
import { TooltipIcon, TooltipProvider } from "./tooltip"

// Mirrors the Figma `date-picker` set (1411:19313): a field whose trigger opens a
// Calendar popover. State=rest|hover|focus|disabled|error × Size × Filled. Reuses
// the `--ds-input-*` field tokens and composes the real <Calendar> + <Popover>.
const SIZE_CLASS = {
  sm: "[height:var(--ds-input-size-sm-height)] [padding-inline:var(--ds-input-size-sm-paddingx)] [border-radius:var(--ds-input-size-sm-radius)] [font-size:var(--ds-input-size-sm-fontsize)]",
  md: "[height:var(--ds-input-size-md-height)] [padding-inline:var(--ds-input-size-md-paddingx)] [border-radius:var(--ds-input-size-md-radius)] [font-size:var(--ds-input-size-md-fontsize)]",
  lg: "[height:var(--ds-input-size-lg-height)] [padding-inline:var(--ds-input-size-lg-paddingx)] [border-radius:var(--ds-input-size-lg-radius)] [font-size:var(--ds-input-size-lg-fontsize)]",
}

type DatePickerProps = {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  error?: boolean
  className?: string
  format?: (date: Date) => string
}

/** Coerce anything (Date, ISO string, timestamp) to a valid Date or undefined.
 *  Guards against non-Date values (e.g. a Storybook date control returns a number),
 *  so we never call Date methods on a non-Date. */
function toDate(value: unknown): Date | undefined {
  if (value == null || value === "") return undefined
  const d = value instanceof Date ? value : new Date(value as string | number)
  return Number.isNaN(d.getTime()) ? undefined : d
}

function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  size = "md",
  disabled,
  error,
  className,
  format,
}: DatePickerProps) {
  const [internal, setInternal] = React.useState<Date | undefined>(() => toDate(defaultValue))
  const [open, setOpen] = React.useState(false)
  const selected = toDate(value) ?? internal
  const formatDate =
    format ?? ((d: Date) => d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }))

  const setSelected = (date: Date | undefined) => {
    const next = toDate(date)
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            disabled={disabled}
            data-slot="date-picker-trigger"
            aria-invalid={error || undefined}
            className={cn(
              "flex w-full items-center gap-2 border text-left transition-colors outline-none",
              "[border-width:var(--ds-input-borderwidth)] [border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)]",
              "hover:[border-color:var(--ds-input-borderhover)] focus-visible:[border-color:var(--ds-input-borderfocus)]",
              "aria-invalid:[border-color:var(--ds-input-bordererror)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              SIZE_CLASS[size],
              className
            )}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0 [color:var(--ds-color-icon-muted)]" />
        <span className={cn("flex-1 truncate", selected ? "[color:var(--ds-input-value)]" : "[color:var(--ds-input-placeholder)]")}>
          {selected ? formatDate(selected) : placeholder}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar mode="single" selected={selected} onSelect={setSelected} autoFocus />
      </PopoverContent>
    </Popover>
  )
}

type DatePickerFieldProps = DatePickerProps & {
  label?: string
  description?: string
  errorMessage?: string
  mandatory?: boolean
  tooltip?: React.ReactNode
}

function DatePickerField({
  label,
  description,
  errorMessage,
  mandatory,
  tooltip,
  error,
  className,
  ...props
}: DatePickerFieldProps) {
  const hasError = error || !!errorMessage
  return (
    <div className={cn("flex w-full flex-col gap-[var(--ds-spacing-component-sm)] items-start", className)}>
      {label && (
        <div className="flex items-center gap-1 h-4">
          <span className="[color:var(--ds-input-content)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)]">
            {label}
          </span>
          {mandatory && <span className="[color:var(--ds-input-contenterror)]">*</span>}
          {tooltip && (
            <TooltipProvider>
              <TooltipIcon content={tooltip} />
            </TooltipProvider>
          )}
        </div>
      )}
      <DatePicker error={hasError} {...props} />
      {hasError && errorMessage ? (
        <p className="[color:var(--ds-input-contenterror)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] w-full">
          {errorMessage}
        </p>
      ) : description ? (
        <p className="[color:var(--ds-input-placeholder)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] w-full">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export { DatePicker, DatePickerField }
