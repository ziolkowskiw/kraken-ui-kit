# Sidebar

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Sidebar component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Sidebar`
- `SidebarProvider`
- `SidebarTrigger`
- `SidebarRail`
- `SidebarInset`
- `SidebarInput`
- `SidebarSeparator`
- `SidebarHeader`
- `SidebarContent`
- `SidebarFooter`
- `SidebarGroup`
- `SidebarGroupLabel`
- `SidebarGroupContent`
- `SidebarGroupAction`
- `SidebarMenu`
- `SidebarMenuItem`
- `SidebarMenuButton`
- `SidebarMenuAction`
- `SidebarMenuBadge`
- `SidebarMenuSkeleton`
- `SidebarMenuSub`
- `SidebarMenuSubItem`
- `SidebarMenuSubButton`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `defaultCollapsed` | bool | `true \| false` | `false` |
| `collapsed` | bool | `true \| false` | `false` |
| `isActive` | bool | `true \| false` | `false` |
| `showOnHover` | bool | `true \| false` | `false` |
| `showIcon` | bool | `true \| false` | `false` |
| `children` | string / node | — | — |


## Token map

**L2 Semantic**
- `--ds-color-background`
- `--ds-color-content-tertiary`
- `--ds-color-foreground`
- `--ds-typography-labelsm-fontsize`

**L1 Primitive / Shared**
- `--ds-sidebar-accent`
- `--ds-sidebar-accentforeground`
- `--ds-sidebar-border`
- `--ds-sidebar-fill`
- `--ds-sidebar-foreground`
- `--ds-sidebar-primary`
- `--ds-sidebar-primaryforeground`
- `--ds-sidebar-ring`

## Accessibility

- Wrap in `<nav aria-label="Primary">` or use `role="navigation"`.
- Collapsible sidebar: the toggle button needs `aria-expanded` and `aria-controls`.
