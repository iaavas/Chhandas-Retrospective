#!/usr/bin/env node
/**
 * Chhandas MCP Server – stdio transport (local use)
 *
 * For HTTP/Vercel deployment see api/mcp.ts in the project root.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createChhandasServer } from "./server.js";

async function main() {
  const server = createChhandasServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Intentionally no console.log here – stdout is reserved for MCP protocol JSON
  process.stderr.write("Chhandas MCP server running on stdio\n");
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err}\n`);
  process.exit(1);
});
