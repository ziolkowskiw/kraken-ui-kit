/**
 * Shared Storybook helpers — the single source of truth for the kit's story
 * conventions. Import from `@/lib/story-helpers` in any `*.stories.tsx`.
 *
 * WHY THIS EXISTS
 * ---------------
 * Two patterns were being copy-pasted across dozens of stories:
 *   1. the lucide icon-picker (turn the full icon set into a `select` control so
 *      a designer/agent can swap the *nested* icon instance, exactly like Figma's
 *      instance-swap on a component's icon slot); and
 *   2. the "nested component" controls (surface a nested Button's props — variant,
 *      label — as namespaced controls under a `Nested: <part>` table category).
 * Centralising them means every story nests the same way and an agent reading one
 * story learns the convention for all of them.
 *
 * Dev-only: pulls the whole `lucide-react` set, which is fine for Storybook but is
 * never shipped to consumers (stories aren't part of the registry).
 */
import * as React from 'react'
import { icons } from 'lucide-react'

/* ── Icon picker ──────────────────────────────────────────────────────────── */

export type IconName = 'none' | keyof typeof icons

/** The full lucide set plus a "none" sentinel, for a Storybook `select` control. */
export const ICON_OPTIONS: IconName[] = [
  'none',
  ...(Object.keys(icons) as (keyof typeof icons)[]),
]

/**
 * Resolve an icon-picker value to a real React node. `undefined`/`'none'` → no
 * icon. The real component props (`leftIcon`, `icon`, children, …) accept any
 * ReactNode; this just bridges the string control to a nested `<Icon />` instance.
 */
export function renderIcon(name?: IconName): React.ReactNode {
  if (!name || name === 'none') return undefined
  const Icon = icons[name as keyof typeof icons]
  return Icon ? <Icon /> : undefined
}

/**
 * An `argTypes` entry for an icon-picker control.
 * @example leftIconName: iconArgType('Left icon', 'Icons')
 */
export function iconArgType(label: string, category?: string) {
  return {
    control: 'select' as const,
    options: ICON_OPTIONS,
    name: label,
    ...(category ? { table: { category } } : {}),
  }
}

/* ── Nested Button controls ───────────────────────────────────────────────── */

/** Figma Button variant axis — reused wherever a story nests a real Button. */
export const BUTTON_VARIANTS = [
  'primary',
  'secondary',
  'tonal',
  'ghost',
  'destructive',
  'destructive-secondary',
  'destructive-ghost',
] as const
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number]

/**
 * `argTypes` for a nested Button, grouped under a `Nested: <part>` category so
 * the controls panel reads like Figma's nested-instance overrides.
 * @example ...nestedButtonArgTypes('Trigger') → `triggerLabel`, `triggerVariant`
 */
export function nestedButtonArgTypes(
  part: string,
  keyPrefix = part.toLowerCase(),
) {
  const category = `Nested: ${part}`
  return {
    [`${keyPrefix}Label`]: {
      control: 'text' as const,
      name: 'Label',
      table: { category },
    },
    [`${keyPrefix}Variant`]: {
      control: 'select' as const,
      options: BUTTON_VARIANTS,
      name: 'Variant',
      table: { category },
    },
  }
}
