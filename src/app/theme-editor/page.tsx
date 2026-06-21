"use client";

/* Phase 8 — visual semantic-layer theme editor.
 * Edit the semantic color tokens, scale spacing & radius with a single multiplier,
 * see real Kraken components restyle live on a dashboard mock, check WCAG contrast,
 * and export the result as CSS or JSON. Overrides are injected as a <style> scoped
 * to #theme-preview, so the editor chrome itself is unaffected. */

import * as React from "react";
import {
  COLOR_TOKENS,
  CONTRAST_PAIRS,
  DEFAULT_STATE,
  type ThemeState,
  type Brand,
  generateOverrideCss,
  exportCss,
  exportJson,
  contrastRatio,
  wcagLevel,
  rgbToHex,
  parseRgb,
} from "@/lib/theme-editor";
import { DashboardPreview } from "@/components/theme-editor/dashboard-preview";

const GROUPS = ["Base", "Primary", "Secondary", "Muted", "Accent", "Surfaces", "Status", "UI"];

export default function ThemeEditorPage() {
  const [state, setState] = React.useState<ThemeState>(DEFAULT_STATE);
  const [effective, setEffective] = React.useState<Record<string, string>>({});
  const probeRef = React.useRef<HTMLDivElement>(null);

  const overrideCss = React.useMemo(() => generateOverrideCss(state), [state]);

  // Brand resolves at :root (= <html>), same as the kit's real brand switching.
  // The editor chrome uses neutral Tailwind classes (not --ds-*), so only the
  // preview restyles. Restore default jit on unmount.
  React.useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", state.brand);
    return () => html.setAttribute("data-theme", "jit");
  }, [state.brand]);

  // Read effective (computed) colors from probes after each paint — reflects the
  // active brand + any overrides, format-agnostic (browser resolves to rgb()).
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
  }, [state, overrideCss]);

  const setColor = (key: string, hex: string) =>
    setState((s) => ({ ...s, colors: { ...s.colors, [key]: hex } }));
  const resetColor = (key: string) =>
    setState((s) => {
      const colors = { ...s.colors };
      delete colors[key];
      return { ...s, colors };
    });

  const colorOf = (key: string) => state.colors[key] ?? effective[key] ?? "#000000";

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* injected live overrides (scoped to #theme-preview) */}
      <style dangerouslySetInnerHTML={{ __html: overrideCss }} />

      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-sm font-semibold">Kraken Theme Editor</h1>
          <p className="text-xs text-neutral-500">
            Edit the semantic layer · live preview · export · WCAG contrast
          </p>
        </div>
        <button
          onClick={() => setState(DEFAULT_STATE)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100"
        >
          Reset all
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">
        {/* ── Controls ─────────────────────────────────────────────── */}
        <aside className="h-[calc(100vh-57px)] overflow-y-auto border-r border-neutral-200 bg-white p-5 [scrollbar-width:thin]">
          {/* Brand base */}
          <Section title="Brand base">
            <div className="flex gap-2">
              {(["jit", "randstadt"] as Brand[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setState((s) => ({ ...s, brand: b }))}
                  className={`flex-1 rounded-md border px-3 py-1.5 text-xs font-medium capitalize ${
                    state.brand === b
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 hover:bg-neutral-100"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-neutral-500">
              Starting point for edits. Switching re-reads base colors.
            </p>
          </Section>

          {/* Spacing & radius multipliers */}
          <Section title="Density">
            <Multiplier
              label="Spacing"
              hint="1 = compact · 1.8 = spacious"
              value={state.spacingScale}
              min={0.5}
              max={2}
              onChange={(v) => setState((s) => ({ ...s, spacingScale: v }))}
            />
            <Multiplier
              label="Corner radius"
              hint="0 = sharp · 2.5 = very round"
              value={state.radiusScale}
              min={0}
              max={2.5}
              onChange={(v) => setState((s) => ({ ...s, radiusScale: v }))}
            />
          </Section>

          {/* Colors grouped */}
          {GROUPS.map((group) => (
            <Section key={group} title={group}>
              <div className="flex flex-col gap-2">
                {COLOR_TOKENS.filter((t) => t.group === group).map((t) => {
                  const hex = colorOf(t.key);
                  const overridden = t.key in state.colors;
                  return (
                    <div key={t.key} className="flex items-center gap-2">
                      <label className="relative size-7 shrink-0 cursor-pointer overflow-hidden rounded-md border border-neutral-300">
                        <span className="block size-full" style={{ background: hex }} />
                        <input
                          type="color"
                          value={hex}
                          onChange={(e) => setColor(t.key, e.target.value)}
                          className="absolute inset-0 cursor-pointer opacity-0"
                          aria-label={`${t.label} color`}
                        />
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
                        <button
                          onClick={() => resetColor(t.key)}
                          className="text-[11px] text-neutral-400 hover:text-neutral-700"
                          title="Reset to brand default"
                        >
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
            {/* hidden probes for computed-color reads — inherit the :root overrides
                + active brand, so contrast always reads the effective values */}
            <div ref={probeRef} aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
              {COLOR_TOKENS.map((t) => (
                <span key={t.key} data-probe={t.key} style={{ color: `var(--ds-color-${t.key})` }}>
                  .
                </span>
              ))}
            </div>
          </div>

          <ContrastPanel effective={effective} />
          <ExportPanel state={state} />
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

function Multiplier({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
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
          aria-label={`${label} multiplier`}
        />
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={0.05}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-neutral-900"
        aria-label={`${label} multiplier slider`}
      />
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
            <div
              key={p.label}
              className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex size-7 items-center justify-center rounded-md text-[11px] font-semibold"
                  style={{ background: bg, color: fg }}
                >
                  Aa
                </span>
                <span className="text-xs">{p.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs tabular-nums">{ratio ? `${ratio}:1` : "—"}</span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    ok
                      ? "bg-green-100 text-green-700"
                      : warn
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {level ?? "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-neutral-500">
        AA needs 4.5:1 for body text (3:1 large). AAA needs 7:1. Fix fails before shipping a theme.
      </p>
    </section>
  );
}

function ExportPanel({ state }: { state: ThemeState }) {
  const [tab, setTab] = React.useState<"css" | "json">("css");
  const [copied, setCopied] = React.useState(false);
  const text = tab === "css" ? exportCss(state) : exportJson(state);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="mt-6 mb-2 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Export tokens</h2>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-neutral-300 p-0.5 text-xs">
            {(["css", "json"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded px-2 py-0.5 font-medium uppercase ${
                  tab === t ? "bg-neutral-900 text-white" : "text-neutral-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={copy}
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="max-h-72 overflow-auto rounded-lg bg-neutral-950 p-3 font-mono text-[11px] leading-relaxed text-neutral-200">
        {text}
      </pre>
    </section>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
