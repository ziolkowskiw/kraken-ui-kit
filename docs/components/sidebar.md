# Sidebar

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Sidebar component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Sidebar`
- `SidebarHeader`
- `SidebarContent`
- `SidebarFooter`
- `SidebarGroup`
- `SidebarGroupLabel`
- `SidebarMenu`
- `SidebarMenuItem`
- `SidebarMenuButton`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `collapsed` | bool | `true \| false` | `false` |
| `isActive` | bool | `true \| false` | `false` |


## Token map

**L2 Semantic**
- `--ds-color-content-tertiary`
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
