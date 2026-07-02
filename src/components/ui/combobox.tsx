"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { menuPopupClasses, menuItemClasses } from "./dropdown-menu"
import { TooltipIcon, TooltipProvider } from "./tooltip"

// Mirrors the Figma `combobox` set (Dropdown-menu page): a searchable select with
// label/help/error chrome, optional clear, and a `--ds-color-popover` dropdown.
// State=rest|hover|focus|disabled|error × Size × Filled. Built on Base UI's
// Combobox; items reuse the shared menu-item styling.
const Combobox = ComboboxPrimitive.Root

function ComboboxGroup({ ...props }: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group data-slot="combobox-group" {...props} />
}

function ComboboxSeparator({ ...props }: ComboboxPrimitive.Separator.Props) {
  return <ComboboxPrimitive.Separator data-slot="combobox-separator" {...props} />
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "px-2 py-1.5 [color:var(--ds-color-muted-foreground)] [font-size:var(--ds-typography-labelsm-fontsize)] font-medium",
        className
      )}
      {...props}
    />
  )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection {...props} />
}

function ComboboxTrigger({ className, children, ...props }: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*=size-])]:size-4", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-4 [color:var(--ds-color-muted-foreground)]" />
    </ComboboxPrimitive.Trigger>
  )
}

/** Anchor ref for positioning ComboboxContent against a custom element. */
function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      className={cn(
        "flex items-center justify-center rounded-sm opacity-60 outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:[--tw-ring-color:var(--ds-color-ring)]",
        className
      )}
      aria-label="Clear selection"
      {...props}
    >
      <XIcon className="size-4" />
    </ComboboxPrimitive.Clear>
  )
}

/* Multi-select surface: a chips container that doubles as the input row.
 * Chips bind the --ds-chip-* Layer-3 tokens (outlined skin). */
function ComboboxChips({ className, ...props }: ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1 border px-2 py-1 transition-colors",
        "[border-width:var(--ds-input-borderwidth)] [border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)] [border-radius:var(--ds-input-size-md-radius)] [font-size:var(--ds-input-size-md-fontsize)]",
        "hover:[border-color:var(--ds-input-borderhover)] focus-within:[border-color:var(--ds-input-borderfocus)]",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & { showRemove?: boolean }) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex w-fit items-center justify-center gap-1 whitespace-nowrap border",
        "[height:var(--ds-chip-size-md-height)] [padding-inline:var(--ds-chip-size-md-paddingx)] [font-size:var(--ds-chip-size-md-fontsize)] [border-radius:var(--ds-chip-size-md-radius)]",
        "[background-color:var(--ds-chip-outlined-fill)] [color:var(--ds-chip-outlined-content)] [border-color:var(--ds-chip-outlined-border)]",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          data-slot="combobox-chip-remove"
          className="-mr-0.5 flex items-center justify-center rounded-sm opacity-60 hover:opacity-100"
          aria-label="Remove"
        >
          <XIcon className="size-3" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "min-w-16 flex-1 border-none bg-transparent outline-none [color:var(--ds-input-content)] placeholder:[color:var(--ds-input-placeholder)]",
        className
      )}
      {...props}
    />
  )
}

const comboboxInputVariants = cva(
  [
    "flex w-full items-center gap-1.5 border transition-colors outline-none",
    "[border-width:var(--ds-input-borderwidth)] [border-color:var(--ds-input-bordercolor)] [background-color:var(--ds-input-fill)]",
    "hover:[border-color:var(--ds-input-borderhover)] focus-within:[border-color:var(--ds-input-borderfocus)]",
    "has-[input:disabled]:[background-color:var(--ds-input-filldisabled)] has-[input:disabled]:opacity-50 has-[input:disabled]:cursor-not-allowed",
    "has-[input[aria-invalid=true]]:[border-color:var(--ds-input-bordererror)]",
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

function ComboboxInput({
  className,
  size,
  showClear = true,
  error,
  ...props
}: Omit<ComboboxPrimitive.Input.Props, "size"> &
  VariantProps<typeof comboboxInputVariants> & { showClear?: boolean; error?: boolean }) {
  return (
    <div data-slot="combobox-input" className={cn(comboboxInputVariants({ size }), className)}>
      <ComboboxPrimitive.Input
        aria-invalid={error || undefined}
        className="min-w-0 flex-1 bg-transparent outline-none [color:var(--ds-input-value)] placeholder:[color:var(--ds-input-placeholder)]"
        {...props}
      />
      {showClear && (
        <ComboboxPrimitive.Clear
          aria-label="Clear"
          className="grid size-4 place-items-center [color:var(--ds-color-icon-muted)] hover:[color:var(--ds-color-content-primary)] outline-none data-[empty]:hidden"
        >
          <XIcon className="size-4" />
        </ComboboxPrimitive.Clear>
      )}
      <ComboboxPrimitive.Trigger
        aria-label="Open"
        className="grid size-4 place-items-center [color:var(--ds-select-icon)] outline-none"
      >
        <ChevronDownIcon className="size-4" />
      </ComboboxPrimitive.Trigger>
    </div>
  )
}

function ComboboxContent({
  className,
  children,
  ...props
}: ComboboxPrimitive.Popup.Props) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner sideOffset={4} className="isolate z-50 w-(--anchor-width)">
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(menuPopupClasses, "w-(--anchor-width) min-w-[8rem]", className)}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList(props: ComboboxPrimitive.List.Props) {
  return <ComboboxPrimitive.List data-slot="combobox-list" {...props} />
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn("px-2 py-4 text-center text-sm [color:var(--ds-color-content-tertiary)]", className)}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(menuItemClasses, "pr-8", className)}
      {...props}
    >
      <span className="flex-1">{children}</span>
      <ComboboxPrimitive.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon className="size-4" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroupLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-group-label"
      className={cn("px-2 py-1.5 [color:var(--ds-color-muted-foreground)] [font-size:var(--ds-typography-labelsm-fontsize)] font-medium", className)}
      {...props}
    />
  )
}

type ComboboxFieldProps = ComboboxPrimitive.Root.Props<unknown, false> & {
  label?: string
  description?: string
  errorMessage?: string
  mandatory?: boolean
  tooltip?: React.ReactNode
  placeholder?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

function ComboboxField({
  label,
  description,
  errorMessage,
  mandatory,
  tooltip,
  placeholder,
  size,
  className,
  children,
  ...props
}: ComboboxFieldProps) {
  const hasError = !!errorMessage
  return (
    <Combobox {...props}>
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
        <ComboboxInput size={size} placeholder={placeholder} error={hasError} />
        {children}
        {hasError ? (
          <p className="[color:var(--ds-input-contenterror)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] w-full">
            {errorMessage}
          </p>
        ) : description ? (
          <p className="[color:var(--ds-input-placeholder)] [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)] w-full">
            {description}
          </p>
        ) : null}
      </div>
    </Combobox>
  )
}

export {
  Combobox,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxTrigger,
  useComboboxAnchor,
  ComboboxValue,
  ComboboxClear,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxSeparator,
  ComboboxField,
  comboboxInputVariants,
}
