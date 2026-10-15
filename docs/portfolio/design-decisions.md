# Design decisions — how Kraken UI Kit became AI-native

The reasoning record behind the kit: the problem it answers, and every
deliberate decision taken to solve it — including the ones that got reversed.
Written first-person by the designer/author; the companion
[user guide](user-guide.md) covers _how_ to use the result.

## The problem

The starting point was a company without a UI kit. That absence has a
well-known cost: every screen is designed and built from scratch, values get
copied by hand from Figma inspect panels, components drift apart across
projects, and a rebrand means repainting every screen individually. There is
no single answer to "what does our button look like" — there are as many
answers as there are screens.

In 2026 the absence has a second, newer cost: **AI coding agents write more
and more of the UI, and an agent without a design system invents one.** It
hardcodes hex values, makes up variant names, and produces plausible-looking
screens that belong to no brand. A design system that only exists as pictures
in Figma and prose in a wiki is invisible to the tools now doing the work.

So the brief I set myself was double: build the missing UI kit, **and build it
so that a machine can consume it as reliably as a human** — because the
consumers of a design system now include agents.

---

## Part 1 — Foundation decisions

### 1. Figma is the single source of truth, and code is generated from it

**Decision.** One Figma file (`JIT DS 2.1`) owns every design decision: 835
variables and 56 component sets. Code artifacts — token CSS, component
manifests, docs, the registry — are generated from that source through
pipelines, never authored in parallel.

**Why.** Design systems die in the gap between design and code. If both sides
are hand-maintained, they _will_ diverge, and the divergence is invisible
until it's expensive. Making one side generated means drift is a build
failure, not a slow rot.

**Trade-off.** Generation demands discipline: you give up the freedom to
"quickly fix it in code". Every change routes through the source and a
rebuild. I accepted the slower loop in exchange for the guarantee.

### 2. A 3-layer token architecture, with zero literals in components

**Decision.** Every color, spacing, radius, and typography value is a
`--ds-*` custom property in three layers — global primitives → semantic roles
→ component knobs — where each layer only references the layer below.
Components bind to Layer 3. There is not a single hex or px literal in the
kit.

**Why.** The layering is what makes everything else possible: rebranding
(swap Layer 2), theming a subtree (the cascade), and machine-checkability (a
literal is grep-detectable and therefore CI-blockable). "No literals, ever"
is a rule an agent can follow and a reviewer can verify mechanically.

**Trade-off.** Three layers cost indirection — finding "what actual color is
this" takes two hops. Tooling absorbs that cost (Storybook, manifests, and
the token browser all resolve chains).

### 3. Tokens live in the W3C DTCG format

**Decision.** The canonical token file (`tokens/tokens.dtcg.json`) uses the
W3C Design Tokens Community Group format with alias chains preserved — the
same open standard the token-tool ecosystem (Tokens Studio and friends)
speaks — rather than any proprietary shape.

**Why.** Tokens are the most long-lived artifact in the system; they should
outlive the current tooling. A standard format keeps the data portable and
lets any future pipeline consume it without translation.

### 4. shadcn parity is the contract

**Decision.** Token names, component APIs, and variant enums follow shadcn
verbatim. Deliberate divergences exist but are few, justified, and published
as a machine-readable list (`foundations.json → shadcnDivergences`).

**Why.** Two reasons, one human and one AI-native. Human: anything that works
with shadcn — Tailwind classes like `bg-primary`, existing app code, the
ecosystem's mental model — works with this kit, themed for free. AI-native:
**every serious coding model has shadcn in its training data.** By matching
shadcn's names, the kit meets agents where their priors already are; the
manifests then only need to describe the _differences_, not the whole world.

**Trade-off.** Parity is a constraint on naming creativity, and it forces the
divergence list to be maintained honestly (that's what the `drift-audit`
skill guards). Where the Figma design genuinely disagreed with shadcn (Button
has seven variants, not six; Alert's axis is `type`), I kept the Figma truth
and documented the divergence instead of pretending.

### 5. Tailwind v4 + CVA + Base UI as the delivery stack

**Decision.** Tailwind v4 for styling (its CSS-variable-first design maps
directly onto the token layer), CVA for variant APIs (one `cva()` call per
component), Base UI for behavior primitives.

**Why.** Each choice keeps the component files _statically analyzable_: a
single `cva()` call with `defaultVariants` means variant enums and defaults
can be extracted by script — which is exactly how the manifests get built.
The stack was chosen for how well machines can read it, not just write it.

### 6. Brand switching touches exactly one layer

**Decision.** `data-theme` on any ancestor selects the brand. Only Layer 2
(semantic) varies per brand; primitives and component tokens are shared.
Components and apps contain zero per-brand code. Brand and light/dark are
never props.

**Why.** This is the multi-brand promise made structural: a new brand is a
new column of semantic values, not a new codebase. It also gives agents a
rule with no judgment calls: never branch on brand.

**Trade-off.** A brand that wants to change component _anatomy_ (not just
values) doesn't fit this model. I scoped that out deliberately: value-level
theming covers the real use case (client brands), and anatomy changes should
be design decisions in Figma, not forks in code.

## Part 2 — Decision 7, the reversal: killing the theme editor

**Decision.** I built a full in-code visual theme editor — a 249-token
semantic-layer editor with live component preview, JSON import/export, and
push-to-Figma — shipped it as Phase 8, iterated on it for two weeks… and then
**removed it entirely** (July 2026), moving all theming to a Figma-first
workflow.

**Why it existed.** The demo was seductive: a non-technical person drags
color pickers and the whole kit restyles live. It worked, and it round-tripped
to Figma.

**Why it died.** It quietly created a _second place where design decisions
happen_. Two writable sources of truth is one too many — the exact disease
the kit exists to cure, reintroduced through a side door. Designers already
have a semantic-mode editor with a full approval workflow: Figma itself. So
themes became Figma semantic modes, exported through the same `token-sync`
pipeline as everything else, with the `add-brand` skill as the ritual.

**What it cost.** Two weeks of built, working, demoable code — deleted. This
is the single most important decision in the project: choosing the boring
architecture over the impressive feature, because the impressive feature
undermined the system's one non-negotiable invariant.

## Part 3 — AI-native decisions

The premise of this layer: **agents don't need better prose, they need ground
truth they can query and rules they can't misread.**

### 8. A machine-readable manifest layer as the primary documentation

**Decision.** Every component has a generated JSON manifest — exact variant
enums, defaults, props, consumed tokens, a11y notes, usage do/don't — plus
`foundations.json` (architecture + rules + divergences) and `index.json`
(aliases/keywords → components). Human docs (`docs/components/*.md`) are
generated _from the same extraction_, so humans and machines read one truth.

**Why.** The failure mode of agents is confident invention:
`variant="outline"` doesn't exist in this kit, and no amount of prose stops a
model from guessing it does. A manifest turns "what variants exist" from a
recall problem into a lookup. The agent instruction is one line: _answer from
the manifest, never guess._

### 9. Overrides: agents propose, humans direct

**Decision.** Exactly one hand-edited area exists under `manifests/`:
`overrides/<name>.json` — aliases, keywords, usage judgment — schema-validated
and merged into the generated manifests at build time.

**Why.** Extraction gets you facts; it can't get you judgment ("prefer Dialog
over AlertDialog unless the action is destructive"). The overrides directory
is the explicit seam where human judgment enters the machine layer — visible,
reviewable, and impossible to confuse with generated content.

### 10. An MCP server, kept local-only

**Decision.** `@kraken-ui/mcp` serves the manifests through six query tools to
any MCP-capable agent. It is deliberately **not** published to npm — it runs
from a clone.

**Why the server.** MCP makes the kit's ground truth available _inside_ the
agent's loop — the agent calls `get_component("button")` mid-task instead of
hallucinating an API.

**Why local-only.** This is a portfolio case study, not a product with
maintenance guarantees. Publishing creates an implied support contract and a
version skew problem (a stale npm copy contradicting the live repo — drift
again, at the distribution layer). A clone is always self-consistent.

### 11. Skills as executable runbooks instead of wiki pages

**Decision.** Every recurring maintenance ritual is a Claude skill with exact
steps, checks, and failure handling: `token-sync`, `add-brand`,
`add-component`, `implement-figma-component`, `mapping-doctor`,
`drift-audit`, `using-kraken-ui-kit`. Verification jobs that need judgment are
agents: `figma-binder`, `parity-reviewer`, `release`.

**Why.** Documentation describes; a skill _executes_. A wiki page titled "how
to add a brand" goes stale silently; the `add-brand` skill either works when
run or fails loudly, which makes it self-testing documentation. The
`implement-figma-component` skill goes further — it appends its own learnings
after each component, so the runbook improved over the 56 components built
with it.

### 12. Code shaped to be machine-readable

**Decision.** Component files follow extraction conventions as hard rules:
one `cva()` call per file with `defaultVariants` present, the rationale
comment directly above it, every component reachable from `MAPPING.md`.
Node IDs — not layer names — are component identity across the Figma↔code
bridge.

**Why.** The manifests are only as reliable as the extraction, and the
extraction is only as reliable as the code's regularity. These conventions
turn the source itself into a database. The build fails if a file breaks
them, so the conventions cannot erode quietly.

**Trade-off.** Some components would read more naturally with two `cva()`
calls or a helper. Regularity won: an occasional slightly awkward file is
cheaper than a manifest layer you can't trust.

### 13. Multiple entry points, one truth

**Decision.** `llms.txt` for any LLM, `CLAUDE.md` for agents working _on_ the
kit, `design.md` (the system written as a skill) and the
`using-kraken-ui-kit` skill for agents building _with_ it, MCP for tool-using
agents, and the raw manifests for everything else. All generated from or
pointing at the same sources.

**Why.** Different agents arrive through different doors — a web-search LLM,
a Claude Code session, an MCP client. Each door should open onto the same
room.

## Part 4 — Governance decisions (what keeps it true)

### 14. The provenance rule, enforced by byte-diff

**Decision.** Every file is classified as _authored_ or _generated_.
Generated files are never hand-edited; CI regenerates everything and fails on
a one-byte difference.

**Why.** An AI-native system's greatest risk is its own helpers: an agent
"fixing" a generated file creates drift that looks like content. The
byte-diff gate makes the provenance rule physical. It has caught real
incidents — including a formatter sweep that corrupted regex-extracted
manifests, which is now structurally prevented (`.prettierignore` excludes
every generator input).

### 15. Truth claims are generated, not written

**Decision.** The README's status block — token counts, component counts,
registry size, shipped milestones — is generated by script from the actual
artifacts, between markers, and drift-gated in CI. Same for all counts in the
docs layer.

**Why.** Hand-written numbers are lies waiting to happen ("56 components" in
prose survives the 57th component silently). If a claim can be computed, it
must be. This applies the kit's core philosophy to its own marketing copy.

### 16. Drift is checked in three directions, on a schedule

**Decision.** `manifests:check` (code ⇄ generated artifacts) runs on every
push; `drift-audit` (Figma ⇄ tokens ⇄ code/MAPPING) runs as a periodic
read-only ritual; `parity-reviewer` spot-checks single components against
both Figma and shadcn.

**Why.** Each edge of the triangle fails differently. CI catches what code
changes break; only a Figma-connected audit catches what _design_ changes
break. Report-only auditing keeps the governance loop honest — the auditor
never fixes, it hands findings to the skill that owns the fix.

---

## The shape of the whole

Every decision above is one idea applied repeatedly: **make the truth live in
exactly one place, make every other representation generated, and make drift
loud.** Humans decide in Figma and in `overrides/`; machines propagate; CI
refuses anything that breaks the chain. That is what "AI-native" means here —
not that AI built it (though it largely did), but that an AI can pick it up
tomorrow, query what is true, and be structurally prevented from making it
false.
