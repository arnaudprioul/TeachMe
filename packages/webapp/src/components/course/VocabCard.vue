<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ILessonWord } from '~/composables/data/courses/lesson-types'
import { useReviewsStore } from '~/stores/reviews.store'
import { useAuthStore } from '~/stores/auth.store'

const props = defineProps<{
  word: ILessonWord
  locale: 'en' | 'fr'
  /** Language slug (e.g. 'korean'), course key (e.g. 'korean-level-1') and
   *  lesson number — needed to add the word to the user's review deck. */
  lang?: string
  courseId?: string
  lessonId?: number
}>()

const { t } = useI18n()
const reviews = useReviewsStore()
const auth = useAuthStore()

const canAddToReview = computed(() =>
  auth.isAuthenticated && !!props.lang && !!props.courseId && typeof props.lessonId === 'number'
)

const isInDeck = computed(() => {
  if (!canAddToReview.value) return false
  return reviews.isInDeck(props.lang!, props.word.id, props.courseId!, props.lessonId!)
})

const isBusy = ref(false)
async function toggleReview() {
  if (!canAddToReview.value || isBusy.value) return
  isBusy.value = true
  try {
    if (isInDeck.value) {
      const card = reviews.findCard(props.lang!, props.word.id, props.courseId!, props.lessonId!)
      if (card) await reviews.remove(card.id)
    } else {
      await reviews.add({
        lang: props.lang!, wordId: props.word.id,
        courseId: props.courseId!, lessonId: props.lessonId!,
      })
    }
  } catch (err) {
    console.warn('[VocabCard] toggle review failed', err)
  } finally {
    isBusy.value = false
  }
}

// Load the deck once (shared across all cards on page)
onMounted(() => {
  if (auth.isAuthenticated && !reviews.loaded) reviews.load()
})
</script>

<template>
  <div class="vc" data-cy="vocab-card">
    <div class="vc__visual">
      <img v-if="word.image" :src="word.image" :alt="word.translation" class="vc__img" />
      <span v-else-if="word.emoji" class="vc__emoji">{{ word.emoji }}</span>
    </div>
    <div class="vc__content">
      <span class="vc__word">{{ word.word }}</span>
      <span class="vc__rom">{{ word.romanization }}</span>
      <span class="vc__translation">{{ locale === 'fr' ? word.translationFr : word.translation }}</span>
    </div>
    <div class="vc__actions">
      <button
        v-if="canAddToReview"
        class="vc__star"
        :class="{ 'vc__star--active': isInDeck }"
        :disabled="isBusy"
        :aria-label="isInDeck ? 'Remove from review' : 'Add to review'"
        @click.stop="toggleReview"
      >
        <svg v-if="isInDeck" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </button>
      <AudioButton :text="word.audioText || word.word" />
    </div>
  </div>
</template>

<style scoped>
.vc {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  transition: all var(--transition-fast);
}
.vc:hover { border-color: var(--color-primary-light); box-shadow: var(--shadow-sm); }

.vc__visual { width: 56px; height: 56px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.vc__img { width: 56px; height: 56px; object-fit: contain; }
.vc__emoji { font-size: 2rem; }

.vc__content { flex: 1; display: flex; flex-direction: column; gap: var(--space-1); min-width: 0; }
.vc__word { font-size: var(--text-base); font-weight: 600; color: var(--color-text); font-family: var(--font-cjk-kr); }
.vc__rom { font-size: var(--text-xs); color: var(--color-text-muted); }
.vc__translation { font-size: var(--text-xs); color: var(--color-text-secondary); }

.vc__actions { display: flex; align-items: center; gap: var(--space-2); flex-shrink: 0; }

.vc__star {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border: none; background: transparent;
  color: var(--color-text-muted); cursor: pointer;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}
.vc__star:hover { background: var(--color-bg-muted); color: #f59e0b; }
.vc__star--active { color: #f59e0b; }
.vc__star--active:hover { background: #fef3c7; }
.vc__star:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
