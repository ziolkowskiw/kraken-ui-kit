# Table

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Table component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Table`
- `TableHeader`
- `TableBody`
- `TableFooter`
- `TableHead`
- `TableRow`
- `TableCell`
- `TableCaption`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

**L3 Component**
- `--ds-button-secondary-content`

**L2 Semantic**
- `--ds-color-border`
- `--ds-color-content-secondary`
- `--ds-color-muted`
- `--ds-spacing-component-sm`
- `--ds-typography-bodymd-fontfamily`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-bodysm-fontsize`
- `--ds-typography-labelmd-fontsize`
- `--ds-typography-labelmd-lineheight`

## Accessibility

- Use semantic `<table>`, `<thead>`, `<tbody>`, `<th scope="col">` for full screen-reader support.
- For complex tables add `<caption>` or `aria-label` on the table.
