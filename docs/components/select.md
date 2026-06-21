# Select

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Displays a list of options to pick from, triggered by a button. Use for single-choice selection. Map to `SelectField`.

## Anatomy

- `Select`
- `SelectContent`
- `SelectField`
- `SelectGroup`
- `SelectItem`
- `SelectLabel`
- `SelectScrollDownButton`
- `SelectScrollUpButton`
- `SelectSeparator`
- `SelectTrigger`
- `SelectValue`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `size` | enum | `"sm" \| "md" \| "lg"` | `"md"` |
| `error` | bool | `true \| false` | `false` |
| `mandatory` | bool | `true \| false` | `false` |
| `disabled` | bool | `true \| false` | `false` |
| `label` | string / node | — | — |
| `description` | string / node | — | — |
| `errorMessage` | string / node | — | — |
| `tooltip` | string / node | — | — |
| `placeholder` | string / node | — | — |
| `className` | string / node | — | — |
| `value` | string / node | — | — |
| `defaultValue` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-muted-foreground`
- `--ds-color-popover`
- `--ds-color-popover-foreground`
- `--ds-spacing-component-sm`
- `--ds-typography-labelsm-fontsize`
- `--ds-typography-labelsm-lineheight`

**L3 Component**
- `--ds-input-borderfocus`
- `--ds-input-borderhover`
- `--ds-input-content`
- `--ds-input-contenterror`
- `--ds-input-placeholder`
- `--ds-input-size-lg-fontsize`
- `--ds-input-size-lg-radius`
- `--ds-input-size-md-fontsize`
- `--ds-input-size-md-radius`
- `--ds-input-size-sm-fontsize`
- `--ds-input-size-sm-radius`
- `--ds-select-bordercolor`
- `--ds-select-borderdisabled`
- `--ds-select-bordererror`
- `--ds-select-borderwidth`
- `--ds-select-fill`
- `--ds-select-icon`
- `--ds-select-paddingright`
- `--ds-select-size-lg-gap`
- `--ds-select-size-lg-minheight`
- `--ds-select-size-lg-paddingleft`
- `--ds-select-size-lg-paddingy`
- `--ds-select-size-md-gap`
- `--ds-select-size-md-minheight`
- `--ds-select-size-md-paddingleft`
- `--ds-select-size-md-paddingy`
- `--ds-select-size-sm-gap`
- `--ds-select-size-sm-minheight`
- `--ds-select-size-sm-paddingleft`
- `--ds-select-size-sm-paddingy`
- `--ds-select-value`

**L1 Primitive / Shared**
- `--ds-menuitem-content`
- `--ds-menuitem-fillhover`

## Accessibility

- Built on Base UI `Select`; the trigger has `aria-haspopup="listbox"` and `aria-expanded`.
- Always use `SelectField` wrapper to get a visible `<label>` correctly linked.
- Keyboard: `ArrowUp`/`ArrowDown` navigates options; `Enter`/`Space` selects.
