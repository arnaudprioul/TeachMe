/**
 * Proxy to the public Google Input Tools handwriting recognition API.
 *
 * This is the same backend that powers Google Translate's handwriting input
 * and Gboard's CJK handwriting mode. It's free, requires no API key, and
 * supports `ko`, `ja`, `zh`, plus most Latin scripts. We proxy through
 * Nitro for two reasons:
 *
 *  1. **CORS** — the endpoint isn't always reachable directly from the
 *     browser depending on the origin and region.
 *  2. **Future-proofing** — having a single server entry point lets us
 *     add caching, throttling, or swap the recognizer for an on-device
 *     ML model without touching the client.
 *
 * Request body shape (from the client):
 * ```ts
 * {
 *   strokes: { x: number; y: number }[][]   // raw canvas-pixel strokes
 *   canvasSize: number                      // square side length in CSS px
 *   language?: 'ko' | 'ja' | 'zh' | string  // default 'ko'
 *   maxResults?: number                     // default 10
 * }
 * ```
 *
 * Response shape (returned to the client):
 * ```ts
 * { candidates: string[] }   // top-N recognized characters/strings
 * ```
 */

interface IRecognizeBody {
  strokes: { x: number; y: number }[][]
  canvasSize: number
  language?: string
  maxResults?: number
}

const GOOGLE_ENDPOINT =
  'https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8'

export default defineEventHandler(async (event) => {
  const body = await readBody<IRecognizeBody>(event)

  if (!body || !Array.isArray(body.strokes) || body.strokes.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'strokes are required' })
  }
  if (typeof body.canvasSize !== 'number' || body.canvasSize <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'canvasSize must be a positive number' })
  }

  const language = body.language || 'ko'
  const maxResults = body.maxResults ?? 10

  // Convert the client's `{x, y}[]` strokes into Google's
  // `[xs[], ys[], ts[]]` format. The canvas doesn't track real timestamps
  // so we synthesise them at 10ms per point — accuracy is unaffected.
  const ink = body.strokes.map((stroke) => {
    const xs: number[] = []
    const ys: number[] = []
    const ts: number[] = []
    stroke.forEach((p, i) => {
      xs.push(Math.round(p.x))
      ys.push(Math.round(p.y))
      ts.push(i * 10)
    })
    return [xs, ys, ts]
  })

  const payload = {
    options: 'enable_pre_space',
    requests: [
      {
        writing_guide: {
          writing_area_width: body.canvasSize,
          writing_area_height: body.canvasSize,
        },
        pre_context: '',
        max_num_results: maxResults,
        max_completions: 0,
        ink,
        language,
      },
    ],
  }

  let raw: unknown
  try {
    raw = await $fetch(GOOGLE_ENDPOINT, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: `handwriting upstream failed: ${err?.message ?? 'unknown'}`,
    })
  }

  // Google's response shape:
  //   ["SUCCESS", [["wat", ["가","각","거",...], [], {...}]]]
  // or:
  //   ["SUCCESS", [["wat", []]]]   if no recognition
  // or sometimes:
  //   ["NO_RESULTS"]               on failure
  let candidates: string[] = []
  try {
    if (Array.isArray(raw) && raw[0] === 'SUCCESS') {
      const inner = raw[1]
      if (Array.isArray(inner) && inner.length > 0) {
        const first = inner[0]
        if (Array.isArray(first) && Array.isArray(first[1])) {
          candidates = first[1].filter((c: unknown): c is string => typeof c === 'string')
        }
      }
    }
  } catch {
    candidates = []
  }

  return { candidates }
})
