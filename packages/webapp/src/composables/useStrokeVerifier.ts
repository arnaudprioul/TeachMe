import type { IStrokePath } from './data/courses/types'

/**
 * Geometric stroke matching for handwriting quizzes — "Option B+".
 *
 * Compares the strokes the learner just drew on the canvas to the reference
 * strokes from the course data and returns a correctness verdict.
 *
 * The comparison is **point-cloud / Procrustes-style**:
 *   1. Hard gate on stroke count — wrong number of strokes is an immediate
 *      fail (this is what catches "I forgot the circle on ㅎ").
 *   2. For each (user stroke, reference stroke) pair we resample BOTH to
 *      the same number of equally-spaced points along their arc length,
 *      then compute the **average per-point Euclidean distance** in viewBox
 *      coordinates (i.e. after canvas → viewBox scaling).
 *   3. Per-point distance is normalised by the viewBox diagonal so the
 *      score is 1 at "perfect overlap" and 0 once the average distance
 *      reaches `MAX_NORM_DIST` (≈ 18% of the viewBox diagonal — about a
 *      sixth of the cell, which is the kind of error a focused learner
 *      shouldn't be making).
 *   4. The stroke is "valid" if every per-stroke score clears `STROKE_FLOOR`
 *      AND the aggregate clears `CHAR_THRESHOLD`.
 *
 * Why this is much stricter than the previous version:
 *   - The previous metric averaged 4 cheap proxies (bbox IoU, centroid,
 *     length, dominant direction) — every one of them could give partial
 *     credit independently, and they could conspire to push the average
 *     above the threshold even when the actual shape was wildly off.
 *   - Pointwise distance after resampling is direct — there's no
 *     "averaging out" because every point along the stroke has to land
 *     near its counterpart on the reference path.
 *   - Stroke order is enforced implicitly: the i-th drawn stroke is
 *     compared to the i-th reference stroke. Drawing in the wrong order
 *     produces high distances on both strokes.
 *
 * For a *real* per-character recognizer (Kanji, cursive, partial input)
 * we'd want an ML model. See ROADMAP.md → "Handwriting recognition (ML
 * on-device)".
 */

export interface IPoint { x: number; y: number }

export interface IStrokeVerificationResult {
  valid: boolean
  /** Aggregate score in [0, 1]. Higher is better. */
  score: number
  /** Per-stroke scores in [0, 1], same length as input. */
  perStroke: number[]
  /** Human-readable reason when valid is false (debug only, not localized). */
  reason?: string
}

const SAMPLE_COUNT = 32
const MAX_NORM_DIST = 0.18  // average per-point distance, as a fraction of viewBox diag
const STROKE_FLOOR = 0.55   // each stroke must individually clear this
const CHAR_THRESHOLD = 0.65 // average across strokes must clear this

// ────────────────────────────────────────────────────────────────────────
// Path sampling for the reference (uses the browser's SVG API).
// ────────────────────────────────────────────────────────────────────────

function samplePath(d: string, samples: number): IPoint[] {
  if (typeof document === 'undefined') return []
  const SVG_NS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.style.visibility = 'hidden'
  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('d', d)
  svg.appendChild(path)
  document.body.appendChild(svg)

  const out: IPoint[] = []
  try {
    const len = path.getTotalLength()
    if (len === 0) return []
    const step = samples > 1 ? len / (samples - 1) : 0
    for (let i = 0; i < samples; i++) {
      const p = path.getPointAtLength(i * step)
      out.push({ x: p.x, y: p.y })
    }
  } finally {
    document.body.removeChild(svg)
  }
  return out
}

// ────────────────────────────────────────────────────────────────────────
// Polyline resampling for the user's strokes.
//
// The canvas captures one point per pointermove event, which means the
// point density depends entirely on the cursor speed. We need to redistribute
// them so they're equally spaced along the arc length, otherwise pointwise
// comparison against an evenly-sampled reference is meaningless.
// ────────────────────────────────────────────────────────────────────────

function resamplePolyline(points: IPoint[], samples: number): IPoint[] {
  if (points.length === 0) return []
  if (points.length === 1 || samples <= 1) {
    return Array.from({ length: samples }, () => ({ ...points[0] }))
  }

  // Cumulative arc length at each input point.
  const cum: number[] = [0]
  for (let i = 1; i < points.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y,
    ))
  }
  const total = cum[cum.length - 1]
  if (total === 0) return Array.from({ length: samples }, () => ({ ...points[0] }))

  const step = total / (samples - 1)
  const out: IPoint[] = [{ ...points[0] }]
  let cursor = 1
  for (let i = 1; i < samples - 1; i++) {
    const target = i * step
    while (cursor < points.length && cum[cursor] < target) cursor++
    if (cursor >= points.length) {
      out.push({ ...points[points.length - 1] })
      continue
    }
    const segLen = cum[cursor] - cum[cursor - 1]
    const t = segLen > 0 ? (target - cum[cursor - 1]) / segLen : 0
    out.push({
      x: points[cursor - 1].x + t * (points[cursor].x - points[cursor - 1].x),
      y: points[cursor - 1].y + t * (points[cursor].y - points[cursor - 1].y),
    })
  }
  out.push({ ...points[points.length - 1] })
  return out
}

// ────────────────────────────────────────────────────────────────────────
// Per-stroke scoring
// ────────────────────────────────────────────────────────────────────────

function clamp01(v: number): number {
  if (v < 0) return 0
  if (v > 1) return 1
  return v
}

function compareStroke(user: IPoint[], reference: IPoint[], viewBoxDiag: number): number {
  if (user.length < 2 || reference.length < 2) return 0

  const ru = resamplePolyline(user, SAMPLE_COUNT)
  // reference is already sampled to SAMPLE_COUNT by samplePath()

  // Average pointwise distance, comparing forward order. Stroke order is
  // enforced via the per-question (i-th stroke vs i-th reference) match;
  // *direction* of a single stroke (start → end vs end → start) we tolerate
  // by also computing the reversed pairing and taking the better of the two,
  // because horizontal/vertical lines drawn in either direction look the
  // same to the eye and we don't want false negatives.
  let sumFwd = 0
  let sumRev = 0
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const u = ru[i]
    const fr = reference[i]
    const rr = reference[SAMPLE_COUNT - 1 - i]
    sumFwd += Math.hypot(u.x - fr.x, u.y - fr.y)
    sumRev += Math.hypot(u.x - rr.x, u.y - rr.y)
  }
  const avgDist = Math.min(sumFwd, sumRev) / SAMPLE_COUNT
  const normDist = avgDist / viewBoxDiag

  return clamp01(1 - normDist / MAX_NORM_DIST)
}

// ────────────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────────────

export function useStrokeVerifier() {
  /**
   * @param userStrokes  Drawn strokes in canvas-pixel coordinates ([0, canvasSize]).
   * @param refStrokes   Reference strokes from the course module.
   * @param viewBox      The reference SVG viewBox string (e.g. "0 0 100 100").
   * @param canvasSize   Side length (in CSS pixels) of the square drawing canvas.
   */
  function verifyStrokes(
    userStrokes: IPoint[][],
    refStrokes: IStrokePath[],
    viewBox: string,
    canvasSize: number,
  ): IStrokeVerificationResult {
    if (!refStrokes || refStrokes.length === 0) {
      return { valid: true, score: 1, perStroke: [], reason: 'no-reference' }
    }

    if (userStrokes.length === 0) {
      return { valid: false, score: 0, perStroke: [], reason: 'empty' }
    }

    // 1. Hard gate: stroke count must match.
    if (userStrokes.length !== refStrokes.length) {
      return {
        valid: false,
        score: 0,
        perStroke: [],
        reason: `expected ${refStrokes.length} strokes, got ${userStrokes.length}`,
      }
    }

    // 2. Parse the viewBox.
    const parts = viewBox.split(/[\s,]+/).map(Number)
    const vbX = parts[0] || 0
    const vbY = parts[1] || 0
    const vbW = parts[2] || 100
    const vbH = parts[3] || 100
    const viewBoxDiag = Math.hypot(vbW, vbH)

    // 3. Scale user strokes from canvas-pixel space → viewBox space.
    const sx = vbW / canvasSize
    const sy = vbH / canvasSize
    const scaledUser: IPoint[][] = userStrokes.map(s =>
      s.map(p => ({ x: vbX + p.x * sx, y: vbY + p.y * sy })),
    )

    // 4. Sample reference strokes (prefer the centre line when available).
    const sampledRef: IPoint[][] = refStrokes.map(r =>
      samplePath(r.center || r.d, SAMPLE_COUNT),
    )

    // 5. Score each stroke pair, then aggregate.
    const perStroke = scaledUser.map((u, i) => compareStroke(u, sampledRef[i], viewBoxDiag))
    const avg = perStroke.reduce((a, b) => a + b, 0) / perStroke.length
    const allAboveFloor = perStroke.every(s => s >= STROKE_FLOOR)

    return {
      valid: avg >= CHAR_THRESHOLD && allAboveFloor,
      score: avg,
      perStroke,
      reason: !allAboveFloor
        ? 'one or more strokes are too far from the reference'
        : (avg < CHAR_THRESHOLD ? 'aggregate score below threshold' : undefined),
    }
  }

  return { verifyStrokes }
}
