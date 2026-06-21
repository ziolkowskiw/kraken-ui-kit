# Data Table Cell

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Data Table Cell component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `DataTableCell`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `showLeftDecoration` | bool | `true \| false` | `false` |
| `showRightDecoration` | bool | `true \| false` | `false` |
| `checked` | bool | `true \| false` | `false` |
| `value` | string / node | — | — |
| `oldValue` | string / node | — | — |
| `secondValue` | string / node | — | — |
| `icon` | string / node | — | — |
| `leftDecoration` | string / node | — | — |
| `rightDecoration` | string / node | — | — |
| `href` | string / node | — | — |
| `badgeLabel` | string / node | — | — |
| `fileName` | string / node | — | — |
| `actionLabel` | string / node | — | — |
| `input` | string / node | — | — |
| `className` | string / node | — | — |


## Token map

**L2 Semantic**
- `--ds-color-content-link`
- `--ds-color-content-link-hover`
- `--ds-color-content-primary`
- `--ds-color-content-secondary`
- `--ds-color-content-tertiary`
- `--ds-typography-bodysm-fontsize`
- `--ds-typography-bodysm-lineheight`
- `--ds-typography-labelsm-fontsize`
- `--ds-typography-labelsm-lineheight`

## Accessibility

- Must be a descendant of a `<table>` element to preserve semantic meaning.
- Provide `headers` attribute when complex column/row spanning is used.
