/* Style-builder logic. A "Style" is a complete, self-contained design style the
 * user authors one at a time: colors + fonts + type scale + spacing + radius.
 * jit/randstadt are just seed palettes to start from. Overrides apply at :root
 * (every token is declared there, alias chains resolve there) — the same reason
 * the kit's brand switch sets data-theme on <html>. */

export type Seed = "jit" | "randstadt";

export type Style = {
  id: string;
  name: string;
  seed: Seed; // starting palette (base colors for anything not overridden)
  colors: Record<string, string>; // semantic token key -> hex
  fontBody: string; // font catalog id
  fontHeading: string; // font catalog id
  fontScale: number; // font-size multiplier
  lineHeightScale: number; // line-height multiplier
  spacingScale: number;
  radiusScale: number;
};

export const newStyle = (seed: Seed = "jit"): Style => ({
  id: `style-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
  name: "Untitled style",
  seed,
  colors: {},
  fontBody: seed === "randstadt" ? "noto-sans" : "moderat",
  fontHeading: seed === "randstadt" ? "noto-sans" : "moderat",
  fontScale: 1,
  lineHeightScale: 1,
  spacingScale: 1,
  radiusScale: 1,
});

// ── Editable semantic colors (shadcn names verbatim) ────────────────────────
export type ColorToken = { key: string; label: string; group: string };
export const COLOR_TOKENS: ColorToken[] = [
  { key: "background", label: "Background", group: "Base" },
  { key: "foreground", label: "Foreground", group: "Base" },
  { key: "primary", label: "Primary", group: "Primary" },
  { key: "primary-foreground", label: "Primary fg", group: "Primary" },
  { key: "secondary", label: "Secondary", group: "Secondary" },
  { key: "secondary-foreground", label: "Secondary fg", group: "Secondary" },
  { key: "muted", label: "Muted", group: "Muted" },
  { key: "muted-foreground", label: "Muted fg", group: "Muted" },
  { key: "accent", label: "Accent", group: "Accent" },
  { key: "accent-foreground", label: "Accent fg", group: "Accent" },
  { key: "card", label: "Card", group: "Surfaces" },
  { key: "card-foreground", label: "Card fg", group: "Surfaces" },
  { key: "popover", label: "Popover", group: "Surfaces" },
  { key: "popover-foreground", label: "Popover fg", group: "Surfaces" },
  { key: "destructive", label: "Destructive", group: "Status" },
  { key: "destructive-foreground", label: "Destructive fg", group: "Status" },
  { key: "border", label: "Border", group: "UI" },
  { key: "input", label: "Input", group: "UI" },
  { key: "ring", label: "Ring", group: "UI" },
];
export const COLOR_GROUPS = ["Base", "Primary", "Secondary", "Muted", "Accent", "Surfaces", "Status", "UI"];

export const CONTRAST_PAIRS: { label: string; fg: string; bg: string }[] = [
  { label: "Text on background", fg: "foreground", bg: "background" },
  { label: "Text on card", fg: "card-foreground", bg: "card" },
  { label: "Text on popover", fg: "popover-foreground", bg: "popover" },
  { label: "Primary button", fg: "primary-foreground", bg: "primary" },
  { label: "Secondary button", fg: "secondary-foreground", bg: "secondary" },
  { label: "Muted text", fg: "muted-foreground", bg: "muted" },
  { label: "Accent", fg: "accent-foreground", bg: "accent" },
  { label: "Destructive", fg: "destructive-foreground", bg: "destructive" },
];

// ── Font catalog ────────────────────────────────────────────────────────────
export type FontDef = { id: string; name: string; stack: string; google?: string; serif?: boolean };
export const FONTS: FontDef[] = [
  { id: "moderat", name: "Moderat JIT (brand)", stack: '"Moderat JIT"' },
  { id: "noto-sans", name: "Noto Sans (brand)", stack: '"Noto Sans"', google: "Noto+Sans" },
  { id: "system", name: "System UI", stack: "system-ui, -apple-system" },
  { id: "inter", name: "Inter", stack: '"Inter"', google: "Inter" },
  { id: "roboto", name: "Roboto", stack: '"Roboto"', google: "Roboto" },
  { id: "open-sans", name: "Open Sans", stack: '"Open Sans"', google: "Open+Sans" },
  { id: "lato", name: "Lato", stack: '"Lato"', google: "Lato" },
  { id: "montserrat", name: "Montserrat", stack: '"Montserrat"', google: "Montserrat" },
  { id: "poppins", name: "Poppins", stack: '"Poppins"', google: "Poppins" },
  { id: "work-sans", name: "Work Sans", stack: '"Work Sans"', google: "Work+Sans" },
  { id: "dm-sans", name: "DM Sans", stack: '"DM Sans"', google: "DM+Sans" },
  { id: "manrope", name: "Manrope", stack: '"Manrope"', google: "Manrope" },
  { id: "space-grotesk", name: "Space Grotesk", stack: '"Space Grotesk"', google: "Space+Grotesk" },
  { id: "ibm-plex-sans", name: "IBM Plex Sans", stack: '"IBM Plex Sans"', google: "IBM+Plex+Sans" },
  { id: "jakarta", name: "Plus Jakarta Sans", stack: '"Plus Jakarta Sans"', google: "Plus+Jakarta+Sans" },
  { id: "merriweather", name: "Merriweather (serif)", stack: '"Merriweather"', google: "Merriweather", serif: true },
  { id: "playfair", name: "Playfair Display (serif)", stack: '"Playfair Display"', google: "Playfair+Display", serif: true },
];
export const fontById = (id: string) => FONTS.find((f) => f.id === id) ?? FONTS[0];
const fontStack = (id: string) => {
  const f = fontById(id);
  return `${f.stack}, ${f.serif ? "ui-serif, Georgia, serif" : "ui-sans-serif, system-ui, -apple-system, sans-serif"}`;
};
export const googleFontHref = (id: string) => {
  const f = fontById(id);
  return f.google
    ? `https://fonts.googleapis.com/css2?family=${f.google}:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`
    : null;
};

// ── Typography styles (which font group + scaled primitives) ────────────────
const HEADING_STYLES = ["display2xl", "displayxl", "displaylg", "displaymd", "headingxl", "headinglg", "headingmd", "headingsm"];
const BODY_STYLES = ["bodylg", "bodymd", "bodysm", "bodyxs", "labellg", "labelmd", "labelsm", "linklg", "linkmd", "linksm", "linkxs", "overline"];

// L1 primitive base px (suffix is named, so we keep an explicit base map)
const FONTSIZE_BASE: Record<string, number> = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24, "2xl": 32, "3xl": 40, "4xl": 48, "5xl": 56, "6xl": 72 };
const LINEHEIGHT_BASE: Record<string, number> = { xs: 16, sm: 20, md: 24, lg: 28, xl: 32, "2xl": 40, "3xl": 56 };
const SPACING_SUFFIXES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96, 128, 160, 192, 256];
const RADIUS_SUFFIXES = [2, 4, 6, 8, 12, 16, 24];

const px = (n: number) => `${Math.round(n * 10) / 10}px`;

/** The CSS that applies the whole style. Targets :root so alias chains resolve. */
export function generateStyleCss(style: Style, selector = ":root"): string {
  const lines: string[] = [];

  // colors
  for (const { key } of COLOR_TOKENS) {
    const v = style.colors[key];
    if (v) lines.push(`  --ds-color-${key}: ${v};`);
  }

  // fonts — override each typography style's family directly (brand-independent)
  const body = fontStack(style.fontBody);
  const heading = fontStack(style.fontHeading);
  for (const s of BODY_STYLES) lines.push(`  --ds-typography-${s}-fontfamily: ${body};`);
  for (const s of HEADING_STYLES) lines.push(`  --ds-typography-${s}-fontfamily: ${heading};`);
  // also drive the app sans + the family primitives, so anything else follows body
  lines.push(`  --ds-fontfamily-jit: ${body};`);
  lines.push(`  --ds-fontfamily-randstadt: ${body};`);

  // type scale
  if (style.fontScale !== 1) {
    for (const [k, base] of Object.entries(FONTSIZE_BASE)) lines.push(`  --ds-fontsize-${k}: ${px(base * style.fontScale)};`);
  }
  if (style.lineHeightScale !== 1) {
    for (const [k, base] of Object.entries(LINEHEIGHT_BASE)) lines.push(`  --ds-lineheight-${k}: ${px(base * style.lineHeightScale)};`);
  }

  // spacing & radius
  if (style.spacingScale !== 1) {
    for (const n of SPACING_SUFFIXES) lines.push(`  --ds-spacing-${n}: ${px(n * style.spacingScale)};`);
  }
  if (style.radiusScale !== 1) {
    for (const n of RADIUS_SUFFIXES) lines.push(`  --ds-borderradius-${n}: ${px(n * style.radiusScale)};`);
  }

  return lines.length ? `${selector} {\n${lines.join("\n")}\n}` : "";
}

/** Complete, re-importable JSON token set for the style. */
export function exportJson(style: Style): string {
  return JSON.stringify(
    {
      $schema: "kraken-style@1",
      name: style.name,
      seed: style.seed,
      typography: {
        fontBody: fontById(style.fontBody).name,
        fontBodyId: style.fontBody,
        fontHeading: fontById(style.fontHeading).name,
        fontHeadingId: style.fontHeading,
        fontScale: style.fontScale,
        lineHeightScale: style.lineHeightScale,
      },
      spacingScale: style.spacingScale,
      radiusScale: style.radiusScale,
      colors: style.colors,
    },
    null,
    2,
  );
}

// ── localStorage persistence (save & switch multiple styles) ────────────────
const LS_KEY = "kraken-styles";
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

// ── Color parsing & WCAG contrast ───────────────────────────────────────────
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
export function rgbToHex([r, g, b]: [number, number, number]): string {
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
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
