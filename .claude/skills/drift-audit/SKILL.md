---
name: drift-audit
description: The 3-way governance check — Figma variables ⇄ tokens.json ⇄ MAPPING.md/code — reports mismatches without changing anything. Trigger for a monthly/periodic audit, before a release, or when asked whether design and code are in sync.
---

# drift-audit — Figma ⇄ tokens ⇄ code 3-way check

Read-only governance pass. Guards the two failure modes that kill the kit's value:
(1) drifting from shadcn's exact token/prop names, (2) Figma and code falling out
of sync. **Report only — do not modify Figma, tokens, or code here.** Hand fixes to
`token-sync` / `mapping-doctor`.

## What to compare

1. **Figma variables ⇄ `tokens/tokens.dtcg.json`** (needs the Figma bridge live):
   - Export current variables (as in `token-sync` step 1, to a temp/in-memory view).
   - Diff against `tokens.dtcg.json`: variables added/removed/renamed in Figma but
     not in the JSON, value or alias-target changes, new modes/brands.
   - Assert the layer contract: semantic still aliases primitives; component still
     aliases semantic; **no raw values in Layers 2–3**.

2. **`tokens.dtcg.json` ⇄ `src/styles/tokens.css`:**
   - Is `tokens.css` stale (older than the JSON, or missing tokens the JSON has)?
   - If so, flag "run `npm run tokens:build`".

3. **Figma component sets ⇄ `MAPPING.md` ⇄ code:**
   - Every Figma set has a `MAPPING.md` entry and a real `.tsx`; every `.tsx` is
     mapped; node IDs resolve. (This overlaps `mapping-doctor` check 1–4 — reuse it.)
   - shadcn-name fidelity: component file names, variant enum values, and semantic
     token names still match shadcn verbatim (the value we must not lose).

4. **`registry.json` ⇄ code:** `npm run registry:build` produces no diff (i.e. the
   committed registry matches the current source). A diff = registry is stale.

5. **Manifests (machine-readable layer):** run `npm run manifests:check` and report:
   - schema failures (component manifests, foundations, tokens, index, **overrides**
     — a failing override is a typo in the human judgment layer);
   - regeneration drift (committed `manifests/**` no longer byte-matches generated
     output → someone hand-edited a manifest or forgot `npm run manifests:build`
     after changing a source);
   - cross-check failures (source ⇄ manifest coverage, registry items, layer-3
     tokens vs `tokens.css`);
   - _(informational, not a failure)_ components with no
     `manifests/overrides/<name>.json` usage overlay — candidates for seeding.

## Output

A dated report (PASS/FAIL per section) with mismatch tables:
`item → Figma value/name → code value/name → suggested skill to fix`.
Order findings by severity: shadcn-name drift first (highest), then sync staleness,
then cosmetic.

## Done when

The three sources agree, or every disagreement is listed with the exact remediation
(`token-sync`, `mapping-doctor`, `registry:build`, or `manifests:build`). No files
changed by this skill.
