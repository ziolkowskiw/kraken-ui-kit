/* Sync-loads the bundled manifests at startup. The package ships its own
 * manifests/ copy (see scripts/copy-manifests.mjs) — no repo, no network. */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface IndexEntry {
  name: string;
  title: string;
  description: string;
  aliases: string[];
  keywords: string[];
  exports: string[];
  file: string;
}

export interface TokenEntry {
  cssVar: string;
  type: string;
  value: unknown;
  brandValue?: unknown;
  description?: string;
  figmaVariableId?: string;
}

export interface TokensManifest {
  source: string;
  brandNote: string;
  layers: {
    global: TokenEntry[];
    semantic: TokenEntry[];
    component: Record<string, TokenEntry[]>;
  };
}

export type ComponentManifest = Record<string, unknown> & {
  name: string;
  usage: { do: string[]; dont: string[] };
  boundaries: string[];
  whenToUseInstead: { component: string; when: string }[];
  notes: string[];
  rationale?: string;
};

const DEFAULT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "manifests"
);

export class Store {
  readonly index: IndexEntry[];
  readonly foundations: Record<string, unknown>;
  readonly tokens: TokensManifest;
  readonly #dir: string;
  readonly #components = new Map<string, ComponentManifest>();

  constructor(dir: string = DEFAULT_DIR) {
    this.#dir = dir;
    if (!existsSync(path.join(dir, "index.json"))) {
      throw new Error(
        `Bundled manifests not found at ${dir} — the package was built without ` +
          `'npm run bundle-manifests'.`
      );
    }
    this.index = this.#read("index.json") as IndexEntry[];
    this.foundations = this.#read("foundations.json") as Record<string, unknown>;
    this.tokens = this.#read("tokens.json") as TokensManifest;
  }

  #read(rel: string): unknown {
    return JSON.parse(readFileSync(path.join(this.#dir, rel), "utf8"));
  }

  component(name: string): ComponentManifest | undefined {
    const cached = this.#components.get(name);
    if (cached) return cached;
    const entry = this.index.find((e) => e.name === name);
    if (!entry) return undefined;
    const manifest = this.#read(entry.file) as ComponentManifest;
    this.#components.set(name, manifest);
    return manifest;
  }
}
