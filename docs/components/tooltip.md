# Tooltip

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Tooltip component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Tooltip`
- `TooltipContent`
- `TooltipIcon`
- `TooltipProvider`
- `TooltipTrigger`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

**L2 Semantic**
- `--ds-color-foreground`
- `--ds-color-inverse`
- `--ds-color-inverse-foreground`
- `--ds-color-muted-foreground`

**L1 Primitive / Shared**
- `--ds-tooltip-fontsize`
- `--ds-tooltip-maxwidth`
- `--ds-tooltip-paddingx`
- `--ds-tooltip-paddingy`
- `--ds-tooltip-radius`

## Accessibility

- Tooltip content should be supplementary — never the only source of required info.
- Must appear on both hover **and** keyboard focus of the trigger.
- Use `role="tooltip"` on the content element; trigger has `aria-describedby` pointing at it.
- `TooltipIcon` trigger includes these semantics by default.
