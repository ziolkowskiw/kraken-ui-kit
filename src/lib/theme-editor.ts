/* Theme-designer logic. Two editable layers, one override model:
 *  - Layer 2 (semantic): every semantic token aliases a Layer-1 primitive
 *    (primary → color.jit.500); re-point it to a different primitive.
 *  - Layer 3 (component): every component token aliases a semantic token
 *    (button/primary/fill → color/primary); re-point it to a different semantic
 *    token or primitive for a component-scoped override.
 * Overrides apply at :root (all tokens are declared there, alias chains resolve
 * there) — the same reason brand switching sets data-theme on <html>. Data is
 * generated from tokens.dtcg.json by scripts/build-semantic-editor-data.mjs
 * (npm run editor:data). */

import data from "./semantic-tokens.json";

export type Prim = { path: string; ds: string; value: string; ramp?: string; step?: string; label: string };
export type SemTarget = { kind: "primitive" | "semantic" | "alias" | "raw"; path?: string; ds?: string; value?: string };
export type SemToken = {
  path: string;
  ds: string;
  name: string;
  type: string;
  major: string; // color | typography | spacing | radius | borderWidth | chart
  sub: string; // core | content | border | status | label | bodymd …
  primFamily: string; // which primitive family it may re-point to
  target: SemTarget; // current alias
  resolved: string; // concrete value (for swatch/display)
};
export type CompToken = {
  path: string;
  ds: string;
  group: string; // button | badge | input | menuItem …
  name: string; // path inside the group, e.g. primary/fill
  type: string;
  primFamily: string;
  target: SemTarget;
  resolved: string;
};

export const SEMANTIC = (data.semantic as SemToken[]).slice();
export const COMPONENT_TOKENS = (data.component as CompToken[]).slice();
export const USAGE = data.usage as Record<string, string[]>;
export const PRIMITIVES = data.primitives as Record<string, Prim[]>;

// primitive lookup by ds var
export const PRIM_BY_DS: Record<string, Prim> = {};
for (const fam of Object.values(PRIMITIVES)) for (const p of fam) PRIM_BY_DS[p.ds] = p;

// semantic / component lookups by ds var
export const SEM_BY_DS: Record<string, SemToken> = {};
for (const tk of SEMANTIC) SEM_BY_DS[tk.ds] = tk;
export const COMP_BY_DS: Record<string, CompToken> = {};
for (const tk of COMPONENT_TOKENS) COMP_BY_DS[tk.ds] = tk;

// color ramps in display order
export const COLOR_RAMPS: string[] = (() => {
  const seen: string[] = [];
  for (const p of PRIMITIVES.color || []) if (p.ramp && !seen.includes(p.ramp)) seen.push(p.ramp);
  return seen;
})();

// major-group display order + labels
export const MAJORS = ["color", "typography", "spacing", "radius", "borderWidth", "chart"];
export const SUBGROUPS: Record<string, string[]> = (() => {
  const m: Record<string, string[]> = {};
  for (const tk of SEMANTIC) {
    (m[tk.major] ||= []);
    if (!m[tk.major].includes(tk.sub)) m[tk.major].push(tk.sub);
  }
  return m;
})();

// ── A style = a named set of token re-points ────────────────────────────────
export type Style = {
  id: string;
  name: string;
  overrides: Record<string, string>; // token ds -> target ds (semantic→primitive, component→semantic|primitive)
  done?: string[]; // design-step slugs marked as designed
};
export const newStyle = (): Style => ({
  id: `style-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
  name: "Untitled style",
  overrides: {},
  done: [],
});

/** effective target ds a token currently points at (override or original). */
export function effectiveTargetDs(tk: SemToken | CompToken, overrides: Record<string, string>): string | null {
  if (overrides[tk.ds]) return overrides[tk.ds];
  if (tk.target.kind === "raw") return null;
  return tk.target.ds ?? null;
}
/** resolve any --ds-* var to its concrete value under the current overrides. */
export function resolveDs(ds: string, overrides: Record<string, string>, depth = 0): string | null {
  if (depth > 10) return null;
  const next = overrides[ds];
  if (next && next !== ds) return resolveDs(next, overrides, depth + 1);
  const prim = PRIM_BY_DS[ds];
  if (prim) return prim.value;
  const sem = SEM_BY_DS[ds];
  if (sem) return sem.target.ds ? resolveDs(sem.target.ds, overrides, depth + 1) ?? sem.resolved : sem.resolved;
  const comp = COMP_BY_DS[ds];
  if (comp) return comp.target.ds ? resolveDs(comp.target.ds, overrides, depth + 1) ?? comp.resolved : comp.resolved;
  return null;
}
/** concrete display value for a token under the current overrides. */
export function effectiveValue(tk: SemToken | CompToken, overrides: Record<string, string>): string {
  return resolveDs(tk.ds, overrides) ?? tk.resolved;
}
/** short human label for any target ds (primitive, semantic, or component). */
export function targetLabel(ds: string): string {
  return PRIM_BY_DS[ds]?.label ?? SEM_BY_DS[ds]?.name ?? COMP_BY_DS[ds]?.name ?? ds.replace(/^--ds-/, "");
}

// ── Per-step token filtering (component-by-component designer) ──────────────
/** Tokens relevant to a design step: the Layer-3 tokens of its component
 * groups + the semantic tokens its files consume directly + the semantic
 * tokens its Layer-3 tokens alias. */
export function tokensForStep(step: { groups?: string[]; files?: string[]; semanticMajors?: string[] }): {
  comp: CompToken[];
  sem: SemToken[];
} {
  const comp = step.groups?.length ? COMPONENT_TOKENS.filter((t) => step.groups!.includes(t.group)) : [];
  const semDs = new Set<string>();
  for (const t of comp) if (t.target.kind === "semantic" && t.target.ds) semDs.add(t.target.ds);
  for (const f of step.files ?? []) for (const ds of USAGE[f] ?? []) if (SEM_BY_DS[ds]) semDs.add(ds);
  let sem = SEMANTIC.filter((t) => semDs.has(t.ds));
  if (step.semanticMajors?.length) {
    const extra = SEMANTIC.filter((t) => step.semanticMajors!.includes(t.major) && !semDs.has(t.ds));
    sem = [...sem, ...extra];
  }
  return { comp, sem };
}

/** Live CSS: re-point each overridden semantic token to its new primitive. */
export function generateCss(style: Style, selector = ":root"): string {
  const lines = Object.entries(style.overrides).map(([semDs, primDs]) => `  ${semDs}: var(${primDs});`);
  return lines.length ? `${selector} {\n${lines.join("\n")}\n}` : "";
}

/** Export the authored theme as an alias map (re-importable).
 * `semantic` holds the full semantic layer (kraken-semantic@1 shape, consumed by
 * the theme-apply skill); `component` is an additive map of only the overridden
 * Layer-3 tokens. */
export function exportJson(style: Style): string {
  const tokens: Record<string, string> = {};
  for (const tk of SEMANTIC) {
    const ds = style.overrides[tk.ds];
    const prim = ds ? PRIM_BY_DS[ds] : null;
    if (prim) tokens[tk.path] = `{${prim.path.replace(/\//g, ".")}}`;
    else if (tk.target.kind === "raw") tokens[tk.path] = tk.target.value ?? tk.resolved;
    else if (tk.target.path) tokens[tk.path] = `{${tk.target.path.replace(/\//g, ".")}}`;
  }
  const component: Record<string, string> = {};
  for (const tk of COMPONENT_TOKENS) {
    const ds = style.overrides[tk.ds];
    if (!ds) continue;
    const target = PRIM_BY_DS[ds] ?? SEM_BY_DS[ds];
    if (target) component[tk.path] = `{${target.path.replace(/\//g, ".")}}`;
  }
  const payload: Record<string, unknown> = {
    $schema: "kraken-semantic@1",
    name: style.name,
    changed: Object.keys(style.overrides).length,
    semantic: tokens,
  };
  if (Object.keys(component).length) payload.component = component;
  return JSON.stringify(payload, null, 2);
}

/** Import a previously exported kraken-semantic@1 JSON back into a Style. */
export function importJson(jsonStr: string): Style | null {
  let parsed: unknown;
  try { parsed = JSON.parse(jsonStr); } catch { return null; }
  if (
    typeof parsed !== "object" || parsed === null ||
    (parsed as Record<string, unknown>)["$schema"] !== "kraken-semantic@1"
  ) return null;

  const raw = parsed as { name?: string; semantic?: Record<string, string>; component?: Record<string, string> };
  const semByPath: Record<string, SemToken> = {};
  for (const tk of SEMANTIC) semByPath[tk.path] = tk;
  const compByPath: Record<string, CompToken> = {};
  for (const tk of COMPONENT_TOKENS) compByPath[tk.path] = tk;

  const primByPath: Record<string, Prim> = {};
  for (const fam of Object.values(PRIMITIVES)) for (const p of fam) primByPath[p.path] = p;

  const overrides: Record<string, string> = {};
  for (const [path, ref] of Object.entries(raw.semantic ?? {})) {
    const tk = semByPath[path];
    if (!tk) continue;
    if (typeof ref === "string" && ref.startsWith("{") && ref.endsWith("}")) {
      const primPath = ref.slice(1, -1).replace(/\./g, "/");
      const prim = primByPath[primPath];
      // only record actual re-points, not the unchanged baseline the export carries
      if (prim && prim.path !== tk.target.path) overrides[tk.ds] = prim.ds;
    }
  }
  for (const [path, ref] of Object.entries(raw.component ?? {})) {
    const tk = compByPath[path];
    if (!tk) continue;
    if (typeof ref === "string" && ref.startsWith("{") && ref.endsWith("}")) {
      const targetPath = ref.slice(1, -1).replace(/\./g, "/");
      const target = primByPath[targetPath] ?? semByPath[targetPath];
      if (target && target.path !== tk.target.path) overrides[tk.ds] = target.ds;
    }
  }

  return {
    id: `style-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: typeof raw.name === "string" && raw.name ? raw.name : "Imported style",
    overrides,
    done: [],
  };
}

// ── localStorage (save & switch named styles) ───────────────────────────────
const LS_KEY = "kraken-semantic-styles";
export function loadStyles(): Style[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
export function saveStyles(styles: Style[]) {
  if (typeof window !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(styles));
}

// ── WCAG contrast (effective colors read from live probes) ───────────────────
export const CONTRAST_PAIRS = [
  { label: "Text on background", fg: "--ds-color-foreground", bg: "--ds-color-background" },
  { label: "Text on card", fg: "--ds-color-card-foreground", bg: "--ds-color-card" },
  { label: "Primary button", fg: "--ds-color-primary-foreground", bg: "--ds-color-primary" },
  { label: "Secondary button", fg: "--ds-color-secondary-foreground", bg: "--ds-color-secondary" },
  { label: "Muted text", fg: "--ds-color-muted-foreground", bg: "--ds-color-muted" },
  { label: "Destructive", fg: "--ds-color-destructive-foreground", bg: "--ds-color-destructive" },
];

export function parseRgb(s: string): [number, number, number] | null {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b] = m[1].split(/[ ,/]+/).map((x) => parseFloat(x));
    return [r, g, b];
  }
  const hex = s.trim().replace("#", "");
  if (/^[0-9a-f]{6}$/i.test(hex)) return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  if (/^[0-9a-f]{3}$/i.test(hex)) return [parseInt(hex[0] + hex[0], 16), parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16)];
  return null;
}
function luminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
export function contrastRatio(fg: string, bg: string): number | null {
  const a = parseRgb(fg);
  const b = parseRgb(bg);
  if (!a || !b) return null;
  const [hi, lo] = luminance(a) > luminance(b) ? [luminance(a), luminance(b)] : [luminance(b), luminance(a)];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}
export type WcagLevel = "AAA" | "AA" | "AA Large" | "Fail";
export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}
export function isColorValue(v: string) {
  return /^#|^rgb|^hsl|^oklch/i.test(v.trim());
}
