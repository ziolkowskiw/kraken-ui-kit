# Drawer

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Drawer component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Drawer`
- `DrawerTrigger`
- `DrawerClose`
- `DrawerPortal`
- `DrawerOverlay`
- `DrawerContent`
- `DrawerHeader`
- `DrawerFooter`
- `DrawerTitle`
- `DrawerDescription`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `side` | enum | `"right" \| "left" \| "top" \| "bottom"` | `"right"` |
| `showCloseButton` | bool | `true \| false` | `false` |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-content-primary`
- `--ds-color-muted-foreground`
- `--ds-color-overlay`
- `--ds-color-popover`
- `--ds-color-popover-foreground`
- `--ds-radius-xl`

## Accessibility

- Same focus-trap and labelling rules as Dialog.
- Add `aria-label` describing the drawer's purpose (e.g. "Filters").
- Ensure the close affordance is keyboard reachable as the first focusable element.
