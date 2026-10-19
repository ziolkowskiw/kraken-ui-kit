# Radio Group

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

A set of checkable buttons where only one can be checked at a time. Use to choose one option from a small visible set.

## Anatomy

- `RadioGroup`
- `RadioGroupField`
- `RadioGroupItem`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `error` | bool | `true \| false` | `false` |
| `mandatory` | bool | `true \| false` | `false` |
| `label` | string / node | — | — |
| `description` | string / node | — | — |
| `errorMessage` | string / node | — | — |
| `tooltip` | string / node | — | — |


## Token map

**L3 Component**
- `--ds-button-primary-filldisabled`
- `--ds-checkbox-checked`
- `--ds-checkbox-checkedborder`
- `--ds-checkbox-checkeddisabled`
- `--ds-checkbox-containerfill`
- `--ds-checkbox-fill`
- `--ds-checkbox-filldisabled`
- `--ds-input-content`
- `--ds-input-contenterror`
- `--ds-input-fieldgap`
- `--ds-input-helper`
- `--ds-radio-bordercolor`
- `--ds-radio-bordererror`
- `--ds-radio-borderhover`
- `--ds-radio-borderwidth`

**L2 Semantic**
- `--ds-color-border-focus`
- `--ds-spacing-4`
- `--ds-typography-labelmd-fontsize`
- `--ds-typography-labelmd-lineheight`

## Accessibility

- Group has `role="radiogroup"` with `aria-labelledby` pointing at the group label.
- Keyboard: `ArrowUp`/`ArrowDown` moves between options (roving tabindex).
- Error state: pair `errorMessage` with `aria-describedby` on the group.
