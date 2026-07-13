# Milestone 1 — Make distribution real (v0.1.0)

**Date:** 2026-07-11
**Branch:** `feat/polish-v0.1`
**Source of truth for scope:** `polish-plan.md` Part 3, Milestone 1

## Problem

The kit's two headline promises fail for anyone outside this repo:

- `npx shadcn add @kraken/<name>` — the registry (`registry.json` + compiled
  `public/r/*.json`, 60 items) is not hosted anywhere, so the namespace cannot
  resolve.
- `claude mcp add kraken-ui -- npx -y @kraken-ui/mcp` — the `@kraken-ui/mcp`
  package (`mcp/`, built, `publishConfig.access: public`) was never published.

A third, latent gap surfaced during design: the registry's cross-item
dependencies are emitted as **bare names** (`registryDependencies: ["theme",
"utils"]`). From a consumer, shadcn resolves bare deps against the default
registry (ui.shadcn.com), not `@kraken`. So Kraken-only items (`theme`,
`tokens`) 404, and names Kraken tokenizes _and_ shadcn ships (`button`,
`dialog`, `input`, …) silently resolve to shadcn's un-tokenized base with no
`--ds-*` bindings. Distribution cannot be "real" until this is fixed.

## Locked decisions

| Decision         | Choice                                                                         | Rationale                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Registry host    | **GitHub Pages** → `https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json` | Repo is already public; zero new paid infra; clean-enough URL. Pulls a small Pages CI job forward from M2 (acceptable).                                                         |
| npm package name | **`@kraken-ui/mcp`** (scoped)                                                  | Already in `mcp/package.json` and every doc (`foundations.json`, `llms.txt`, README, MCP README) — zero doc churn. Fallback: unscoped `kraken-ui-mcp` only if the org is taken. |
| Sequencing       | **Reversible prep autonomous; irreversible ship gated**                        | `npm publish`, enabling Pages, and the `v0.1.0` tag are outward-facing and hard to reverse — each gets an explicit confirm.                                                     |

Verified facts (2026-07-11): repo is PUBLIC; not logged into npm (user must
`npm login`); neither `@kraken-ui/mcp` nor `kraken-ui-mcp` exists on npm yet.

## Phase A — reversible prep (executed autonomously)

### A1. Fix cross-registry dependency namespacing

- **Edit** `scripts/build-registry.mjs` (the source; `registry.json` and
  `public/r/*` are generated — never hand-edited).
- When emitting `registryDependencies` for each item, prefix any dep whose name
  is itself a Kraken registry item with `@kraken/`; leave true shadcn primitives
  (e.g. `utils`) bare. The authoritative "Kraken-owned" set = the set of item
  names the build already produces (deterministic, self-consistent).
- **Regenerate:** `npm run registry:bundle` (registry:build + manifests:build +
  shadcn build).
- **Verify:** `npm run manifests:check` green; `git diff` on `registry.json` and
  `public/r/*.json` shows _only_ `@kraken/` prefixes added to internal deps
  (`utils` unchanged).

### A2. GitHub Pages workflow

- **Add** `.github/workflows/pages.yml`.
- Trigger: push to `main` + `workflow_dispatch`.
- Steps: checkout → `npm ci` → `npm run registry:bundle` (regenerating in CI
  doubles as a drift guard) → assemble a static artifact containing `r/*.json`
  plus `llms.txt`, `registry.json`, `manifests/`, and `MAPPING.md` (so
  llms.txt's relative links resolve on the hosted site) →
  `actions/upload-pages-artifact` → `actions/deploy-pages`.
- Standard Pages permissions block (`pages: write`, `id-token: write`) and a
  single concurrency group.
- Enabling Pages in repo Settings (Source: GitHub Actions) is a one-time manual
  step — deferred to Phase B.
- Deploy reflects latest `main` (registry is not pinned to release tags; the
  plan does not require pinning).

### A3. Consumer-side registries docs

Add, immediately ahead of the `npx shadcn add @kraken/button` line, the
`components.json` snippet consumers need:

```jsonc
"registries": { "@kraken": "https://ziolkowskiw.github.io/kraken-ui-kit/r/{name}.json" }
```

Locations:

- **README** install section — edit directly (authored).
- **`llms.txt`** — locate source (authored vs generated) and update there.
- **`foundations.json` `install` block** — generated; edit the source that feeds
  it (`scripts/build-manifests.mjs` or a data module) and regenerate with
  `npm run manifests:build`. Do not hand-edit `foundations.json`.
- MCP README already correct (`@kraken-ui/mcp`).

### A4. Extend the release script

- **Edit** `scripts/release.mjs` to bump `mcp/package.json` in lockstep with the
  root version and `npm --prefix mcp publish` alongside the root git tag.
- Preserve the script's **dry-run default** (real publish/tag only with the
  existing opt-in flags).

### A5. Local MCP smoke test

- `npm --prefix mcp pack`; inspect the tarball contents (`dist/`, bundled
  `manifests/`, `README.md`).
- Boot the built server (`node mcp/dist/index.js` via the inspector or a
  minimal stdio ping) to confirm it starts and lists its tools.
- Fully local and reversible.

## Phase B — gated ship (user-driven, assistant assists + confirms)

- **B1. Publish MCP.** User runs `! npm login` (claims `@kraken-ui`). Assistant
  publishes `@kraken-ui/mcp` after the user OKs the packed contents; verify with
  `npm view @kraken-ui/mcp version`.
- **B2. Enable Pages.** User sets Settings → Pages → Source: GitHub Actions; a
  push triggers deploy. Assistant verifies `curl …/r/button.json` returns 200
  with `@kraken/` deps.
- **B3. End-to-end proof** (plan step 3, never before executed):
  - Scratch repo with `components.json` carrying the registries block.
  - `npx shadcn add @kraken/dialog` → assert it installs Kraken's tokenized
    dialog, pulls `@kraken/button` + theme/tokens, `--ds-*` tokens present, no
    hex literals.
  - `claude mcp add kraken-ui -- npx -y @kraken-ui/mcp` → prompt an agent for a
    destructive confirmation dialog → assert `variant="destructive"`, correct
    tokens, no hex.
- **B4. Cut v0.1.0.** `npm run release:minor` (0.0.1 → 0.1.0) — now also
  version-bumps and publishes the MCP package; prepends CHANGELOG, commits, tags.

## Risks & mitigations

- **A1 over-prefixing:** assumes any bare dep matching a Kraken item name should
  be the Kraken one. Correct given the tokenized-everything thesis; the B3 proof
  is the arbiter. If a component intentionally needs shadcn's base primitive, the
  proof will reveal it and the mapping can carve out an exception.
- **npm org availability:** `@kraken-ui` must be claimable at login. Fallback
  (unscoped `kraken-ui-mcp`) already decided; would then require the A3 doc edits
  to change the package name too.
- **Generated-source location:** `foundations.json` / `llms.txt` install text
  must be traced to their sources before editing (provenance rule). If `llms.txt`
  turns out to be authored (not generated), edit it directly.

## Definition of done

1. A stranger's repo installs a Kraken component **and** the MCP server using
   only what README says — the B3 proof passes.
2. `registry.json` / `public/r/*` internal deps resolve to `@kraken/*` for
   consumers.
3. `@kraken-ui/mcp` is published; the GitHub Pages registry serves `/r/*.json`.
4. `v0.1.0` is tagged and both artifacts released together.

## Out of scope (deferred)

- CI beyond the Pages job (tsc/manifests-drift/lint/tests) — Milestone 2.
- Publishing Storybook — Milestone 2.
- The Figma "randstadt" name reintroduction flagged by the background
  token-drift task — a Figma-side rename, tracked separately.
