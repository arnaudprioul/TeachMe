import type { ICharStrokes } from '../types'

/**
 * Center-line stroke data for the 46 base katakana — same situation as
 * `japanese-hiragana/strokes.ts`: empty for now, but the static SVGs
 * shipped under `assets/images/courses/japanese-katakana/strokes/` are
 * enough to render the stroke-order display on the practice page. See
 * the comment in the hiragana version for the full rationale.
 */
export const STROKES: Record<string, ICharStrokes> = {}
