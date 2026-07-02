# Alert Dialog

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Alert Dialog component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `AlertDialog`
- `AlertDialogClose`
- `AlertDialogCancel`
- `AlertDialogContent`
- `AlertDialogDescription`
- `AlertDialogOverlay`
- `AlertDialogPortal`
- `AlertDialogTrigger`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `closeIcon` | bool | `true \| false` | `false` |
| `title` | string / node | — | — |
| `description` | string / node | — | — |
| `secondaryActions` | string / node | — | — |
| `primaryActions` | string / node | — | — |


## Token map

**L3 Component**
- `--ds-card-radius`

**L2 Semantic**
- `--ds-color-background`
- `--ds-color-border`
- `--ds-color-content-primary`
- `--ds-color-foreground`
- `--ds-color-overlay`
- `--ds-spacing-component-lg`
- `--ds-spacing-component-md`
- `--ds-spacing-component-sm`
- `--ds-spacing-component-xl`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-bodymd-lineheight`
- `--ds-typography-headingmd-fontfamily`
- `--ds-typography-headingmd-fontsize`
- `--ds-typography-headingmd-fontweight`
- `--ds-typography-headingmd-lineheight`

## Accessibility

- Built on Base UI `AlertDialog`; focus is trapped inside while open.
- Required: `DialogTitle` (visible or visually-hidden) for `aria-labelledby`.
- Destructive confirmations: place the Cancel button before the destructive one in DOM order.
