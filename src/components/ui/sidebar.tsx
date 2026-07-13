"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";

// Mirrors the Figma Sidebar page: `sidebar` (State=collapsed|expanded) + `sidebar/
// item` (State active|rest, Type base/badge/dropdown…), `sidebar/item-sub`,
// `sidebar/group-label`. A focused navigation rail bound to the `--ds-sidebar-*`
// Layer-3 tokens; `collapsed` flows to items via context (icons-only when collapsed).
//
// App-shell layer (shadcn-compat, additive): wrap a layout in `SidebarProvider`
// and the Sidebar reads its collapsed state from there when the `collapsed`
// prop is not set. `SidebarTrigger`/`SidebarRail` toggle it (also ⌘/Ctrl+B),
// `SidebarInset` is the content column. No mobile sheet mode (yet).
const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false });
const useSidebar = () => React.useContext(SidebarContext);

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarShell = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
};
const SidebarShellContext = React.createContext<SidebarShell | null>(null);
const useSidebarShell = () => React.useContext(SidebarShellContext);

function SidebarProvider({
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}) {
  const [internal, setInternal] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? internal;

  const setCollapsed = React.useCallback(
    (next: boolean) => {
      if (collapsedProp === undefined) setInternal(next);
      onCollapsedChange?.(next);
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [collapsedProp, onCollapsedChange],
  );
  const toggleSidebar = React.useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed],
  );

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  return (
    <SidebarShellContext.Provider value={{ collapsed, setCollapsed, toggleSidebar }}>
      <div
        data-slot="sidebar-wrapper"
        className={cn("flex min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarShellContext.Provider>
  );
}

function Sidebar({
  className,
  collapsed: collapsedProp,
  children,
  ...props
}: React.ComponentProps<"aside"> & { collapsed?: boolean }) {
  const shell = useSidebarShell();
  const collapsed = collapsedProp ?? shell?.collapsed ?? false;
  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <aside
        data-slot="sidebar"
        data-state={collapsed ? "collapsed" : "expanded"}
        className={cn(
          "relative flex h-full flex-col gap-2 border-r p-2 transition-[width] duration-200",
          "[background-color:var(--ds-sidebar-fill)] [color:var(--ds-sidebar-foreground)] [border-color:var(--ds-sidebar-border)]",
          collapsed ? "w-16" : "w-64",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const shell = useSidebarShell();
  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="sm"
      iconOnly
      aria-label="Toggle sidebar"
      leftIcon={<PanelLeftIcon />}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        shell?.toggleSidebar();
      }}
      {...props}
    />
  );
}

// The invisible grab strip on the sidebar's edge — click to toggle. Must be
// rendered inside <Sidebar> (which is position:relative).
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const shell = useSidebarShell();
  return (
    <button
      data-slot="sidebar-rail"
      aria-label="Toggle sidebar"
      tabIndex={-1}
      onClick={() => shell?.toggleSidebar()}
      title="Toggle sidebar"
      className={cn(
        "absolute inset-y-0 -right-2 z-20 w-4 -translate-x-1/2 cursor-col-resize",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 hover:after:[background-color:var(--ds-sidebar-border)]",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex min-h-svh w-full flex-1 flex-col",
        "[background-color:var(--ds-color-background)] [color:var(--ds-color-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      className={cn("h-8 w-full [background-color:var(--ds-color-background)]", className)}
      {...props}
    />
  );
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      decorative
      className={cn("mx-2 !w-auto [background-color:var(--ds-sidebar-border)]", className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex items-center gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("relative flex flex-col gap-1 p-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  const { collapsed } = useSidebar();
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "flex h-7 items-center px-2 [color:var(--ds-color-content-tertiary)] [font-size:var(--ds-typography-labelsm-fontsize)] font-medium uppercase tracking-wide",
        collapsed && "sr-only",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar-group-content" className={cn("w-full text-sm", className)} {...props} />
  );
}

function SidebarGroupAction({ className, ...props }: React.ComponentProps<"button">) {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return (
    <button
      data-slot="sidebar-group-action"
      className={cn(
        "absolute top-2.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-none",
        "[color:var(--ds-sidebar-foreground)] hover:[background-color:var(--ds-sidebar-accent)] hover:[color:var(--ds-sidebar-accentforeground)]",
        "focus-visible:ring-2 focus-visible:[--tw-ring-color:var(--ds-sidebar-ring)]",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul data-slot="sidebar-menu" className={cn("flex flex-col gap-1", className)} {...props} />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("group/sb-item relative", className)}
      {...props}
    />
  );
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
  },
);

function SidebarMenuButton({
  className,
  isActive,
  sub,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants> & { isActive?: boolean }) {
  const { collapsed } = useSidebar();
  const collapsedLabel = collapsed
    ? React.Children.toArray(children)
        .filter((child) => React.isValidElement(child) && child.type === "span")
        .map(
          (child) => (child as React.ReactElement<{ children?: React.ReactNode }>).props.children,
        )
        .join(" ") || undefined
    : undefined;
  return (
    <button
      data-slot="sidebar-menu-button"
      data-active={isActive}
      aria-label={collapsedLabel}
      className={cn(sidebarMenuButtonVariants({ sub }), collapsed && "justify-center", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        // hide text spans when collapsed; keep icons
        if (collapsed && typeof child === "string") return null;
        if (collapsed && React.isValidElement(child) && child.type === "span") return null;
        return child;
      })}
    </button>
  );
}

// Trailing action inside a menu item (e.g. a "…" menu). `showOnHover` keeps it
// hidden until the row is hovered/focused.
function SidebarMenuAction({
  className,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & { showOnHover?: boolean }) {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return (
    <button
      data-slot="sidebar-menu-action"
      className={cn(
        "absolute top-1/2 right-2 flex aspect-square w-5 -translate-y-1/2 items-center justify-center rounded-md p-0 outline-none",
        "[color:var(--ds-sidebar-foreground)] hover:[background-color:var(--ds-sidebar-accent)] hover:[color:var(--ds-sidebar-accentforeground)]",
        "focus-visible:ring-2 focus-visible:[--tw-ring-color:var(--ds-sidebar-ring)]",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        showOnHover && "opacity-0 group-hover/sb-item:opacity-100 focus-visible:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({ className, ...props }: React.ComponentProps<"div">) {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={cn(
        "pointer-events-none absolute top-1/2 right-2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full px-1.5 tabular-nums select-none",
        "[color:var(--ds-sidebar-foreground)] [font-size:var(--ds-typography-labelsm-fontsize)] font-medium",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & { showIcon?: boolean }) {
  // random 50–90% width, stable per mount
  const width = React.useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      className={cn("flex h-9 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" />}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        style={{ "--skeleton-width": width } as React.CSSProperties}
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5 [border-color:var(--ds-sidebar-border)]",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      className={cn("group/sb-sub-item relative", className)}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  className,
  isActive,
  ...props
}: React.ComponentProps<"a"> & { isActive?: boolean }) {
  return (
    <a
      data-slot="sidebar-menu-sub-button"
      data-active={isActive}
      className={cn(
        "flex min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 outline-none",
        "[color:var(--ds-sidebar-foreground)] [font-size:var(--ds-typography-labelsm-fontsize)]",
        "hover:[background-color:var(--ds-sidebar-accent)] hover:[color:var(--ds-sidebar-accentforeground)]",
        "focus-visible:ring-2 focus-visible:[--tw-ring-color:var(--ds-sidebar-ring)]",
        "data-[active=true]:[background-color:var(--ds-sidebar-primary)] data-[active=true]:[color:var(--ds-sidebar-primaryforeground)]",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarSeparator,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  sidebarMenuButtonVariants,
  useSidebar,
};
