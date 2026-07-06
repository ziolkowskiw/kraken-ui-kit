#!/usr/bin/env node
/* Generates registry.json for the Kraken UI Kit shadcn registry.
 *
 * Derives every component item from the real source under src/components/ui/
 * so the registry never drifts from the code: imports are parsed to find npm
 * dependencies and sibling components (registryDependencies). Every component
 * depends on the `theme` item (which depends on `tokens`) so installs are
 * tokenized out of the box.
 *
 *   Run: npm run registry:build   ->  writes registry.json
 *   Then: npx shadcn build         ->  compiles registry.json -> public/r/*.json
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { parseImports } from "./lib/extract.mjs";

const ROOT = process.cwd();
const UI_DIR = join(ROOT, "src/components/ui");

// Read package.json so we can pin dependency ranges to what the kit uses.
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
const dep = (name) => (allDeps[name] ? `${name}@${allDeps[name].replace(/^[\^~]/, "")}` : name);

const files = readdirSync(UI_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))
  .sort();

const items = files.map((file) => {
  const name = basename(file, ".tsx");
  const src = readFileSync(join(UI_DIR, file), "utf8");
  const { npm, registryDeps: siblings, usesUtils } = parseImports(src);
  const registryDeps = new Set(["theme", ...siblings]); // tokenized by default
  if (usesUtils) registryDeps.add("utils");
  registryDeps.delete(name); // never self-depend

  return {
    name,
    type: "registry:ui",
    title: name.replace(/(^|-)(\w)/g, (_, d, c) => (d ? " " : "") + c.toUpperCase()).trim(),
    description: `Kraken UI Kit ${name} — tokenized shadcn component (Layer-3 --ds-* bindings, brand-switchable via [data-theme]).`,
    dependencies: [...new Set(npm)].sort().map(dep),
    registryDependencies: [...registryDeps].sort(),
    files: [{ path: `src/components/ui/${file}`, type: "registry:ui" }],
  };
});

// Base items every component leans on.
const base = [
  {
    name: "utils",
    type: "registry:lib",
    title: "cn() utility",
    description: "clsx + tailwind-merge className helper.",
    dependencies: [dep("clsx"), dep("tailwind-merge")],
    files: [{ path: "src/lib/utils.ts", type: "registry:lib" }],
  },
  {
    name: "tokens",
    type: "registry:file",
    title: "Design tokens (--ds-*)",
    description: "Generated 3-layer token CSS (primitives + component tokens + brand semantics). Brand-switchable via [data-theme] on <html>.",
    files: [{ path: "src/styles/tokens.css", type: "registry:file", target: "src/styles/tokens.css" }],
  },
  {
    name: "theme",
    type: "registry:file",
    title: "Kraken theme mapping",
    description: "Maps shadcn semantic vars (--primary, --background, …) onto the --ds-* tokens + @theme inline. Depends on `tokens`.",
    registryDependencies: ["tokens"],
    files: [{ path: "src/styles/kraken-theme.css", type: "registry:file", target: "src/styles/kraken-theme.css" }],
  },
  {
    name: "ai-foundations",
    type: "registry:file",
    title: "AI foundations (machine-readable rules)",
    description: "Always-on design-system rules for AI agents — token architecture, brand contract, conventions, shadcn divergences. Generated from design.md + MAPPING.md; the MCP server (@kraken-ui/mcp) serves the same data on demand.",
    files: [{ path: "manifests/foundations.json", type: "registry:file", target: "ai/kraken-foundations.json" }],
  },
];

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "kraken",
  homepage: "https://github.com/ziolkowskiw/kraken-ui-kit",
  items: [...base, ...items],
};

writeFileSync(join(ROOT, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`registry.json written: ${registry.items.length} items (${items.length} components + ${base.length} base).`);
