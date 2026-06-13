// Build the final design-token stylesheet from the raw export.
//
// WHY THIS EXISTS
// ---------------
// figma-console-mcp exports one CSS block per Figma collection-mode, i.e.
// [data-theme="global"], [data-theme="jit"], [data-theme="randstadt"],
// [data-theme="component"]. That is wrong for the browser: primitives (global)
// and component knobs (component) must be ALWAYS on (:root), and only the
// SEMANTIC brand modes should be switchable themes. This script rewrites those
// selectors so the 3-layer cascade actually works at runtime.
//
// Result structure (src/styles/tokens.css):
//   :root                        -> global primitives  (always on)
//   :root, [data-theme="jit"]    -> semantic, default brand (jit)
//   [data-theme="randstadt"]     -> semantic, brand override
//   :root                        -> component tokens   (always on; alias semantic)
//
// Switching brand = set data-theme="randstadt" on <html>. Nothing else changes;
// component tokens read var(--ds-color-*) which re-resolve to the active brand.
//
// No dependencies — pure Node. Run: npm run tokens:build

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'tokens', 'tokens.raw.css');
const OUT = path.join(root, 'src', 'styles', 'tokens.css');

// --- selector mapping (the only thing to touch when brands change) -----------
// Single-mode Figma collections that must always apply -> :root.
const BASE_MODES = ['global', 'component'];
// The semantic brand shown when no data-theme attribute is set.
const DEFAULT_BRAND = 'jit';
// Every other semantic mode (e.g. 'randstadt') becomes [data-theme="<mode>"].
// -----------------------------------------------------------------------------

const raw = await readFile(SRC, 'utf8');

const remapped = raw.replace(
  /\[data-theme="([^"]+)"\]\s*\{/g,
  (_match, mode) => {
    if (BASE_MODES.includes(mode)) return ':root {';
    if (mode === DEFAULT_BRAND) return `:root,\n[data-theme="${mode}"] {`;
    return `[data-theme="${mode}"] {`;
  },
);

// Strip the tool's generated-by comment (first line) and add our own header.
const body = remapped.replace(/^\/\*[^\n]*\*\/\n/, '');
const header =
  `/* AUTO-GENERATED — do not edit by hand.\n` +
  `   Source: tokens/tokens.dtcg.json (canonical) -> tokens/tokens.raw.css (export).\n` +
  `   Rebuild: npm run tokens:build   Re-sync from Figma: see docs/token-pipeline.md\n` +
  `   :root = primitives + component tokens + default brand "${DEFAULT_BRAND}";\n` +
  `   [data-theme="<brand>"] = semantic brand override. */\n\n`;

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, header + body);

const themeCount = [...raw.matchAll(/\[data-theme="([^"]+)"\]/g)].length;
console.log(`✓ Built ${path.relative(root, OUT)} from ${themeCount} source blocks`);
console.log(`  base -> :root (${BASE_MODES.join(', ')}); default brand: ${DEFAULT_BRAND}`);
