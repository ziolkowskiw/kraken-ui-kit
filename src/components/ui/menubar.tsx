"use client"

import * as React from "react"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { menuItemClasses, menuPopupClasses } from "./dropdown-menu"

// Mirrors the Figma `Menubar` component (1696:13412): a horizontal bar of menus.
// Built on Base UI's Menubar wrapping per-menu `Menu` primitives; items reuse the
// shared `--ds-menuitem-*` styling.
function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        "flex items-center gap-1 rounded-md border p-1 [border-color:var(--ds-color-border)] [background-color:var(--ds-color-background)] shadow-xs",
        className
      )}
      {...props}
    />
  )
}

const MenubarMenu = MenuPrimitive.Root
const MenubarGroup = MenuPrimitive.Group
const MenubarRadioGroup = MenuPrimitive.RadioGroup
const MenubarSub = MenuPrimitive.SubmenuRoot

function MenubarTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex cursor-default items-center rounded-sm px-2 py-1 text-sm font-medium outline-none select-none [color:var(--ds-color-content-primary)]",
        "data-highlighted:[background-color:var(--ds-menuitem-fillhover)] data-popup-open:[background-color:var(--ds-menuitem-fillhover)]",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  side = "bottom",
  align = "start",
  sideOffset = 6,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "side" | "align" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} className="isolate z-50">
        <MenuPrimitive.Popup data-slot="menubar-content" className={cn(menuPopupClasses, className)} {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function MenubarItem({
  className,
  variant = "default",
  inset,
  ...props
}: MenuPrimitive.Item.Props & { variant?: "default" | "destructive"; inset?: boolean }) {
  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
      data-variant={variant}
      className={cn(menuItemClasses, inset && "pl-8", className)}
      {...props}
    />
  )
}

function MenubarCheckboxItem({ className, children, ...props }: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem data-slot="menubar-checkbox-item" className={cn(menuItemClasses, "pl-8", className)} {...props}>
      <span className="pointer-events-none absolute left-2 flex size-4 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-4" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

// Standalone section header — plain div so it doesn't require a Menu.Group ancestor.
function MenubarLabel({ className, inset, ...props }: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="menubar-label"
      className={cn("px-2 py-1.5 [color:var(--ds-color-muted-foreground)] [font-size:var(--ds-typography-labelsm-fontsize)] font-medium", inset && "pl-8", className)}
      {...props}
    />
  )
}

function MenubarSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator data-slot="menubar-separator" className={cn("-mx-1 my-1 h-px [background-color:var(--ds-color-border)]", className)} {...props} />
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="menubar-shortcut" className={cn("ml-auto text-xs tracking-widest [color:var(--ds-color-content-tertiary)]", className)} {...props} />
}

function MenubarSubTrigger({ className, inset, children, ...props }: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.SubmenuTrigger data-slot="menubar-sub-trigger" className={cn(menuItemClasses, inset && "pl-8", className)} {...props}>
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function MenubarSubContent({ className, ...props }: MenuPrimitive.Popup.Props) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner side="right" align="start" sideOffset={4} className="isolate z-50">
        <MenuPrimitive.Popup data-slot="menubar-sub-content" className={cn(menuPopupClasses, className)} {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

export {
  Menubar,
  MenubarMenu,
  MenubarGroup,
  MenubarRadioGroup,
  MenubarSub,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSubTrigger,
  MenubarSubContent,
}
