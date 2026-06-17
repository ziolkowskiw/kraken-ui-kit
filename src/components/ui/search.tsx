"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { SearchIcon, XIcon, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { TooltipIcon, TooltipProvider } from "./tooltip"

// Mirrors the Figma `search` set (858:2055): an input with a leading magnifier and
// an optional clear control. State=rest|hover|focus|disabled|error|warning × Size ×
// Filled. Reuses the `--ds-input-*` field tokens; warning adds the status-warning
// border/icon.
const searchVariants = cva(
  [
    "flex w-full items-center gap-1.5 border transition-colors outline-none",
    "[border-width:var(--ds-input-borderwidth)] [border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)]",
    "hover:[border-color:var(--ds-input-borderhover)]",
    "focus-within:[border-color:var(--ds-input-borderfocus)]",
    "has-[input:disabled]:[background-color:var(--ds-input-filldisabled)] has-[input:disabled]:[border-color:var(--ds-input-borderdisabled)] has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
    "data-[state=error]:[border-color:var(--ds-input-bordererror)]",
    "data-[state=warning]:[border-color:var(--ds-color-status-warning-border)]",
    "[&_input]:flex-1 [&_input]:min-w-0 [&_input]:bg-transparent [&_input]:outline-none [&_input]:border-none",
    "[&_input]:placeholder:[color:var(--ds-input-placeholder)] [&_input]:[color:var(--ds-input-value)]",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[height:var(--ds-input-size-sm-height)] [padding-inline:var(--ds-input-size-sm-paddingx)] [border-radius:var(--ds-input-size-sm-radius)] [font-size:var(--ds-input-size-sm-fontsize)] [&_svg]:size-4",
        md: "[height:var(--ds-input-size-md-height)] [padding-inline:var(--ds-input-size-md-paddingx)] [border-radius:var(--ds-input-size-md-radius)] [font-size:var(--ds-input-size-md-fontsize)] [&_svg]:size-4",
        lg: "[height:var(--ds-input-size-lg-height)] [padding-inline:var(--ds-input-size-lg-paddingx)] [border-radius:var(--ds-input-size-lg-radius)] [font-size:var(--ds-input-size-lg-fontsize)] [&_svg]:size-4.5",
      },
    },
    defaultVariants: { size: "md" },
  }
)

type SearchProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof searchVariants> & {
    onClear?: () => void
    state?: "default" | "error" | "warning"
  }

function Search({ className, size, value, onClear, state = "default", ...props }: SearchProps) {
  const showClear = !!onClear && value != null && String(value).length > 0
  return (
    <div
      data-slot="search"
      data-state={state}
      className={cn(searchVariants({ size }), className)}
    >
      <SearchIcon className="[color:var(--ds-color-icon-muted)]" />
      <InputPrimitive type="search" value={value} {...props} />
      {state === "warning" && <TriangleAlert className="[color:var(--ds-color-status-warning-icon)]" />}
      {showClear && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="grid size-4 place-items-center [color:var(--ds-color-icon-muted)] hover:[color:var(--ds-color-content-primary)] outline-none"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  )
}

type SearchFieldProps = SearchProps & {
  label?: string
  description?: string
  errorMessage?: string
  mandatory?: boolean
  tooltip?: React.ReactNode
}

function SearchField({
  label,
  description,
  errorMessage,
  mandatory,
  tooltip,
  state,
  className,
  ...props
}: SearchFieldProps) {
  const resolvedState = errorMessage ? "error" : state
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
      <Search state={resolvedState} {...props} />
      {errorMessage ? (
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

export { Search, SearchField, searchVariants }
