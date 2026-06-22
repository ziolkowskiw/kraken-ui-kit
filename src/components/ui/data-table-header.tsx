"use client"

// Mirrors the Figma `data-table/header` (1824:18391) — sortable column header
// cell with asc/desc/neutral sort icons and optional checkbox column.

import * as React from "react"
import { ArrowDownUp, ArrowUp, ArrowDown, SquareDashed } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Checkbox } from "./checkbox"
import { TooltipIcon, TooltipProvider } from "./tooltip"
import { Avatar } from "./avatar"

// ─── Sorting icons (data-table/sorting-icons 1385:14056) ──────────────────────
// default = unsorted (up/down), ascending = up, descending = down.

type SortVariant = "default" | "ascending" | "descending"
const SORT_ICON = { default: ArrowDownUp, ascending: ArrowUp, descending: ArrowDown }

function SortingIcons({
  variant = "default",
  className,
}: {
  variant?: SortVariant
  className?: string
}) {
  const Icon = SORT_ICON[variant]
  return (
    <span
      data-slot="sorting-icons"
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center [color:var(--ds-color-content-primary)]",
        className
      )}
    >
      <Icon className="size-3.5" />
    </span>
  )
}

// ─── Header decoration (data-table/header-decoration-left|right 1205:22478) ───
// One of: icon | sortable | checkbox | tooltip | avatar. Reuses the kit primitives.

type DecorationType = "icon" | "sortable" | "checkbox" | "tooltip" | "avatar"

type TableHeaderDecorationProps = {
  type?: DecorationType
  /** type="icon": the glyph to render (defaults to a dashed placeholder) */
  icon?: React.ReactNode
  /** type="sortable": current sort direction */
  sort?: SortVariant
  /** type="checkbox" */
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean) => void
  /** type="tooltip": tooltip content */
  tooltip?: React.ReactNode
  /** type="avatar": pass a configured <Avatar/>, otherwise a default xs avatar renders */
  avatar?: React.ReactNode
  className?: string
}

function TableHeaderDecoration({
  type = "icon",
  icon,
  sort = "default",
  checked,
  onCheckedChange,
  tooltip = "More information",
  avatar,
  className,
}: TableHeaderDecorationProps) {
  return (
    <span
      data-slot="table-header-decoration"
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      {type === "icon" &&
        (icon ?? <SquareDashed className="size-4 [color:var(--ds-color-content-tertiary)]" />)}
      {type === "sortable" && <SortingIcons variant={sort} />}
      {type === "checkbox" && (
        <Checkbox
          checked={checked === "indeterminate" ? undefined : checked}
          indeterminate={checked === "indeterminate"}
          onCheckedChange={onCheckedChange}
        />
      )}
      {type === "tooltip" && (
        <TooltipProvider>
          <TooltipIcon content={tooltip} />
        </TooltipProvider>
      )}
      {type === "avatar" && (avatar ?? <Avatar size="xs" fallback="" />)}
    </span>
  )
}

// ─── Header cell (data-table/header 1205:19194) ───────────────────────────────
// State: rest/hover/active → CSS pseudo-states; selected → `selected` prop.

const tableHeaderVariants = cva(
  [
    "group/th relative flex h-8 flex-1 items-center gap-1 px-2 py-[7px] whitespace-nowrap select-none",
    "[font-size:var(--ds-typography-labellg-fontsize)] [font-weight:var(--ds-typography-labellg-fontweight)] [line-height:var(--ds-typography-labellg-lineheight)]",
    "[color:var(--ds-color-content-primary)]",
    "[background-color:var(--ds-color-muted)]",
    "hover:[background-color:var(--ds-color-secondary-hover)]",
    "active:[background-color:var(--ds-color-secondary-active)]",
    "data-[selected]:[background-color:var(--ds-color-primary-muted)]",
    "data-[selected]:hover:[background-color:var(--ds-color-primary-muted)]",
  ].join(" "),
  {
    variants: {
      alignment: { left: "justify-start text-left", right: "justify-end text-right" },
    },
    defaultVariants: { alignment: "left" },
  }
)

type TableHeaderProps = React.ComponentProps<"div"> &
  VariantProps<typeof tableHeaderVariants> & {
    label?: string
    showLabel?: boolean
    selected?: boolean
    showBorder?: boolean
    empty?: boolean
    leftDecoration?: React.ReactNode
    rightDecoration?: React.ReactNode
  }

function TableHeader({
  className,
  alignment,
  label = "Table heading",
  showLabel = true,
  selected,
  showBorder,
  empty,
  leftDecoration,
  rightDecoration,
  ...props
}: TableHeaderProps) {
  return (
    <div
      data-slot="table-header"
      role="columnheader"
      data-selected={selected || undefined}
      className={cn(tableHeaderVariants({ alignment }), className)}
      {...props}
    >
      {!empty && leftDecoration}
      {!empty && showLabel && <span className="min-w-0 truncate">{label}</span>}
      {!empty && rightDecoration}
      {showBorder && (
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px [background-color:var(--ds-color-border-subtle)]"
        />
      )}
    </div>
  )
}

// ─── Header row (Table header row 1343:9008) ──────────────────────────────────
// Slot container that lays out TableHeader cells across the table width.

function TableHeaderRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-header-row"
      role="row"
      className={cn(
        "flex w-full items-stretch px-1.5 [background-color:var(--ds-color-muted)]",
        className
      )}
      {...props}
    />
  )
}

export {
  SortingIcons,
  TableHeaderDecoration,
  TableHeader,
  TableHeaderRow,
  tableHeaderVariants,
}
