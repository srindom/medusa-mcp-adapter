# Medusa MCP adapter

Expose an MCP server on your Medusa instance.

## Usage

1. Install the adapter:

```bash
npm install medusa-mcp-adapter @modelcontextprotocol/sdk zod@^3
yarn add medusa-mcp-adapter @modelcontextprotocol/sdk zod@^3
pnpm add medusa-mcp-adapter @modelcontextprotocol/sdk zod@^3
```

2. Add a [transport] endpoint to your Medusa project:

```typescript
// src/api/mcp/[transport]/route.ts

import { WorkflowManager } from "@medusajs/framework/orchestration";
import { z, ZodTypeAny } from "zod";
import { createMedusaMcpHandler } from "medusa-mcp-adapter"

const handler = createMedusaMcpHandler(async (container, server) => {
  const product = container.resolve("product")
  server.registerTool(
    `list_products`,
    {
      title: "List Products",
      description: "List products in the Medusa store.",
      inputSchema: {
        limit: z.number().min(1).max(100).default(10)
      }
    },
    async (input) => {
        const [prods, count] = await product.listAndCount(
            {},
            { take: input.limit }
        )

      return {
        content: [
          { type: "text", text: `Here are some products.` },
          { type: "text", text: JSON.stringify({ products: prods, count }) }
        ],
      }
    }
  )
})

export { handler as GET, handler as POST };
```

3. Add raw body validator to the route:

```typescript
// src/api/middlewares.ts
import { defineMiddlewares, authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/mcp*",
      middlewares: [],
      bodyParser: { preserveRawBody: true },
    },
  ],
})
```

4. Integrate with your client

Add this to your Claude Desktop MCP config:
```
"medusa-store": {
  "command": "npx",
  "args": [
    "-y",
    "mcp-remote",
    "http://localhost:9000/mcp/mcp"
  ]
}
```

Add to Claude Code:
```bash
claude mcp add medusa-store http://localhost:9000/mcp/mcp -t http
```

## How it works
medusa-mcp-adapter adds the necessary polyfills to MedusaRequest and MedusaResponse to be able to use Vercel's [mcp-adapter](https://github.com/vercel/mcp-adapter) package that integrates with the MCP SDK.
