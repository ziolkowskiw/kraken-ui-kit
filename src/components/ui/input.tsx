import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { TooltipIcon, TooltipProvider } from "./tooltip";

const inputVariants = cva(
  [
    "flex w-full items-center gap-1.5 border transition-colors outline-none",
    "[border-width:var(--ds-input-borderwidth)] [border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)]",
    "hover:[border-color:var(--ds-input-borderhover)]",
    "focus-within:[border-color:var(--ds-input-borderfocus)]",
    "has-[input:disabled]:[background-color:var(--ds-input-filldisabled)] has-[input:disabled]:[border-color:var(--ds-input-borderdisabled)] has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50",
    "has-[input[aria-invalid=true]]:[border-color:var(--ds-input-bordererror)]",
    "[&_input]:flex-1 [&_input]:min-w-0 [&_input]:bg-transparent [&_input]:outline-none [&_input]:border-none",
    "[&_input]:placeholder:[color:var(--ds-input-placeholder)]",
    "[&_input]:[color:var(--ds-input-value)]",
    "[&_input]:disabled:cursor-not-allowed [&_input]:disabled:[color:var(--ds-input-placeholder)]",
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
  },
);

type InputFieldProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    description?: string;
    errorMessage?: string;
    error?: boolean;
    mandatory?: boolean;
    /** When provided, shows the ⓘ tooltip-icon trigger next to the label. */
    tooltip?: React.ReactNode;
    leftDecoration?: React.ReactNode;
    rightDecoration?: React.ReactNode;
  };

function InputField({
  className,
  size,
  label,
  description,
  errorMessage,
  error,
  mandatory,
  tooltip,
  leftDecoration,
  rightDecoration,
  disabled,
  type,
  id: idProp,
  ...props
}: InputFieldProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const hasError = error || !!errorMessage;
  return (
    <div className="flex w-full flex-col gap-[var(--ds-spacing-component-sm)] items-start">
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
      <div data-slot="input" className={cn(inputVariants({ size }), className)}>
        {leftDecoration}
        <InputPrimitive
          id={id}
          type={type}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          {...props}
        />
        {hasError && <CircleAlert className="shrink-0 [color:var(--ds-input-bordererror)]" />}
        {rightDecoration}
      </div>
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

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full items-center border transition-colors outline-none",
        "[border-width:var(--ds-input-borderwidth)] [border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)]",
        "[height:var(--ds-input-size-md-height)] [padding-inline:var(--ds-input-size-md-paddingx)] [border-radius:var(--ds-input-size-md-radius)] [font-size:var(--ds-input-size-md-fontsize)]",
        "[color:var(--ds-input-value)] placeholder:[color:var(--ds-input-placeholder)]",
        "hover:[border-color:var(--ds-input-borderhover)]",
        "focus-visible:[border-color:var(--ds-input-borderfocus)]",
        "disabled:[background-color:var(--ds-input-filldisabled)] disabled:[border-color:var(--ds-input-borderdisabled)] disabled:cursor-not-allowed disabled:opacity-50 disabled:[color:var(--ds-input-placeholder)]",
        "aria-invalid:[border-color:var(--ds-input-bordererror)]",
        className,
      )}
      {...props}
    />
  );
}

export { Input, InputField, inputVariants };
