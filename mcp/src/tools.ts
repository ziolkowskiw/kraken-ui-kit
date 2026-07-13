/* The six tools. Output is raw JSON, dense by default — agents parse it;
 * humans read the docs. */
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Store, TokenEntry } from "./store.js";
import { search } from "./search.js";

const json = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data) }],
});
const error = (message: string) => ({
  content: [{ type: "text" as const, text: JSON.stringify({ error: message }) }],
  isError: true,
});

const resolveBrand = (t: TokenEntry, brand?: string): TokenEntry => {
  if (brand !== "brand") return t;
  const { brandValue, ...rest } = t;
  return { ...rest, value: brandValue ?? t.value };
};

export function registerTools(server: McpServer, store: Store): void {
  server.registerTool(
    "list_components",
    {
      description:
        "List all Kraken UI Kit components (name, title, one-line description). Use search_components to find one by concept; get_component for the full contract.",
      inputSchema: {},
    },
    async () =>
      json(store.index.map(({ name, title, description }) => ({ name, title, description }))),
  );

  server.registerTool(
    "search_components",
    {
      description:
        "Search components by name, alias, export, or keyword (e.g. 'modal', 'outline button', 'dropdown'). Returns the top 5 matches with scores.",
      inputSchema: { query: z.string().min(1).describe("Free-text query") },
    },
    async ({ query }) => json(search(store.index, query)),
  );

  server.registerTool(
    "get_component",
    {
      description:
        "Full machine-readable contract for one component: install command, variant axes with exact enum values + defaults, props, slots, --ds-* tokens, a11y rules, usage do/don't, boundaries. Call get_foundations once per session first.",
      inputSchema: {
        name: z.string().describe("Component name, e.g. 'button' or 'dropdown-menu'"),
        dense: z
          .boolean()
          .optional()
          .describe("Default true. Set false to include rationale and prose notes."),
      },
    },
    async ({ name, dense }) => {
      const manifest = store.component(name);
      if (!manifest) {
        const suggestions = search(store.index, name, 3).map((r) => r.name);
        return error(
          `Unknown component '${name}'.` +
            (suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : ""),
        );
      }
      if (dense === false) return json(manifest);
      const { rationale, notes, ...denseManifest } = manifest;
      return json(denseManifest);
    },
  );

  server.registerTool(
    "get_foundations",
    {
      description:
        "The always-on rules of the kit: 3-layer --ds-* token architecture, brand switching (data-theme jit/brand), core principles, Figma↔code conventions, shadcn divergences, scales, install bootstrap. Call once per session before building UI.",
      inputSchema: {},
    },
    async () => json(store.foundations),
  );

  server.registerTool(
    "get_tokens",
    {
      description:
        "Design-token index slices. Filter by layer (global | semantic | component) and/or component (e.g. 'button'). brand='brand' resolves values to the brand-mode overrides; default is jit.",
      inputSchema: {
        layer: z.enum(["global", "semantic", "component"]).optional(),
        component: z
          .string()
          .optional()
          .describe("Component token group, e.g. 'button' — implies layer=component"),
        brand: z.enum(["jit", "brand"]).optional(),
      },
    },
    async ({ layer, component, brand }) => {
      const { layers, brandNote } = store.tokens;
      if (component) {
        const group = layers.component[component];
        if (!group)
          return error(
            `No component token group '${component}'. Available: ${Object.keys(layers.component).join(", ")}`,
          );
        return json({ brandNote, component: group.map((t) => resolveBrand(t, brand)) });
      }
      const pick = layer ? [layer] : (["global", "semantic", "component"] as const);
      const out: Record<string, unknown> = { brandNote };
      for (const l of pick) {
        out[l] =
          l === "component"
            ? Object.fromEntries(
                Object.entries(layers.component).map(([c, ts]) => [
                  c,
                  ts.map((t) => resolveBrand(t, brand)),
                ]),
              )
            : layers[l].map((t) => resolveBrand(t, brand));
      }
      return json(out);
    },
  );

  server.registerTool(
    "get_usage_rules",
    {
      description:
        "Usage judgment: foundations principles + per-component do/don't, boundaries, and when-to-use-something-else. Pass name for one component; omit for the global rules only.",
      inputSchema: {
        name: z.string().optional().describe("Component name, e.g. 'button'"),
      },
    },
    async ({ name }) => {
      const f = store.foundations;
      const global = {
        corePrinciples: f.corePrinciples,
        figmaCodeConventions: f.figmaCodeConventions,
        shadcnDivergences: f.shadcnDivergences,
      };
      if (!name) return json(global);
      const manifest = store.component(name);
      if (!manifest) return error(`Unknown component '${name}'.`);
      return json({
        ...global,
        component: {
          name: manifest.name,
          usage: manifest.usage,
          boundaries: manifest.boundaries,
          whenToUseInstead: manifest.whenToUseInstead,
          notes: manifest.notes,
        },
      });
    },
  );
}
