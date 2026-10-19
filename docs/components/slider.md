# Slider

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Slider component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Slider`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

**L2 Semantic**
- `--ds-color-background`
- `--ds-color-foreground`
- `--ds-color-muted`
- `--ds-color-primary`
- `--ds-radius-full`
- `--ds-spacing-6`

## Accessibility

- Built on Base UI — the thumb has `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-label`.
- Keyboard: `ArrowLeft`/`ArrowRight` (or `Up`/`Down`) adjust value; `Home`/`End` go to min/max.
