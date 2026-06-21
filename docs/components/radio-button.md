# Radio Button

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Radio Button component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `RadioButton`
- `RadioButtonGroup`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `variant` | enum | `"button" \| "standalone"` | `"button"` |
| `size` | enum | `"sm" \| "md" \| "lg"` | `"lg"` |
| `error` | bool | `true \| false` | `false` |
| `mandatory` | bool | `true \| false` | `false` |
| `label` | string / node | — | — |
| `secondLineLabel` | string / node | — | — |
| `description` | string / node | — | — |
| `errorMessage` | string / node | — | — |
| `tooltip` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L3 Component**
- `--ds-checkbox-bordercolor`
- `--ds-checkbox-bordererror`
- `--ds-checkbox-bordererrorhover`
- `--ds-checkbox-borderhover`
- `--ds-checkbox-borderwidth`
- `--ds-checkbox-checkedborder`
- `--ds-checkbox-checkeddisabled`
- `--ds-checkbox-containerfill`
- `--ds-checkbox-containerradius`
- `--ds-checkbox-fillhover`
- `--ds-checkbox-gap`
- `--ds-checkbox-paddingx`
- `--ds-checkbox-size-lg-minheight`
- `--ds-checkbox-size-md-minheight`
- `--ds-checkbox-size-sm-minheight`
- `--ds-input-content`
- `--ds-input-contenterror`
- `--ds-input-placeholder`

**L2 Semantic**
- `--ds-color-content-primary`
- `--ds-color-content-secondary`
- `--ds-color-content-tertiary`
- `--ds-color-primary-muted`
- `--ds-spacing-component-sm`
- `--ds-typography-labelmd-fontsize`
- `--ds-typography-labelmd-fontweight`
- `--ds-typography-labelmd-lineheight`
- `--ds-typography-labelsm-fontsize`
- `--ds-typography-labelsm-lineheight`

## Accessibility

- Same rules as RadioGroup. The labeled variant puts the label in DOM — no extra `aria-label` needed.
