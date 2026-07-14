# kraken-ui-kit — agent instructions

## Answer from the machine-readable layer, never guess

- Read `manifests/foundations.json` **first, once per session** — token
  architecture, brand contract, conventions, shadcn divergences.
- Answer component questions from `manifests/components/<name>.json` (or the
  `kraken-ui` MCP tools when connected): exact variant enums, defaults, props,
  `--ds-*` tokens, a11y, usage do/don't. Do **not** invent variants
  (`variant="outline"` does not exist — `secondary` is the outline) or tokens.
- `manifests/index.json` maps aliases/keywords → components; duplicate Figma
  names resolve by **node ID** (see MAPPING.md Part 4).

## Generated vs authored — the provenance rule

Generated, **never hand-edit** (CI byte-diffs them): `manifests/**` (except
`overrides/`), `docs/components/**`, `registry.json`, `src/styles/tokens.css`,
`README.md`'s Status block (between `<!-- STATUS:START -->`/`<!-- STATUS:END -->`).
To change them, edit the **source** and regenerate:

| To change…                        | Edit…                                                                          | Then run                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| a component's API/tokens          | `src/components/ui/<name>.tsx`                                                 | `npm run registry:build && npm run manifests:build && npm run docs:build` |
| Figma mapping / descriptions      | `MAPPING.md`                                                                   | `npm run manifests:build`                                                 |
| aliases, keywords, usage do/don't | `manifests/overrides/<name>.json` (the only hand-edited JSON under manifests/) | `npm run manifests:build`                                                 |
| a11y notes                        | `scripts/data/a11y-notes.mjs`                                                  | `npm run docs:build && npm run manifests:build`                           |
| design tokens                     | `tokens/tokens.dtcg.json` (via token-sync)                                     | `npm run tokens:build && npm run manifests:build`                         |
| README status counts              | `scripts/build-readme-status.mjs`                                              | `npm run docs:build`                                                      |

Validate with `npm run manifests:check` (schemas + drift byte-diff +
cross-checks). Agents propose; humans direct: overrides are the human judgment
layer and are schema-validated.

## Extraction conventions (keep these true)

- One `cva()` call per component file, with `defaultVariants` present — the
  regex-based extractors in `scripts/lib/extract.mjs` depend on it.
- The rationale comment sits as `//` lines directly above the `cva()` declaration.
- Every `src/components/ui/*.tsx` must be reachable from MAPPING.md (by name,
  Source link, or a `<file>.tsx` mention) — the manifest build fails otherwise.

## Key rules (full set in manifests/foundations.json)

- Every color/spacing/radius/typography value is a `--ds-*` token — no hex/px
  literals, ever. Components bind Layer 3 (or semantic), not primitives.
- State is CSS, never a prop; `disabled` is the only state prop.
- Brands: `data-theme` = `jit` (default) | `brand` — only the semantic layer
  swaps; zero per-brand code.
- Form inputs go through `*Field` wrappers; icons are lucide via
  `leftIcon`/`rightIcon`/`icon`.

## Commands

```bash
npm run manifests:build   # regenerate manifests/ from sources
npm run manifests:check   # schemas + drift + cross-checks (CI gate)
npm run registry:bundle   # registry:build + manifests:build + shadcn build
npm run mcp:build         # build the @kraken-ui/mcp server package
npm run mcp:dev           # inspect the MCP server interactively
```
