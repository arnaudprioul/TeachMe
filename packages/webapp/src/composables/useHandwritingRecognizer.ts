/**
 * Client wrapper around the `/api/v1/handwriting/recognize` Nitro proxy,
 * which itself talks to Google Input Tools.
 *
 * Returns the top-N character candidates Google's recognizer thinks the
 * user just drew. The training quiz then checks whether the target symbol
 * is in that list to decide if the answer is correct.
 *
 * Why an API and not an on-device model:
 *  - Zero bundle weight (the model lives on Google's side).
 *  - High accuracy across CJK scripts (it's the same model used by
 *    Google Translate's handwriting input and Gboard).
 *  - No training pipeline to maintain.
 * Trade-off: needs network. The caller is responsible for falling back
 * to the local geometric verifier when the recognizer throws.
 */

export interface IRecognizeOptions {
  /** ISO language tag understood by the recognizer (e.g. 'ko', 'ja', 'zh'). */
  language?: string
  /** Max number of candidates to return. Default 10. */
  maxResults?: number
}

export function useHandwritingRecognizer() {
  /**
   * Send the user's drawn strokes to the recognizer.
   *
   * @param strokes     `{x, y}[]` per stroke, in canvas-pixel coordinates.
   * @param canvasSize  Side length of the square drawing canvas in CSS px.
   * @param opts        Language + max candidates.
   * @returns           Top-N candidate strings, ordered by confidence.
   *                    Empty array if the recognizer found nothing.
   * @throws            On network / server / upstream failure.
   */
  async function recognize(
    strokes: { x: number; y: number }[][],
    canvasSize: number,
    opts: IRecognizeOptions = {},
  ): Promise<string[]> {
    if (!strokes.length || canvasSize <= 0) return []

    const res = await $fetch<{ candidates: string[] }>('/api/v1/handwriting/recognize', {
      method: 'POST',
      body: {
        strokes,
        canvasSize,
        language: opts.language ?? 'ko',
        maxResults: opts.maxResults ?? 10,
      },
    })
    return res.candidates ?? []
  }

  return { recognize }
}
