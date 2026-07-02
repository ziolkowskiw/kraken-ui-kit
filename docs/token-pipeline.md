# Token pipeline — Figma → JSON → CSS

Plain-language guide to how design tokens get from Figma into code. You (designer)
make changes in Figma; this pipeline turns them into the CSS the components use.
**You never hand-edit the CSS.**

## The three files

| File | What it is | Edited by |
|---|---|---|
| `tokens/tokens.dtcg.json` | The **canonical** token data — every variable, its layer, value, and alias chain, in the industry-standard W3C DTCG format. The source of truth in code. | Figma export (never by hand) |
| `tokens/tokens.raw.css` | The raw CSS export from the Figma plugin — correct values, but one block per Figma collection-mode. An intermediate. | Figma export (never by hand) |
| `src/styles/tokens.css` | The **final** stylesheet the app imports. Correct `:root` / brand-theme structure. | `npm run tokens:build` (never by hand) |

## The two steps

### 1. Sync from Figma  (needs the Figma desktop bridge running)
Done with Claude + the Figma Console MCP. Claude runs two exports against the live
`JIT DS 2.0` file, writing **only the three real collections** (`global`, `semantic`,
`component`) — the `_preview-labels` collection is docs-only and excluded:

- `tokens.dtcg.json` — canonical JSON, **aliases preserved** (`resolveAliases: false`).
- `tokens.raw.css` — css-vars, aliases preserved, `--ds-` prefix.

(This becomes the `token-sync` Claude skill — see the project plan, Phase 7.)

### 2. Build the final CSS  (no Figma needed — runs anywhere, incl. CI)
```bash
npm run tokens:build
```
`scripts/build-tokens.mjs` rewrites the selectors so the layers cascade correctly:

```
:root                        primitives (global)        — always on
:root, [data-theme="jit"]    semantic, default brand    — jit shows by default
[data-theme="brand"]     semantic, brand override
:root                        component tokens           — always on, alias semantic
```

## How theming works

The whole kit re-skins by setting one attribute on `<html>`:

```html
<html>                          <!-- jit brand (default) -->
<html data-theme="brand">   <!-- brand brand -->
```

Because component tokens (`--ds-button-primary-fill`) alias semantic tokens
(`--ds-color-primary`) which alias brand primitives, changing the brand mode
re-resolves everything automatically. Verified: jit → `#FFD242` rounded,
brand → `#298EE5` sharp, with **no change to component tokens**.

## Adding a brand later
1. Add the brand as a mode in the Figma `semantic` collection (alias to a primitive ramp).
2. Re-run step 1 (sync) and step 2 (build).
3. If it should be the default brand, change `DEFAULT_BRAND` at the top of
   `scripts/build-tokens.mjs`; otherwise it just works as `[data-theme="<brand>"]`.

## Naming rule (for reference)
CSS variable = `--ds-` + the full Figma token path, slashes → dashes, lowercased.
`button/primary/fill` → `--ds-button-primary-fill`. See
`../JIT-DS-2.0-naming-conventions.md` (in the design-docs folder).
