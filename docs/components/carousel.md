# Carousel

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Carousel component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Carousel`
- `CarouselContent`
- `CarouselItem`
- `CarouselPrevious`
- `CarouselNext`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

_No `--ds-*` tokens used directly — relies on Tailwind/shadcn semantic classes._

## Accessibility

- Add `aria-label` to the `<Carousel>` (e.g. "Product images").
- Previous/Next buttons need accessible labels; current slide position should be announced (e.g. "Slide 2 of 5").
- Pause auto-play (if used) on focus/hover; provide a manual play/pause control.
