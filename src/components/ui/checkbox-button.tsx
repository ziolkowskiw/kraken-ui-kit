"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Checkbox } from "./checkbox"
import { TooltipIcon, TooltipProvider } from "./tooltip"

const checkboxButtonVariants = cva(
  [
    "group/cb relative flex items-center transition-colors outline-none cursor-pointer",
    "[gap:var(--ds-checkbox-gap)]",
  ].join(" "),
  {
    variants: {
      variant: {
        button: [
          "[padding-left:var(--ds-checkbox-paddingx)] [padding-right:var(--ds-checkbox-paddingx)]",
          "[background-color:var(--ds-checkbox-containerfill)]",
          "[border-width:var(--ds-checkbox-borderwidth)] border-solid [border-color:var(--ds-checkbox-bordercolor)]",
          "[border-radius:var(--ds-checkbox-containerradius)]",
          "hover:[background-color:var(--ds-checkbox-fillhover)] hover:[border-color:var(--ds-checkbox-borderhover)]",
          "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
          // checked / indeterminate: brand border + muted fill (Figma checked container)
          "has-[[data-checked]]:[background-color:var(--ds-color-primary-muted)] has-[[data-checked]]:[border-color:var(--ds-checkbox-checkedborder)]",
          "has-[[data-indeterminate]]:[background-color:var(--ds-color-primary-muted)] has-[[data-indeterminate]]:[border-color:var(--ds-checkbox-checkedborder)]",
          // error: red border in every checked state (overrides the brand rules above via higher specificity)
          "data-[error]:[border-color:var(--ds-checkbox-bordererror)]",
          "data-[error]:has-[[data-checked]]:[background-color:var(--ds-checkbox-containerfill)] data-[error]:has-[[data-checked]]:[border-color:var(--ds-checkbox-bordererror)]",
          "data-[error]:has-[[data-indeterminate]]:[background-color:var(--ds-checkbox-containerfill)] data-[error]:has-[[data-indeterminate]]:[border-color:var(--ds-checkbox-bordererror)]",
          "data-[error]:hover:[border-color:var(--ds-checkbox-bordererrorhover)]",
        ].join(" "),
        standalone: [
          "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
        ].join(" "),
      },
      // Single-line rows resolve to exactly the size token (sm 32 / md 40 / lg 48),
      // matching Figma; min-height lets a two-line label grow.
      size: {
        sm: "[min-height:var(--ds-checkbox-size-sm-minheight)]",
        md: "[min-height:var(--ds-checkbox-size-md-minheight)]",
        lg: "[min-height:var(--ds-checkbox-size-lg-minheight)]",
      },
    },
    defaultVariants: {
      variant: "button",
      size: "lg",
    },
  }
)

type CheckboxButtonProps = Omit<React.ComponentProps<typeof Checkbox>, "children"> &
  VariantProps<typeof checkboxButtonVariants> & {
    label?: string
    secondLineLabel?: string
  }

function CheckboxButton({
  className,
  variant,
  size,
  error,
  label = "Checkbox",
  secondLineLabel,
  ...props
}: CheckboxButtonProps) {
  return (
    <label
      data-slot="checkbox-button"
      data-error={error || undefined}
      className={cn(checkboxButtonVariants({ variant, size }), className)}
    >
      <Checkbox error={error} hoverScope="group" {...props} />
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            "[font-size:var(--ds-typography-labelmd-fontsize)] [line-height:var(--ds-typography-labelmd-lineheight)] [font-weight:var(--ds-typography-labelmd-fontweight)]",
            "[color:var(--ds-color-content-secondary)]",
            "group-has-[[data-checked]]/cb:[color:var(--ds-color-content-primary)]",
            "group-has-[[data-indeterminate]]/cb:[color:var(--ds-color-content-primary)]",
            "group-has-[:disabled]/cb:[color:var(--ds-checkbox-checkeddisabled)]",
          )}
        >
          {label}
        </span>
        {secondLineLabel && (
          <span
            className={cn(
              "[font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)]",
              "[color:var(--ds-color-content-tertiary)]",
              "group-has-[:disabled]/cb:[color:var(--ds-checkbox-checkeddisabled)]",
            )}
          >
            {secondLineLabel}
          </span>
        )}
      </div>
    </label>
  )
}

type CheckboxButtonGroupProps = {
  label?: string
  description?: string
  errorMessage?: string
  error?: boolean
  mandatory?: boolean
  /** When provided, shows the ⓘ tooltip-icon trigger next to the label. */
  tooltip?: React.ReactNode
  direction?: "horizontal" | "vertical"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  className?: string
}

function CheckboxButtonGroup({
  className,
  label,
  description,
  errorMessage,
  error,
  mandatory,
  tooltip,
  direction = "horizontal",
  size = "lg",
  children,
  ...props
}: CheckboxButtonGroupProps) {
  const hasError = error || !!errorMessage
  const isVertical = direction === "vertical"

  // Help text / error message: in vertical layouts it sits directly under the
  // label (above the options); in horizontal it sits at the bottom. (Figma)
  const helpOrError =
    hasError && errorMessage ? (
      <p className="[color:var(--ds-input-contenterror)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] w-full">
        {errorMessage}
      </p>
    ) : description ? (
      <p className="[color:var(--ds-input-placeholder)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] w-full">
        {description}
      </p>
    ) : null

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[var(--ds-spacing-component-sm)] items-start",
        className,
      )}
      aria-invalid={hasError || undefined}
      role="group"
      {...props}
    >
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
      {isVertical && helpOrError}
      <div
        className={cn(
          "grid w-full",
          isVertical
            ? // vertical option gap is tighter for md/sm than lg (Figma)
              size === "lg"
              ? "grid-flow-row gap-2"
              : "grid-flow-row gap-1"
            : "grid-flow-col auto-cols-fr gap-2",
        )}
      >
        {children}
      </div>
      {!isVertical && helpOrError}
    </div>
  )
}

export {
  CheckboxButton,
  CheckboxButtonGroup,
  checkboxButtonVariants,
}
