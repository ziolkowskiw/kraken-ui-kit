# Kraken UI Kit

A shadcn-based company design system that is **designed in Figma and generated
into code** — and stays that way. One Figma file (`JIT DS 2.1`) is the source of
truth for 827 design tokens and 56 components; a token pipeline, a Figma↔code
map, and a set of AI skills keep the two sides from drifting apart.

**Stack:** Next.js 16 · React 19 · Tailwind v4 · Base UI · CVA · Storybook 10

## The idea

Most design systems die in the gap between Figma and code: tokens get copied
by hand, components drift, and rebranding means a repaint of every screen.
This kit closes that gap with three moves:

**1. A 3-layer token architecture.** Every color, radius, spacing, and font
value is a `--ds-*` custom property, and each layer only references the layer
below:

```
component    --ds-button-primary-fill   ─►   semantic    --ds-color-primary   ─►   global    --ds-color-jit-400
(per-component knobs)                        (shadcn names, per brand)             (raw primitive ramps)
```

Components bind to the component layer, never to raw values — so there isn't a
single hardcoded hex or px in the kit.

**2. Brand switching that only touches one layer.** The semantic layer is the
only thing that changes per brand. Set `data-theme` and every `var()` in the
tree re-resolves:

```html
<html>
  <!-- jit (default): yellow #FFD242, rounded, Moderat JIT -->
  <html data-theme="brand">
    <!-- brand: blue #298EE5, sharp corners, Noto Sans -->
  </html>
</html>
```

**3. shadcn parity as the contract.** Token names, component APIs, and variant
enums follow shadcn verbatim, so anything that works with shadcn (Tailwind
classes like `bg-primary`, existing app code, the ecosystem's mental model)
works here — but themed and brand-switchable for free.

## Token pipeline

Tokens flow one way: Figma → JSON → CSS. You never hand-edit the CSS.

| Step                                                                  | Command                                         | Needs Figma?         |
| --------------------------------------------------------------------- | ----------------------------------------------- | -------------------- |
| Sync from Figma → `tokens/tokens.dtcg.json` + `tokens/tokens.raw.css` | Claude + Figma Console MCP (`token-sync` skill) | yes (desktop bridge) |
| Build final CSS → `src/styles/tokens.css`                             | `npm run tokens:build`                          | no                   |

Full guide: [`docs/token-pipeline.md`](docs/token-pipeline.md).

## What's inside

- **56 tokenized components** (`src/components/ui/`) — CVA variants, Base UI
  primitives, `*Field` form wrappers, lucide icons as props.
- **Storybook** — every component has a story mirroring its Figma property
  panel 1:1, with a live Brand toggle. Conventions:
  [`docs/storybook-conventions.md`](docs/storybook-conventions.md).
- **shadcn registry** (`registry.json`, 58 items) — install components into any
  app with `npx shadcn add @kraken/button`; theming comes along automatically.
- **Figma↔code map** ([`MAPPING.md`](MAPPING.md)) — every Figma component node
  ID → its `.tsx` file + prop table, with deep links.
- **AI layer** — [`design.md`](design.md) (the system as a Claude skill) plus
  workflow skills: `token-sync`, `drift-audit`, `add-component`,
  `mapping-doctor`, `implement-figma-component`, `using-kraken-ui-kit`.

## Creating a new theme

Themes are authored **in Figma, not in code**. Add a new mode to the semantic
variable collection in `JIT DS 2.1` (that's the only layer that varies per
brand), design it there, then export:

```bash
# after editing variables in Figma:
#   1. token-sync skill  → tokens/tokens.dtcg.json
#   2. rebuild the CSS
npm run tokens:build
```

The new theme becomes available as `<html data-theme="<mode>">` — no component
or app code changes needed.

## Quick start

```bash
npm install
npm run tokens:build   # rebuild src/styles/tokens.css from tokens/
npm run dev            # showcase at http://localhost:3000 (brand toggle top-right)
npm run storybook      # component explorer at :6006 (Brand toggle in the toolbar)
```

To consume the kit from another app, add the Kraken registry to your
`components.json`, then install any component:

```jsonc
// components.json
"registries": {
  "@kraken": "https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json"
}
```

```bash
npx shadcn add @kraken/button    # installs tokenized, brand-switchable
```

## Status

- ✅ **Token pipeline**: 827 tokens (3 layers) export from Figma; brand-switchable CSS verified (jit ⇄ brand).
- ✅ **React kit + Storybook**: 56 components wired to tokens; live brand toggle in showcase and Storybook.
- ✅ **Figma↔code mapping**: `MAPPING.md` — 40 parent components, node IDs + source links.
- ✅ **Registry + AI layer**: shadcn registry (58 items), workflow skills, per-component docs, `design.md`.
- ⬜ **Figma-first theming**: author themes as semantic modes in Figma; export via `token-sync` (supporting skills planned).
- ⬜ **Governance** (ongoing): monthly `drift-audit`, first versioned release via the release agent.
