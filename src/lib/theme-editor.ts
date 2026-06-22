/* Semantic-layer editor logic. You edit the DS's *semantic layer*: every semantic
 * token is an alias to a Layer-1 primitive (primary → color.jit.500), and you
 * re-point it to a different primitive. Overrides apply at :root (all tokens are
 * declared there, alias chains resolve there) — the same reason brand switching
 * sets data-theme on <html>. Data is generated from tokens.dtcg.json by
 * scripts/build-semantic-editor-data.mjs (npm run editor:data). */

import data from "./semantic-tokens.json";

export type Prim = { path: string; ds: string; value: string; ramp?: string; step?: string; label: string };
export type SemTarget = { kind: "primitive" | "alias" | "raw"; path?: string; ds?: string; value?: string };
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

export const SEMANTIC = (data.semantic as SemToken[]).slice();
export const PRIMITIVES = data.primitives as Record<string, Prim[]>;

// primitive lookup by ds var
export const PRIM_BY_DS: Record<string, Prim> = {};
for (const fam of Object.values(PRIMITIVES)) for (const p of fam) PRIM_BY_DS[p.ds] = p;

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

// ── A style = a named set of semantic re-points ─────────────────────────────
export type Style = {
  id: string;
  name: string;
  overrides: Record<string, string>; // semantic ds  ->  primitive ds (chosen alias)
};
export const newStyle = (): Style => ({
  id: `style-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
  name: "Untitled style",
  overrides: {},
});

/** effective primitive ds a token currently points at (override or original). */
export function effectiveTargetDs(tk: SemToken, overrides: Record<string, string>): string | null {
  if (overrides[tk.ds]) return overrides[tk.ds];
  if (tk.target.kind === "raw") return null;
  return tk.target.ds ?? null;
}
/** concrete display value for a token under the current overrides. */
export function effectiveValue(tk: SemToken, overrides: Record<string, string>): string {
  const ds = overrides[tk.ds];
  if (ds && PRIM_BY_DS[ds]) return PRIM_BY_DS[ds].value;
  return tk.resolved;
}

/** Live CSS: re-point each overridden semantic token to its new primitive. */
export function generateCss(style: Style, selector = ":root"): string {
  const lines = Object.entries(style.overrides).map(([semDs, primDs]) => `  ${semDs}: var(${primDs});`);
  return lines.length ? `${selector} {\n${lines.join("\n")}\n}` : "";
}

/** Export the authored semantic layer as an alias map (re-importable). */
export function exportJson(style: Style): string {
  const tokens: Record<string, string> = {};
  for (const tk of SEMANTIC) {
    const ds = style.overrides[tk.ds];
    const prim = ds ? PRIM_BY_DS[ds] : null;
    if (prim) tokens[tk.path] = `{${prim.path.replace(/\//g, ".")}}`;
    else if (tk.target.kind === "raw") tokens[tk.path] = tk.target.value ?? tk.resolved;
    else if (tk.target.path) tokens[tk.path] = `{${tk.target.path.replace(/\//g, ".")}}`;
  }
  return JSON.stringify(
    { $schema: "kraken-semantic@1", name: style.name, changed: Object.keys(style.overrides).length, semantic: tokens },
    null,
    2,
  );
}

/** Import a previously exported kraken-semantic@1 JSON back into a Style. */
export function importJson(jsonStr: string): Style | null {
  let parsed: unknown;
  try { parsed = JSON.parse(jsonStr); } catch { return null; }
  if (
    typeof parsed !== "object" || parsed === null ||
    (parsed as Record<string, unknown>)["$schema"] !== "kraken-semantic@1"
  ) return null;

  const raw = parsed as { name?: string; semantic?: Record<string, string> };
  const semByPath: Record<string, SemToken> = {};
  for (const tk of SEMANTIC) semByPath[tk.path] = tk;

  const primByPath: Record<string, Prim> = {};
  for (const fam of Object.values(PRIMITIVES)) for (const p of fam) primByPath[p.path] = p;

  const overrides: Record<string, string> = {};
  for (const [path, ref] of Object.entries(raw.semantic ?? {})) {
    const tk = semByPath[path];
    if (!tk) continue;
    if (typeof ref === "string" && ref.startsWith("{") && ref.endsWith("}")) {
      const primPath = ref.slice(1, -1).replace(/\./g, "/");
      const prim = primByPath[primPath];
      if (prim) overrides[tk.ds] = prim.ds;
    }
  }

  return {
    id: `style-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: typeof raw.name === "string" && raw.name ? raw.name : "Imported style",
    overrides,
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
