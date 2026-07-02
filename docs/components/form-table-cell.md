# Form Table Cell

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Form Table Cell component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `FormTableCell`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `placeholder` | string / node | — | — |
| `options` | string / node | — | — |
| `className` | string / node | — | — |


## Token map

**L3 Component**
- `--ds-checkbox-bordercolor`
- `--ds-checkbox-borderhover`
- `--ds-checkbox-fill`

**L2 Semantic**
- `--ds-color-content-secondary`
- `--ds-radius-lg`
- `--ds-typography-labelsm-fontsize`
- `--ds-typography-labelsm-lineheight`

## Accessibility

- Must be inside a `<table>`; include `headers` referencing the column and/or row header.
