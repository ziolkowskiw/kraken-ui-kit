---
name: token-sync
description: Sync design tokens from the Figma JIT DS 2.1 file into the repo and regenerate the CSS the kit uses, in one ritual. Trigger when tokens changed in Figma, when asked to "sync tokens", "rebuild tokens", or after a variable edit in Figma.
---

# token-sync — Figma variables → tokens.json → CSS

The single ritual that pulls token changes out of Figma and regenerates the
stylesheet. Figma is the source of truth for token **decisions**;
`tokens/tokens.dtcg.json` is the canonical machine artifact. Full background:
`docs/token-pipeline.md`. **Never hand-edit any token CSS.**

## Preconditions

- Figma desktop app open on **JIT DS 2.1** (`Y3gNgjmXe1t67fPlDjM2iH`) with the
  Figma Console MCP desktop bridge running. Check with `figma_get_status` (probe).
- If the bridge is down, stop and ask the user to open Figma + the bridge — step 1
  cannot run without it. (Step 2 runs anywhere, no Figma needed.)

## Step 1 — Export from Figma (needs the bridge)

Export **only the three real collections** — `global`, `semantic`, `component`.
Exclude the docs-only `_preview-labels` collection. Keep aliases intact
(`resolveAliases: false`) so the alias chains survive.

1. Canonical JSON → `tokens/tokens.dtcg.json` (W3C DTCG format, aliases preserved).
2. Raw CSS vars → `tokens/tokens.raw.css` (`--ds-` prefix, aliases as `var()` chains).

Use the `figma_export_tokens` MCP tool for both. Verify the two files changed and
still contain the brand modes (`jit`, `brand`) before continuing.

## Step 2 — Build the final CSS (no Figma; CI-safe)

```bash
npm run tokens:build
```

`scripts/build-tokens.mjs` rewrites the per-collection blocks into the correct
cascade:

```
:root                         primitives (always on)
:root, [data-theme="jit"]     semantic, default brand
[data-theme="brand"]      semantic, brand override
:root                         component tokens (always on)
```

Output: `src/styles/tokens.css` (imported by `globals.css`).

## Step 3 — Verify

- `npm run build` (or `tsc --noEmit`) passes.
- Spot-check the brand flip still works: a `[data-theme="brand"]` value differs
  from default (e.g. `--ds-button-primary-fill` `#FFD242` → `#298EE5`).
- If component tokens (`--ds-*-fill`, …) changed, that's a red flag — only semantic
  values should differ per brand.

## Step 4 — Propagate to the registry (if token files moved/changed shape)

`tokens.css` ships via the registry `tokens` item — no action needed for value
changes. If you added a new shipped style file, run `npm run registry:build`.

## Done when

The three token files are in sync, `tokens.css` is regenerated, the build passes,
and brand switching still re-skins the kit. Commit all three token files together.
