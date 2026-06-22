"use client"

// Mirrors the Figma `data-table/cell` (1824:18395) — a table data cell with
// optional inline controls (input, select, badge, checkbox, button, action menu).

import * as React from "react"
import {
  SquareDashed,
  ArrowRight,
  Pencil,
  Download,
  Trash2,
  EllipsisVertical,
  File as FileIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { Input } from "./input"

// data-table/cell (1227:14311). One cell of body content. `type` selects what the
// cell renders; `alignment` flips horizontal alignment. Reuses Badge/Button/
// Checkbox/Input. Cell text = bodySm; the row supplies vertical padding.

type CellType =
  | "text"
  | "text 2 rows"
  | "link"
  | "diff"
  | "icon + text"
  | "icon only"
  | "checkbox"
  | "action overflow"
  | "actions icon"
  | "action text"
  | "badge"
  | "file"
  | "input"

type CellAlignment = "left" | "right"

type DataTableCellProps = {
  type?: CellType
  alignment?: CellAlignment
  /** primary value (text, link, diff "new", icon+text) */
  value?: string
  /** diff "old" value (struck through) */
  oldValue?: string
  /** second line (text 2 rows) */
  secondValue?: string
  /** glyph for icon / icon+text, and the default text decoration */
  icon?: React.ReactNode
  showLeftDecoration?: boolean
  showRightDecoration?: boolean
  leftDecoration?: React.ReactNode
  rightDecoration?: React.ReactNode
  /** link href (type=link) */
  href?: string
  /** badge (type=badge) */
  badgeLabel?: string
  badgeColor?: React.ComponentProps<typeof Badge>["color"]
  /** file (type=file) */
  fileName?: string
  /** checkbox (type=checkbox) */
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean) => void
  /** action text (type=action text) */
  actionLabel?: string
  onAction?: () => void
  /** actions icon (type=actions icon) */
  onEdit?: () => void
  onDownload?: () => void
  onDelete?: () => void
  /** action overflow (type=action overflow) */
  onOverflow?: () => void
  /** input (type=input) — defaults to a small placeholder input */
  input?: React.ReactNode
  className?: string
}

const text = "[font-size:var(--ds-typography-bodysm-fontsize)] [line-height:var(--ds-typography-bodysm-lineheight)]"
const dashed = <SquareDashed className="size-4 shrink-0 [color:var(--ds-color-content-tertiary)]" />
const iconBtn = "shrink-0 rounded-full"

function DataTableCell({
  type = "text",
  alignment = "left",
  value = "Value",
  oldValue = "Old value",
  secondValue = "Value",
  icon,
  showLeftDecoration = false,
  showRightDecoration = false,
  leftDecoration,
  rightDecoration,
  href = "#",
  badgeLabel = "Status label",
  badgeColor = "brand",
  fileName = "filename.pdf",
  checked,
  onCheckedChange,
  actionLabel = "Action verb",
  onAction,
  onEdit,
  onDownload,
  onDelete,
  onOverflow,
  input,
  className,
}: DataTableCellProps) {
  // control types start flush-left so the button's own padding provides the inset
  const isControl =
    type === "actions icon" ||
    type === "action text" ||
    type === "action overflow" ||
    type === "file" ||
    type === "input"
  const pad = isControl
    ? alignment === "right"
      ? "pl-2 pr-0"
      : "pl-0 pr-2"
    : "px-2"

  let content: React.ReactNode
  switch (type) {
    case "text":
      content = (
        <>
          {showLeftDecoration && (leftDecoration ?? dashed)}
          <span className={cn("min-w-0 truncate", text, "[color:var(--ds-color-content-primary)]")}>
            {value}
          </span>
          {showRightDecoration && (rightDecoration ?? dashed)}
        </>
      )
      break
    case "text 2 rows":
      content = (
        <span className="flex min-w-0 flex-col">
          <span className={cn("truncate", text, "[color:var(--ds-color-content-primary)]")}>{value}</span>
          <span className={cn("truncate", text, "[color:var(--ds-color-content-tertiary)]")}>{secondValue}</span>
        </span>
      )
      break
    case "link":
      content = (
        <a href={href} className={cn("min-w-0 truncate underline", text, "[color:var(--ds-color-content-link)] hover:[color:var(--ds-color-content-link-hover)]")}>
          {value}
        </a>
      )
      break
    case "diff":
      content = (
        <>
          <span className={cn("truncate line-through", text, "[color:var(--ds-color-content-tertiary)]")}>{oldValue}</span>
          <ArrowRight className="size-4 shrink-0 [color:var(--ds-color-content-tertiary)]" />
          <span className={cn("truncate", text, "[color:var(--ds-color-content-primary)]")}>{value}</span>
        </>
      )
      break
    case "icon + text":
      content = (
        <>
          <span className="inline-flex size-4 shrink-0 items-center justify-center [color:var(--ds-color-content-primary)] [&_svg]:size-4">
            {icon ?? dashed}
          </span>
          <span className={cn("min-w-0 truncate", text, "[color:var(--ds-color-content-primary)]")}>{value}</span>
        </>
      )
      break
    case "icon only":
      content = (
        <span className="inline-flex size-4 shrink-0 items-center justify-center [color:var(--ds-color-content-primary)] [&_svg]:size-4">
          {icon ?? dashed}
        </span>
      )
      break
    case "checkbox":
      content = (
        <Checkbox
          checked={checked === "indeterminate" ? undefined : checked}
          indeterminate={checked === "indeterminate"}
          onCheckedChange={onCheckedChange}
        />
      )
      break
    case "badge":
      content = (
        <Badge color={badgeColor} appearance="filled" size="sm" shape="square">
          {badgeLabel}
        </Badge>
      )
      break
    case "file":
      content = (
        <span className={cn("inline-flex items-center gap-1.5 rounded-[2px] px-2 py-1", "[color:var(--ds-color-content-secondary)]")}>
          <FileIcon className="size-3 shrink-0" />
          <span className="truncate [font-size:var(--ds-typography-labelsm-fontsize)] [line-height:var(--ds-typography-labelsm-lineheight)]">
            {fileName}
          </span>
        </span>
      )
      break
    case "action text":
      content = (
        <Button variant="ghost" size="xs" onClick={onAction}>
          {actionLabel}
        </Button>
      )
      break
    case "actions icon":
      content = (
        <>
          <Button variant="ghost" size="xs" iconOnly className={iconBtn} leftIcon={<Pencil />} onClick={onEdit} aria-label="Edit" />
          <Button variant="ghost" size="xs" iconOnly className={iconBtn} leftIcon={<Download />} onClick={onDownload} aria-label="Download" />
          <Button variant="destructive-ghost" size="xs" iconOnly className={cn(iconBtn, "[--btn-border:transparent]")} leftIcon={<Trash2 />} onClick={onDelete} aria-label="Delete" />
        </>
      )
      break
    case "action overflow":
      content = (
        <Button variant="ghost" size="xs" iconOnly className={iconBtn} leftIcon={<EllipsisVertical />} onClick={onOverflow} aria-label="More actions" />
      )
      break
    case "input":
      content = input ?? <Input placeholder="Placeholder" className="h-8 w-full" />
      break
  }

  return (
    <div
      data-slot="data-table-cell"
      role="cell"
      data-type={type}
      className={cn(
        "flex min-w-0 flex-1 items-center gap-1",
        pad,
        alignment === "right" ? "justify-end text-right" : "justify-start text-left",
        type === "input" && "flex-col items-stretch",
        className
      )}
    >
      {content}
    </div>
  )
}

export { DataTableCell }
export type { CellType, CellAlignment }
