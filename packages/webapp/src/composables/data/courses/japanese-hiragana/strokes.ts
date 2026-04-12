import type { ICharStrokes } from '../types'

/**
 * Center-line stroke data for the 46 base hiragana, used by the
 * **animation** mode of the StrokeAnimation component (the "play
 * stroke order" button) and by the offline geometric verifier.
 *
 * **Currently empty** — but the **static** stroke-order display on the
 * practice page works fine because we now ship the KanjiVG SVGs in
 * `assets/images/courses/japanese-hiragana/strokes/`. Those SVGs give
 * us the visual stroke order with numbered strokes (rendered by the
 * `static SVG` branch of StrokeAnimation), but they don't expose the
 * per-stroke center-line + endpoints that the animation branch needs.
 *
 * Filling in this map would unlock:
 *  - the "play animation" button on the practice page (currently the
 *    static SVG is shown indefinitely),
 *  - the offline geometric verifier in the training drawing exercise
 *    (the online Google Input Tools recognizer keeps working without).
 *
 * Source candidates: KanjiVG paths can be parsed into center-lines
 * (each `<path>` is already a single stroke), or AnimCJK ships
 * pre-computed median paths that are exactly the right shape.
 */
export const STROKES: Record<string, ICharStrokes> = {}
