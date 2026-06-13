# Kraken UI Kit

A shadcn-based company design system with a **3-layer token architecture** and
**brand theming**. Designed in Figma (`JIT DS 2.0`), generated into code — the two
stay in sync via a token pipeline.

## The idea

Three layers of design tokens, each only referencing the layer below:

```
component   button/primary/fill  ─►  semantic  color/primary  ─►  global  color/jit/400
(per-component knobs)                (shadcn names, per brand)     (raw primitives)
```

Switch the whole kit's look by changing **only the semantic layer** (the brand mode):

```html
<html>                          <!-- jit brand: yellow #FFD242, rounded -->
<html data-theme="randstadt">   <!-- randstadt brand: blue #298EE5, sharp -->
```

## Token pipeline

| Step | Command | Needs Figma? |
|---|---|---|
| Sync from Figma → `tokens/tokens.dtcg.json` + `tokens/tokens.raw.css` | Claude + Figma Console MCP | yes (desktop bridge) |
| Build final CSS → `src/styles/tokens.css` | `npm run tokens:build` | no |

You never hand-edit CSS. Full guide: [`docs/token-pipeline.md`](docs/token-pipeline.md).

## Quick start

```bash
npm install
npm run tokens:build   # rebuild src/styles/tokens.css from tokens/
npm run dev            # showcase at http://localhost:3000 (brand toggle top-right)
npm run storybook      # component explorer at :6006 (Brand toggle in the toolbar)
```

## Status

- ✅ **Phase 4 — Token pipeline**: 827 tokens (3 layers) export from Figma; brand-switchable CSS verified (jit ⇄ randstadt).
- ✅ **Phase 5 — React kit + Storybook**: Next.js 16 + Tailwind v4 + shadcn (Base UI); v1-12 components wired to tokens; live brand toggle in both the showcase and Storybook. (Extension CVA variants + remaining stories = Phase 5.1.)
- ⬜ Phase 6 — Figma↔code mapping (`MAPPING.md`) · Phase 7 — registry + AI skills/agents · Phase 8 — live theme editor (tweakcn).

Full roadmap: `JIT-DS-2.0-execution-plan.md` (design-docs folder).
