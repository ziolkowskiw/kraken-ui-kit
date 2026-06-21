# Alert

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Displays a callout for user attention. Use for inline, non-blocking messages (info, success, warning, error).

## Anatomy

- `Alert`
- `AlertTitle`
- `AlertDescription`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `type` | enum | `"neutral" \| "error" \| "success" \| "informational" \| "warning"` | `"neutral"` |
| `icon` | string / node | — | — |
| `closeIcon` | string / node | — | — |
| `action` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L3 Component**
- `--ds-alert-borderwidth`
- `--ds-alert-padding`
- `--ds-alert-radius`

**L2 Semantic**
- `--ds-color-content-primary`
- `--ds-color-status-error-bg`
- `--ds-color-status-error-border`
- `--ds-color-status-error-foreground`
- `--ds-color-status-error-icon`
- `--ds-color-status-info-bg`
- `--ds-color-status-info-border`
- `--ds-color-status-info-foreground`
- `--ds-color-status-info-icon`
- `--ds-color-status-neutral-bg`
- `--ds-color-status-neutral-border`
- `--ds-color-status-neutral-foreground`
- `--ds-color-status-neutral-icon`
- `--ds-color-status-success-bg`
- `--ds-color-status-success-border`
- `--ds-color-status-success-foreground`
- `--ds-color-status-success-icon`
- `--ds-color-status-warning-bg`
- `--ds-color-status-warning-border`
- `--ds-color-status-warning-foreground`
- `--ds-color-status-warning-icon`
- `--ds-spacing-component-md`
- `--ds-spacing-component-sm`
- `--ds-typography-bodysm-fontsize`
- `--ds-typography-bodysm-lineheight`
- `--ds-typography-labellg-fontsize`
- `--ds-typography-labellg-fontweight`
- `--ds-typography-labellg-lineheight`

## Accessibility

- Use `role="alert"` for live, assertive announcements (errors). For non-urgent info prefer `role="status"`.
- Include both an icon and text — never color alone to convey type.
- Dismissible alerts: the close button needs an accessible label (`aria-label="Dismiss"`).
