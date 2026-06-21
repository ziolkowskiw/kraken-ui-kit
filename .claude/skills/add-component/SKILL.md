---
name: add-component
description: Scaffold a new component for the Kraken UI Kit — tokenized .tsx bound to Layer-3 --ds-* tokens, a Storybook story mirroring the Figma property surface, a MAPPING.md entry, and a registry item. Trigger when asked to add/scaffold/build a new component in kraken-ui-kit.
---

# add-component — add a tokenized component the kit way

Produces a component that matches its Figma set 1:1, is fully tokenized, and is
discoverable (story + mapping + registry). For deep Figma-driven 1:1 builds, also
use the existing `implement-figma-component` skill (it has the Figma-read loop and
accumulated learnings); this skill is the wrapper that makes the result a
first-class kit citizen.

## Inputs
- Component name (lowercase-kebab, shadcn registry name where one exists).
- Its Figma component set node ID (from `JIT-DS-2.0-figma-shadcn-names.md` /
  `MAPPING.md`), if it exists in Figma.

## Steps

1. **Read the Figma set** (if it exists) via the Figma MCP — property axes become
   the component's props and the story's controls. Use `implement-figma-component`
   for the detailed read/build/validate loop.

2. **Write `src/components/ui/<name>.tsx`:**
   - Base UI primitive where one exists; `cva` + `cn` (from `@/lib/utils`).
   - **Every color/radius/spacing/font → a `--ds-*` token** (Layer-3 component
     token if one exists, else semantic `--ds-color-*`). No hex/px literals.
   - Variant enum values = exact lowercase Figma strings (1:1).
   - `State` (hover/focus/active) → CSS pseudo-classes, **not props**; only
     `disabled` is a prop. Form fields get a `*Field` wrapper (label / description /
     errorMessage / mandatory).
   - Nested instances compose the real child component (Button/Badge/Input/…).

3. **Write `src/components/ui/<name>.stories.tsx:`** controls mirror the Figma
   property surface 1:1 (enum→select, boolean→toggle, text→text, icon→lucide
   picker). Pin examples to `state=rest`. Disable auto ReactNode/Date controls
   (use the `hasTooltip` + `tooltipText` pattern; see field stories).

4. **Validate:** `tsc --noEmit` passes; `npm run build-storybook` (exit 0); render
   the story. Fix until clean.

5. **Add to `MAPPING.md`:** a row/section with the Figma node ID + deep link, the
   `.tsx` GitHub link, the shadcn-style description, and the prop map. Then run the
   `mapping-doctor` checks.

6. **Add to the registry:** `npm run registry:build` regenerates `registry.json`
   from source (the new file is picked up automatically; deps/sibling-deps are
   derived from its imports). Then `npx shadcn build` to refresh `public/r/`.

## Done when
The component renders in Storybook with Figma-parity controls, uses only `--ds-*`
tokens, has a `MAPPING.md` entry, and installs via `npx shadcn add @kraken/<name>`.
