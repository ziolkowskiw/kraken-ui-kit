"use client";

/* Phase 8 — Semantic-layer editor (variables studio).
 * Edit the DS's semantic layer: every semantic token is an alias to a Layer-1
 * primitive; re-point it to a different primitive. A grouped, searchable token
 * table next to a live component preview. Overrides inject as a <style> at :root
 * so the kit's alias chains re-resolve. Save/switch named styles; export the
 * authored semantic layer as JSON. */

import * as React from "react";
import {
  SEMANTIC,
  PRIMITIVES,
  PRIM_BY_DS,
  COLOR_RAMPS,
  MAJORS,
  SUBGROUPS,
  type SemToken,
  type Style,
  newStyle,
  generateCss,
  exportJson,
  importJson,
  effectiveTargetDs,
  effectiveValue,
  loadStyles,
  saveStyles,
  CONTRAST_PAIRS,
  contrastRatio,
  wcagLevel,
  parseRgb,
  isColorValue,
} from "@/lib/theme-editor";
import { DashboardPreview } from "@/components/theme-editor/dashboard-preview";

export default function SemanticEditorPage() {
  const [saved, setSaved] = React.useState<Style[]>([]);
  const [style, setStyle] = React.useState<Style>(() => newStyle());
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

  // read effective colors for the contrast pairs after each paint
  React.useEffect(() => {
    if (!probeRef.current) return;
    const next: Record<string, string> = {};
    for (const v of new Set(CONTRAST_PAIRS.flatMap((p) => [p.fg, p.bg]))) {
      const el = probeRef.current.querySelector<HTMLElement>(`[data-probe="${v}"]`);
      if (el) next[v] = getComputedStyle(el).color;
    }
    setContrast((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [css]);

  // resizable splitter between the token table and the preview
  const [previewW, setPreviewW] = React.useState(520);
  const dragging = React.useRef(false);
  React.useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPreviewW(Math.max(340, Math.min(window.innerWidth - 420, window.innerWidth - e.clientX)));
    };
    const up = () => {
      dragging.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);
  const startDrag = (e: React.MouseEvent) => {
    dragging.current = true;
    e.preventDefault();
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  const repoint = (semDs: string, primDs: string) => setStyle((s) => ({ ...s, overrides: { ...s.overrides, [semDs]: primDs } }));
  const reset = (semDs: string) =>
    setStyle((s) => {
      const o = { ...s.overrides };
      delete o[semDs];
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

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? SEMANTIC.filter((t) => t.path.toLowerCase().includes(q)) : SEMANTIC;
  }, [query]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Header */}
      <header className="flex flex-wrap items-center gap-3 border-b border-neutral-200 bg-white px-5 py-3">
        <div className="mr-auto">
          <h1 className="text-sm font-semibold">Kraken Semantic Layer Editor</h1>
          <p className="text-xs text-neutral-500">
            Re-point semantic tokens to primitives · {SEMANTIC.length} tokens · {changedCount} changed
          </p>
        </div>
        <input value={style.name} onChange={(e) => setStyle((s) => ({ ...s, name: e.target.value }))} className="w-44 rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm" aria-label="Style name" />
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

      <div className="flex flex-col lg:flex-row">
        {/* ── Token table ──────────────────────────────────────────── */}
        <main className="h-[calc(100vh-57px)] flex-1 overflow-y-auto p-4 [scrollbar-width:thin]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${SEMANTIC.length} semantic tokens…`}
            className="mb-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          {MAJORS.map((major) => {
            const tokens = filtered.filter((t) => t.major === major);
            if (!tokens.length) return null;
            return (
              <details key={major} open={major === "color" || !!query} className="mb-2 rounded-lg border border-neutral-200 bg-white">
                <summary className="cursor-pointer select-none px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  {major} <span className="text-neutral-400">({tokens.length})</span>
                </summary>
                <div className="border-t border-neutral-100">
                  {(SUBGROUPS[major] || ["core"]).map((sub) => {
                    const rows = tokens.filter((t) => t.sub === sub);
                    if (!rows.length) return null;
                    return (
                      <div key={sub}>
                        {(SUBGROUPS[major]?.length ?? 0) > 1 && (
                          <div className="bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{sub}</div>
                        )}
                        {rows.map((tk) => (
                          <TokenRow key={tk.ds} tk={tk} overrides={style.overrides} onRepoint={repoint} onReset={reset} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </main>

        {/* draggable splitter */}
        <div
          onMouseDown={startDrag}
          role="separator"
          aria-orientation="vertical"
          title="Drag to resize"
          className="hidden cursor-col-resize items-center justify-center bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 lg:flex lg:w-1.5"
        >
          <div className="h-10 w-0.5 rounded bg-neutral-400" />
        </div>

        {/* ── Live preview + a11y + export ─────────────────────────── */}
        <aside
          className="h-[calc(100vh-57px)] w-full shrink-0 overflow-y-auto border-l border-neutral-200 bg-neutral-50 p-4 lg:w-[var(--pw)]"
          style={{ "--pw": `${previewW}px` } as React.CSSProperties}
        >
          <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="origin-top scale-[0.82]">
              <DashboardPreview />
            </div>
            <div ref={probeRef} aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
              {[...new Set(CONTRAST_PAIRS.flatMap((p) => [p.fg, p.bg]))].map((v) => (
                <span key={v} data-probe={v} style={{ color: `var(${v})` }}>.</span>
              ))}
            </div>
          </div>
          <ContrastPanel contrast={contrast} />
          <ExportPanel style={style} />
          <ImportPanel onImport={setStyle} />
        </aside>
      </div>
    </div>
  );
}

// ── Token row ───────────────────────────────────────────────────────────────
function TokenRow({ tk, overrides, onRepoint, onReset }: { tk: SemToken; overrides: Record<string, string>; onRepoint: (s: string, p: string) => void; onReset: (s: string) => void }) {
  const overridden = tk.ds in overrides;
  const targetDs = effectiveTargetDs(tk, overrides);
  const value = effectiveValue(tk, overrides);
  return (
    <div className={`flex items-center gap-2 border-t border-neutral-100 px-3 py-1.5 ${overridden ? "bg-amber-50/60" : ""}`}>
      <code className="flex-1 truncate text-[11px] text-neutral-700" title={tk.path}>{tk.name}</code>
      {tk.primFamily === "color" ? (
        <ColorPicker tk={tk} value={value} targetDs={targetDs} onPick={(ds) => onRepoint(tk.ds, ds)} />
      ) : (
        <PrimSelect family={tk.primFamily} targetDs={targetDs} onPick={(ds) => onRepoint(tk.ds, ds)} />
      )}
      <span className="hidden w-24 truncate text-right font-mono text-[10px] text-neutral-400 sm:inline" title={targetDs ?? "raw"}>
        {targetDs ? PRIM_BY_DS[targetDs]?.label : "raw"}
      </span>
      <button onClick={() => onReset(tk.ds)} disabled={!overridden} className={`text-[11px] ${overridden ? "text-neutral-500 hover:text-neutral-800" : "text-transparent"}`} title="Reset">↺</button>
    </div>
  );
}

// color: swatch button + ramp popover
function ColorPicker({ tk, value, targetDs, onPick }: { tk: SemToken; value: string; targetDs: string | null; onPick: (ds: string) => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-1.5 py-1 hover:bg-neutral-50" aria-label={`Re-point ${tk.name}`}>
        <span className="size-4 rounded border border-neutral-300" style={{ background: isColorValue(value) ? value : "#fff" }} />
        <span className="font-mono text-[10px] text-neutral-500">{value}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 max-h-80 w-72 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-2 shadow-xl">
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

// non-color: dropdown of the family's primitives
function PrimSelect({ family, targetDs, onPick }: { family: string; targetDs: string | null; onPick: (ds: string) => void }) {
  const opts = PRIMITIVES[family] || [];
  return (
    <select value={targetDs ?? ""} onChange={(e) => onPick(e.target.value)} className="w-36 rounded-md border border-neutral-300 px-1.5 py-1 text-[11px]">
      {!targetDs && <option value="">raw</option>}
      {opts.map((p) => (
        <option key={p.ds} value={p.ds}>{p.label} · {p.value}</option>
      ))}
    </select>
  );
}

function ContrastPanel({ contrast }: { contrast: Record<string, string> }) {
  return (
    <section className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
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
    <details className="mt-4 mb-2 rounded-xl border border-neutral-200 bg-white">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold">Import semantic layer</summary>
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
  const text = exportJson(style);
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const download = () => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${style.name.replace(/\s+/g, "-").toLowerCase() || "semantic"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="mt-4 mb-2 rounded-xl border border-neutral-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Export semantic layer</h2>
        <div className="flex gap-2">
          <button onClick={download} className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium hover:bg-neutral-100">Download</button>
          <button onClick={copy} className="rounded-md bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-neutral-700">{copied ? "Copied!" : "Copy"}</button>
        </div>
      </div>
      <pre className="max-h-48 overflow-auto rounded-lg bg-neutral-950 p-2.5 font-mono text-[10px] leading-relaxed text-neutral-200">{text}</pre>
    </section>
  );
}
