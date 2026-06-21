# Resizable

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Resizable component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `ResizablePanelGroup`
- `ResizablePanel`
- `ResizableHandle`

## Props

| Prop | Type | Values | Default |
|---|---|---|---|
| `withHandle` | bool | `true \| false` | `false` |


## Token map

**L2 Semantic**
- `--ds-color-background`
- `--ds-color-border`
- `--ds-color-content-tertiary`

## Accessibility

- Each resize handle needs `aria-label` (e.g. "Resize panel") and keyboard support (`ArrowLeft`/`ArrowRight`).
- `react-resizable-panels` provides this by default.
