# Combobox

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Combobox component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Combobox`
- `ComboboxLabel`
- `ComboboxCollection`
- `ComboboxTrigger`
- `ComboboxValue`
- `ComboboxClear`
- `ComboboxChips`
- `ComboboxChip`
- `ComboboxChipsInput`
- `ComboboxInput`
- `ComboboxContent`
- `ComboboxList`
- `ComboboxItem`
- `ComboboxEmpty`
- `ComboboxGroup`
- `ComboboxGroupLabel`
- `ComboboxSeparator`
- `ComboboxField`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `size` | enum | `"sm" \| "md" \| "lg"` | `"md"` |
| `showRemove` | bool | `true \| false` | `false` |
| `showClear` | bool | `true \| false` | `false` |
| `error` | bool | `true \| false` | `false` |
| `mandatory` | bool | `true \| false` | `false` |
| `label` | string / node | — | — |
| `description` | string / node | — | — |
| `errorMessage` | string / node | — | — |
| `tooltip` | string / node | — | — |
| `placeholder` | string / node | — | — |
| `className` | string / node | — | — |

> **State note:** `hover`, `focus`, `active` states are handled by CSS pseudo-classes — there is no state prop. `disabled` is the only state prop.

## Token map

**L1 Primitive / Shared**
- `--ds-chip-outlined-border`
- `--ds-chip-outlined-content`
- `--ds-chip-outlined-fill`
- `--ds-chip-size-md-fontsize`
- `--ds-chip-size-md-height`
- `--ds-chip-size-md-paddingx`
- `--ds-chip-size-md-radius`

**L2 Semantic**
- `--ds-color-content-primary`
- `--ds-color-content-tertiary`
- `--ds-color-icon-muted`
- `--ds-color-muted-foreground`
- `--ds-color-ring`
- `--ds-spacing-component-sm`
- `--ds-typography-labelsm-fontsize`
- `--ds-typography-labelsm-lineheight`

**L3 Component**
- `--ds-input-bordercolor`
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
- `--ds-select-icon`

## Accessibility

- Built on Base UI `Combobox`; the input has `role="combobox"`, `aria-expanded`, `aria-autocomplete`.
- Keyboard: `ArrowDown`/`ArrowUp` navigates options; `Escape` closes; `Enter` selects.
- Option list should have `role="listbox"` with each item as `role="option"`.
