# Switch

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

A control that toggles between on and off. Use for instant settings that take effect without a submit step.

## Anatomy

- `Switch`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `size` | enum | `"default" \| "compact"` | `"default"` |
| `error` | bool | `true \| false` | `false` |
| `leftLabel` | string / node | — | — |
| `rightLabel` | string / node | — | — |
| `tooltip` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L2 Semantic**
- `--ds-color-border-focus`
- `--ds-color-content-primary`
- `--ds-color-primary`
- `--ds-color-primary-hover`
- `--ds-color-status-error-border`
- `--ds-color-white`

**L3 Component**
- `--ds-input-bordercolor`

## Accessibility

- Built on Base UI — the element has `role="switch"` and `aria-checked`.
- Always provide a visible label or `aria-label` describing what the switch controls.
- Keyboard: `Space` toggles the switch.
