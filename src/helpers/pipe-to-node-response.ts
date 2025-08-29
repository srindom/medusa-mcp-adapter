import { createAbortController, isAbortError } from "./create-abort-controller"
import { createWriterFromResponse } from "./create-writer-from-response"

export async function pipeToNodeResponse(
  readable: ReadableStream<Uint8Array>,
  res: any,
  waitUntilForEnd?: Promise<unknown>
) {
  try {
    // If the response has already errored, then just return now.
    const { errored, destroyed } = res
    if (errored || destroyed) return

    // Create a new AbortController so that we can abort the readable if the
    // client disconnects.
    const controller = createAbortController(res)

    const writer = createWriterFromResponse(res, waitUntilForEnd)

    await readable.pipeTo(writer, { signal: controller.signal })
  } catch (err: any) {
    // If this isn't related to an abort error, re-throw it.
    if (isAbortError(err)) return

    console.log(err)

    throw new Error('failed to pipe response')
  }
}

