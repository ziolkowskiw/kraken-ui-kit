# Avatar Stack

> See [MAPPING.md](../../MAPPING.md) for Figma node ID and deep link.

## What it is

Avatar Stack component. See MAPPING.md for the full shadcn-aligned description.

## Anatomy

- `AvatarStack`
- `Avatar`

## Props

All props are passed through to the underlying Base UI / HTML element.


## Token map

_No `--ds-*` tokens used directly — relies on Tailwind/shadcn semantic classes._

## Accessibility

- The group needs an accessible count: wrap in an element with `aria-label="5 participants"`.
- Individual avatars inside the stack should carry `title` or `aria-label`.
