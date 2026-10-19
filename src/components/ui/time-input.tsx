"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlert, Clock8 } from "lucide-react"

import { cn } from "@/lib/utils"
import { TooltipIcon, TooltipProvider } from "./tooltip"

// Mirrors the Figma `time-input` set (903:5961): a field for entering a time, with
// a trailing `clock-8` affordance. State=rest|hover|focus|disabled|error × Size × Filled.
// Reuses the `--ds-input-*` field tokens. The browser's own picker indicator is
// hidden so only the kit clock shows; clicking the clock opens the native picker.
// Proportional figures (no tabular-nums) to match the Figma value text.
const timeInputVariants = cva(
  [
    "flex w-full items-center gap-[var(--ds-spacing-component-xs)] border transition-colors outline-none",
    "[border-width:var(--ds-input-borderwidth)] [border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)]",
    "hover:[border-color:var(--ds-input-borderhover)]",
    "focus-within:[border-color:var(--ds-input-borderfocus)]",
    "has-[input:disabled]:[background-color:var(--ds-input-filldisabled)] has-[input:disabled]:[border-color:var(--ds-input-borderdisabled)] has-[input:disabled]:cursor-not-allowed",
    "has-[input[aria-invalid=true]]:[border-color:var(--ds-input-bordererror)]",
    "[&_input]:flex-1 [&_input]:min-w-0 [&_input]:bg-transparent [&_input]:outline-none [&_input]:border-none",
    "[&_input]:placeholder:[color:var(--ds-input-placeholder)] [&_input]:[color:var(--ds-input-value)]",
    "[&_input]:disabled:cursor-not-allowed [&_input]:disabled:[color:var(--ds-input-placeholder)]",
    "[&_input::-webkit-calendar-picker-indicator]:hidden",
    "data-[empty]:[&_input]:[color:var(--ds-input-placeholder)]",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
    "[&_[data-slot=time-input-trigger]]:[color:var(--ds-button-secondary-content)]",
    "has-[input[aria-invalid=true]]:[&_[data-slot=time-input-trigger]]:[color:var(--ds-input-bordererror)]",
    "has-[input:disabled]:[&_[data-slot=time-input-trigger]]:[color:var(--ds-color-content-disabled-strong)]",
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

type TimeInputProps = Omit<React.ComponentProps<"input">, "size" | "type"> &
  VariantProps<typeof timeInputVariants> & { error?: boolean }

function TimeInput({ className, size, error, disabled, onChange, ...props }: TimeInputProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  // A native time input has no :placeholder-shown, so track emptiness to paint
  // the "--:--" mask in the placeholder colour like the Figma Filled=false look.
  const [uncontrolledEmpty, setUncontrolledEmpty] = React.useState(!props.defaultValue)
  const empty = props.value !== undefined ? !props.value : uncontrolledEmpty
  const openPicker = () => {
    const input = rootRef.current?.querySelector("input")
    try {
      input?.showPicker()
    } catch {
      input?.focus()
    }
  }
  return (
    <div
      ref={rootRef}
      data-slot="time-input"
      data-empty={empty || undefined}
      className={cn(timeInputVariants({ size }), className)}
    >
      <InputPrimitive
        type="time"
        disabled={disabled}
        aria-invalid={error || undefined}
        onChange={(e) => {
          setUncontrolledEmpty(!e.currentTarget.value)
          onChange?.(e)
        }}
        {...props}
      />
      {error && <CircleAlert className="[color:var(--ds-input-bordererror)]" />}
      <button
        type="button"
        data-slot="time-input-trigger"
        tabIndex={-1}
        aria-hidden
        disabled={disabled}
        onClick={openPicker}
        className="flex shrink-0 cursor-pointer disabled:cursor-not-allowed"
      >
        <Clock8 />
      </button>
    </div>
  )
}

type TimeInputFieldProps = TimeInputProps & {
  label?: string
  description?: string
  errorMessage?: string
  mandatory?: boolean
  tooltip?: React.ReactNode
}

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
  const generatedId = React.useId()
  const id = idProp ?? generatedId
  const hasError = error || !!errorMessage
  return (
    <div className={cn("flex w-full flex-col gap-[var(--ds-input-fieldgap)] items-start", className)}>
      {label && (
        <div className="flex items-center gap-1 [color:var(--ds-input-content)] [font-size:var(--ds-typography-labelmd-fontsize)] [line-height:var(--ds-typography-labelmd-lineheight)]">
          <label htmlFor={id}>
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
        <p className="[color:var(--ds-input-contenterror)] [font-size:var(--ds-typography-labelmd-fontsize)] [line-height:var(--ds-typography-labelmd-lineheight)] w-full">
          {errorMessage}
        </p>
      ) : description ? (
        <p className="[color:var(--ds-input-helper)] [font-size:var(--ds-typography-labelmd-fontsize)] [line-height:var(--ds-typography-labelmd-lineheight)] w-full">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export { TimeInput, TimeInputField, timeInputVariants }
