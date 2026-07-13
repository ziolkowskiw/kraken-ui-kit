"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 [background-color:var(--ds-color-overlay)]/20 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  children,
  title,
  description,
  closeIcon = false,
  secondaryActions,
  primaryActions,
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  title?: React.ReactNode
  description?: React.ReactNode
  closeIcon?: boolean
  secondaryActions?: React.ReactNode
  primaryActions?: React.ReactNode
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col outline-none",
          "[background-color:var(--ds-color-background)] [color:var(--ds-color-foreground)]",
          "border [border-color:var(--ds-color-border)] [border-radius:var(--ds-card-radius)]",
          "shadow-lg",
          "duration-100 sm:max-w-[480px] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2.5 [padding:var(--ds-spacing-component-md)]">
          <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className="flex-1 min-w-0 [font-family:var(--ds-typography-headingmd-fontfamily)] [font-size:var(--ds-typography-headingmd-fontsize)] [font-weight:var(--ds-typography-headingmd-fontweight)] [line-height:var(--ds-typography-headingmd-lineheight)] [color:var(--ds-color-content-primary)]"
          >
            {title}
          </AlertDialogPrimitive.Title>
          {closeIcon && (
            <AlertDialogPrimitive.Close
              data-slot="alert-dialog-close"
              render={<Button variant="ghost" size="xs" iconOnly />}
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </AlertDialogPrimitive.Close>
          )}
        </div>

        <div className="h-px w-full [background-color:var(--ds-color-border)]" />

        <div
          data-slot="alert-dialog-body"
          className="[padding-inline:var(--ds-spacing-component-xl)] [padding-block:var(--ds-spacing-component-lg)]"
        >
          {description != null && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
          {children}
        </div>

        <div className="h-px w-full [background-color:var(--ds-color-border)]" />

        <div className="flex items-start justify-between [padding:var(--ds-spacing-component-md)]">
          <div className="flex items-center" data-slot="alert-dialog-secondary-actions">
            {secondaryActions}
          </div>
          <div className="flex flex-1 items-center justify-end gap-[var(--ds-spacing-component-sm)] min-w-0" data-slot="alert-dialog-primary-actions">
            {primaryActions}
          </div>
        </div>
      </AlertDialogPrimitive.Popup>
    </AlertDialogPortal>
  )
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "[font-size:var(--ds-typography-bodymd-fontsize)] [line-height:var(--ds-typography-bodymd-lineheight)] [color:var(--ds-color-content-primary)]",
        className
      )}
      {...props}
    />
  )
}

// shadcn-compat alias: upstream names the dismissing action "Cancel".
function AlertDialogCancel({ ...props }: AlertDialogPrimitive.Close.Props) {
  return (
    <AlertDialogPrimitive.Close data-slot="alert-dialog-cancel" {...props} />
  )
}

function AlertDialogClose({ ...props }: AlertDialogPrimitive.Close.Props) {
  return (
    <AlertDialogPrimitive.Close data-slot="alert-dialog-close" {...props} />
  )
}

export {
  AlertDialog,
  AlertDialogClose,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTrigger,
}
