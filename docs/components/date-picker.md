# Date Picker

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Date Picker component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `DatePicker`
- `DatePickerField`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `disabled` | bool | `true \| false` | `false` |
| `error` | bool | `true \| false` | `false` |
| `mandatory` | bool | `true \| false` | `false` |
| `placeholder` | string / node | — | — |
| `className` | string / node | — | — |
| `label` | string / node | — | — |
| `description` | string / node | — | — |
| `errorMessage` | string / node | — | — |
| `tooltip` | string / node | — | — |


## Token map

**L2 Semantic**
- `--ds-color-icon-muted`
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

- Composes Calendar + Popover + Button; see individual a11y notes for each.
- The trigger button should announce the current selection: `aria-label="Choose date, 21 June 2026"`.
- The calendar popover traps focus when open; `Escape` closes and returns focus to the trigger.
