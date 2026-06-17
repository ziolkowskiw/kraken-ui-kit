"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Mirrors the Figma `drawer` set (1627:891): Type=down|left|right|top + `drawer/
// header` + `drawer/footer`. A side-anchored sheet built on Base UI's Dialog
// primitive (reliable backdrop + focus trap); `side` drives the edge it slides
// from. Surface = `--ds-color-popover`.
const Drawer = DialogPrimitive.Root
const DrawerTrigger = DialogPrimitive.Trigger
const DrawerClose = DialogPrimitive.Close
const DrawerPortal = DialogPrimitive.Portal

function DrawerOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 [background-color:var(--ds-color-overlay)]/20 duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

const drawerVariants = cva(
  [
    "fixed z-50 flex flex-col gap-4 outline-none transition-transform duration-200 ease-out",
    "[background-color:var(--ds-color-popover)] [color:var(--ds-color-popover-foreground)] shadow-lg",
  ].join(" "),
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l [border-color:var(--ds-color-border)] data-closed:translate-x-full",
        left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r [border-color:var(--ds-color-border)] data-closed:-translate-x-full",
        top: "inset-x-0 top-0 max-h-[80vh] border-b [border-color:var(--ds-color-border)] data-closed:-translate-y-full",
        bottom: "inset-x-0 bottom-0 max-h-[80vh] border-t [border-color:var(--ds-color-border)] data-closed:translate-y-full rounded-t-xl",
      },
    },
    defaultVariants: { side: "right" },
  }
)

function DrawerContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props &
  VariantProps<typeof drawerVariants> & { showCloseButton?: boolean }) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Popup
        data-slot="drawer-content"
        data-side={side}
        className={cn(drawerVariants({ side }), "p-5", className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            render={<Button variant="ghost" size="sm" iconOnly className="absolute top-3 right-3" />}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-header" className={cn("flex flex-col gap-1.5", className)} {...props} />
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-heading text-base leading-none font-medium [color:var(--ds-color-content-primary)]", className)}
      {...props}
    />
  )
}

function DrawerDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm [color:var(--ds-color-muted-foreground)]", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  drawerVariants,
}
