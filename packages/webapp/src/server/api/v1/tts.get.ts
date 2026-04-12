/**
 * Server proxy to the public Google Translate TTS endpoint.
 *
 * This is the same audio backend used by Google Translate's "speaker"
 * button — free, no API key, supports every language Google Translate
 * does, returns a real MP3 stream rendered server-side. We proxy through
 * Nitro for two reasons:
 *
 *   1. **CORS** — the upstream endpoint doesn't set headers a browser
 *      needs for a direct cross-origin fetch.
 *   2. **User-Agent / Referer** — Google rejects requests that don't
 *      look like a real browser. Setting them server-side keeps the
 *      client clean.
 *
 * Usage from the client:
 *   `<audio src="/api/v1/tts?text=의&lang=ko" />`
 *
 * Notes on the implementation:
 *  - We use native `fetch` (not `$fetch`) to bypass ofetch's auto
 *    Content-Type sniffing, which has been known to mangle binary
 *    responses on certain ofetch versions.
 *  - We validate the upstream `Content-Type` so we never pipe an HTML
 *    error page through to the browser as if it were an MP3 (which is
 *    exactly what causes the `NotSupportedError` on the client side).
 *  - We send the audio via `sendStream` so the response is streamed
 *    out instead of buffered through the event loop.
 */

import { sendStream } from 'h3'

const GOOGLE_TTS = 'https://translate.google.com/translate_tts'

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const text = String(query.text ?? '').trim()
  const lang = String(query.lang ?? 'ko').trim()

  if (!text) {
    throw createError({ statusCode: 400, statusMessage: 'text query param is required' })
  }
  if (text.length > 200) {
    throw createError({ statusCode: 400, statusMessage: 'text too long (>200 chars)' })
  }

  const upstreamUrl =
    `${GOOGLE_TTS}?ie=UTF-8` +
    `&q=${encodeURIComponent(text)}` +
    `&tl=${encodeURIComponent(lang)}` +
    `&client=tw-ob` +
    `&total=1&idx=0&textlen=${text.length}`

  let upstream: Response
  try {
    upstream = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': BROWSER_UA,
        'Referer': 'https://translate.google.com/',
        'Accept': 'audio/mpeg, audio/*;q=0.9, */*;q=0.1',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: `tts upstream fetch failed: ${err?.message ?? 'unknown'}`,
    })
  }

  if (!upstream.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: `tts upstream returned HTTP ${upstream.status}`,
    })
  }

  // Defensive: bail if Google handed us anything that isn't audio
  // (HTML error page, captcha, JSON error, …). Without this check we'd
  // pipe garbage through to the browser as `audio/mpeg` and the
  // <audio> element would fail with `NotSupportedError`.
  const upstreamCT = upstream.headers.get('content-type') ?? ''
  if (!upstreamCT.toLowerCase().startsWith('audio/')) {
    throw createError({
      statusCode: 502,
      statusMessage: `tts upstream returned non-audio content-type: ${upstreamCT || '<empty>'}`,
    })
  }

  if (!upstream.body) {
    throw createError({ statusCode: 502, statusMessage: 'tts upstream returned empty body' })
  }

  // Mirror the upstream content-type (always audio/mpeg in practice).
  setHeader(event, 'Content-Type', upstreamCT)
  // (text, lang) → audio is deterministic, cache forever in the browser.
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return sendStream(event, upstream.body)
})
