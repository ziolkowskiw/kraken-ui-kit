"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const accordionItemVariants = cva("flex flex-col", {
  variants: {
    variant: {
      "in-box": [
        "[background-color:var(--ds-color-surface)]",
        "border [border-color:var(--ds-color-secondary-hover)] [border-radius:var(--ds-card-radius)]",
      ].join(" "),
      standalone: "",
    },
  },
  defaultVariants: { variant: "in-box" },
})

type AccordionRootProps = Omit<AccordionPrimitive.Root.Props, "multiple"> & {
  /**
   * Whether one (`"single"`) or many (`"multiple"`) items can be open at the
   * same time. Mirrors the shadcn/Radix `type` API. Maps to Base UI's
   * `multiple` boolean internally.
   * @default "single"
   */
  type?: "single" | "multiple"
}

function Accordion({ className, type = "single", children, ...props }: AccordionRootProps) {
  // Base UI matches `defaultValue`/`value` against each item's `value`, which
  // defaults to an auto-generated id (not the item index). Assign an index-based
  // value to any AccordionItem that doesn't set one, so `defaultValue={[0]}` and
  // friends resolve predictably.
  const items = React.Children.map(children, (child, index) =>
    React.isValidElement(child) &&
    (child.props as { value?: unknown }).value === undefined
      ? React.cloneElement(child as React.ReactElement<{ value?: unknown }>, {
          value: index,
        })
      : child
  )

  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      multiple={type === "multiple"}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {items}
    </AccordionPrimitive.Root>
  )
}

function AccordionItem({
  className,
  variant,
  ...props
}: AccordionPrimitive.Item.Props & VariantProps<typeof accordionItemVariants>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      data-variant={variant}
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  title,
  subtitle,
  hasSubtitle = true,
  icon,
  hasIcon = true,
  compact = false,
  ...props
}: AccordionPrimitive.Trigger.Props & {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  hasSubtitle?: boolean
  icon?: React.ReactNode
  hasIcon?: boolean
  compact?: boolean
}) {
  return (
    <AccordionPrimitive.Header data-slot="accordion-header">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex w-full cursor-pointer items-center justify-between outline-none transition-colors",
          "[padding-inline:var(--ds-spacing-component-lg)]",
          compact
            ? "[padding-block:var(--ds-spacing-component-lg)]"
            : "[padding-block:var(--ds-spacing-component-xl)]",
          "focus-visible:ring-2 focus-visible:[--tw-ring-color:var(--ds-color-border-focus)] focus-visible:ring-offset-1 [border-radius:var(--ds-card-radius)]",
          // Base UI strips the native `disabled` attr on composite triggers, so
          // hook the disabled look on data-disabled / aria-disabled instead.
          "aria-disabled:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          className
        )}
        {...props}
      >
        <div className="flex items-center">
          {hasIcon && icon && (
            <div className="flex items-start px-1.5">
              <span className="size-6 [color:var(--ds-color-content-primary)] [&_svg]:size-6">
                {icon}
              </span>
            </div>
          )}
          <span
            className={cn(
              "[color:var(--ds-color-content-primary)] whitespace-nowrap text-left",
              "[font-family:var(--ds-typography-headingmd-fontfamily)] [font-size:var(--ds-typography-headingmd-fontsize)] [font-weight:var(--ds-typography-headingmd-fontweight)] [line-height:var(--ds-typography-headingmd-lineheight)]",
            )}
          >
            {title ?? children}
          </span>
          {hasSubtitle && subtitle && (
            <>
              <div className="mx-3 w-px self-stretch [background-color:var(--ds-color-border)]" />
              <span
                className={cn(
                  "[color:var(--ds-color-content-secondary)] whitespace-nowrap",
                  "[font-family:var(--ds-typography-bodylg-fontfamily)] [font-size:var(--ds-typography-bodylg-fontsize)] [font-weight:var(--ds-typography-bodylg-fontweight)] [line-height:var(--ds-typography-bodylg-lineheight)]",
                )}
              >
                {subtitle}
              </span>
            </>
          )}
        </div>
        <ChevronDown className="size-6 shrink-0 [color:var(--ds-color-content-secondary)] transition-transform duration-200 group-data-[panel-open]/trigger:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  contentTitle,
  hasTitle = true,
  linkButton,
  hasLinkButton = false,
  ...props
}: AccordionPrimitive.Panel.Props & {
  contentTitle?: React.ReactNode
  hasTitle?: boolean
  linkButton?: React.ReactNode
  hasLinkButton?: boolean
}) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className={cn(
        "flex flex-col gap-3 overflow-hidden",
        // Animate height between 0 and the panel's measured height. Base UI sets
        // --accordion-panel-height on the element and toggles data-starting-style
        // (entering) / data-ending-style (leaving).
        "h-[var(--accordion-panel-height)] transition-[height,opacity] duration-200 ease-out",
        "data-[starting-style]:h-0 data-[ending-style]:h-0 data-[ending-style]:opacity-0",
        "[padding-inline:var(--ds-spacing-component-lg)] [padding-bottom:var(--ds-spacing-component-xl)]",
        className
      )}
      {...props}
    >
      <div className="h-px w-full [background-color:var(--ds-color-border)]" />
      {hasTitle && contentTitle && (
        <p className="[font-family:var(--ds-typography-headingmd-fontfamily)] [font-size:var(--ds-typography-headingmd-fontsize)] [font-weight:var(--ds-typography-headingmd-fontweight)] [line-height:var(--ds-typography-headingmd-lineheight)] [color:var(--ds-color-content-primary)]">
          {contentTitle}
        </p>
      )}
      <div className="[font-family:var(--ds-typography-bodymd-fontfamily)] [font-size:var(--ds-typography-bodymd-fontsize)] [font-weight:var(--ds-typography-bodymd-fontweight)] [line-height:var(--ds-typography-bodymd-lineheight)] [color:var(--ds-color-content-primary)]">
        {children}
      </div>
      {hasLinkButton && linkButton}
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
