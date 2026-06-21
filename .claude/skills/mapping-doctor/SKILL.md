---
name: mapping-doctor
description: Verify and regenerate MAPPING.md against the live Figma file and the code — check node IDs resolve, every component file is mapped, prop maps are current, and Figma descriptions/links match. Trigger when asked to check/fix/refresh the mapping, after renaming Figma sets, or after adding/removing components.
---

# mapping-doctor — keep MAPPING.md true

`MAPPING.md` (repo root) is the Figma ↔ code bridge: each component's Figma node ID
→ `.tsx` file → prop map, plus Figma deep links and shadcn descriptions. This skill
re-verifies it against both sides and fixes drift. Source of names/IDs:
`../JIT-DS-2.0-figma-shadcn-names.md` (design-docs folder).

## Checks (run all; report PASS/FAIL per check)

1. **Node IDs resolve.** With the Figma Console MCP bridge live, resolve every node
   ID in `MAPPING.md` via `figma.getNodeByIdAsync`. Any "not found" = the set moved;
   re-locate it by name (`figma.root.findAll` for COMPONENT_SET/COMPONENT) and update
   both the ID and its Figma deep link (`?node-id=<id with ':'→'-'>`).
   *(Known precedent: tooltip moved `2077:*` → `2115:*`.)*
2. **Every component file is mapped.** Diff `src/components/ui/*.tsx` (minus
   `*.stories.tsx`) against the files referenced in `MAPPING.md`. Flag any `.tsx`
   with no entry, and any entry pointing at a missing file.
3. **Prop maps current.** For the v1-12 full prop tables, re-read the component's
   exported props / CVA variants and confirm the table matches (variant/size enums,
   field-wrapper props, `disabled`-only state rule).
4. **GitHub links valid.** Every `💻` link points at
   `…/blob/main/src/components/ui/<file>` that exists.
5. **Figma descriptions/links in sync** (optional, needs bridge). For each mapped
   node, confirm its Figma `description` + `documentationLinks` match `MAPPING.md`'s
   description + GitHub link. Re-apply via `figma_set_description` / set
   `node.documentationLinks` if they drifted.
6. **Duplicate-name resolution intact.** Confirm the by-node-ID disambiguations in
   Part 4 still hold (e.g. "Select" page set → `combobox`; "Dropdown" page → `select`).

## Conventions to preserve (don't "fix" these)
- `State` axis → CSS, no prop except `disabled`.
- Variant values are exact lowercase code enums (1:1, no transform).
- Sub-parts (`dialog/header`, `select/item`, …) compose into the parent file — they
  get **no** standalone `.tsx` and no own row beyond a compose note.

## Output
A short report: per-check PASS/FAIL + a table of `node/file → issue → fix applied`.
Apply safe fixes (stale IDs, links, descriptions) directly; for anything that
changes the component inventory or prop contract, list it and ask before editing.

## Done when
Every node ID resolves, every component file is mapped, prop tables match the code,
and (if the bridge is live) Figma metadata matches `MAPPING.md`.
