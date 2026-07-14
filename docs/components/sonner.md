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

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-content-primary`
- `--ds-color-content-secondary`
- `--ds-color-content-tertiary`
- `--ds-color-popover`
- `--ds-color-status-error-border`
- `--ds-color-status-error-icon`
- `--ds-color-status-info-border`
- `--ds-color-status-info-icon`
- `--ds-color-status-success-border`
- `--ds-color-status-success-icon`
- `--ds-color-status-warning-border`
- `--ds-color-status-warning-icon`
- `--ds-radius-lg`
- `--ds-shadow-overlay`
- `--ds-typography-bodysm-fontfamily`
- `--ds-typography-bodysm-fontsize`
- `--ds-typography-bodysm-lineheight`
- `--ds-typography-labelmd-fontfamily`
- `--ds-typography-labelmd-fontsize`
- `--ds-typography-labelmd-fontweight`
- `--ds-typography-labelmd-lineheight`

## Accessibility

- Toasts are delivered to an `aria-live="polite"` region (Sonner default). Use `aria-live="assertive"` for critical errors.
- Auto-dismissing toasts: pause the timer on hover/focus; offer a manual close.
- Don't put required user decisions in a toast — use a Dialog instead.
