/* Shared source-extraction helpers for the generated surfaces (docs, registry,
 * manifests). All extraction is regex-based and convention-bound: one cva()
 * call per file with `defaultVariants` present — see CLAUDE.md.
 */

// ── CVA / props extraction (from build-docs.mjs) ───────────────────────────
export function extractExports(src) {
  const m = src.match(/export\s*\{([^}]+)\}/g);
  if (!m) return [];
  return m
    .flatMap((b) =>
      b
        .replace(/export\s*\{/, "")
        .replace("}", "")
        .split(","),
    )
    .map((s) =>
      s
        .trim()
        .split(/\s+as\s+/)[0]
        .trim(),
    )
    .filter((s) => s && /^[A-Z]/.test(s))
    .filter((v, i, a) => a.indexOf(v) === i);
}

export function extractVariants(src) {
  const result = {};
  // find every `variants: { ... defaultVariants/compoundVariants` block
  const blocksRe =
    /variants:\s*\{([\s\S]*?)\n[ \t]*\},?\s*\n[ \t]*(defaultVariants|compoundVariants)/g;
  let bm;
  while ((bm = blocksRe.exec(src))) {
    const block = bm[1];
    // each axis key: { ... } — key may be bare word or "quoted"
    const kvRe = /(?:["'](\w[\w-]*)["']|(\w+)):\s*\{([\s\S]*?)\n[ \t]*\}/g;
    let km;
    while ((km = kvRe.exec(block))) {
      const key = km[1] || km[2];
      if (key === "class" || key === "className") continue;
      const inner = km[3];
      // value keys: bare identifiers OR quoted (may contain hyphens)
      const vals = [
        ...[...inner.matchAll(/["']([\w-]+)["']\s*:/g)].map((m) => m[1]),
        ...[...inner.matchAll(/^[ \t]+(\w+)\s*:/gm)]
          .map((m) => m[1])
          .filter((v) => !["class", "className", "true", "false"].includes(v)),
      ];
      const unique = [...new Set(vals)];
      if (unique.length) {
        result[key] = result[key] ? [...new Set([...result[key], ...unique])] : unique;
      }
    }
  }
  return result;
}

export function extractDefaults(src) {
  const m = src.match(/defaultVariants:\s*\{([^}]+)\}/);
  if (!m) return {};
  const obj = {};
  for (const pair of m[1].matchAll(/(\w+):\s*"([^"]+)"/g)) obj[pair[1]] = pair[2];
  return obj;
}

export function extractCompoundVariants(src) {
  const block = src.match(/compoundVariants:\s*\[([\s\S]*?)\n[ \t]*\],/);
  if (!block) return [];
  const out = [];
  let note = null;
  for (const line of block[1].split("\n")) {
    const trimmed = line.trim();
    const comment = trimmed.match(/^\/\/\s?(.*)/);
    if (comment) {
      note = comment[1];
      continue;
    }
    const obj = trimmed.match(/^\{(.*)\}[,]?$/);
    if (!obj) continue;
    const when = {};
    for (const kv of obj[1].matchAll(/(\w[\w-]*|"[\w-]+"):\s*(true|false|"[^"]*"|\d+)/g)) {
      const key = kv[1].replace(/"/g, "");
      if (key === "class" || key === "className") continue;
      const raw = kv[2];
      when[key] = raw === "true" ? true : raw === "false" ? false : raw.replace(/"/g, "");
    }
    if (Object.keys(when).length) out.push(note ? { when, note } : { when });
  }
  return out;
}

export function extractTokens(src) {
  const matches = [...src.matchAll(/var\(--ds-([a-z0-9-]+)\)/g)].map((m) => m[1]);
  return [...new Set(matches)].sort();
}

export function extractBoolProps(src) {
  const props = [];
  for (const m of src.matchAll(/(\w+)\?:\s*bool(?:ean)?/g)) props.push(m[1]);
  return props;
}

export function extractStringProps(src) {
  const props = [];
  for (const m of src.matchAll(/(\w+)\?:\s*(?:React\.ReactNode|string|LucideIcon)/g))
    props.push(m[1]);
  return props;
}

/* The `//` comment block immediately above the first cva() declaration —
 * the human-authored rationale (e.g. button.tsx:6-10). */
export function extractLeadingComment(src) {
  const lines = src.split("\n");
  const declIdx = lines.findIndex((l) => /(?:const|let)\s+\w+\s*=\s*cva\s*\(/.test(l));
  if (declIdx <= 0) return null;
  const comment = [];
  for (let i = declIdx - 1; i >= 0; i--) {
    const m = lines[i].match(/^\s*\/\/\s?(.*)$/);
    if (!m) break;
    comment.unshift(m[1]);
  }
  return comment.length ? comment.join(" ").replace(/\s+/g, " ").trim() : null;
}

// ── Token layer classification (from build-docs.mjs) ───────────────────────
export function tokenLayer(name) {
  if (
    name.startsWith("button-") ||
    name.startsWith("input-") ||
    name.startsWith("badge-") ||
    name.startsWith("card-") ||
    name.startsWith("alert-") ||
    name.startsWith("select-") ||
    name.startsWith("checkbox-") ||
    name.startsWith("radio-") ||
    name.startsWith("switch-") ||
    name.startsWith("tabs-") ||
    name.startsWith("sidebar-token") ||
    name.startsWith("toggle-")
  ) {
    return "L3 Component";
  }
  if (
    name.startsWith("color-") ||
    name.startsWith("radius-") ||
    name.startsWith("spacing-") ||
    name.startsWith("typography-") ||
    name.startsWith("shadow-")
  )
    return "L2 Semantic";
  return "L1 Primitive / Shared";
}

// ── Import parsing (from build-registry.mjs) ───────────────────────────────
// react/react-dom are provided by the app.
export const SKIP_PKGS = new Set(["react", "react-dom"]);

export const pkgName = (spec) => {
  if (spec.startsWith("@")) return spec.split("/").slice(0, 2).join("/"); // @scope/pkg
  return spec.split("/")[0];
};

const importRe = /(?:import|export)[^"']*?from\s*["']([^"']+)["']|import\s*["']([^"']+)["']/g;

/* Parse a ui/*.tsx source into npm packages + sibling registry deps.
 * Mirrors build-registry.mjs behavior exactly. */
export function parseImports(src) {
  const npm = new Set();
  const registryDeps = new Set();
  let usesUtils = false;

  let m;
  const re = new RegExp(importRe.source, "g");
  while ((m = re.exec(src))) {
    const spec = m[1] || m[2];
    if (!spec) continue;
    if (spec === "@/lib/utils") {
      usesUtils = true;
      continue;
    }
    if (spec.startsWith("@/components/ui/")) {
      registryDeps.add(spec.split("/").pop());
      continue;
    }
    if (spec.startsWith("./")) {
      registryDeps.add(spec.split("/").pop());
      continue;
    } // sibling ui file
    if (spec.startsWith("@/") || spec.startsWith(".")) continue; // other internal
    const p = pkgName(spec);
    if (!SKIP_PKGS.has(p)) npm.add(p);
  }
  return { npm: [...npm], registryDeps: [...registryDeps], usesUtils };
}
