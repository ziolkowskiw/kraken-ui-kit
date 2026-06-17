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

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
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
          "focus-visible:ring-2 focus-visible:[ring-color:var(--ds-color-border-focus)] focus-visible:ring-offset-1 [border-radius:var(--ds-card-radius)]",
          "disabled:pointer-events-none disabled:opacity-50",
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
              <div className="mx-3 h-[26px] w-px [background-color:var(--ds-color-border)]" />
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
        "flex flex-col gap-3 overflow-hidden transition-all",
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
