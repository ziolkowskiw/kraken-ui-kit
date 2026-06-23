"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"
import { TooltipIcon, TooltipProvider } from "./tooltip"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

type RadioGroupItemProps = RadioPrimitive.Root.Props & {
  error?: boolean
}

function RadioGroupItem({ className, error, ...props }: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      data-error={error || undefined}
      className={cn(
        "group/radio peer relative flex aspect-square size-4 shrink-0 rounded-full border-solid outline-none transition-colors",
        "[border-width:var(--ds-radio-borderwidth)] [background-color:var(--ds-radio-fill)] [border-color:var(--ds-radio-bordercolor)]",
        "hover:[border-color:var(--ds-radio-borderhover)]",
        "focus-visible:shadow-[0px_0px_0px_3px_var(--ds-color-border-focus)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-checked:[border-color:var(--ds-radio-indicator)] data-checked:[background-color:var(--ds-radio-indicator)] data-checked:text-[var(--ds-color-primary-foreground)]",
        "data-[error]:[border-color:var(--ds-radio-bordererror)]",
        "data-[error]:data-checked:[background-color:var(--ds-radio-fillerror)] data-[error]:data-checked:[border-color:var(--ds-radio-fillerror)]",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

type RadioGroupFieldProps = RadioGroupPrimitive.Props & {
  label?: string
  description?: string
  errorMessage?: string
  error?: boolean
  mandatory?: boolean
  /** When provided, shows the ⓘ tooltip-icon trigger next to the label. */
  tooltip?: React.ReactNode
  direction?: "horizontal" | "vertical"
}

function RadioGroupField({
  className,
  label,
  description,
  errorMessage,
  error,
  mandatory,
  tooltip,
  direction = "vertical",
  children,
  ...props
}: RadioGroupFieldProps) {
  const hasError = error || !!errorMessage
  return (
    <div className={cn("flex w-full flex-col gap-[var(--ds-spacing-component-sm)] items-start", className)}>
      {label && (
        <div className="flex items-center gap-1 h-4">
          <span className="[color:var(--ds-input-content)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)]">
            {label}
          </span>
          {mandatory && (
            <span className="[color:var(--ds-input-contenterror)]">*</span>
          )}
          {tooltip && (
            <TooltipProvider>
              <TooltipIcon content={tooltip} />
            </TooltipProvider>
          )}
        </div>
      )}
      <RadioGroupPrimitive
        data-slot="radio-group"
        aria-invalid={hasError || undefined}
        className={cn(
          "grid w-full gap-2",
          direction === "horizontal" ? "grid-flow-col auto-cols-fr" : "grid-flow-row",
        )}
        {...props}
      >
        {children}
      </RadioGroupPrimitive>
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

export { RadioGroup, RadioGroupField, RadioGroupItem }
