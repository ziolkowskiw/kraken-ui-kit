"use client"

import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Mirrors the Figma `Navigation menu` (1696:13337): a horizontal menu whose
// triggers reveal a shared floating panel. Built on Base UI's NavigationMenu;
// the panel uses the `--ds-color-popover` surface. The Content of every item is
// portaled into the single Popup/Viewport rendered by `NavigationMenu`, and the
// `NavigationMenuIndicator` arrow points at whichever trigger is currently open.
const navigationMenuTriggerStyle = cva(
  cn(
    "group inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors",
    "[color:var(--ds-color-content-primary)]",
    "hover:[background-color:var(--ds-color-muted)] focus-visible:ring-2 focus-visible:ring-ring/50",
    "data-popup-open:[background-color:var(--ds-color-muted)]"
  )
)

function NavigationMenu({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({ className, ...props }: NavigationMenuPrimitive.List.Props) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props}
    />
  )
}

function NavigationMenuItem({ ...props }: NavigationMenuPrimitive.Item.Props) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" {...props} />
}

function NavigationMenuTrigger({ className, children, ...props }: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children}
      <NavigationMenuPrimitive.Icon className="transition-transform duration-200 data-popup-open:rotate-180">
        <ChevronDownIcon className="size-3.5" aria-hidden />
      </NavigationMenuPrimitive.Icon>
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({ className, ...props }: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "w-full p-3",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-200",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuLink({ className, ...props }: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-md p-2 text-sm outline-none transition-colors",
        "[color:var(--ds-color-content-primary)] hover:[background-color:var(--ds-color-muted)] focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  )
}

// The shared floating panel. Every `NavigationMenuContent` is portaled into the
// single Viewport here, so triggers reveal one panel rather than individual
// popovers. The `NavigationMenuIndicator` arrow sits in the Positioner so it can
// track the active trigger's anchor. Surface = `--ds-color-popover`.
function NavigationMenuViewport({
  className,
  sideOffset = 8,
  side,
  align,
  ...props
}: NavigationMenuPrimitive.Viewport.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "sideOffset" | "side" | "align">) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        sideOffset={sideOffset}
        side={side}
        align={align}
        className="isolate z-50 box-border h-(--positioner-height) w-(--positioner-width) transition-[top,left,right,bottom] duration-200"
      >
        <NavigationMenuPrimitive.Popup
          data-slot="navigation-menu-popup"
          className={cn(
            "relative h-(--popup-height) w-full origin-(--transform-origin) overflow-hidden",
            "[border-radius:var(--ds-radius-lg)] [background-color:var(--ds-color-popover)] [color:var(--ds-color-popover-foreground)]",
            "[box-shadow:var(--ds-shadow-overlay)] ring-1 ring-foreground/10",
            "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
          )}
        >
          <NavigationMenuIndicator />
          <NavigationMenuPrimitive.Viewport
            data-slot="navigation-menu-viewport"
            className={cn("relative h-full w-full", className)}
            {...props}
          />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

// Visual feedback for which trigger is active. Base UI exposes this as `Arrow`
// (it points toward the current anchor); the kit names the export `Indicator` to
// match the shadcn/Figma `NavigationMenuIndicator` surface. The diamond inherits
// the popover surface so it reads as a continuation of the panel.
function NavigationMenuIndicator({ className, ...props }: NavigationMenuPrimitive.Arrow.Props) {
  return (
    <NavigationMenuPrimitive.Arrow
      data-slot="navigation-menu-indicator"
      className={cn(
        "z-1 flex h-2.5 w-full items-end justify-center overflow-hidden",
        "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm [background-color:var(--ds-color-popover)] ring-1 ring-foreground/10" />
    </NavigationMenuPrimitive.Arrow>
  )
}

// shadcn-compat alias: upstream calls this composition (Portal > Positioner >
// Popup > Viewport) `NavigationMenuPositioner`; the kit named it Viewport first.
const NavigationMenuPositioner = NavigationMenuViewport

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuPositioner,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
}
