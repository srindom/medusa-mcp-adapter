import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";
import { createMcpHandler } from "mcp-handler";
import { pipeToNodeResponse } from "./helpers/pipe-to-node-response";
import { setUpRequest } from "./helpers/set-up-medusa-request";
import { Config } from "./types";
import { prepareResponse } from "./helpers/prepare-response";

export function createMedusaMcpHandler(fn: (container: MedusaRequest["scope"], server: McpServer) => Promise<void>, serverOpts: ServerOptions = {}, config: Config = {
  basePath: "/mcp",
}) {
  return async (req: MedusaRequest, res: MedusaResponse) => {
    setUpRequest(req, res)
    const handler = createMcpHandler(
      (server) => fn(req.scope, server),
      serverOpts,
      config
    );

    const response = await handler(req as any)

    prepareResponse(res, response)

    if (!response.body) {
      res.end();
      return;
    }

    if (!response.body) {
      throw new Error('Response body is missing');
    }

    await pipeToNodeResponse(response.body, res)
  };
}


