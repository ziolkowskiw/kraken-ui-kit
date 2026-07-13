# @kraken-ui/mcp

MCP server exposing the [Kraken UI Kit](https://github.com/ziolkowskiw/kraken-ui-kit)
machine-readable design-system layer to AI agents: per-component contracts
(variants, props, `--ds-*` tokens, a11y, usage do/don't), the always-on
foundations rules, and the full token index — self-contained, no repo or
network access at runtime.

## Install (local-only — not published to npm)

This server runs from a local clone of the kit; it is not published to npm.
Clone the repo, build the server once, then register it by absolute path:

```bash
# in your clone of kraken-ui-kit:
npm --prefix mcp install && npm --prefix mcp run build
# then register it (use the absolute path to your clone):
claude mcp add kraken-ui -- node /abs/path/to/kraken-ui-kit/mcp/dist/index.js
```

## Tools

| Tool | Params | Returns |
|---|---|---|
| `list_components` | — | all components (name, title, one-liner) |
| `search_components` | `query` | top-5 ranked matches with scores |
| `get_component` | `name`, `dense?=true` | full manifest; `dense:false` adds rationale + prose |
| `get_foundations` | — | always-on rules — call once per session |
| `get_tokens` | `layer?`, `component?`, `brand?` | filtered token slice; `brand:"brand"` resolves brand-mode values |
| `get_usage_rules` | `name?` | global principles + per-component do/don't |

## Development (inside the kit repo)

```bash
npm run manifests:build   # at the repo root — regenerate manifests/
npm run mcp:build         # bundle manifests + compile
npm run mcp:dev           # exercise via @modelcontextprotocol/inspector
```

The bundled `manifests/` copy is generated at build/pack time from the repo's
committed `manifests/` (overrides excluded — they are generator inputs).
Never edit manifests by hand; edit the sources (`src/components/ui/*.tsx`,
`MAPPING.md`, `manifests/overrides/`, `tokens/tokens.dtcg.json`) and rebuild.
