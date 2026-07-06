#!/usr/bin/env node
/* kraken-ui MCP server — stdio transport.
 * Install downstream:  claude mcp add kraken-ui -- npx -y @kraken-ui/mcp
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRequire } from "node:module";
import { Store } from "./store.js";
import { registerTools } from "./tools.js";

const { version } = createRequire(import.meta.url)("../package.json") as {
  version: string;
};

const store = new Store();
const server = new McpServer(
  { name: "kraken-ui", version },
  {
    instructions:
      "Machine-readable Kraken UI Kit (JIT DS 2.0). Call get_foundations once per session before building UI; answer component questions from get_component / search_components — never guess variant names or tokens.",
  }
);

registerTools(server, store);
await server.connect(new StdioServerTransport());
console.error(`kraken-ui MCP server v${version} ready (stdio, ${store.index.length} components)`);
