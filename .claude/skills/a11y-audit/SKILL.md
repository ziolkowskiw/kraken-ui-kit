---
name: a11y-audit
description: Use when asked to test, audit, or verify accessibility / a11y / WCAG compliance of kraken-ui-kit components, before shipping a new or changed component, after a brand or token change, or when someone asks whether the kit (or one component) meets WCAG 2.2 AA, EN 301 549, or the European Accessibility Act.
---

# a11y-audit — WCAG 2.2 AA audit of kit components

Report-only. Measures components as rendered in Storybook across **every brand ×
scheme**, then routes each finding to the source file that fixes it. Never edits
components, tokens, stories, or `.storybook/preview.tsx` here — fixes go through
the normal skills (`token-sync`, `add-component`, …) after the user decides.

**Target: WCAG 2.2 A + AA.** EN 301 549 v4.1.1 (the EAA standard) moved to 2.2.
`manifests/foundations.json` states the same target ("WCAG 2.2 AA"); if it ever
drifts, the fix is in `scripts/build-manifests.mjs`, not the JSON.

**Automation finds roughly a third to half of real issues.** A clean scan is
never "accessible" — the report must list what was not verified (step 6).

## 0. Setup

- Storybook running: `npm run storybook` (port 6006). Scripts fail fast if not.
- Output to your scratchpad: `--out <scratchpad>/a11y`.
- Scope: `--only button,dialog` (component file names) or omit for the whole kit.
- Read `reference.md` in this folder once — SC-by-SC coverage + the APG
  keyboard contract per component.

## 1. Existing gate + suppressions

```bash
npx vitest --run --project=storybook          # addon-a11y axe, jit/light only, no contrast
grep -rn "a11y:" src/components/ui/*.stories.tsx   # per-story rule disables
```

List every suppression as "needs justification". The global
`color-contrast: false` in `preview.tsx` means CI has **never** checked contrast.

## 2. Theme-matrix axe scan

```bash
node .claude/skills/a11y-audit/scripts/scan-axe.mjs --out $OUT [--only …] [--stories playground]
```

Every story × jit/brand/acme (light; add `--schemes light,dark` once dark mode
ships), WCAG 2.2 tags, contrast **on**, whole
document (portals), plus an open-overlay pass. Read `axe.md`. The `themes`
column is diagnostic:

| fails in                | means                                       | fix lives in                                |
| ----------------------- | ------------------------------------------- | ------------------------------------------- |
| every theme             | structural (markup, ARIA, size)             | `src/components/ui/<name>.tsx`              |
| one brand, both schemes | that brand's palette                        | semantic tokens → `token-sync` (Figma mode) |
| dark only, all brands   | dark mode doesn't reach `--ds-*`            | `.dark` block / token pipeline              |
| a story only            | story markup (missing label in the example) | `<name>.stories.tsx`                        |

## 3. Token-pair contrast

```bash
node .claude/skills/a11y-audit/scripts/contrast-tokens.mjs --out $OUT
```

Semantic fg/bg pairs per brand × scheme (4.5:1 text, 3:1 UI/focus ring). Pairs
are inferred from token names: report a failing pair as a **confirmed** issue only
when step 2 shows a component rendering it; otherwise "palette risk".
With `--schemes light,dark`, an "inert scheme" banner means `.dark` never
changes any `--ds-*` value — report that as **one** systemic finding, not one
row per pair or story.

## 4. Keyboard / focus / reflow

```bash
node .claude/skills/a11y-audit/scripts/scan-keyboard.mjs --out $OUT [--stories all] [--brands jit,brand,acme]
```

Tab walk with focus-indicator pixel diff (also under forced colors), reachability,
traps, overlay open-by-keyboard → focus in → Escape → focus back, reflow at
320px, text-spacing clipping, reduced motion. Writes `aria/<story>.yml`
snapshots. `info` rows are not failures.

**Verify every finding before reporting it** (each of these produced false
positives during development):

- Reflow: is the width from the component's cva, or from the story (`w-72`,
  fixed wrapper)? Story widths are story bugs, not component bugs.
- "Does not open": does the story render the overlay pre-opened, or put another
  trigger (e.g. a label tooltip) first? Check the story source.
- "No visible focus": screenshot it (`page.screenshot` after `Tab`) and read the
  classes — e.g. Tailwind v4 `outline-none` + `focus-visible:outline-2` leaves
  `outline-style: none`.
- Then check the focus color itself against step 3 (`border-focus` / `ring`).

## 5. Manifest claims check

For each component, read `manifests/components/<name>.json` → `a11y` and compare
each claim with `aria/<story>.yml` (and `.open.yml`): roles, names,
`aria-current`, `aria-expanded`, labelled-by. A claim the DOM contradicts is a
docs bug — fix source is `scripts/data/a11y-notes.mjs`, never the manifest.
Also check the APG contract in `reference.md` for that component.

## 6. Report

Write a dated report (scratchpad; publish only if asked) with:

1. **Verdict per component**: FAIL / PASS-automated / NOT TESTED — never "PASS".
2. **Findings** by severity: SC · component · themes · evidence (ratio, selector,
   screenshot) · fix file (routing table above / `reference.md`).
3. **Systemic issues** first (a token or shared class failing everywhere beats
   50 duplicate rows).
4. **Not verified by automation** — copy the manual checklist from
   `reference.md` and mark each item untested unless you did it.
5. Suppressions from step 1 and the foundations 2.1→2.2 note.

## Common mistakes

| Mistake                                                                            | Instead                                                                         |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Treating `npx vitest` green as compliant                                           | It skips contrast and every theme but jit/light                                 |
| Enabling contrast in `preview.tsx` / adding `parameters.a11y` disables to go green | Report; user decides                                                            |
| Per-brand code fix for a brand-only failure                                        | Semantic token change via Figma → `token-sync`                                  |
| Editing `manifests/**` for a wrong a11y note                                       | `scripts/data/a11y-notes.mjs` + `npm run docs:build && npm run manifests:build` |
| Counting the same token failure 60×                                                | Collapse to one systemic finding listing affected components                    |
| Reporting script output unverified                                                 | Step 4 checklist — screenshot and read the source                               |
