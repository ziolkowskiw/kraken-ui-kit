# Textarea

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Displays a form textarea. Use for multi-line text entry (comments, notes). Map to `TextareaField`.

## Anatomy

- `Textarea`
- `TextareaField`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `size` | enum | `"sm" \| "md" \| "lg"` | `"md"` |
| `error` | bool | `true \| false` | `false` |
| `mandatory` | bool | `true \| false` | `false` |
| `showCounter` | bool | `true \| false` | `false` |
| `label` | string / node | — | — |
| `description` | string / node | — | — |
| `errorMessage` | string / node | — | — |
| `tooltip` | string / node | — | — |
| `id` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

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
- `--ds-input-size-lg-paddingx`
- `--ds-input-size-lg-radius`
- `--ds-input-size-md-fontsize`
- `--ds-input-size-md-paddingx`
- `--ds-input-size-md-radius`
- `--ds-input-size-sm-fontsize`
- `--ds-input-size-sm-paddingx`
- `--ds-input-size-sm-radius`
- `--ds-input-value`

**L2 Semantic**
- `--ds-spacing-component-sm`
- `--ds-typography-labelsm-fontsize`
- `--ds-typography-labelsm-lineheight`

## Accessibility

- Native `<textarea>` — keyboard accessible by default.
- Always use `TextareaField` wrapper for a visible, associated `<label>`.
- Character counter: expose count via `aria-describedby` so screen readers announce it on change.
