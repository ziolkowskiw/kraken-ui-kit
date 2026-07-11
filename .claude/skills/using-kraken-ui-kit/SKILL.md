---
name: using-kraken-ui-kit
description: Use the Kraken UI Kit (JIT DS 2.1) correctly — install tokenized components from the registry, use the right --ds-* tokens and shadcn-named props, and switch brands. Trigger whenever building UI in or with kraken-ui-kit, adding a component, or wiring tokens/themes.
---

# Using the Kraken UI Kit (JIT DS 2.1)

A shadcn-based company UI kit with a **3-layer token architecture** and **shadcn
parity**. This skill pre-loads everything an agent needs to consume it without
re-explanation. Repo: `github.com/ziolkowskiw/kraken-ui-kit`.

**Stack:** Next.js 16 / React 19 / Tailwind v4 / Base UI / CVA / Storybook 10.

## 0. Prefer the MCP server / manifests

The kit ships a **machine-readable layer** — dense per-component JSON contracts
served by an MCP server. When it's available, answer component questions from it
instead of reading source or guessing:

```bash
claude mcp add kraken-ui -- npx -y @kraken-ui/mcp
```

| Tool | Use it for |
|---|---|
| `get_foundations` | call **once per session** — token architecture, brands, conventions, shadcn divergences |
| `search_components query` | find a component by concept ("modal", "outline button", "dropdown") |
| `get_component name` | the full contract: install cmd, exact variant enums + defaults, props, slots, `--ds-*` tokens, a11y |
| `get_tokens layer?/component?/brand?` | token slices; `brand:"brand"` resolves brand-mode values |
| `get_usage_rules name?` | do/don't, boundaries, when-to-use-something-else |
| `list_components` | the full component list |

Without MCP, the same data is committed under `manifests/` (start at
`manifests/foundations.json`, then `manifests/components/<name>.json`) and the
`ai-foundations` registry item installs `foundations.json` into consuming repos.

## 1. Install components (registry)

The kit publishes a shadcn registry (`registry.json`, compiled to `public/r/*.json`).
Components install **already tokenized** — they bind to `--ds-*` design tokens and
switch brands for free.

```bash
# from a registry URL or local path (namespace: @kraken)
npx shadcn add @kraken/button
npx shadcn add @kraken/input @kraken/select @kraken/dialog
```

Installing a component also pulls its dependencies automatically:
- the `theme` item (shadcn vars → `--ds-*` mapping) → which pulls `tokens` (the
  `--ds-*` values) → so theming always comes along;
- the `utils` item (`cn()`); and any sibling components (e.g. `date-picker` pulls
  `calendar`, `popover`, `tooltip`).

After install, ensure `globals.css` imports the token + theme layers (the kit's
`src/app/globals.css` is the reference):
```css
@import "../styles/tokens.css";       /* --ds-* values, brand-switchable */
@import "../styles/kraken-theme.css";  /* shadcn vars -> --ds-*  + @theme inline */
```

## 2. The token contract (NEVER hard-code values)

Three layers, consumed top-down. **Components bind only to Layer 3 (colors) or
Layer 1 (pure dimensions).**

1. **Primitives** (`--ds-color-slate-500`, `--ds-radius-md`, spacing…) — raw ramps.
2. **Semantic** (`--ds-color-primary`, `--ds-color-background`, `--ds-color-border`…)
   — shadcn names verbatim; aliases to primitives; **this is the only layer that
   changes per brand/theme**.
3. **Component** (`--ds-button-primary-fill`, `--ds-input-border`, `--ds-card-fill`…)
   — per-component knobs; aliases to semantic.

Rules:
- Use `--ds-*` custom properties for every color, radius, spacing, font value.
- Never write a hex/px literal in a component. Never bind a component straight to
  a primitive when a Layer-3 token exists.
- shadcn's own vars (`--primary`, `--background`, …) are already re-pointed at
  `--ds-*` in `kraken-theme.css`, so plain shadcn/Tailwind classes (`bg-primary`,
  `text-muted-foreground`) are correctly themed too.

## 3. Brand / theme switching

Set `data-theme` on `<html>` (or any ancestor). Default brand is `jit`.
```html
<html data-theme="jit">       <!-- yellow primary, 6px radius -->
<html data-theme="brand"> <!-- blue primary, 0px radius -->
```
Switching only swaps the semantic layer — component tokens are untouched and every
`var()` re-resolves. Do not add per-brand overrides in app code.

## 4. Component API conventions (shadcn parity)

- **Variant values are the exact lowercase enum strings** shown in Figma (1:1).
- **`State` (hover/focus/active) is CSS, never a prop.** The only state prop is
  `disabled`.
- **Field wrappers**: form inputs map to the `*Field` wrapper, not the bare
  primitive — `InputField`, `TextareaField`, `SelectField`, `RadioGroupField`
  (they add label / description / errorMessage / mandatory).
- **Icons** are `lucide-react` components passed as `leftIcon` / `rightIcon` /
  `icon` props (or children).
- Button: `variant` (primary | secondary | tonal | ghost | destructive |
  destructive-secondary | destructive-ghost), `size` (xs | sm | md | lg),
  `iconOnly`. `secondary` *is* the outline; `link` is a separate component.

## 5. Figma ↔ code

`MAPPING.md` (repo root) maps every Figma component (node ID) → its `.tsx` file +
prop table, with Figma deep links and shadcn descriptions. Use it to go from a
Figma node to the right component and props. Keep it current with the
`mapping-doctor` skill.

## 6. The v1 12 (core, 1:1 with shadcn)

`button, input, textarea, select, checkbox, radio-group, switch, badge, card,
alert, dialog, tabs`. 40+ more parents exist (see `MAPPING.md` / `registry.json`).

## Related skills
- `token-sync` — Figma variables → tokens.json → regenerate CSS.
- `add-component` — scaffold a new tokenized component + story + mapping entry.
- `mapping-doctor` — verify/regenerate `MAPPING.md` against live Figma.
- `drift-audit` — Figma ⇄ tokens.json ⇄ MAPPING.md 3-way check.
