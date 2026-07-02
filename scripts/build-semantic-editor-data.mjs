#!/usr/bin/env node
/* Generates src/lib/semantic-tokens.json for the theme designer.
 * Sourced from the canonical tokens.dtcg.json so the editor never drifts:
 * every semantic token (its CSS var, type, current primitive alias, and which
 * primitive family it may be re-pointed to) + every primitive (grouped by ramp)
 * + every Layer-3 component token (grouped by component) + a usage map of which
 * --ds-* vars each src/components/ui/*.tsx actually consumes (drives the
 * per-component token filter in the theme designer).
 *
 *   Run: npm run editor:data
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const t = JSON.parse(readFileSync(join(ROOT, "tokens/tokens.dtcg.json"), "utf8"));

// --ds- var name from a token path (lowercase, slashes -> dashes)
const dsVar = (path) => `--ds-${path.replace(/\//g, "-").toLowerCase()}`;
// "{color.slate.200}" -> "color/slate/200"
const aliasPath = (v) => (typeof v === "string" && v.startsWith("{") ? v.slice(1, -1).replace(/\./g, "/") : null);

function leaves(node, path, acc) {
  if (node && typeof node === "object") {
    if ("$value" in node) {
      acc.push({ path: path.join("/"), type: node.$type, value: node.$value });
      return acc;
    }
    for (const k of Object.keys(node)) if (!k.startsWith("$")) leaves(node[k], [...path, k], acc);
  }
  return acc;
}

const globalLeaves = leaves(t.global, [], []);
const semanticLeaves = leaves(t.semantic, [], []);
const componentLeaves = leaves(t.component ?? {}, [], []);

// combined lookup for resolving alias chains to a concrete value
const all = new Map();
for (const l of [...globalLeaves, ...semanticLeaves, ...componentLeaves]) all.set(l.path, l.value);
function resolve(value, depth = 0) {
  if (depth > 10) return null;
  const ap = aliasPath(value);
  if (!ap) return value; // concrete
  const next = all.get(ap);
  return next === undefined ? null : resolve(next, depth + 1);
}

// ── Primitives, grouped by family ───────────────────────────────────────────
const primitives = {};
for (const l of globalLeaves) {
  const seg = l.path.split("/");
  let family;
  if (seg[0] === "color") family = "color";
  else if (seg[0] === "spacing") family = "spacing";
  else if (seg[0] === "borderRadius") family = "borderRadius";
  else if (seg[0] === "borderWidth") family = "borderWidth";
  else if (seg[0] === "fontSize") family = "fontSize";
  else if (seg[0] === "lineHeight") family = "lineHeight";
  else if (seg[0] === "fontWeight") family = "fontWeight";
  else if (seg[0] === "fontFamily") family = "fontFamily";
  else family = "other";
  (primitives[family] ||= []).push({
    path: l.path,
    ds: dsVar(l.path),
    value: String(l.value),
    ramp: family === "color" ? seg[1] : undefined, // slate, jit, blue…
    step: family === "color" ? seg[2] : undefined,
    label: seg.slice(1).join(" "),
  });
}

// which primitive family a semantic token can be re-pointed to
function primFamilyFor(path, type) {
  if (type === "color") return "color";
  if (type === "fontWeight") return "fontWeight";
  if (type === "string") return "fontFamily"; // typography family
  if (type === "dimension") {
    if (path.startsWith("spacing")) return "spacing";
    if (path.startsWith("radius")) return "borderRadius";
    if (path.startsWith("borderWidth")) return "borderWidth";
    if (path.endsWith("fontsize") || path.endsWith("fontSize")) return "fontSize";
    if (path.endsWith("lineheight") || path.endsWith("lineHeight")) return "lineHeight";
    return "spacing";
  }
  return "color";
}

// ── Semantic tokens ─────────────────────────────────────────────────────────
const semantic = semanticLeaves.map((l) => {
  const seg = l.path.split("/");
  const major = seg[0]; // color | typography | spacing | radius | borderWidth | chart
  // subgroup: nested name for color (content/border/status/label…), else core
  let sub;
  if (major === "color") sub = seg.length > 2 ? seg[1] : "core";
  else if (major === "typography") sub = seg[1]; // bodymd, headinglg…
  else sub = seg.length > 2 ? seg[1] : "scale";
  const ap = aliasPath(l.value);
  const target = ap
    ? { kind: all.has(ap) && ap.split("/")[0] !== major ? "primitive" : "alias", path: ap, ds: dsVar(ap) }
    : { kind: "raw", value: String(l.value) };
  return {
    path: l.path,
    ds: dsVar(l.path),
    name: seg.slice(major === "color" && sub !== "core" ? 2 : 1).join("/") || l.path,
    type: l.type,
    major,
    sub,
    primFamily: primFamilyFor(l.path, l.type),
    target,
    resolved: String(resolve(l.value) ?? l.value), // concrete value for swatch/display
  };
});

// ── Layer-3 component tokens ────────────────────────────────────────────────
const semanticPaths = new Set(semanticLeaves.map((l) => l.path));
const globalPaths = new Set(globalLeaves.map((l) => l.path));
const component = componentLeaves.map((l) => {
  const seg = l.path.split("/");
  const ap = aliasPath(l.value);
  let target;
  if (!ap) target = { kind: "raw", value: String(l.value) };
  else if (semanticPaths.has(ap)) target = { kind: "semantic", path: ap, ds: dsVar(ap) };
  else if (globalPaths.has(ap)) target = { kind: "primitive", path: ap, ds: dsVar(ap) };
  else target = { kind: "alias", path: ap, ds: dsVar(ap) };
  return {
    path: l.path,
    ds: dsVar(l.path),
    group: seg[0], // button | badge | input | …
    name: seg.slice(1).join("/") || l.path,
    type: l.type,
    primFamily: primFamilyFor(l.path.replace(/^[^/]+\//, ""), l.type),
    target,
    resolved: String(resolve(l.value) ?? l.value),
  };
});

// ── Usage map: which --ds-* vars each ui component file consumes ────────────
const UI_DIR = join(ROOT, "src/components/ui");
const usage = {};
for (const f of readdirSync(UI_DIR).sort()) {
  if (!f.endsWith(".tsx") || f.includes(".stories.")) continue;
  const src = readFileSync(join(UI_DIR, f), "utf8");
  const vars = new Set();
  for (const m of src.matchAll(/var\((--ds-[a-z0-9-]+)/g)) vars.add(m[1]);
  if (vars.size) usage[f.replace(/\.tsx$/, "")] = [...vars].sort();
}

const out = {
  generatedAt: new Date().toISOString(),
  counts: {
    semantic: semantic.length,
    component: component.length,
    usageFiles: Object.keys(usage).length,
    primitives: Object.fromEntries(Object.entries(primitives).map(([k, v]) => [k, v.length])),
  },
  semantic,
  component,
  usage,
  primitives,
};

writeFileSync(join(ROOT, "src/lib/semantic-tokens.json"), JSON.stringify(out, null, 2) + "\n");
console.log(
  `semantic-tokens.json: ${semantic.length} semantic + ${component.length} component tokens, usage for ${Object.keys(usage).length} files, primitives:`,
  out.counts.primitives,
);
