# Popover

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Popover component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `Popover`
- `PopoverTrigger`
- `PopoverHeader`
- `PopoverContent`
- `PopoverClose`
- `PopoverTitle`
- `PopoverDescription`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

**L2 Semantic**
- `--ds-color-muted-foreground`
- `--ds-color-popover`
- `--ds-color-popover-foreground`
- `--ds-radius-lg`
- `--ds-typography-bodymd-fontsize`
- `--ds-typography-bodymd-lineheight`
- `--ds-typography-labellg-fontsize`
- `--ds-typography-labellg-fontweight`

## Accessibility

- Focus moves into the popover on open (Base UI behavior); `Escape` closes and returns focus to the trigger.
- If the popover is complex (a form, etc.) use `role="dialog"` with `aria-modal="true"`.
- For purely informational hover-cards prefer `role="tooltip"`.
