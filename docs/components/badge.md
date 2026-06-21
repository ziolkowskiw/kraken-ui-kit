# Badge

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Displays a badge or a component that looks like a badge. Use to label or categorize an item, or to show counts/status.

## Anatomy

- `Badge`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `color` | enum | `"neutral" \| "brand" \| "green" \| "red" \| "orange" \| "amber" \| "blue" \| "purple"` | `"neutral"` |
| `appearance` | enum | `"filled" \| "outlined" \| "ghost"` | `"filled"` |
| `size` | enum | `"sm" \| "md" \| "lg"` | `"md"` |
| `leftIcon` | string / node | — | — |
| `rightIcon` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L3 Component**
- `--ds-badge-amber-border`
- `--ds-badge-amber-content`
- `--ds-badge-amber-fill`
- `--ds-badge-blue-border`
- `--ds-badge-blue-content`
- `--ds-badge-blue-fill`
- `--ds-badge-brand-border`
- `--ds-badge-brand-content`
- `--ds-badge-brand-fill`
- `--ds-badge-green-border`
- `--ds-badge-green-content`
- `--ds-badge-green-fill`
- `--ds-badge-orange-border`
- `--ds-badge-orange-content`
- `--ds-badge-orange-fill`
- `--ds-badge-purple-border`
- `--ds-badge-purple-content`
- `--ds-badge-purple-fill`
- `--ds-badge-red-border`
- `--ds-badge-red-content`
- `--ds-badge-red-fill`
- `--ds-badge-size-lg-fontsize`
- `--ds-badge-size-lg-fontweight`
- `--ds-badge-size-lg-height`
- `--ds-badge-size-lg-paddingx`
- `--ds-badge-size-lg-radiusfull`
- `--ds-badge-size-lg-radiussquare`
- `--ds-badge-size-md-fontsize`
- `--ds-badge-size-md-fontweight`
- `--ds-badge-size-md-height`
- `--ds-badge-size-md-paddingx`
- `--ds-badge-size-md-radius`
- `--ds-badge-size-md-radiussquare`
- `--ds-badge-size-sm-fontsize`
- `--ds-badge-size-sm-fontweight`
- `--ds-badge-size-sm-height`
- `--ds-badge-size-sm-paddingx`
- `--ds-badge-size-sm-radiusfull`
- `--ds-badge-size-sm-radiussquare`
- `--ds-badge-slate-border`
- `--ds-badge-slate-content`
- `--ds-badge-slate-fill`

## Accessibility

- Purely visual in most cases; add `aria-label` when the badge conveys information not in surrounding text (e.g. "3 unread").
- Avoid using color alone — pair with text or icon for all eight color variants.
