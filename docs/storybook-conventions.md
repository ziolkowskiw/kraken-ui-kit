# Storybook story conventions — the gold standard

Every `*.stories.tsx` in `src/components/ui/` follows this shape. The goal: each
story reads like the component's **Figma property panel**, every icon and nested
component is a real, swappable instance, and an agent can learn the whole kit's
conventions by reading one file. Distilled from `dialog`, `select`, `input`,
`button`, and `badge`.

## The six rules

1. **CSF3 + `satisfies Meta`.** Typed meta, `tags: ['autodocs']`, `parameters.layout`,
   and **always a `component:` field** — without it autodocs renders no props table.
   When the meta's args are a wrapper type (a composed playground whose StoryProps
   isn't a superset of the component props), keep the association docs-only:
   `component: Dialog as React.ComponentType<StoryProps>`. Also carry the
   MAPPING.md one-liner as
   `parameters: { docs: { description: { component: '…' } } }`.
2. **A `Playground` story with the full control surface.** It mirrors the Figma
   variant matrix 1:1 — every Figma property is an `argType`. Pin the `State` axis
   to `rest` (hover/focus/active are CSS, not props); only `disabled` is a control.
3. **Icons are nested instances, exposed as a picker.** Never hardcode a lone
   `<Check />`. Use the shared icon-picker (`@/lib/story-helpers`) so the nested
   icon is swappable, exactly like Figma instance-swap.
4. **Nested components expose their props under `Nested: <part>` categories.** A
   Dialog's trigger Button, a Card's footer Buttons, a Menu's items — surface their
   variant/label as namespaced controls (`nestedButtonArgTypes`).
5. **Named example stories** for the meaningful variants/states (`Variants`,
   `Sizes`, `WithIcons`, `Disabled`, `Matrix`, …) on top of the Playground.
6. **Gate dependent controls with `if:`.** A control that only applies when a slot
   is present, or when a `type`/variant has a specific value, must hide when it's
   irrelevant. Never leave a `Subtitle` field editable while `hasSubtitle` is off.
   See "Gating dependent controls" below.

## Shared helpers (`@/lib/story-helpers`)

```ts
import {
  ICON_OPTIONS, renderIcon, iconArgType,   // icon nesting
  BUTTON_VARIANTS, nestedButtonArgTypes,    // component nesting
} from '@/lib/story-helpers'
```

- `iconArgType(label, category?)` → an icon-picker `argType`.
- `renderIcon(name)` → resolves the picker value to a nested `<Icon />`.
- `nestedButtonArgTypes('Trigger')` → `triggerLabel` + `triggerVariant` controls
  grouped under `Nested: Trigger`.

## Canonical template

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { iconArgType, renderIcon, type IconName } from '@/lib/story-helpers'
import { Thing } from './thing'

const VARIANTS = ['primary', 'secondary'] as const   // ← Figma variant axis
const SIZES = ['sm', 'md', 'lg'] as const

// Story-only props that back the pickers/toggles the panel exposes.
type StoryProps = React.ComponentProps<typeof Thing> & {
  leftIconName?: IconName
  rightIconName?: IconName
}

const meta = {
  title: 'Components/Thing',
  component: Thing,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'inline-radio', options: SIZES },
    disabled: { control: 'boolean' },
    leftIconName: iconArgType('Left icon'),
    rightIconName: iconArgType('Right icon'),
    // hide the raw ReactNode props — the pickers drive them
    leftIcon: { table: { disable: true } },
    rightIcon: { table: { disable: true } },
  },
  args: {
    children: 'Label',
    variant: 'primary',
    size: 'md',
    disabled: false,
    leftIconName: 'none',
    rightIconName: 'none',
  },
  render: ({ leftIconName, rightIconName, ...args }: StoryProps) => (
    <Thing {...args} leftIcon={renderIcon(leftIconName)} rightIcon={renderIcon(rightIconName)} />
  ),
} satisfies Meta<StoryProps>

export default meta
type Story = StoryObj<typeof meta>

// All controls active — the "Figma property panel" experience.
export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((v) => <Thing key={v} variant={v}>{v}</Thing>)}
    </div>
  ),
}

export const WithIcons: Story = { args: { leftIconName: 'Wrench', rightIconName: 'Check' } }
export const Disabled: Story = { args: { disabled: true } }
```

## Nesting a component (the Dialog pattern)

```tsx
import { nestedButtonArgTypes, BUTTON_VARIANTS } from '@/lib/story-helpers'

argTypes: {
  ...nestedButtonArgTypes('Trigger'),   // → triggerLabel, triggerVariant (Nested: Trigger)
  ...nestedButtonArgTypes('Confirm'),   // → confirmLabel, confirmVariant (Nested: Confirm)
},
render: ({ triggerLabel, triggerVariant, confirmLabel, confirmVariant }) => (
  <Dialog>
    <DialogTrigger render={<Button variant={triggerVariant}>{triggerLabel}</Button>} />
    <DialogContent>
      <DialogFooter>
        <DialogClose render={<Button variant={confirmVariant}>{confirmLabel}</Button>} />
      </DialogFooter>
    </DialogContent>
  </Dialog>
),
```

## Gating dependent controls

A content control must disappear from the panel when its slot/type isn't active —
otherwise you get editable-but-ignored controls (a `Subtitle` field while
`hasSubtitle` is off). Use Storybook's `if:` condition. Put the toggle **before**
its dependent control so the panel reads top-down.

- **Presence toggle** — pair a `show*`/`has*` boolean with its content control:
  ```ts
  hasSubtitle: { control: 'boolean' },
  subtitle:    { control: 'text', if: { arg: 'hasSubtitle' } },
  ```
- **Value equality** — gate on an enum / `type` value:
  ```ts
  type:       { control: 'select', options: TYPES },
  badgeLabel: { control: 'text', if: { arg: 'type', eq: 'badge' } },
  ```
- **Nothing to gate** — if the toggle drives a *hardcoded* child (a menu's icons, a
  footer's fixed Buttons), there's no separate control, so no `if:` is needed.
- **Limit** — `if:` supports single-value `eq` / `neq` / `truthy` / `exists` only
  (no `in: [...]`). A control shared by *several* enum values (e.g. an icon used by
  both `icon + text` and `icon only`) can't be cleanly gated — leave it, and prefer
  the `'none'` self-gating picker where possible.

## Per-story QA checklist

Adapted from *"Design Systems in 2026 → turn your system into a Claude Skill."*

- [ ] `Playground` exposes **every Figma property** as a control (parity with `MAPPING.md`).
- [ ] Enum props use the exact code enum strings (lowercase, 1:1 with Figma).
- [ ] Every icon slot is an **icon-picker** control, not a hardcoded icon.
- [ ] Every **nested component** (trigger/footer/item Buttons, decorations) exposes
      its props under a `Nested: <part>` category.
- [ ] Every **dependent control is gated with `if:`** — a `show*`/`has*` toggle hides
      its paired content control; type/variant-specific controls gate on the value.
      No editable-but-ignored controls.
- [ ] `disabled` (and `error`, where it exists) has a dedicated state story.
- [ ] No hardcoded colors/spacing — components read `--ds-*` tokens; stories never
      inline hex/px for themed surfaces.
- [ ] Renders correctly under **all four toolbar permutations**: brand `jit`/`brand`
      × scheme `light`/`dark`.
- [ ] `title` is `Components/<Name>`, `tags: ['autodocs']`, typed `satisfies Meta`.

## Toolbar globals

Storybook exposes two live switches (`.storybook/preview.tsx`):

- **Brand** — `jit` (default, `:root`) ⇄ `brand` (`[data-theme="brand"]`), the
  semantic layer swap.
- **Scheme** — `light` ⇄ `dark`, toggles the `.dark` token block on `<html>`.
