import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma `item` set (1707:23695): Variant=default|muted|outline × State
// (hover→CSS), with left/right decoration slots (`item/decoration-left|right`) and
// a title/description stack. Title = labellg/content-primary, description =
// bodymd/content-secondary.
const itemVariants = cva(
  [
    "group/item flex items-center gap-3 transition-colors outline-none",
    "[padding-block:var(--ds-spacing-component-md)] [padding-inline:var(--ds-spacing-component-lg)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "[border-radius:var(--ds-radius-md)] hover:[background-color:var(--ds-color-muted)]",
        outline:
          "border [border-color:var(--ds-color-border)] [border-radius:var(--ds-radius-md)] hover:[background-color:var(--ds-color-muted)]",
        muted:
          "[background-color:var(--ds-color-muted)] [border-radius:var(--ds-radius-md)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Item({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return (
    <div
      data-slot="item"
      data-variant={variant}
      className={cn(itemVariants({ variant }), className)}
      {...props}
    />
  )
}

function ItemMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-media"
      className={cn(
        "flex shrink-0 items-center justify-center [color:var(--ds-color-icon-default)] [&_svg]:size-5",
        className
      )}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "truncate [color:var(--ds-color-content-primary)] [font-family:var(--ds-typography-labellg-fontfamily)] [font-size:var(--ds-typography-labellg-fontsize)] [font-weight:var(--ds-typography-labellg-fontweight)] [line-height:var(--ds-typography-labellg-lineheight)]",
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "line-clamp-2 [color:var(--ds-color-content-secondary)] [font-family:var(--ds-typography-bodymd-fontfamily)] [font-size:var(--ds-typography-bodymd-fontsize)] [line-height:var(--ds-typography-bodymd-lineheight)]",
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  itemVariants,
}
