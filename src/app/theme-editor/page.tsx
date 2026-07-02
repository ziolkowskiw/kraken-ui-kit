"use client";

/* Theme designer — a component-by-component workflow. Pick a step in the rail
 * (Button first, Charts last), see that component's live variant matrix, and
 * edit only the tokens that actually affect it: its Layer-3 component tokens
 * plus the semantic tokens it consumes. Overrides inject as a <style> at :root
 * so the kit's alias chains re-resolve live. Editor chrome stays on neutral
 * Tailwind grays so only the specimens react to edits. */

import * as React from "react";
import {
  SEMANTIC,
  PRIMITIVES,
  PRIM_BY_DS,
  SEM_BY_DS,
  COLOR_RAMPS,
  type SemToken,
  type CompToken,
  type Style,
  newStyle,
  generateCss,
  exportJson,
  importJson,
  effectiveTargetDs,
  effectiveValue,
  targetLabel,
  tokensForStep,
  loadStyles,
  saveStyles,
  CONTRAST_PAIRS,
  contrastRatio,
  wcagLevel,
  parseRgb,
  isColorValue,
} from "@/lib/theme-editor";
import { DESIGN_STEPS, STEP_SECTIONS } from "@/components/theme-editor/specimens";

export default function ThemeDesignerPage() {
  const [saved, setSaved] = React.useState<Style[]>([]);
  const [style, setStyle] = React.useState<Style>(() => newStyle());
  const [stepSlug, setStepSlug] = React.useState("button");
  const [query, setQuery] = React.useState("");
  const [contrast, setContrast] = React.useState<Record<string, string>>({});
  const probeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const s = loadStyles();
    setSaved(s);
    if (s.length) setStyle(s[s.length - 1]);
    document.documentElement.setAttribute("data-theme", "jit");
  }, []);

  const css = React.useMemo(() => generateCss(style), [style]);
  const step = DESIGN_STEPS.find((s) => s.slug === stepSlug) ?? DESIGN_STEPS[0];
  const stepIndex = DESIGN_STEPS.indexOf(step);
  const stepTokens = React.useMemo(() => tokensForStep(step), [step]);

  // changed-token count per step for the rail dots
  const changedByStep = React.useMemo(() => {
    const m: Record<string, number> = {};
    for (const s of DESIGN_STEPS) {
      const { comp, sem } = tokensForStep(s);
      m[s.slug] = [...comp, ...sem].filter((t) => t.ds in style.overrides).length;
    }
    return m;
  }, [style.overrides]);

  // read effective colors for the contrast pairs after each paint
  React.useEffect(() => {
    if (!probeRef.current) return;
    const next: Record<string, string> = {};
    for (const v of new Set(CONTRAST_PAIRS.flatMap((p) => [p.fg, p.bg]))) {
      const el = probeRef.current.querySelector<HTMLElement>(`[data-probe="${v}"]`);
      if (el) next[v] = getComputedStyle(el).color;
    }
    setContrast((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [css, stepSlug]);

  const repoint = (ds: string, targetDs: string) =>
    setStyle((s) => ({ ...s, overrides: { ...s.overrides, [ds]: targetDs } }));
  const reset = (ds: string) =>
    setStyle((s) => {
      const o = { ...s.overrides };
      delete o[ds];
      return { ...s, overrides: o };
    });

  const save = () =>
    setSaved((prev) => {
      const next = prev.some((p) => p.id === style.id) ? prev.map((p) => (p.id === style.id ? style : p)) : [...prev, style];
      saveStyles(next);
      return next;
    });
  const inList = saved.some((s) => s.id === style.id);
  const changedCount = Object.keys(style.overrides).length;

  const done = style.done ?? [];
  const isDone = done.includes(step.slug);
  const toggleDone = () =>
    setStyle((s) => ({
      ...s,
      done: isDone ? (s.done ?? []).filter((d) => d !== step.slug) : [...(s.done ?? []), step.slug],
    }));
  const goto = (offset: number) => {
    const next = DESIGN_STEPS[stepIndex + offset];
    if (next) {
      setStepSlug(next.slug);
      setQuery("");
    }
  };

  const q = query.trim().toLowerCase();
  const compRows = q ? stepTokens.comp.filter((t) => t.path.toLowerCase().includes(q)) : stepTokens.comp;
  const semRows = q ? stepTokens.sem.filter((t) => t.path.toLowerCase().includes(q)) : stepTokens.sem;
  const showContrast = step.slug === "foundations" || step.slug === "review";

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-center gap-3 border-b border-neutral-200 bg-white px-5 py-3">
        <div className="mr-auto">
          <h1 className="text-sm font-semibold">Kraken Theme Designer</h1>
          <p className="text-xs text-neutral-500">
            Component by component · {done.length}/{DESIGN_STEPS.length} steps designed · {changedCount} token{changedCount === 1 ? "" : "s"} changed
          </p>
        </div>
        <input
          value={style.name}
          onChange={(e) => setStyle((s) => ({ ...s, name: e.target.value }))}
          className="w-44 rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm"
          aria-label="Style name"
        />
        <select
          value={inList ? style.id : ""}
          onChange={(e) => (e.target.value ? setStyle(saved.find((s) => s.id === e.target.value)!) : setStyle(newStyle()))}
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
        <button onClick={() => setStyle(newStyle())} className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100">New</button>
        <button onClick={save} className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700">Save</button>
      </header>

      <div className="flex">
        {/* ── Step rail ────────────────────────────────────────────── */}
        <nav className="h-[calc(100vh-57px)] w-60 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white py-3 [scrollbar-width:thin]">
          {STEP_SECTIONS.map((section) => (
            <div key={section} className="mb-3">
              <div className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{section}</div>
              {DESIGN_STEPS.filter((s) => s.section === section).map((s) => {
                const active = s.slug === step.slug;
                const stepDone = done.includes(s.slug);
                const changed = changedByStep[s.slug] ?? 0;
                return (
                  <button
                    key={s.slug}
                    onClick={() => { setStepSlug(s.slug); setQuery(""); }}
                    className={`flex w-full items-center gap-2 px-4 py-1.5 text-left text-[13px] ${active ? "bg-neutral-900 text-white" : "hover:bg-neutral-100"}`}
                  >
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${
                        stepDone
                          ? "bg-green-500 text-white"
                          : changed
                            ? "bg-amber-400 text-amber-950"
                            : active
                              ? "bg-white/20 text-white"
                              : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {stepDone ? "✓" : DESIGN_STEPS.indexOf(s) + 1}
                    </span>
                    <span className="flex-1 truncate">{s.label}</span>
                    {changed > 0 && (
                      <span className={`text-[10px] tabular-nums ${active ? "text-amber-300" : "text-amber-600"}`}>{changed}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Specimen canvas ──────────────────────────────────────── */}
        <main className="h-[calc(100vh-57px)] min-w-0 flex-1 overflow-y-auto p-6 [scrollbar-width:thin]">
          <div className="mb-4 flex flex-wrap items-start gap-3">
            <div className="mr-auto">
              <h2 className="text-base font-semibold">
                {stepIndex + 1}. {step.label}
              </h2>
              <p className="max-w-xl text-xs text-neutral-500">{step.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => goto(-1)} disabled={stepIndex === 0} className="rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium hover:bg-neutral-100 disabled:opacity-40">← Prev</button>
              <button
                onClick={toggleDone}
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${isDone ? "bg-green-100 text-green-800 hover:bg-green-200" : "border border-neutral-300 hover:bg-neutral-100"}`}
              >
                {isDone ? "✓ Designed" : "Mark as designed"}
              </button>
              <button onClick={() => goto(1)} disabled={stepIndex === DESIGN_STEPS.length - 1} className="rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 disabled:opacity-40">Next →</button>
            </div>
          </div>

          <div className="relative overflow-x-auto rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="bg-background text-foreground">{step.render()}</div>
            <div ref={probeRef} aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
              {[...new Set(CONTRAST_PAIRS.flatMap((p) => [p.fg, p.bg]))].map((v) => (
                <span key={v} data-probe={v} style={{ color: `var(${v})` }}>.</span>
              ))}
            </div>
          </div>

          {showContrast && <ContrastPanel contrast={contrast} />}
        </main>

        {/* ── Token panel ──────────────────────────────────────────── */}
        <aside className="h-[calc(100vh-57px)] w-[400px] shrink-0 overflow-y-auto border-l border-neutral-200 bg-white p-4 [scrollbar-width:thin]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${stepTokens.comp.length + stepTokens.sem.length} tokens for ${step.label}…`}
            className="mb-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />

          {compRows.length > 0 && (
            <TokenSection title="Component tokens" subtitle="Layer 3 — scoped to this component" defaultOpen>
              {groupBy(compRows, (t) => t.name.split("/")[0]).map(([sub, rows]) => (
                <div key={sub}>
                  {rows.length > 0 && compRows.length > 8 && (
                    <div className="bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{sub}</div>
                  )}
                  {rows.map((tk) => (
                    <TokenRow key={tk.ds} tk={tk} kind="component" overrides={style.overrides} onRepoint={repoint} onReset={reset} />
                  ))}
                </div>
              ))}
            </TokenSection>
          )}

          {semRows.length > 0 && (
            <TokenSection
              title="Semantic tokens"
              subtitle="Layer 2 — shared; edits affect every component using them"
              defaultOpen={compRows.length === 0}
            >
              {groupBy(semRows, (t) => t.major).map(([major, rows]) => (
                <div key={major}>
                  <div className="bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{major}</div>
                  {rows.map((tk) => (
                    <TokenRow key={tk.ds} tk={tk} kind="semantic" overrides={style.overrides} onRepoint={repoint} onReset={reset} />
                  ))}
                </div>
              ))}
            </TokenSection>
          )}

          {compRows.length === 0 && semRows.length === 0 && (
            <p className="px-1 py-6 text-center text-xs text-neutral-400">No tokens match.</p>
          )}

          <ExportPanel style={style} />
          <ImportPanel onImport={setStyle} />
          <PushToFigmaPanel overrides={style.overrides} />
        </aside>
      </div>
    </div>
  );
}

function groupBy<T>(rows: T[], key: (t: T) => string): [string, T[]][] {
  const m = new Map<string, T[]>();
  for (const r of rows) {
    const k = key(r);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(r);
  }
  return [...m.entries()];
}

function TokenSection({ title, subtitle, defaultOpen, children }: { title: string; subtitle: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details open={defaultOpen} className="mb-3 rounded-lg border border-neutral-200 bg-white">
      <summary className="cursor-pointer select-none px-3 py-2">
        <span className="text-xs font-semibold">{title}</span>
        <span className="ml-2 text-[10px] text-neutral-400">{subtitle}</span>
      </summary>
      <div className="border-t border-neutral-100">{children}</div>
    </details>
  );
}

// ── Token row ───────────────────────────────────────────────────────────────
function TokenRow({
  tk,
  kind,
  overrides,
  onRepoint,
  onReset,
}: {
  tk: SemToken | CompToken;
  kind: "semantic" | "component";
  overrides: Record<string, string>;
  onRepoint: (ds: string, target: string) => void;
  onReset: (ds: string) => void;
}) {
  const overridden = tk.ds in overrides;
  const targetDs = effectiveTargetDs(tk, overrides);
  const value = effectiveValue(tk, overrides);
  return (
    <div className={`flex items-center gap-2 border-t border-neutral-100 px-3 py-1.5 ${overridden ? "bg-amber-50/60" : ""}`}>
      <code className="flex-1 truncate text-[11px] text-neutral-700" title={tk.path}>{tk.name}</code>
      {tk.primFamily === "color" ? (
        <ColorPicker tk={tk} kind={kind} value={value} targetDs={targetDs} onPick={(ds) => onRepoint(tk.ds, ds)} />
      ) : (
        <TargetSelect tk={tk} kind={kind} targetDs={targetDs} onPick={(ds) => onRepoint(tk.ds, ds)} />
      )}
      <span className="hidden w-24 truncate text-right font-mono text-[10px] text-neutral-400 sm:inline" title={targetDs ?? "raw"}>
        {targetDs ? targetLabel(targetDs) : "raw"}
      </span>
      <button onClick={() => onReset(tk.ds)} disabled={!overridden} className={`text-[11px] ${overridden ? "text-neutral-500 hover:text-neutral-800" : "text-transparent"}`} title="Reset">↺</button>
    </div>
  );
}

// color: swatch button + popover (semantic aliases for component tokens, then ramps)
function ColorPicker({
  tk,
  kind,
  value,
  targetDs,
  onPick,
}: {
  tk: SemToken | CompToken;
  kind: "semantic" | "component";
  value: string;
  targetDs: string | null;
  onPick: (ds: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const semanticOptions = kind === "component" ? SEMANTIC.filter((s) => s.type === "color") : [];
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-1.5 py-1 hover:bg-neutral-50" aria-label={`Re-point ${tk.name}`}>
        <span className="size-4 rounded border border-neutral-300" style={{ background: isColorValue(value) ? value : "#fff" }} />
        <span className="max-w-24 truncate font-mono text-[10px] text-neutral-500">{value}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 max-h-80 w-72 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-2 shadow-xl">
            {semanticOptions.length > 0 && (
              <div className="mb-2">
                <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-neutral-400">Semantic (preferred)</div>
                <div className="flex flex-col">
                  {semanticOptions.map((s) => (
                    <button
                      key={s.ds}
                      onClick={() => { onPick(s.ds); setOpen(false); }}
                      className={`flex items-center gap-2 rounded px-1.5 py-1 text-left hover:bg-neutral-100 ${targetDs === s.ds ? "bg-neutral-100 ring-1 ring-neutral-400" : ""}`}
                    >
                      <span className="size-3.5 shrink-0 rounded border border-neutral-200" style={{ background: s.resolved }} />
                      <span className="truncate text-[10px] text-neutral-600">{s.path}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-neutral-400">Primitives</div>
              </div>
            )}
            {COLOR_RAMPS.map((ramp) => {
              const steps = (PRIMITIVES.color || []).filter((p) => p.ramp === ramp);
              return (
                <div key={ramp} className="mb-1.5">
                  <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-neutral-400">{ramp}</div>
                  <div className="flex flex-wrap gap-0.5">
                    {steps.map((p) => (
                      <button
                        key={p.ds}
                        onClick={() => { onPick(p.ds); setOpen(false); }}
                        title={`${p.label} · ${p.value}`}
                        className={`size-5 rounded border ${targetDs === p.ds ? "ring-2 ring-neutral-900" : "border-neutral-200"}`}
                        style={{ background: p.value }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// non-color: dropdown of semantic aliases (component tokens) + the family's primitives
function TargetSelect({
  tk,
  kind,
  targetDs,
  onPick,
}: {
  tk: SemToken | CompToken;
  kind: "semantic" | "component";
  targetDs: string | null;
  onPick: (ds: string) => void;
}) {
  const prims = PRIMITIVES[tk.primFamily] || [];
  const sems = kind === "component" ? SEMANTIC.filter((s) => s.primFamily === tk.primFamily && s.type !== "color") : [];
  return (
    <select value={targetDs ?? ""} onChange={(e) => e.target.value && onPick(e.target.value)} className="w-36 rounded-md border border-neutral-300 px-1.5 py-1 text-[11px]">
      {!targetDs && <option value="">raw</option>}
      {targetDs && !prims.some((p) => p.ds === targetDs) && !sems.some((s) => s.ds === targetDs) && (
        <option value={targetDs}>{targetLabel(targetDs)}</option>
      )}
      {sems.length > 0 && (
        <optgroup label="Semantic">
          {sems.map((s) => (
            <option key={s.ds} value={s.ds}>{s.path} · {s.resolved}</option>
          ))}
        </optgroup>
      )}
      <optgroup label="Primitives">
        {prims.map((p) => (
          <option key={p.ds} value={p.ds}>{p.label} · {p.value}</option>
        ))}
      </optgroup>
    </select>
  );
}

function ContrastPanel({ contrast }: { contrast: Record<string, string> }) {
  return (
    <section className="mt-4 max-w-md rounded-xl border border-neutral-200 bg-white p-4">
      <h2 className="mb-2 text-sm font-semibold">WCAG contrast</h2>
      <div className="flex flex-col gap-1.5">
        {CONTRAST_PAIRS.map((p) => {
          const fg = contrast[p.fg];
          const bg = contrast[p.bg];
          const ratio = fg && bg && parseRgb(fg) && parseRgb(bg) ? contrastRatio(fg, bg) : null;
          const level = ratio ? wcagLevel(ratio) : null;
          const ok = level === "AAA" || level === "AA";
          const warn = level === "AA Large";
          return (
            <div key={p.label} className="flex items-center justify-between rounded-lg border border-neutral-200 px-2.5 py-1.5">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded text-[10px] font-semibold" style={{ background: bg, color: fg }}>Aa</span>
                <span className="text-[11px]">{p.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] tabular-nums">{ratio ? `${ratio}:1` : "—"}</span>
                <span className={`rounded px-1 py-0.5 text-[9px] font-semibold ${ok ? "bg-green-100 text-green-700" : warn ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{level ?? "—"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const MODES = ["jit", "brand"] as const;
type PushStatus = "idle" | "loading" | "ok" | "error";

function PushToFigmaPanel({ overrides }: { overrides: Record<string, string> }) {
  const [pat, setPat] = React.useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("kraken-figma-pat") ?? "";
  });
  const [mode, setMode] = React.useState<(typeof MODES)[number]>("jit");
  const [status, setStatus] = React.useState<PushStatus>("idle");
  const [msg, setMsg] = React.useState("");
  const count = Object.keys(overrides).length;

  const savePat = (v: string) => {
    setPat(v);
    if (typeof window !== "undefined") localStorage.setItem("kraken-figma-pat", v);
  };

  const push = async () => {
    if (!pat.trim()) { setMsg("Figma PAT is required."); setStatus("error"); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/push-to-figma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides, targetMode: mode, pat: pat.trim() }),
      });
      const data = await res.json() as { pushed?: number; skipped?: number; error?: string };
      if (!res.ok) { setMsg(data.error ?? `Error ${res.status}`); setStatus("error"); return; }
      setMsg(`Pushed ${data.pushed} alias${data.pushed === 1 ? "" : "es"} to Figma "${mode}" mode.${(data.skipped ?? 0) > 0 ? ` (${data.skipped} skipped — not in token map)` : ""}`);
      setStatus("ok");
    } catch (e) {
      setMsg(String(e));
      setStatus("error");
    }
  };

  return (
    <details className="mt-3 rounded-xl border border-neutral-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold">Push to Figma</summary>
      <div className="border-t border-neutral-100 p-4 flex flex-col gap-2.5">
        <p className="text-[11px] text-neutral-500">Write the {count} changed alias{count === 1 ? "" : "es"} back to the Figma semantic collection.</p>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Figma PAT</span>
          <input
            type="password"
            value={pat}
            onChange={(e) => savePat(e.target.value)}
            placeholder="figd_…"
            className="w-full rounded-md border border-neutral-300 px-2.5 py-1.5 font-mono text-xs"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Target mode</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
            className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-xs"
          >
            {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <button
          onClick={push}
          disabled={status === "loading" || !count}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
        >
          {status === "loading" ? "Pushing…" : `Push ${count} change${count === 1 ? "" : "s"}`}
        </button>
        {msg && (
          <p className={`text-[11px] ${status === "ok" ? "text-green-700" : "text-red-600"}`}>{msg}</p>
        )}
      </div>
    </details>
  );
}

function ImportPanel({ onImport }: { onImport: (s: Style) => void }) {
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState("");
  const handle = () => {
    const result = importJson(text.trim());
    if (!result) { setError("Invalid JSON or wrong schema"); return; }
    onImport(result);
    setText("");
    setError("");
  };
  return (
    <details className="mt-3 rounded-xl border border-neutral-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold">Import theme</summary>
      <div className="border-t border-neutral-100 p-4">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setError(""); }}
          rows={5}
          placeholder='Paste exported JSON ({"$schema":"kraken-semantic@1",…})'
          className="w-full rounded-lg border border-neutral-300 bg-neutral-50 p-2.5 font-mono text-[10px] leading-relaxed"
        />
        {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
        <button
          onClick={handle}
          disabled={!text.trim()}
          className="mt-2 rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-700 disabled:opacity-40"
        >
          Import
        </button>
      </div>
    </details>
  );
}

function ExportPanel({ style }: { style: Style }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(exportJson(style));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const download = () => {
    const blob = new Blob([exportJson(style)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${style.name.replace(/\s+/g, "-").toLowerCase() || "theme"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <details className="mt-4 rounded-xl border border-neutral-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold">Export theme</summary>
      <div className="border-t border-neutral-100 p-4">
        <div className="mb-2 flex gap-2">
          <button onClick={download} className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium hover:bg-neutral-100">Download</button>
          <button onClick={copy} className="rounded-md bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-neutral-700">{copied ? "Copied!" : "Copy"}</button>
        </div>
        <pre className="max-h-48 overflow-auto rounded-lg bg-neutral-950 p-2.5 font-mono text-[10px] leading-relaxed text-neutral-200">{exportJson(style)}</pre>
      </div>
    </details>
  );
}
