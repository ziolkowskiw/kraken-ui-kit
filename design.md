---
name: design-system
description: Apply the Kraken UI Kit (JIT DS 2.0) design system — --ds-* tokens, 3-layer architecture, brand theming (jit/brand), shadcn-named components, Figma parity, Storybook conventions — to all UI, component, and design work.
---

# Kraken UI Kit — Design System Skill

The single source of truth for building UI with the Kraken UI Kit (JIT DS 2.0):
a shadcn-based kit designed in Figma, generated into code, kept in sync via a
token pipeline. 827 tokens across 3 layers, 56 components, 2 brands.

This file holds the rules and conventions. Exhaustive detail lives in the
reference files listed at the bottom — load them on demand, don't inline them.

## Core principles

1. **Every color, spacing, radius, and typography value MUST use a `--ds-*`
   semantic token.** No hardcoded hex/px literals in components — ever.
2. **Bind at the right layer.** Components consume Layer 3 (component tokens)
   for colors, or Layer 1 primitives for pure dimensions. Never bind a
   component straight to a primitive when a Layer-3 token exists.
3. **Only the semantic layer changes per brand.** Brand switching must be free:
   no per-brand overrides in app or component code.
4. **shadcn parity.** Token names, component names, and props follow shadcn
   verbatim; variant values are the exact lowercase enum strings shown in Figma.
5. **State is CSS, never a prop.** hover/focus/active come from pseudo-classes;
   the only state prop is `disabled`.
6. **Accessibility is non-negotiable.** WCAG 2.1 AA contrast (4.5:1 text,
   3:1 UI), visible focus ring (`--ds-color-border-focus`), full keyboard
   navigation.
7. **Generated files are never hand-edited.** `src/styles/tokens.css` is built
   from `tokens/tokens.dtcg.json` (`npm run tokens:build`); Figma is synced via
   the `token-sync` skill.

## Token architecture

Three layers, each referencing only the layer below:

```
Layer 3  --ds-button-primary-fill   ─►  Layer 2  --ds-color-primary   ─►  Layer 1  --ds-color-jit-400
(component knobs, per component)        (semantic, shadcn names,          (primitives: raw ramps)
                                         the ONLY per-brand layer)
```

### Naming conventions

| Category | Pattern | Example |
|---|---|---|
| Color primitive | `--ds-color-{ramp}-{shade}` | `--ds-color-slate-500`, `--ds-color-jit-400` |
| Color semantic | `--ds-color-{role}[-{state}]` | `--ds-color-primary`, `--ds-color-primary-hover` |
| Status semantic | `--ds-color-status-{kind}-{part}` | `--ds-color-status-error-bg` |
| Content/border | `--ds-color-{content\|border}-{role}` | `--ds-color-content-secondary`, `--ds-color-border-focus` |
| Component token | `--ds-{component}-{variant}-{property}` | `--ds-button-primary-fillhover` |
| Spacing | `--ds-spacing-{px}` / `--ds-spacing-{context}-{size}` | `--ds-spacing-16`, `--ds-spacing-component-md` |
| Radius | `--ds-radius-{size}` (aliases `--ds-borderradius-{px}`) | `--ds-radius-md` → 6px |
| Typography | `--ds-typography-{role}{size}-{prop}` | `--ds-typography-labellg-fontweight` |
| Font primitives | `--ds-{fontsize\|lineheight\|fontweight\|fontfamily}-{key}` | `--ds-fontsize-sm` (14px) |

### Scales (Layer 1)

- **Spacing** — px-named steps: `0 1 2 3 4 5 6 7 8 10 12 16 20 24 28 32 36 40 44 48 56 64 80 96 128 160 192 256`.
  Semantic aliases: `component-xs…2xl` (6→32px), `layout-xs…2xl` (16→96px).
- **Radius** — `none xs sm md lg xl 2xl 3xl full` (0, 2, 4, 6, 8, 12, 16, 24, 9999px).
- **Font sizes** — `xs…6xl` (12, 14, 16, 20, 24, 32, 40, 48, 56, 72px); line heights `xs…3xl` (16→56px).
- **Typography roles** — `display{md,lg,xl,2xl}`, `heading{sm,md,lg,xl}`,
  `body{xs,sm,md,lg}`, `label{sm,md,lg}`, `link{xs,sm,md,lg}`, `overline`.

### Brands (semantic layer modes)

Set `data-theme` on `<html>` (or any ancestor). Default is `jit`.

| Brand | Primary | Radius feel | Font |
|---|---|---|---|
| `jit` (default) | `--ds-color-jit-400` #FFD242 (yellow) | rounded (6px) | Moderat JIT |
| `brand` | `--ds-color-brand-500` #298EE5 (blue) | sharp (0px) | Noto Sans |

The second brand is named **`brand`** — nothing else. Switching swaps only
`[data-theme]` semantic values; every `var()` re-resolves down the chain.
shadcn's own vars (`--primary`, `--background`, …) are re-pointed at `--ds-*`
in `src/styles/kraken-theme.css`, so plain Tailwind classes (`bg-primary`,
`text-muted-foreground`) theme correctly too.

## Component building rules

1. Start from Figma: `MAPPING.md` maps every Figma node ID → `.tsx` file + prop
   table. New components go through the `add-component` skill (tokenized `.tsx`
   + story + mapping entry + registry item).
2. Structure: CVA variants in `src/components/ui/{name}.tsx`, styled with
   Tailwind utilities that resolve to `--ds-*` (via `kraken-theme.css`) or
   direct `var(--ds-…)` arbitrary values.
3. All fills, strokes, and text bind to component/semantic tokens; all radii to
   `--ds-radius-*`; all gaps/padding to the spacing scale.
4. Every interactive component covers five states — default, hover, active,
   disabled, focus — via CSS, using its `--ds-{component}-…-{fill|fillhover|fillactive|filldisabled}` knobs.
5. Form inputs ship as `*Field` wrappers (`InputField`, `TextareaField`,
   `SelectField`, `RadioGroupField`) adding label / description / errorMessage /
   mandatory; the bare primitive stays available.
6. Icons are `lucide-react` components passed as `leftIcon` / `rightIcon` /
   `icon` props (or children) — never baked in.
7. Verify in both brands before calling it done: toggle `jit ⇄ brand` in the
   showcase (`npm run dev`) or the Storybook toolbar.
8. Reference API: Button — `variant` (primary | secondary | tonal | ghost |
   destructive | destructive-secondary | destructive-ghost), `size`
   (xs | sm | md | lg), `iconOnly`. `secondary` *is* the outline; `link` is a
   separate component.

## Storybook requirements

Every component has a `*.stories.tsx` following `docs/storybook-conventions.md`:

- CSF3 with `satisfies Meta`, `tags: ['autodocs']`, always a `component:` field,
  and the MAPPING.md one-liner as the docs description.
- A `Playground` story mirroring the Figma variant matrix 1:1 — every Figma
  property is an argType; the `State` axis is pinned to `rest`.
- Icons and nested components are swappable instances via `@/lib/story-helpers`
  (`iconArgType`, `renderIcon`, `nestedButtonArgTypes`) — never a hardcoded
  `<Check />`.
- Dependent controls are gated with `if:` so irrelevant fields hide.
- Named example stories (`Variants`, `Sizes`, `WithIcons`, `Disabled`, …) on
  top of the Playground. Zero hardcoded values in story styling.

## Quality checklist

Before shipping a component or UI change:

- [ ] No hex/px literals — every value resolves to a `--ds-*` token
- [ ] Colors bound at Layer 3 (or semantic), not primitives
- [ ] All five states styled (default, hover, active, disabled, focus)
- [ ] Renders correctly in **both** brands (`jit` and `brand`)
- [ ] WCAG AA contrast: 4.5:1 text, 3:1 UI elements (theme editor verifies)
- [ ] Variant/prop names match Figma enums and shadcn conventions exactly
- [ ] Story follows the conventions doc (Playground, pickers, `if:` gating)
- [ ] `MAPPING.md` entry present and current (run `mapping-doctor` if unsure)
- [ ] Registry item added/updated (`registry.json`) for installable components
- [ ] Tokens changed? Ran `npm run tokens:build` — never edited `tokens.css` by hand

## Workflow commands

```bash
npm run dev            # showcase at :3000 (brand toggle top-right)
npm run storybook      # component explorer at :6006 (Brand toolbar toggle)
npm run tokens:build   # rebuild src/styles/tokens.css from tokens/
npx shadcn add @kraken/button   # install a tokenized component elsewhere
```

## Reference files (load on demand)

- [`MAPPING.md`](MAPPING.md) — Figma node ID ↔ component file ↔ prop tables (40 parents)
- [`tokens/tokens.dtcg.json`](tokens/tokens.dtcg.json) — canonical token source (DTCG format)
- [`src/styles/tokens.css`](src/styles/tokens.css) — generated CSS custom properties (do not edit)
- [`docs/token-pipeline.md`](docs/token-pipeline.md) — Figma → tokens.json → CSS pipeline
- [`docs/storybook-conventions.md`](docs/storybook-conventions.md) — the six story rules + canonical template
- [`docs/components/`](docs/components/) — per-component docs
- [`registry.json`](registry.json) — shadcn registry (58 items, namespace `@kraken`)

## Related skills

`using-kraken-ui-kit` (consume the kit), `token-sync` (Figma → tokens),
`add-component` (scaffold), `mapping-doctor` (verify MAPPING.md),
`drift-audit` (3-way Figma ⇄ tokens ⇄ code check), `theme-apply` (apply an
editor-exported theme).
