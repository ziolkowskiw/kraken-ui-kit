# Sonner

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Sonner component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Toaster`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `description` | string / node | — | — |


## Token map

**L3 Component**
- `--ds-alert-padding`
- `--ds-alert-radius`
- `--ds-badge-green-border`
- `--ds-badge-green-fill`
- `--ds-badge-orange-border`
- `--ds-badge-orange-fill`
- `--ds-badge-red-border`
- `--ds-badge-red-fill`

**L2 Semantic**
- `--ds-color-background`
- `--ds-color-content-primary`
- `--ds-color-content-secondary`
- `--ds-color-content-tertiary`
- `--ds-color-status-neutral-border`
- `--ds-spacing-8`
- `--ds-typography-bodymd-fontfamily`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-bodysm-fontfamily`
- `--ds-typography-bodysm-fontsize`
- `--ds-typography-bodysm-lineheight`
- `--ds-typography-labellg-lineheight`

## Accessibility

- Toasts are delivered to an `aria-live="polite"` region (Sonner default). Use `aria-live="assertive"` for critical errors.
- Auto-dismissing toasts: pause the timer on hover/focus; offer a manual close.
- Don't put required user decisions in a toast — use a Dialog instead.
