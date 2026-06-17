"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { TooltipIcon, TooltipProvider } from "./tooltip"

// ─── Table title / section title (Container/Title 1411:15601, ──────────────────
//     Container/Section title 1411:15724) ──────────────────────────────────────
// Same structure (title + tooltip on the left, action buttons on the right);
// `variant` swaps the background + title colour.

const tableTitleVariants = cva("flex w-full items-center gap-1", {
  variants: {
    variant: {
      title: "[background-color:var(--ds-color-primary-muted)] px-4 py-3 rounded-t-lg",
      section: "[background-color:var(--ds-color-surface)] px-4 pt-4 pb-2",
    },
  },
  defaultVariants: { variant: "title" },
})

type TableTitleProps = React.ComponentProps<"div"> &
  VariantProps<typeof tableTitleVariants> & {
    title?: string
    showTooltip?: boolean
    tooltip?: React.ReactNode
    showAction?: boolean
    /** override the default ghost/secondary/primary action buttons */
    actions?: React.ReactNode
  }

function TableTitle({
  className,
  variant = "title",
  title = "Table title",
  showTooltip = true,
  tooltip = "More information",
  showAction = true,
  actions,
  ...props
}: TableTitleProps) {
  return (
    <div data-slot="table-title" data-variant={variant} className={cn(tableTitleVariants({ variant }), className)} {...props}>
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <span
          className={cn(
            "font-heading truncate [font-size:var(--ds-typography-headingmd-fontsize)] [font-weight:var(--ds-typography-headingmd-fontweight)] [line-height:var(--ds-typography-headingmd-lineheight)]",
            variant === "section"
              ? "[color:var(--ds-color-content-primary)]"
              : "[color:var(--ds-button-primary-content)]"
          )}
        >
          {title}
        </span>
        {showTooltip && (
          <TooltipProvider>
            <TooltipIcon content={tooltip} />
          </TooltipProvider>
        )}
      </div>
      {showAction && (
        <div className="flex shrink-0 items-center gap-2">
          {actions ?? (
            <>
              <Button variant="ghost" size="sm">
                Action verb
              </Button>
              <Button variant="secondary" size="sm">
                Action verb
              </Button>
              <Button variant="primary" size="sm">
                Action verb
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Table body row (data-table/row 1333:8324) ────────────────────────────────
// Background by `variant`; hover/pressed are CSS-only and opt-in via `interactive`.

const tableRowVariants = cva("flex w-full items-stretch min-h-7 p-1.5", {
  variants: {
    variant: {
      white: "[background-color:var(--ds-color-background)]",
      grey: "[background-color:var(--ds-color-surface)]",
      selected: "[background-color:var(--ds-color-primary-muted)]",
    },
    interactive: {
      true: "cursor-pointer hover:[background-color:var(--ds-color-muted)] active:[background-color:var(--ds-color-secondary-active)]",
      false: "",
    },
  },
  defaultVariants: { variant: "white", interactive: false },
})

type TableRowProps = React.ComponentProps<"div"> & VariantProps<typeof tableRowVariants>

function TableRow({ className, variant, interactive, ...props }: TableRowProps) {
  return (
    <div
      data-slot="table-row"
      role="row"
      className={cn(tableRowVariants({ variant, interactive }), className)}
      {...props}
    />
  )
}

// ─── Data table container (Data table 2225:12619) ─────────────────────────────
// Vertical stack of title / header row / body rows / section titles.

function DataTable({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-table"
      role="table"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-lg border border-solid",
        "[border-color:var(--ds-color-border)] [background-color:var(--ds-color-background)]",
        className
      )}
      {...props}
    />
  )
}

export {
  TableTitle,
  TableRow,
  DataTable,
  tableTitleVariants,
  tableRowVariants,
}
