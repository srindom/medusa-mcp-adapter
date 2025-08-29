import { MedusaRequest } from "@medusajs/framework";
import { IncomingHttpHeaders } from "http";
import { McpEvent } from "./helpers/log-helpers";

export type ExtendedRequest = MedusaRequest & {
  rawBody: Buffer | string;
  _headers: IncomingHttpHeaders
  json: () => Promise<any>;
  text: () => Promise<string>;
  signal: AbortSignal;
  headers: any;
};



/**
 * Configuration for the MCP handler.
 * @property redisUrl - The URL of the Redis instance to use for the MCP handler.
 * @property streamableHttpEndpoint - The endpoint to use for the streamable HTTP transport.
 * @property sseEndpoint - The endpoint to use for the SSE transport.
 * @property verboseLogs - If true, enables console logging.
 */
export type Config = {
  /**
   * The URL of the Redis instance to use for the MCP handler.
   * @default process.env.REDIS_URL || process.env.KV_URL
   */
  redisUrl?: string;
  /**
   * The endpoint to use for the streamable HTTP transport.
   * @deprecated Use `set basePath` instead.
   * @default "/mcp"
   */
  streamableHttpEndpoint?: string;
  /**
   * The endpoint to use for the SSE transport.
   * @deprecated Use `set basePath` instead.
   * @default "/sse"
   */
  sseEndpoint?: string;
  /**
   * The endpoint to use for the SSE messages transport.
   * @deprecated Use `set basePath` instead.
   * @default "/message"
   */
  sseMessageEndpoint?: string;
  /**
   * The maximum duration of an MCP request in seconds.
   * @default 60
   */
  maxDuration?: number;
  /**
   * If true, enables console logging.
   * @default false
   */
  verboseLogs?: boolean;
  /**
   * The base path to use for deriving endpoints.
   * If provided, endpoints will be derived from this path.
   * For example, if basePath is "/", that means your routing is:
   *  /app/[transport]/route.ts and then:
   * - streamableHttpEndpoint will be "/mcp"
   * - sseEndpoint will be "/sse"
   * - sseMessageEndpoint will be "/message"
   * @default ""
   */
  basePath?: string;
  /**
   * Callback function that receives MCP events.
   * This can be used to track analytics, debug issues, or implement custom behaviors.
   */
  onEvent?: (event: McpEvent) => void;

  /**
   * If true, disables the SSE endpoint.
   * As of 2025-03-26, SSE is not supported by the MCP spec.
   * https://modelcontextprotocol.io/specification/2025-03-26/basic/transports
   * @default false
   */
  disableSse?: boolean;
};

