import { MedusaResponse } from "@medusajs/framework";

export function prepareResponse(
  res: MedusaResponse,
  response: Response
): void | Promise<void> {
  if (!res.headersSent) {
    res.statusCode = response.status;
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }
  }
}
