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
- `--ds-color-content-secondary`
- `--ds-color-muted`
- `--ds-color-primary`
- `--ds-radius-full`
- `--ds-spacing-2`
- `--ds-spacing-component-sm`
- `--ds-typography-labelsm-fontfamily`
- `--ds-typography-labelsm-fontsize`
- `--ds-typography-labelsm-lineheight`

## Accessibility

- Use `<progress>` or a `<div role="progressbar">` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- For indeterminate state omit `aria-valuenow`.
- Include an `aria-label` or `aria-labelledby` describing what is progressing.
