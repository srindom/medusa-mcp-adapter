import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { createAbortController } from "./create-abort-controller";
import { ExtendedRequest } from "../types";

export function setUpRequest(req: MedusaRequest, res: MedusaResponse): asserts req is ExtendedRequest {
  const _req = req as ExtendedRequest;
  _req._headers = req.headers
  _req.headers = Object.entries(req.headers)
  _req.headers.get = (key: string) => {
    return _req._headers[key.toLowerCase()];
  }

  _req.json = async () => {
    // parse rawBody to json
    try {
      const bodyStr = Buffer.isBuffer(req.rawBody) ? req.rawBody.toString('utf-8') : req.rawBody;
      const result = JSON.parse(bodyStr);
      return result;
    } catch (error: any) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  
  }

  _req.text = async () => {
    try {
      if (Buffer.isBuffer(req.rawBody)) {
        return req.rawBody.toString('utf-8');
      } else if (typeof req.rawBody === 'string') {
        return req.rawBody;  // Already a string
      } else {
        throw new Error('Raw body is not a Buffer or string');
      }
    } catch (error: any) {
      throw new Error(`Failed to parse text: ${error.message}`);
    }
  }

  const { signal } = createAbortController(res)
  _req.signal = signal
}

