import type { ICharStrokes } from '../types'

/**
 * Stroke data for the 46 base hiragana.
 *
 * **TODO** — currently empty. We don't have hand-crafted SVG paths for
 * the kana yet. The downstream impact:
 *
 *  - The `StrokeAnimation` component falls back to rendering the kana
 *    in font on the practice page (which already looks fine).
 *  - The geometric `useStrokeVerifier` falls through to "no reference
 *    data → mark incorrect" for offline mode, but the primary
 *    `useHandwritingRecognizer` path (Google Input Tools handwriting
 *    API) doesn't need stroke data and will keep working online.
 *
 * When we want stroke-by-stroke animation + offline grading for kana,
 * source the SVG paths from KanjiVG (CC-BY-SA) or AnimCJK and convert
 * them to the `IStrokePath` shape used by Korean — same data structure
 * as `korean-hangeul/strokes.ts`, just one entry per kana.
 */
export const STROKES: Record<string, ICharStrokes> = {}
