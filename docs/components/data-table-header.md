# Data Table Header

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Data Table Header component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `SortingIcons`
- `TableHeaderDecoration`
- `TableHeader`
- `TableHeaderRow`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `checked` | bool | `true \| false` | `false` |
| `showLabel` | bool | `true \| false` | `false` |
| `selected` | bool | `true \| false` | `false` |
| `showBorder` | bool | `true \| false` | `false` |
| `empty` | bool | `true \| false` | `false` |
| `className` | string / node | — | — |
| `icon` | string / node | — | — |
| `tooltip` | string / node | — | — |
| `avatar` | string / node | — | — |
| `label` | string / node | — | — |
| `leftDecoration` | string / node | — | — |
| `rightDecoration` | string / node | — | — |


## Token map

**L2 Semantic**
- `--ds-color-border-subtle`
- `--ds-color-content-primary`
- `--ds-color-content-tertiary`
- `--ds-color-muted`
- `--ds-color-primary-muted`
- `--ds-color-secondary-active`
- `--ds-color-secondary-hover`
- `--ds-typography-labellg-fontsize`
- `--ds-typography-labellg-fontweight`
- `--ds-typography-labellg-lineheight`

## Accessibility

- `<th>` with `scope="col"`; sortable headers need `aria-sort`.
- Avoid placing interactive controls inside `<th>` other than sort buttons.
