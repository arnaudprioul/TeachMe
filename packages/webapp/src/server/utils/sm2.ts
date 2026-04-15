/**
 * SM-2 spaced repetition algorithm (the one Anki is based on).
 *
 * Input — the user's rating after seeing the card:
 *   - 0..2: failure (didn't remember / very hard)
 *   - 3..5: success (hard / good / easy)
 *
 * We use a simplified 2-button UI: "Didn't know" (→ quality 2) and
 * "Got it" (→ quality 4). The algorithm can still scale to a 4-button
 * Again/Hard/Good/Easy UI later without schema changes.
 *
 * References: https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
 */

export interface ISrsState {
  easeFactor: number   // 1.3 – 2.5+  (higher = longer intervals)
  intervalDays: number // days until next review
  repetitions: number  // consecutive successful reviews
}

export function initialSrsState(): ISrsState {
  return { easeFactor: 2.5, intervalDays: 0, repetitions: 0 }
}

/**
 * Apply a quality rating to an existing SRS state. Returns the new state
 * with the updated interval, ease factor, and repetitions counter.
 */
export function applyRating(state: ISrsState, quality: number): ISrsState {
  const q = Math.max(0, Math.min(5, Math.round(quality)))

  let { easeFactor, intervalDays, repetitions } = state

  if (q < 3) {
    // Failure — reset repetitions, keep card due tomorrow
    repetitions = 0
    intervalDays = 1
  } else {
    // Success — step the interval using SM-2 schedule
    if (repetitions === 0) intervalDays = 1
    else if (repetitions === 1) intervalDays = 6
    else intervalDays = Math.round(intervalDays * easeFactor)
    repetitions++
  }

  // Update ease factor (same formula whether success or failure)
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  if (easeFactor < 1.3) easeFactor = 1.3

  return { easeFactor, intervalDays, repetitions }
}

/**
 * Compute the next review date given an interval (in days) from now.
 */
export function nextReviewDate(intervalDays: number, now = new Date()): Date {
  const ms = intervalDays * 24 * 60 * 60 * 1000
  return new Date(now.getTime() + ms)
}
