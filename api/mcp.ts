/**
 * Vercel serverless handler for the Chhandas MCP server.
 *
 * Exposes the MCP server over HTTP using the Streamable HTTP transport,
 * which is the standard transport for remotely-hosted MCP servers.
 *
 * Endpoint: POST /api/mcp
 *
 * Clients connect with:
 *   {
 *     "type": "http",
 *     "url": "https://<your-vercel-domain>/api/mcp"
 *   }
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createChhandasServer } from "../mcp/src/server.js";

// Vercel expects a default export of (req, res) => void | Promise<void>
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  // Only accept POST requests — MCP Streamable HTTP uses POST for everything
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed. Use POST." }));
    return;
  }

  // Add CORS headers so browser-based MCP clients can connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Mcp-Session-Id"
  );

  try {
    const server = createChhandasServer();

    // stateless: each request creates a fresh transport + server pair.
    // For stateful sessions you would persist the transport keyed by
    // the Mcp-Session-Id header, but stateless is sufficient for tool calls.
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
    });

    await server.connect(transport);
    await transport.handleRequest(req, res);
  } catch (err) {
    console.error("MCP handler error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  }
}

// Required by Vercel for streaming responses (SSE)
export const config = {
  api: {
    bodyParser: false,
  },
};
