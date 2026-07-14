# Font strategy

The kit ships two brand typefaces, and they're distributed very differently.
This doc is the honest answer to "what font will I actually see?" for anyone
consuming the kit outside the JIT org.

## What each brand renders as

**`jit` (default brand):** `Moderat JIT`. This is a **proprietary, JIT-internal
font** — it is not bundled with the kit and has no distributable webfont.
`--font-sans` resolves it through
`var(--ds-typography-bodymd-fontfamily), ui-sans-serif, system-ui,
-apple-system, sans-serif` (`src/styles/kraken-theme.css:58`) — so most
consumers outside JIT will see the fallback stack (`ui-sans-serif` →
`system-ui` → `-apple-system` → `sans-serif`, i.e. each OS's native UI font),
**not** Moderat JIT. Only machines with the font already installed render it.

**`brand`:** `Noto Sans`, loaded via Google Fonts (`<link>` tags in
`src/app/layout.tsx`, registered under its literal name so the
`--ds-typography-bodymd-fontfamily` token resolves to it). This works for
every consumer — no fallback needed in practice.

## Supplying your own font for a new brand

Fonts are a design token like any other — a new brand supplies its own via
one Figma variable, no code change:

1. In the `semantic` collection's typography variables for your new brand's
   mode, point the font-family value at your brand's font name (see the
   `add-brand` skill, `.claude/skills/add-brand/SKILL.md`, for the full
   ritual).
2. If the font isn't OS-resident (most client fonts aren't), load it the same
   way `brand`'s Noto Sans is loaded: add a `<link>`/`@font-face` in
   `src/app/layout.tsx` (or `public/fonts/` + `@font-face` in `globals.css`
   for a self-hosted woff2 — see the note at `src/app/globals.css:17-19`).
   This is one documented example, not a new mechanism — the font pipeline
   is otherwise identical to every other token.

## Why Moderat JIT isn't bundled

It's a commercially-licensed font internal to JIT. Bundling it would require
redistribution rights the project doesn't have. The fallback chain exists
specifically so the kit still looks intentional (native OS UI font) rather
than broken (browser's generic serif) when Moderat JIT isn't present.
