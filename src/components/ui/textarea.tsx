import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { TooltipIcon, TooltipProvider } from "./tooltip"

const textareaVariants = cva(
  [
    "flex w-full field-sizing-content min-h-16 border transition-colors outline-none",
    "[border-width:var(--ds-input-borderwidth)] [border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)]",
    "[color:var(--ds-input-value)] placeholder:[color:var(--ds-input-placeholder)]",
    "hover:[border-color:var(--ds-input-borderhover)]",
    "focus-visible:[border-color:var(--ds-input-borderfocus)]",
    "disabled:[background-color:var(--ds-input-filldisabled)] disabled:[border-color:var(--ds-input-borderdisabled)] disabled:cursor-not-allowed disabled:opacity-50 disabled:[color:var(--ds-input-placeholder)]",
    "aria-invalid:[border-color:var(--ds-input-bordererror)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[padding:var(--ds-input-size-sm-paddingx)] [border-radius:var(--ds-input-size-sm-radius)] [font-size:var(--ds-input-size-sm-fontsize)]",
        md: "[padding:var(--ds-input-size-md-paddingx)] [border-radius:var(--ds-input-size-md-radius)] [font-size:var(--ds-input-size-md-fontsize)]",
        lg: "[padding:var(--ds-input-size-lg-paddingx)] [border-radius:var(--ds-input-size-lg-radius)] [font-size:var(--ds-input-size-lg-fontsize)]",
      },
    },
    defaultVariants: { size: "md" },
  }
)

type TextareaProps = React.ComponentProps<"textarea"> &
  VariantProps<typeof textareaVariants>

function Textarea({ className, size, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  )
}

type TextareaFieldProps = React.ComponentProps<"textarea"> &
  VariantProps<typeof textareaVariants> & {
    label?: string
    description?: string
    errorMessage?: string
    error?: boolean
    mandatory?: boolean
    /** When provided, shows the ⓘ tooltip-icon trigger next to the label. */
    tooltip?: React.ReactNode
    showCounter?: boolean
    maxLength?: number
  }

function TextareaField({
  className,
  size,
  label,
  description,
  errorMessage,
  error,
  mandatory,
  tooltip,
  showCounter,
  maxLength,
  disabled,
  value,
  defaultValue,
  id: idProp,
  onChange,
  ...props
}: TextareaFieldProps & { id?: string }) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId
  const hasError = error || !!errorMessage
  const initialLength = String(value ?? defaultValue ?? "").length
  const [charCount, setCharCount] = React.useState(initialLength)
  React.useEffect(() => {
    if (value !== undefined) setCharCount(String(value).length)
  }, [value])
  const counter = showCounter && maxLength ? (
    <span className="[color:var(--ds-input-placeholder)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] tabular-nums shrink-0">
      {charCount}/{maxLength}
    </span>
  ) : null
  return (
    <div className="flex w-full flex-col gap-[var(--ds-spacing-component-sm)] items-start">
      {(label || counter) && (
        // Top row: label on the left, character counter pinned to the top-right.
        <div className="flex w-full items-center gap-1 min-h-4">
          {label && (
            <label htmlFor={id} className="[color:var(--ds-input-content)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)]">
              {label}
            </label>
          )}
          {label && mandatory && (
            <span className="[color:var(--ds-input-contenterror)]">*</span>
          )}
          {label && tooltip && (
            <TooltipProvider>
              <TooltipIcon content={tooltip} />
            </TooltipProvider>
          )}
          {counter && <span className="ml-auto">{counter}</span>}
        </div>
      )}
      <textarea
        id={id}
        data-slot="textarea"
        disabled={disabled}
        aria-invalid={hasError || undefined}
        maxLength={maxLength}
        className={cn(textareaVariants({ size }), className)}
        value={value}
        defaultValue={defaultValue}
        {...props}
        onChange={(e) => {
          setCharCount(e.target.value.length)
          onChange?.(e)
        }}
      />
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

export { Textarea, TextareaField, textareaVariants }
