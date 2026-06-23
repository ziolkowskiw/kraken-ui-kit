"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Mirrors the Figma Sidebar page: `sidebar` (State=collapsed|expanded) + `sidebar/
// item` (State active|rest, Type base/badge/dropdown…), `sidebar/item-sub`,
// `sidebar/group-label`. A focused navigation rail bound to the `--ds-sidebar-*`
// Layer-3 tokens; `collapsed` flows to items via context (icons-only when collapsed).
const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false })
const useSidebar = () => React.useContext(SidebarContext)

function Sidebar({
  className,
  collapsed = false,
  children,
  ...props
}: React.ComponentProps<"aside"> & { collapsed?: boolean }) {
  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <aside
        data-slot="sidebar"
        data-state={collapsed ? "collapsed" : "expanded"}
        className={cn(
          "flex h-full flex-col gap-2 border-r p-2 transition-[width] duration-200",
          "[background-color:var(--ds-sidebar-fill)] [color:var(--ds-sidebar-foreground)] [border-color:var(--ds-sidebar-border)]",
          collapsed ? "w-16" : "w-64",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("flex items-center gap-2 p-2", className)} {...props} />
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-content" className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto", className)} {...props} />
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("flex flex-col gap-2 p-2", className)} {...props} />
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" className={cn("flex flex-col gap-1 p-2", className)} {...props} />
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  const { collapsed } = useSidebar()
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "flex h-7 items-center px-2 [color:var(--ds-color-content-tertiary)] [font-size:var(--ds-typography-labelsm-fontsize)] font-medium uppercase tracking-wide",
        collapsed && "sr-only",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" className={cn("flex flex-col gap-1", className)} {...props} />
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" className={cn("relative", className)} {...props} />
}

const sidebarMenuButtonVariants = cva(
  [
    "group/sb-btn flex w-full items-center gap-2 rounded-md p-2 text-sm outline-none transition-colors cursor-pointer",
    "[color:var(--ds-sidebar-foreground)]",
    "hover:[background-color:var(--ds-sidebar-accent)] hover:[color:var(--ds-sidebar-accentforeground)]",
    "focus-visible:ring-2 focus-visible:[--tw-ring-color:var(--ds-sidebar-ring)]",
    "data-[active=true]:[background-color:var(--ds-sidebar-primary)] data-[active=true]:[color:var(--ds-sidebar-primaryforeground)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      sub: { true: "pl-8 [font-size:var(--ds-typography-labelsm-fontsize)]", false: "" },
    },
    defaultVariants: { sub: false },
  }
)

function SidebarMenuButton({
  className,
  isActive,
  sub,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants> & { isActive?: boolean }) {
  const { collapsed } = useSidebar()
  return (
    <button
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ sub }), collapsed && "justify-center", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        // hide text spans when collapsed; keep icons
        if (collapsed && typeof child === "string") return null
        if (collapsed && React.isValidElement(child) && child.type === "span") return null
        return child
      })}
    </button>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
  useSidebar,
}
