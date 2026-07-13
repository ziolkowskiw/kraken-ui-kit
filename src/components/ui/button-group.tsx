import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "./separator"

// Mirrors the Figma `button-group-container` slot (Button group page, 699:1902):
// a row/column of <Button>s that read as one segmented control — inner radii are
// flattened and borders collapse into shared seams. Children are real <Button>s
// (single source of truth); this only handles the grouping geometry.
const buttonGroupVariants = cva(
  [
    "flex w-fit items-stretch",
    "[&>*]:focus-visible:z-10 [&>*]:focus-within:z-10",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: [
          "flex-row",
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
          "[&>*:not(:first-child)]:-ml-px",
        ].join(" "),
        vertical: [
          "flex-col",
          "[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
          "[&>*:not(:first-child)]:-mt-px",
        ].join(" "),
      },
    },
    defaultVariants: { orientation: "horizontal" },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn("relative self-stretch !h-auto", className)}
      {...props}
    />
  )
}

function ButtonGroupText({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="button-group-text"
      className={cn(
        "flex items-center gap-2 border [border-color:var(--ds-color-border)] [background-color:var(--ds-color-muted)] [color:var(--ds-color-content-secondary)]",
        "[height:var(--ds-button-size-md-height)] [padding-inline:var(--ds-button-size-md-paddingx)] [border-radius:var(--ds-button-size-md-radius)] [font-size:var(--ds-button-size-md-fontsize)]",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants }
