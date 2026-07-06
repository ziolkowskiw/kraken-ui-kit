# manifests/ — machine-readable design-system layer

**Generated — do not edit** (`npm run manifests:build`). The only hand-edited
files here are `overrides/*.json` — the human judgment layer (aliases,
keywords, usage do/don't, boundaries), schema-validated by
`npm run manifests:check`.

Everything else is derived from human-maintained sources: the component
sources under `src/components/ui/`, `MAPPING.md`, `registry.json`,
`tokens/tokens.dtcg.json`, `scripts/data/a11y-notes.mjs`, and `design.md`.
Agents propose; humans direct. To change a manifest, change its source.

Served to agents by the `@kraken-ui/mcp` server (see `mcp/`).
