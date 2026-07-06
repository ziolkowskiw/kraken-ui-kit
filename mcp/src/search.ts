/* Deterministic, zero-dependency keyword/alias scorer.
 *
 * exact name (100) > alias (90) > export name (80) > keyword (60)
 * plus +10 per query term found in title/description; alphabetical tie-break.
 * Disambiguations (e.g. "dropdown" → dropdown-menu, not select/combobox) are
 * encoded in the aliases/keywords authored in manifests/overrides/.
 */
import type { IndexEntry } from "./store.js";

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export interface SearchResult {
  name: string;
  title: string;
  description: string;
  score: number;
}

export function score(entry: IndexEntry, query: string): number {
  const q = norm(query);
  if (!q) return 0;
  const terms = q.split(" ");
  const qJoined = q.replace(/[\s-]+/g, "-");
  const qFlat = q.replace(/[^a-z0-9]/g, "");

  const aliases = entry.aliases.map(norm);
  const keywords = entry.keywords.map(norm);
  const exportsFlat = entry.exports.map((e) => e.toLowerCase());

  let base = 0;
  const hit = (v: number) => (base = Math.max(base, v));

  if (qJoined === entry.name) hit(100);
  if (aliases.includes(q)) hit(90);
  if (exportsFlat.includes(qFlat)) hit(80);
  for (const t of terms) {
    if (t === entry.name) hit(100);
    if (aliases.includes(t)) hit(90);
    if (exportsFlat.includes(t)) hit(80);
    if (keywords.includes(t)) hit(60);
  }

  const hay = new Set(norm(`${entry.title} ${entry.description}`).split(/[\s-]+/));
  let overlap = 0;
  for (const t of new Set(terms)) if (hay.has(t)) overlap += 10;

  return base + overlap;
}

export function search(index: IndexEntry[], query: string, limit = 5): SearchResult[] {
  return index
    .map((e) => ({ name: e.name, title: e.title, description: e.description, score: score(e, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit);
}
