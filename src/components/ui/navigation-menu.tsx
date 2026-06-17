"use client"

import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Mirrors the Figma `Navigation menu` (1696:13337): a horizontal menu whose
// triggers reveal a shared floating panel. Built on Base UI's NavigationMenu;
// the panel uses the `--ds-color-popover` surface. The Content of every item is
// portaled into the single Popup/Viewport rendered by `NavigationMenu`.
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
      <NavigationMenuPrimitive.Portal>
        <NavigationMenuPrimitive.Positioner sideOffset={8} className="isolate z-50 box-border h-(--positioner-height) w-(--positioner-width) transition-[top,left,right,bottom] duration-200">
          <NavigationMenuPrimitive.Popup
            data-slot="navigation-menu-popup"
            className={cn(
              "relative h-(--popup-height) w-full origin-(--transform-origin) overflow-hidden",
              "[border-radius:var(--ds-radius-lg)] [background-color:var(--ds-color-popover)] [color:var(--ds-color-popover-foreground)]",
              "shadow-md ring-1 ring-foreground/10",
              "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
            )}
          >
            <NavigationMenuPrimitive.Viewport className="relative h-full w-full" />
          </NavigationMenuPrimitive.Popup>
        </NavigationMenuPrimitive.Positioner>
      </NavigationMenuPrimitive.Portal>
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

const NavigationMenuItem = NavigationMenuPrimitive.Item

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

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
}
