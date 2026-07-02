# Time Input

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Time Input component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `TimeInput`
- `TimeInputField`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `size` | enum | `"sm" \| "md" \| "lg"` | `"md"` |
| `error` | bool | `true \| false` | `false` |
| `mandatory` | bool | `true \| false` | `false` |
| `label` | string / node | — | — |
| `description` | string / node | — | — |
| `errorMessage` | string / node | — | — |
| `tooltip` | string / node | — | — |
| `id` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L2 Semantic**
- `--ds-color-icon-muted`
- `--ds-spacing-component-sm`
- `--ds-typography-labelsm-fontsize`
- `--ds-typography-labelsm-lineheight`

**L3 Component**
- `--ds-input-bordercolor`
- `--ds-input-borderdisabled`
- `--ds-input-bordererror`
- `--ds-input-borderfocus`
- `--ds-input-borderhover`
- `--ds-input-borderwidth`
- `--ds-input-content`
- `--ds-input-contenterror`
- `--ds-input-fill`
- `--ds-input-filldisabled`
- `--ds-input-placeholder`
- `--ds-input-size-lg-fontsize`
- `--ds-input-size-lg-height`
- `--ds-input-size-lg-paddingx`
- `--ds-input-size-lg-radius`
- `--ds-input-size-md-fontsize`
- `--ds-input-size-md-height`
- `--ds-input-size-md-paddingx`
- `--ds-input-size-md-radius`
- `--ds-input-size-sm-fontsize`
- `--ds-input-size-sm-height`
- `--ds-input-size-sm-paddingx`
- `--ds-input-size-sm-radius`
- `--ds-input-value`

## Accessibility

- Native `type="time"` — screen readers announce it as a time input with h/m/s segments.
- Always pair with a visible label via `TextareaField`-style wrapper or `<label for>`.
