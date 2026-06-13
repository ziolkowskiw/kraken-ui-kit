import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma `button` component set (1854:52960): Variant × Size +
// iconOnly + left/right icon slots. Figma's State axis (rest/hover/focus/active/
// disabled) maps to CSS states here — only `disabled` is a real prop. Each
// variant sets local --btn-* vars from its Layer-3 tokens; the base consumes them.
const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 select-none items-center justify-center gap-1.5 border whitespace-nowrap transition-colors outline-none",
    "[background-color:var(--btn-fill)] [color:var(--btn-content)] [border-color:var(--btn-border,transparent)]",
    "hover:[background-color:var(--btn-fill-hover)] active:[background-color:var(--btn-fill-active)]",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:[background-color:var(--btn-fill-disabled)] disabled:[color:var(--btn-content-disabled)] disabled:[border-color:var(--btn-border-disabled,transparent)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "[--btn-fill:var(--ds-button-primary-fill)] [--btn-fill-hover:var(--ds-button-primary-fillhover)] [--btn-fill-active:var(--ds-button-primary-fillactive)] [--btn-fill-disabled:var(--ds-button-primary-filldisabled)] [--btn-content:var(--ds-button-primary-content)] [--btn-content-disabled:var(--ds-button-primary-contentdisabled)]",
        secondary:
          "[--btn-fill:var(--ds-button-secondary-fill)] [--btn-fill-hover:var(--ds-button-secondary-fillhover)] [--btn-fill-active:var(--ds-button-secondary-fillactive)] [--btn-fill-disabled:var(--ds-button-secondary-filldisabled)] [--btn-content:var(--ds-button-secondary-content)] [--btn-content-disabled:var(--ds-button-secondary-contentdisabled)] [--btn-border:var(--ds-button-secondary-border)]",
        tonal:
          "[--btn-fill:var(--ds-button-tonal-fill)] [--btn-fill-hover:var(--ds-button-tonal-fillhover)] [--btn-fill-active:var(--ds-button-tonal-fillactive)] [--btn-fill-disabled:var(--ds-button-tonal-filldisabled)] [--btn-content:var(--ds-button-tonal-content)] [--btn-content-disabled:var(--ds-button-tonal-contentdisabled)]",
        ghost:
          "[--btn-fill:var(--ds-button-ghost-fill)] [--btn-fill-hover:var(--ds-button-ghost-fillhover)] [--btn-fill-active:var(--ds-button-ghost-fillactive)] [--btn-fill-disabled:var(--ds-button-ghost-filldisabled)] [--btn-content:var(--ds-button-ghost-content)] [--btn-content-disabled:var(--ds-button-ghost-contentdisabled)]",
        destructive:
          "[--btn-fill:var(--ds-button-destructive-fill)] [--btn-fill-hover:var(--ds-button-destructive-fillhover)] [--btn-fill-active:var(--ds-button-destructive-fillactive)] [--btn-fill-disabled:var(--ds-button-destructive-filldisabled)] [--btn-content:var(--ds-button-destructive-content)] [--btn-content-disabled:var(--ds-button-destructive-contentdisabled)]",
        "destructive-secondary":
          "[--btn-fill:var(--ds-button-destructivesecondary-fill)] [--btn-fill-hover:var(--ds-button-destructivesecondary-fillhover)] [--btn-fill-active:var(--ds-button-destructivesecondary-fillactive)] [--btn-fill-disabled:var(--ds-button-destructivesecondary-filldisabled)] [--btn-content:var(--ds-button-destructivesecondary-content)] [--btn-content-disabled:var(--ds-button-destructivesecondary-contentdisabled)] [--btn-border:var(--ds-button-destructivesecondary-border)] [--btn-border-disabled:var(--ds-button-destructivesecondary-borderdisabled)]",
        "destructive-ghost":
          "[--btn-fill:var(--ds-button-destructiveghost-fill)] [--btn-fill-hover:var(--ds-button-destructiveghost-fillhover)] [--btn-fill-active:var(--ds-button-destructiveghost-fillactive)] [--btn-fill-disabled:var(--ds-button-destructiveghost-filldisabled)] [--btn-content:var(--ds-button-destructiveghost-content)] [--btn-content-disabled:var(--ds-button-destructiveghost-contentdisabled)] [--btn-border:var(--ds-button-destructiveghost-border)] [--btn-border-disabled:var(--ds-button-destructiveghost-borderdisabled)]",
      },
      size: {
        xs: "[height:var(--ds-button-size-xs-height)] [padding-inline:var(--ds-button-size-xs-paddingx)] [font-size:var(--ds-button-size-xs-fontsize)] [font-weight:var(--ds-button-size-xs-fontweight)] [border-radius:var(--ds-button-size-xs-radius)] gap-1 [&_svg]:size-3",
        sm: "[height:var(--ds-button-size-sm-height)] [padding-inline:var(--ds-button-size-sm-paddingx)] [font-size:var(--ds-button-size-sm-fontsize)] [font-weight:var(--ds-button-size-sm-fontweight)] [border-radius:var(--ds-button-size-sm-radius)] gap-1 [&_svg]:size-3.5",
        md: "[height:var(--ds-button-size-md-height)] [padding-inline:var(--ds-button-size-md-paddingx)] [font-size:var(--ds-button-size-md-fontsize)] [font-weight:var(--ds-button-size-md-fontweight)] [border-radius:var(--ds-button-size-md-radius)] [&_svg]:size-4",
        lg: "[height:var(--ds-button-size-lg-height)] [padding-inline:var(--ds-button-size-lg-paddingx)] [font-size:var(--ds-button-size-lg-fontsize)] [font-weight:var(--ds-button-size-lg-fontweight)] [border-radius:var(--ds-button-size-lg-radius)] [&_svg]:size-4",
      },
      iconOnly: { true: "aspect-square", false: "" },
    },
    compoundVariants: [
      // icon-only uses a square padding token per size
      { iconOnly: true, size: "xs", class: "[padding-inline:var(--ds-button-size-xs-icononlypadding)]" },
      { iconOnly: true, size: "sm", class: "[padding-inline:var(--ds-button-size-sm-icononlypadding)]" },
      { iconOnly: true, size: "md", class: "[padding-inline:var(--ds-button-size-md-icononlypadding)]" },
      { iconOnly: true, size: "lg", class: "[padding-inline:var(--ds-button-size-lg-icononlypadding)]" },
      // ghost has its own horizontal padding when it has a label
      { variant: "ghost", iconOnly: false, size: "xs", class: "[padding-inline:var(--ds-button-ghost-size-xs-paddingx)]" },
      { variant: "ghost", iconOnly: false, size: "sm", class: "[padding-inline:var(--ds-button-ghost-size-sm-paddingx)]" },
      { variant: "ghost", iconOnly: false, size: "md", class: "[padding-inline:var(--ds-button-ghost-size-md-paddingx)]" },
      { variant: "ghost", iconOnly: false, size: "lg", class: "[padding-inline:var(--ds-button-ghost-size-lg-paddingx)]" },
    ],
    defaultVariants: { variant: "primary", size: "md", iconOnly: false },
  }
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
  }

function Button({
  className,
  variant,
  size,
  iconOnly,
  leftIcon,
  rightIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, iconOnly }), className)}
      {...props}
    >
      {iconOnly ? (
        leftIcon ?? rightIcon ?? children
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
