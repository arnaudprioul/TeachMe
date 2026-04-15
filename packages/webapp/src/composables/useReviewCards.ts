import { computed } from 'vue'
import { getCourseModule } from '~/composables/data/courses'
import type { ILessonWord } from '~/composables/data/courses/lesson-types'
import type { IReviewCard } from '~/stores/reviews.store'

export interface IEnrichedReviewCard extends IReviewCard {
  word: ILessonWord | null
}

/**
 * Join a review card (which only stores IDs) with the actual ILessonWord
 * from the static course registry. If the underlying word no longer
 * exists (lesson renamed, word id changed), `word` will be null — the
 * card row itself remains in the DB so the user can decide to delete it.
 */
export function resolveReviewCard(card: IReviewCard): IEnrichedReviewCard {
  // card.courseId is e.g. 'korean-level-1'. Split to lang/course slug:
  const [lang, ...rest] = card.courseId.split('-')
  const courseSlug = rest.join('-')
  const m = getCourseModule(lang, courseSlug)
  const lesson = m?.lessons?.find(l => l.id === card.lessonId)
  const word = lesson?.words.find(w => w.id === card.wordId) ?? null
  return { ...card, word }
}

export function resolveReviewCards(cards: IReviewCard[]): IEnrichedReviewCard[] {
  return cards.map(resolveReviewCard)
}
