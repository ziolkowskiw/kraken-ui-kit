"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { TooltipIcon, TooltipProvider } from "./tooltip"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left [color:var(--ds-select-value)]", className)}
      {...props}
    />
  )
}

const selectTriggerVariants = cva(
  [
    "flex w-fit items-center justify-between border-solid transition-colors outline-none select-none",
    "[border-width:var(--ds-select-borderwidth)] [background-color:var(--ds-select-fill)] [border-color:var(--ds-select-bordercolor)]",
    "[padding-right:var(--ds-select-paddingright)]",
    "hover:[border-color:var(--ds-input-borderhover)]",
    "focus-visible:[border-color:var(--ds-input-borderfocus)]",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:[border-color:var(--ds-select-borderdisabled)]",
    "aria-invalid:[border-color:var(--ds-select-bordererror)]",
    "data-placeholder:[color:var(--ds-input-placeholder)]",
    "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "[min-height:var(--ds-select-size-sm-minheight)] [padding-left:var(--ds-select-size-sm-paddingleft)] [padding-block:var(--ds-select-size-sm-paddingy)] [gap:var(--ds-select-size-sm-gap)] [border-radius:var(--ds-input-size-sm-radius)] [font-size:var(--ds-input-size-sm-fontsize)]",
        md: "[min-height:var(--ds-select-size-md-minheight)] [padding-left:var(--ds-select-size-md-paddingleft)] [padding-block:var(--ds-select-size-md-paddingy)] [gap:var(--ds-select-size-md-gap)] [border-radius:var(--ds-input-size-md-radius)] [font-size:var(--ds-input-size-md-fontsize)]",
        lg: "[min-height:var(--ds-select-size-lg-minheight)] [padding-left:var(--ds-select-size-lg-paddingleft)] [padding-block:var(--ds-select-size-lg-paddingy)] [gap:var(--ds-select-size-lg-gap)] [border-radius:var(--ds-input-size-lg-radius)] [font-size:var(--ds-input-size-lg-fontsize)]",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function SelectTrigger({
  className,
  size,
  children,
  ...props
}: SelectPrimitive.Trigger.Props & VariantProps<typeof selectTriggerVariants>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(selectTriggerVariants({ size }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="pointer-events-none size-4 [color:var(--ds-select-icon)]" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg",
            "[background-color:var(--ds-color-popover)] [color:var(--ds-color-popover-foreground)]",
            "[box-shadow:var(--ds-shadow-overlay)] ring-1 ring-foreground/10",
            "duration-100 data-[align-trigger=true]:animate-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-1.5 py-1 text-xs [color:var(--ds-color-muted-foreground)]", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none",
        "focus:[background-color:var(--ds-menuitem-fillhover)] focus:[color:var(--ds-menuitem-content)]",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px [background-color:var(--ds-color-border)]", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center [background-color:var(--ds-color-popover)] py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center [background-color:var(--ds-color-popover)] py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

type SelectFieldProps = {
  label?: string
  description?: string
  errorMessage?: string
  error?: boolean
  mandatory?: boolean
  /** When provided, shows the ⓘ tooltip-icon trigger next to the label. */
  tooltip?: React.ReactNode
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  placeholder?: string
  children: React.ReactNode
  className?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string | null) => void
  "aria-label"?: string
}

function SelectField({
  label,
  description,
  errorMessage,
  error,
  mandatory,
  tooltip,
  size,
  disabled,
  placeholder,
  children,
  className,
  value,
  defaultValue,
  onValueChange,
  "aria-label": ariaLabel,
}: SelectFieldProps) {
  const labelId = React.useId()
  const hasError = error || !!errorMessage
  return (
    <div className={cn("flex w-full flex-col gap-[var(--ds-spacing-component-sm)] items-start", className)}>
      {label && (
        <div className="flex items-center gap-1 h-4">
          <span id={labelId} className="[color:var(--ds-input-content)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)]">
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
      <Select value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          size={size}
          className="w-full"
          aria-invalid={hasError || undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-label={!label ? ariaLabel : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
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

export {
  Select,
  SelectContent,
  SelectField,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
}
