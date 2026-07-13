"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { RadioGroupItem } from "./radio-group";
import { TooltipIcon, TooltipProvider } from "./tooltip";

// Mirrors the Figma `Radio button` set (Radio page): the button-style radio that
// parallels `checkbox-button`. Variant=button|standalone × Size × Semantic
// (default|error). The selected button gets a brand-muted fill + brand border
// (the same shell tokens checkbox-button uses); the radio dot is the real
// `RadioGroupItem` (single source of truth).
const radioButtonVariants = cva(
  [
    "group/rb relative flex items-center transition-colors outline-none cursor-pointer",
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
          "has-[[data-checked]]:[background-color:var(--ds-color-primary-muted)] has-[[data-checked]]:[border-color:var(--ds-checkbox-checkedborder)]",
          "data-[error]:[border-color:var(--ds-checkbox-bordererror)]",
          "data-[error]:has-[[data-checked]]:[background-color:var(--ds-checkbox-containerfill)] data-[error]:has-[[data-checked]]:[border-color:var(--ds-checkbox-bordererror)]",
          "data-[error]:hover:[border-color:var(--ds-checkbox-bordererrorhover)]",
        ].join(" "),
        standalone: "has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed",
      },
      size: {
        sm: "[min-height:var(--ds-checkbox-size-sm-minheight)]",
        md: "[min-height:var(--ds-checkbox-size-md-minheight)]",
        lg: "[min-height:var(--ds-checkbox-size-lg-minheight)]",
      },
    },
    defaultVariants: { variant: "button", size: "lg" },
  },
);

type RadioButtonProps = React.ComponentProps<typeof RadioGroupItem> &
  VariantProps<typeof radioButtonVariants> & {
    label?: string;
    secondLineLabel?: string;
  };

function RadioButton({
  className,
  variant,
  size,
  error,
  label = "Radio",
  secondLineLabel,
  ...props
}: RadioButtonProps) {
  return (
    <label
      data-slot="radio-button"
      data-error={error || undefined}
      className={cn(radioButtonVariants({ variant, size }), className)}
    >
      <RadioGroupItem error={error} {...props} />
      <div className="flex flex-col gap-1">
        <span
          className={cn(
            "[font-size:var(--ds-typography-labelmd-fontsize)] [line-height:var(--ds-typography-labelmd-lineheight)] [font-weight:var(--ds-typography-labelmd-fontweight)]",
            "[color:var(--ds-color-content-secondary)]",
            "group-has-[[data-checked]]/rb:[color:var(--ds-color-content-primary)]",
            "group-has-[:disabled]/rb:[color:var(--ds-checkbox-checkeddisabled)]",
          )}
        >
          {label}
        </span>
        {secondLineLabel && (
          <span
            className={cn(
              "[font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)]",
              "[color:var(--ds-color-content-tertiary)]",
              "group-has-[:disabled]/rb:[color:var(--ds-checkbox-checkeddisabled)]",
            )}
          >
            {secondLineLabel}
          </span>
        )}
      </div>
    </label>
  );
}

type RadioButtonGroupProps = RadioGroupPrimitive.Props & {
  label?: string;
  description?: string;
  errorMessage?: string;
  error?: boolean;
  mandatory?: boolean;
  tooltip?: React.ReactNode;
  direction?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
};

function RadioButtonGroup({
  className,
  label,
  description,
  errorMessage,
  error,
  mandatory,
  tooltip,
  direction = "horizontal",
  children,
  ...props
}: RadioButtonGroupProps) {
  const hasError = error || !!errorMessage;
  const isVertical = direction === "vertical";

  const helpOrError =
    hasError && errorMessage ? (
      <p className="[color:var(--ds-input-contenterror)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] w-full">
        {errorMessage}
      </p>
    ) : description ? (
      <p className="[color:var(--ds-input-placeholder)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] w-full">
        {description}
      </p>
    ) : null;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[var(--ds-spacing-component-sm)] items-start",
        className,
      )}
    >
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
      {isVertical && helpOrError}
      <RadioGroupPrimitive
        data-slot="radio-button-group"
        aria-invalid={hasError || undefined}
        className={cn(
          "grid w-full",
          isVertical ? "grid-flow-row gap-2" : "grid-flow-col auto-cols-fr gap-2",
        )}
        {...props}
      >
        {children}
      </RadioGroupPrimitive>
      {!isVertical && helpOrError}
    </div>
  );
}

export { RadioButton, RadioButtonGroup, radioButtonVariants };
