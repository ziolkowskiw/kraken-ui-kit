import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma `badge` component set (619:6877): Color × Appearance × Size
// × Shape + left/right icon slots. Every visual value binds a Layer-3 token
// (--ds-badge-*). `color` sets three local vars; `appearance` decides which apply.
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 border whitespace-nowrap transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none",
  {
    variants: {
      color: {
        neutral:
          "[--badge-fill:var(--ds-badge-slate-fill)] [--badge-content:var(--ds-badge-slate-content)] [--badge-border:var(--ds-badge-slate-border)]",
        brand:
          "[--badge-fill:var(--ds-badge-brand-fill)] [--badge-content:var(--ds-badge-brand-content)] [--badge-border:var(--ds-badge-brand-border)]",
        green:
          "[--badge-fill:var(--ds-badge-green-fill)] [--badge-content:var(--ds-badge-green-content)] [--badge-border:var(--ds-badge-green-border)]",
        red: "[--badge-fill:var(--ds-badge-red-fill)] [--badge-content:var(--ds-badge-red-content)] [--badge-border:var(--ds-badge-red-border)]",
        orange:
          "[--badge-fill:var(--ds-badge-orange-fill)] [--badge-content:var(--ds-badge-orange-content)] [--badge-border:var(--ds-badge-orange-border)]",
        amber:
          "[--badge-fill:var(--ds-badge-amber-fill)] [--badge-content:var(--ds-badge-amber-content)] [--badge-border:var(--ds-badge-amber-border)]",
        blue: "[--badge-fill:var(--ds-badge-blue-fill)] [--badge-content:var(--ds-badge-blue-content)] [--badge-border:var(--ds-badge-blue-border)]",
        purple:
          "[--badge-fill:var(--ds-badge-purple-fill)] [--badge-content:var(--ds-badge-purple-content)] [--badge-border:var(--ds-badge-purple-border)]",
      },
      appearance: {
        filled:
          "[background-color:var(--badge-fill)] [color:var(--badge-content)] [border-color:var(--badge-border)]",
        outlined:
          "[background-color:transparent] [color:var(--badge-content)] [border-color:var(--badge-border)]",
        ghost:
          "[background-color:transparent] [color:var(--badge-content)] [border-color:transparent]",
      },
      size: {
        sm: "[min-height:var(--ds-badge-size-sm-height)] [padding-inline:var(--ds-badge-size-sm-paddingx)] [padding-block:var(--ds-badge-size-sm-paddingy)] [font-size:var(--ds-badge-size-sm-fontsize)] [font-weight:var(--ds-badge-size-sm-fontweight)] [&>svg]:size-3",
        md: "[min-height:var(--ds-badge-size-md-height)] [padding-inline:var(--ds-badge-size-md-paddingx)] [padding-block:var(--ds-badge-size-md-paddingy)] [font-size:var(--ds-badge-size-md-fontsize)] [font-weight:var(--ds-badge-size-md-fontweight)] [&>svg]:size-3.5",
        lg: "[min-height:var(--ds-badge-size-lg-height)] [padding-inline:var(--ds-badge-size-lg-paddingx)] [padding-block:var(--ds-badge-size-lg-paddingy)] [font-size:var(--ds-badge-size-lg-fontsize)] [font-weight:var(--ds-badge-size-lg-fontweight)] [&>svg]:size-4",
      },
      // Radius depends on size + shape (see compoundVariants).
      shape: { round: "", square: "" },
    },
    compoundVariants: [
      { size: "sm", shape: "round", class: "[border-radius:var(--ds-badge-size-sm-radiusfull)]" },
      { size: "md", shape: "round", class: "[border-radius:var(--ds-badge-size-md-radius)]" },
      { size: "lg", shape: "round", class: "[border-radius:var(--ds-badge-size-lg-radiusfull)]" },
      { size: "sm", shape: "square", class: "[border-radius:var(--ds-badge-size-sm-radiussquare)]" },
      { size: "md", shape: "square", class: "[border-radius:var(--ds-badge-size-md-radiussquare)]" },
      { size: "lg", shape: "square", class: "[border-radius:var(--ds-badge-size-lg-radiussquare)]" },
    ],
    defaultVariants: {
      color: "neutral",
      appearance: "filled",
      size: "md",
      shape: "round",
    },
  }
)

function Badge({
  className,
  color,
  appearance,
  size,
  shape,
  leftIcon,
  rightIcon,
  children,
  render,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
  }) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ color, appearance, size, shape }), className),
        children: (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        ),
      },
      props
    ),
    render,
    state: { slot: "badge", color, appearance, size, shape },
  })
}

export { Badge, badgeVariants }
