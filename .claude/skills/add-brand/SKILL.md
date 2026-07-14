---
name: add-brand
description: Onboard a new brand theme into the kit by adding a mode to the Figma semantic collection and syncing it through the token pipeline. Trigger when asked to "add a brand", "add a new theme", or "onboard a client brand".
---

# add-brand — onboard a new brand theme

The ritual for adding a third (or Nth) brand to the kit. Themes are authored
**in Figma, not in code** — this skill is the bridge from a new Figma mode to
a working `data-theme="<brand>"` in the running app, with zero component
code changes.

## Preconditions

- Figma desktop app open on **JIT DS 2.1** (`Y3gNgjmXe1t67fPlDjM2iH`) with the
  Figma Console MCP desktop bridge running. Check with `figma_get_status`
  (probe). If the bridge is down, stop and ask the user to open Figma + the
  bridge — step 1 cannot run without it.
- Know the new brand's name up front (kebab-case, e.g. `acme`) — this becomes
  the `data-theme` value everywhere. Never reuse the second brand's retired
  internal name — confirm the exact naming constraint with the user first.

## Step 1 — Add a mode in Figma

In the `semantic` variable collection (the _only_ layer that varies per
brand — `global` and `component` never change per brand), add a new mode
named after the brand. Figma requires a value for every semantic variable in
the new mode — copy from an existing mode (`jit` or `brand`) as a starting
point, then adjust colors/radius/typography/shadow values for the new brand's
identity. Do not touch the `global` or `component` collections — a new brand
should only ever add a `semantic` mode.

## Step 2 — Sync

Run the `token-sync` skill (Steps 1–2 of `.claude/skills/token-sync/SKILL.md`):
export the three real collections (`global`, `semantic`, `component`) via
`figma_export_tokens`, which pulls the new mode into
`tokens/tokens.dtcg.json` + `tokens/tokens.raw.css`, then `npm run tokens:build`
to regenerate `src/styles/tokens.css`.

## Step 3 — Verify

- `npm run build` (or `tsc --noEmit`) passes.
- Set `data-theme="<new-brand>"` on `<html>` (or use the Storybook/showcase
  brand toggle) and confirm the kit re-skins with **zero component-file
  changes** — every component already binds `--ds-*` semantic tokens, so a
  new semantic mode is automatically picked up.
- Run `npm run manifests:check` — component tokens (`--ds-*-fill`, …) must
  **not** have changed. Only semantic values should differ per brand; if a
  component token changed, something was added to the wrong collection.

## Done when

The new mode renders correctly via the brand toggle, `manifests:check`
passes, and no `.tsx` file under `src/components/ui/` was touched. Commit all
three token files (`tokens.dtcg.json`, `tokens.raw.css`, `tokens.css`)
together, same as `token-sync`.
