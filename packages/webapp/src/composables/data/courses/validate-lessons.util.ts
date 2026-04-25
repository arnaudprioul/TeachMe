import type { ILesson } from './lesson-types'

/**
 * Validates that every lesson in the array belongs to the expected level.
 * Throws an error at module load time if a lesson is misplaced.
 *
 * @param lessons - The lessons array (typically from `./lessons/index.ts`).
 * @param expectedLevel - The level number this folder represents (1, 2, 3…).
 * @param context - Human-readable context for the error (e.g. 'japanese-level-1').
 * @returns The same lessons array (for chaining).
 */
export function validateLessons(
  lessons: ILesson[],
  expectedLevel: number,
  context: string,
): ILesson[] {
  const misplaced = lessons.filter((lesson) => lesson.level !== expectedLevel)

  if (misplaced.length > 0) {
    const details = misplaced
      .map((l) => `  - LESSON #${l.id} (themeKey: "${l.themeKey}") has level=${l.level}`)
      .join('\n')

    throw new Error(
      `[${context}] Lesson level mismatch: expected level=${expectedLevel}, but found ${misplaced.length} misplaced lesson(s):\n${details}\n` +
      `Either move the lesson(s) to the correct folder, or fix the \`level\` field in the lesson file(s).`,
    )
  }

  return lessons
}
