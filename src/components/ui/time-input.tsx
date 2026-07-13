"use client";

import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { TooltipIcon, TooltipProvider } from "./tooltip";

// Mirrors the Figma `time-input` set (858:2044): a field for entering a time, with
// a trailing clock affordance. State=rest|hover|focus|disabled|error × Size × Filled.
// Reuses the `--ds-input-*` field tokens.
const timeInputVariants = cva(
  [
    "flex w-full items-center gap-1.5 border transition-colors outline-none",
    "[border-width:var(--ds-input-borderwidth)] [border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)]",
    "hover:[border-color:var(--ds-input-borderhover)]",
    "focus-within:[border-color:var(--ds-input-borderfocus)]",
    "has-[input:disabled]:[background-color:var(--ds-input-filldisabled)] has-[input:disabled]:[border-color:var(--ds-input-borderdisabled)] has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
    "has-[input[aria-invalid=true]]:[border-color:var(--ds-input-bordererror)]",
    "[&_input]:flex-1 [&_input]:min-w-0 [&_input]:bg-transparent [&_input]:outline-none [&_input]:border-none [&_input]:tabular-nums",
    "[&_input]:placeholder:[color:var(--ds-input-placeholder)] [&_input]:[color:var(--ds-input-value)]",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none [&_svg]:[color:var(--ds-color-icon-muted)]",
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
  },
);

type TimeInputProps = Omit<React.ComponentProps<"input">, "size" | "type"> &
  VariantProps<typeof timeInputVariants> & { error?: boolean };

function TimeInput({ className, size, error, ...props }: TimeInputProps) {
  return (
    <div data-slot="time-input" className={cn(timeInputVariants({ size }), className)}>
      <InputPrimitive type="time" aria-invalid={error || undefined} {...props} />
      <Clock />
    </div>
  );
}

type TimeInputFieldProps = TimeInputProps & {
  label?: string;
  description?: string;
  errorMessage?: string;
  mandatory?: boolean;
  tooltip?: React.ReactNode;
};

function TimeInputField({
  label,
  description,
  errorMessage,
  mandatory,
  tooltip,
  error,
  id: idProp,
  className,
  ...props
}: TimeInputFieldProps & { id?: string }) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const hasError = error || !!errorMessage;
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-[var(--ds-spacing-component-sm)] items-start",
        className,
      )}
    >
      {label && (
        <div className="flex items-center gap-1 h-4">
          <label
            htmlFor={id}
            className="[color:var(--ds-input-content)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)]"
          >
            {label}
          </label>
          {mandatory && <span className="[color:var(--ds-input-contenterror)]">*</span>}
          {tooltip && (
            <TooltipProvider>
              <TooltipIcon content={tooltip} />
            </TooltipProvider>
          )}
        </div>
      )}
      <TimeInput id={id} error={hasError} {...props} />
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
  );
}

export { TimeInput, TimeInputField, timeInputVariants };
