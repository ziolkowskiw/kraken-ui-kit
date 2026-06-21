---
name: theme-apply
description: Apply a theme produced by the visual theme editor (or a hand-written override) to the kit, and optionally push the edited semantic values back into Figma. Trigger when asked to apply/save a theme, turn an editor export into a brand, or sync edited colors to Figma.
---

# theme-apply — land a theme in code (and optionally Figma)

The visual theme editor (`/theme-editor` route) lets a non-technical user edit the
**semantic layer** — colors + a spacing multiplier + a radius multiplier — over a
live dashboard of real components, with WCAG contrast checks, and export CSS/JSON.
This skill turns that export into a durable part of the kit.

## Inputs
- The Semantic-Layer Editor's **JSON** export (`kraken-semantic@1`): a map of every
  semantic token path → its primitive alias (e.g. `"color/primary": "{color.blue.500}"`),
  reflecting the user's re-points. Or a description of the desired changes.

## A. Apply to the canonical tokens (durable, recommended)
The export *is* the semantic layer. Fold the changed aliases into the source of
truth and regenerate:
1. For each entry in the export's `semantic` map that differs from
   `tokens/tokens.dtcg.json`'s `semantic`, update that token's `$value` to the new
   `{primitive.path}` alias. (Only touch changed tokens.)
2. `npm run tokens:build` → regenerates `src/styles/tokens.css`. `npm run editor:data`
   → refreshes the editor's `semantic-tokens.json`.
3. `npm run build` to verify; check the contrast pairs still pass.

## B. Apply as a quick CSS override (no source edit)
1. Build the override CSS from the editor's working style with
   `generateCss(style, ":root")` in `src/lib/theme-editor.ts` (the editor injects
   exactly this live — `--ds-color-primary: var(--ds-color-blue-500);` …).
2. Paste it **after** `@import "../styles/tokens.css"` in `src/app/globals.css`. It
   targets `:root`, so alias chains re-resolve and components restyle.
3. `npm run build` to verify.

## B. Promote to a brand (durable, round-trips through Figma)
The clean home for a theme is the Figma **semantic** collection as a brand mode —
that keeps Figma the source of truth and lets `token-sync` regenerate the CSS.
1. In Figma, add (or pick) a brand mode in the `semantic` collection.
2. Set its semantic color variables to the edited values (aliasing the right
   primitives; add primitives if a new hue is needed). For spacing/radius scale:
   the multiplier maps to choosing a different primitive step, or adding scaled
   primitive values — log it as a deliberate decision.
3. Run the `token-sync` skill (export + `npm run tokens:build`).
4. If it should be selectable, it already works as `[data-theme="<brand>"]`.

## C. Push-to-Figma (optional, the closing loop)
Write the editor's edited **semantic color** values straight back into the Figma
`semantic` collection via the Figma Console MCP (`figma_batch_update_variables` /
`figma_set_fills` on the variable's mode value), so a visually-created theme lands
in **both** code and Figma. Guardrails:
- Only touch **semantic** color variables (never primitives or component tokens).
- Keep them as **aliases** to primitives where a matching primitive exists; only
  write a raw value when introducing a genuinely new hue (then add the primitive
  first and alias to it).
- Requires the desktop bridge live; confirm the target file is `JIT DS 2.0` first.

## Done when
The theme is applied (override or brand), `npm run build` passes, contrast pairs
are AA+, and — if pushed — the Figma semantic collection reflects the same values.
