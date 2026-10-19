# Progress

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Progress component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Progress`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `showLabels` | bool | `true \| false` | `false` |
| `label` | string / node | — | — |


## Token map

**L2 Semantic**
- `--ds-color-muted`
- `--ds-color-primary`
- `--ds-radius-full`
- `--ds-spacing-12`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-labellg-lineheight`

**L3 Component**
- `--ds-input-value`

## Accessibility

- Use `<progress>` or a `<div role="progressbar">` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- For indeterminate state omit `aria-valuenow`.
- Include an `aria-label` or `aria-labelledby` describing what is progressing.
