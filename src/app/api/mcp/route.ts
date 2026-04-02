// ── MCP Streamable HTTP Endpoint ──
// This is the main entry point for the SDOH Scout MCP server.
// Prompt Opinion connects to this URL to access our tools.

import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createMCPServer } from "@/lib/mcp/server";

// We'll use stateless mode for Vercel serverless compatibility
function createTransportAndServer() {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
    enableJsonResponse: true,
  });
  const server = createMCPServer();
  return { transport, server };
}

export async function POST(req: Request) {
  const { transport, server } = createTransportAndServer();
  await server.connect(transport);
  return transport.handleRequest(req);
}

export async function GET(req: Request) {
  const { transport, server } = createTransportAndServer();
  await server.connect(transport);
  return transport.handleRequest(req);
}

export async function DELETE(req: Request) {
  const { transport, server } = createTransportAndServer();
  await server.connect(transport);
  return transport.handleRequest(req);
}

// Handle CORS for cross-origin requests from Prompt Opinion
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, MCP-Session-ID, MCP-Protocol-Version, X-Patient-ID, X-FHIR-Server-URL, X-FHIR-Access-Token",
    },
  });
}
