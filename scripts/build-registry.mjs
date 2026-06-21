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

const ROOT = process.cwd();
const UI_DIR = join(ROOT, "src/components/ui");

// import source -> npm package name (root). react/react-dom are provided by the app.
const SKIP_PKGS = new Set(["react", "react-dom"]);
const pkgName = (src) => {
  if (src.startsWith("@")) return src.split("/").slice(0, 2).join("/"); // @scope/pkg
  return src.split("/")[0];
};

// Read package.json so we can pin dependency ranges to what the kit uses.
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
const dep = (name) => (allDeps[name] ? `${name}@${allDeps[name].replace(/^[\^~]/, "")}` : name);

const files = readdirSync(UI_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))
  .sort();

const componentNames = new Set(files.map((f) => basename(f, ".tsx")));
const importRe = /(?:import|export)[^"']*?from\s*["']([^"']+)["']|import\s*["']([^"']+)["']/g;

const items = files.map((file) => {
  const name = basename(file, ".tsx");
  const src = readFileSync(join(UI_DIR, file), "utf8");
  const npm = new Set();
  const registryDeps = new Set(["theme"]); // tokenized by default
  let usesUtils = false;

  let m;
  while ((m = importRe.exec(src))) {
    const spec = m[1] || m[2];
    if (!spec) continue;
    if (spec === "@/lib/utils") { usesUtils = true; continue; }
    if (spec.startsWith("@/components/ui/")) { registryDeps.add(basename(spec)); continue; }
    if (spec.startsWith("./")) { registryDeps.add(basename(spec)); continue; } // sibling ui file
    if (spec.startsWith("@/") || spec.startsWith(".")) continue; // other internal
    const p = pkgName(spec);
    if (!SKIP_PKGS.has(p)) npm.add(p);
  }
  if (usesUtils) registryDeps.add("utils");
  registryDeps.delete(name); // never self-depend

  return {
    name,
    type: "registry:ui",
    title: name.replace(/(^|-)(\w)/g, (_, d, c) => (d ? " " : "") + c.toUpperCase()).trim(),
    description: `Kraken UI Kit ${name} — tokenized shadcn component (Layer-3 --ds-* bindings, brand-switchable via [data-theme]).`,
    dependencies: [...npm].sort().map(dep),
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
];

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "kraken",
  homepage: "https://github.com/ziolkowskiw/kraken-ui-kit",
  items: [...base, ...items],
};

writeFileSync(join(ROOT, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`registry.json written: ${registry.items.length} items (${items.length} components + ${base.length} base).`);
