import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

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

export { ButtonGroup, buttonGroupVariants }
