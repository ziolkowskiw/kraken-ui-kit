"use client";

/* Phase 8 — Style builder.
 * Author one complete design style at a time: colors + fonts + type scale +
 * spacing + radius. Seed from a base palette (jit/randstadt are just examples),
 * watch real Kraken components restyle live, check WCAG contrast, save/switch
 * named styles (localStorage), and export the token set as JSON. Overrides are
 * injected as a <style> at :root so the kit's alias chains re-resolve. */

import * as React from "react";
import {
  COLOR_TOKENS,
  COLOR_GROUPS,
  CONTRAST_PAIRS,
  FONTS,
  type Style,
  type Seed,
  newStyle,
  generateStyleCss,
  exportJson,
  googleFontHref,
  loadStyles,
  saveStyles,
  contrastRatio,
  wcagLevel,
  rgbToHex,
  parseRgb,
} from "@/lib/theme-editor";
import { DashboardPreview } from "@/components/theme-editor/dashboard-preview";

export default function ThemeEditorPage() {
  const [saved, setSaved] = React.useState<Style[]>([]);
  const [style, setStyle] = React.useState<Style>(() => newStyle());
  const [effective, setEffective] = React.useState<Record<string, string>>({});
  const probeRef = React.useRef<HTMLDivElement>(null);

  // hydrate saved styles + open the most recent one
  React.useEffect(() => {
    const s = loadStyles();
    setSaved(s);
    if (s.length) setStyle(s[s.length - 1]);
  }, []);

  const css = React.useMemo(() => generateStyleCss(style), [style]);

  // brand seed resolves at :root (= <html>), like the kit's real brand switch
  React.useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", style.seed);
    return () => html.setAttribute("data-theme", "jit");
  }, [style.seed]);

  // read effective colors from probes after each paint (reflects seed + overrides)
  React.useEffect(() => {
    if (!probeRef.current) return;
    const next: Record<string, string> = {};
    for (const { key } of COLOR_TOKENS) {
      const el = probeRef.current.querySelector<HTMLElement>(`[data-probe="${key}"]`);
      if (el) {
        const rgb = parseRgb(getComputedStyle(el).color);
        if (rgb) next[key] = rgbToHex(rgb);
      }
    }
    setEffective((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [css]);

  const update = (patch: Partial<Style>) => setStyle((s) => ({ ...s, ...patch }));
  const setColor = (key: string, hex: string) => setStyle((s) => ({ ...s, colors: { ...s.colors, [key]: hex } }));
  const resetColor = (key: string) =>
    setStyle((s) => {
      const colors = { ...s.colors };
      delete colors[key];
      return { ...s, colors };
    });
  const colorOf = (key: string) => style.colors[key] ?? effective[key] ?? "#000000";

  const save = () =>
    setSaved((prev) => {
      const next = prev.some((p) => p.id === style.id) ? prev.map((p) => (p.id === style.id ? style : p)) : [...prev, style];
      saveStyles(next);
      return next;
    });
  const switchTo = (id: string) => {
    const f = saved.find((s) => s.id === id);
    if (f) setStyle(f);
  };
  const createNew = () => setStyle(newStyle(style.seed));
  const remove = () =>
    setSaved((prev) => {
      const next = prev.filter((p) => p.id !== style.id);
      saveStyles(next);
      setStyle(next[next.length - 1] ?? newStyle());
      return next;
    });

  // live-load Google fonts for the chosen families
  const fontLinks = [...new Set([googleFontHref(style.fontBody), googleFontHref(style.fontHeading)])].filter(Boolean) as string[];
  const inList = saved.some((s) => s.id === style.id);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {fontLinks.map((href) => (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link key={href} rel="stylesheet" href={href} precedence="default" />
      ))}

      {/* Header — style management */}
      <header className="flex flex-wrap items-center gap-3 border-b border-neutral-200 bg-white px-6 py-3">
        <div className="mr-auto">
          <h1 className="text-sm font-semibold">Kraken Style Builder</h1>
          <p className="text-xs text-neutral-500">Author one style · live preview · WCAG · export JSON</p>
        </div>
        <input
          value={style.name}
          onChange={(e) => update({ name: e.target.value })}
          className="w-44 rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm"
          aria-label="Style name"
        />
        <select
          value={inList ? style.id : ""}
          onChange={(e) => (e.target.value ? switchTo(e.target.value) : createNew())}
          className="rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
          aria-label="Switch style"
        >
          {!inList && <option value="">{style.name} (unsaved)</option>}
          {saved.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button onClick={createNew} className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100">
          New
        </button>
        <button onClick={save} className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700">
          Save
        </button>
        {inList && (
          <button onClick={remove} className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
            Delete
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr]">
        {/* ── Controls ─────────────────────────────────────────────── */}
        <aside className="h-[calc(100vh-57px)] overflow-y-auto border-r border-neutral-200 bg-white p-5 [scrollbar-width:thin]">
          <Section title="Start from (base palette)">
            <div className="flex gap-2">
              {(["jit", "randstadt"] as Seed[]).map((b) => (
                <button
                  key={b}
                  onClick={() => update({ seed: b })}
                  className={`flex-1 rounded-md border px-3 py-1.5 text-xs font-medium capitalize ${
                    style.seed === b ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 hover:bg-neutral-100"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-neutral-500">Just a starting point for colors you don&apos;t override.</p>
          </Section>

          <Section title="Typography">
            <FontSelect label="Body / UI font" value={style.fontBody} onChange={(v) => update({ fontBody: v })} />
            <FontSelect label="Heading font" value={style.fontHeading} onChange={(v) => update({ fontHeading: v })} />
            <Multiplier label="Font size scale" hint="1 = base · 1.25 = larger text" value={style.fontScale} min={0.75} max={1.5} onChange={(v) => update({ fontScale: v })} />
            <Multiplier label="Line-height scale" hint="1 = base · 1.3 = airier" value={style.lineHeightScale} min={0.85} max={1.6} onChange={(v) => update({ lineHeightScale: v })} />
          </Section>

          <Section title="Density">
            <Multiplier label="Spacing" hint="1 = compact · 1.8 = spacious" value={style.spacingScale} min={0.5} max={2} onChange={(v) => update({ spacingScale: v })} />
            <Multiplier label="Corner radius" hint="0 = sharp · 2.5 = very round" value={style.radiusScale} min={0} max={2.5} onChange={(v) => update({ radiusScale: v })} />
          </Section>

          {COLOR_GROUPS.map((group) => (
            <Section key={group} title={group}>
              <div className="flex flex-col gap-2">
                {COLOR_TOKENS.filter((t) => t.group === group).map((t) => {
                  const hex = colorOf(t.key);
                  const overridden = t.key in style.colors;
                  return (
                    <div key={t.key} className="flex items-center gap-2">
                      <label className="relative size-7 shrink-0 cursor-pointer overflow-hidden rounded-md border border-neutral-300">
                        <span className="block size-full" style={{ background: hex }} />
                        <input type="color" value={hex} onChange={(e) => setColor(t.key, e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label={`${t.label} color`} />
                      </label>
                      <span className="flex-1 text-xs">{t.label}</span>
                      <input
                        type="text"
                        value={hex}
                        onChange={(e) => setColor(t.key, e.target.value)}
                        className="w-[78px] rounded border border-neutral-300 px-1.5 py-1 font-mono text-[11px] tabular-nums"
                        aria-label={`${t.label} hex`}
                      />
                      {overridden && (
                        <button onClick={() => resetColor(t.key)} className="text-[11px] text-neutral-400 hover:text-neutral-700" title="Reset to base palette">
                          ↺
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          ))}
        </aside>

        {/* ── Preview + a11y + export ──────────────────────────────── */}
        <main className="h-[calc(100vh-57px)] overflow-y-auto p-6">
          <div className="relative overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
            <DashboardPreview />
            <div ref={probeRef} aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
              {COLOR_TOKENS.map((t) => (
                <span key={t.key} data-probe={t.key} style={{ color: `var(--ds-color-${t.key})` }}>
                  .
                </span>
              ))}
            </div>
          </div>

          <ContrastPanel effective={effective} />
          <ExportPanel style={style} />
        </main>
      </div>
    </div>
  );
}

// ── Local UI bits (neutral chrome — unaffected by token edits) ──────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 border-b border-neutral-100 pb-5 last:border-0">
      <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
      {children}
    </section>
  );
}

function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-xs">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs">
        {FONTS.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Multiplier({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs">{label}</span>
        <input
          type="number"
          value={value}
          step={0.05}
          min={min}
          max={max}
          onChange={(e) => onChange(clamp(parseFloat(e.target.value) || 0, min, max))}
          className="w-14 rounded border border-neutral-300 px-1.5 py-0.5 text-right font-mono text-[11px] tabular-nums"
          aria-label={`${label} value`}
        />
      </div>
      <input type="range" value={value} min={min} max={max} step={0.05} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-neutral-900" aria-label={`${label} slider`} />
      <p className="mt-0.5 text-[11px] text-neutral-400">{hint}</p>
    </div>
  );
}

function ContrastPanel({ effective }: { effective: Record<string, string> }) {
  return (
    <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold">Accessibility · WCAG contrast</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {CONTRAST_PAIRS.map((p) => {
          const fg = effective[p.fg];
          const bg = effective[p.bg];
          const ratio = fg && bg ? contrastRatio(fg, bg) : null;
          const level = ratio ? wcagLevel(ratio) : null;
          const ok = level === "AAA" || level === "AA";
          const warn = level === "AA Large";
          return (
            <div key={p.label} className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md text-[11px] font-semibold" style={{ background: bg, color: fg }}>
                  Aa
                </span>
                <span className="text-xs">{p.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs tabular-nums">{ratio ? `${ratio}:1` : "—"}</span>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${ok ? "bg-green-100 text-green-700" : warn ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                  {level ?? "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-neutral-500">AA needs 4.5:1 body (3:1 large). AAA needs 7:1. Fix fails before shipping.</p>
    </section>
  );
}

function ExportPanel({ style }: { style: Style }) {
  const [copied, setCopied] = React.useState(false);
  const text = exportJson(style);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const download = () => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${style.name.replace(/\s+/g, "-").toLowerCase() || "style"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="mt-6 mb-2 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Export tokens (JSON)</h2>
        <div className="flex items-center gap-2">
          <button onClick={download} className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100">
            Download
          </button>
          <button onClick={copy} className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="max-h-72 overflow-auto rounded-lg bg-neutral-950 p-3 font-mono text-[11px] leading-relaxed text-neutral-200">{text}</pre>
    </section>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
