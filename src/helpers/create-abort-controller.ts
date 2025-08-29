import { MedusaResponse } from "@medusajs/framework";

export const ResponseAbortedName = 'ResponseAborted'
export class ResponseAborted extends Error {
  public readonly name = ResponseAbortedName
}

export function isAbortError(e: any): e is Error & { name: 'AbortError' } {
  return e?.name === 'AbortError' || e?.name === ResponseAbortedName
}

export function createAbortController(res: MedusaResponse) {
  const controller = new AbortController();

  res.once('close', () => {
    if (res.writableFinished) return

    controller.abort(new ResponseAborted())
  })

  return controller
}

