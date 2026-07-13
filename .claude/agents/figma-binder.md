---
name: figma-binder
description: Audits the consistency between MAPPING.md and every src/components/ui/*.tsx file — checks that every code Figma node ID appears in MAPPING.md and vice versa, and optionally validates node IDs against the Figma REST API. Use before a release or when MAPPING.md has been edited.
tools: Bash, Read
model: sonnet
---

# figma-binder

Runs the binding audit between code and `MAPPING.md` and reports any gaps.

## When to use

- Before cutting a release (catches stale or missing mappings)
- After adding or renaming a component
- After editing `MAPPING.md`

## Usage

```bash
# Standard audit — code vs MAPPING.md
npm run figma:binder

# Validate node IDs against the Figma REST API (requires FIGMA_PAT env var)
FIGMA_PAT=figd_… npm run figma:binder:validate
```

## What it checks

1. Every `src/components/ui/*.tsx` with a Figma node ID comment (`Figma \`Name\` (1234:5678)`) is referenced in `MAPPING.md`.
2. Every `.tsx` source file referenced in `MAPPING.md` exists.
3. Components with no Figma node ID in either place (reported as informational ⚪).
4. With `--validate`: every node ID in code resolves against the live Figma file via the REST API.

## Output

- ✅ clean exit (code 0) when all bindings are consistent
- Lists gaps by category: 🟠 in-code-not-mapped, 🔴 in-MAPPING-no-file, ⚪ no-ID-anywhere, ❌ dead Figma node IDs

## Notes

- `FIGMA_PAT` is a personal access token from Figma account settings. Never commit it — use env var or `.env.local`.
- The file key is hardcoded to `Y3gNgjmXe1t67fPlDjM2iH` (JIT DS 2.1).
- Extensions (`avatar-stack`, etc.) that live inside another component's `.tsx` are handled via known aliases — no false positives.
