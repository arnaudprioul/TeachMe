<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ILessonWord } from '~/composables/data/courses/lesson-types'
import { useReviewsStore } from '~/stores/reviews.store'
import { useAuthStore } from '~/stores/auth.store'
import { useSpeechRecognition } from '~/composables/useSpeechRecognition'
import { useCourseContext } from '~/composables/useCourseContext'

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

// ── Speech recognition for pronunciation practice ──
const speech = useSpeechRecognition()
const { module } = useCourseContext()
const micState = ref<'idle' | 'listening' | 'correct' | 'wrong'>('idle')

function startMic() {
  if (micState.value === 'listening') {
    speech.stop()
    micState.value = 'idle'
    return
  }
  micState.value = 'listening'
  speech.transcript.value = ''
  speech.error.value = null
  const ttsLang = module.value?.config.ttsLang ?? 'ko-KR'
  speech.start(ttsLang)
}

watch(() => speech.transcript.value, (val) => {
  if (!val || micState.value !== 'listening') return
  const norm = (s: string) => s.trim().toLowerCase().replace(/[.!?,。、\s]/g, '')
  const spoken = norm(val)
  const target = norm(props.word.word)
  const romaji = norm(props.word.romanization)
  const ok = spoken === target || spoken === romaji || spoken.includes(target) || target.includes(spoken)
  micState.value = ok ? 'correct' : 'wrong'
  setTimeout(() => { micState.value = 'idle' }, 2500)
})

watch(() => speech.isListening.value, (v) => {
  if (!v && micState.value === 'listening') micState.value = 'idle'
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
      <button
        v-if="speech.isSupported.value"
        class="vc__mic"
        :class="{
          'vc__mic--listening': micState === 'listening',
          'vc__mic--correct': micState === 'correct',
          'vc__mic--wrong': micState === 'wrong',
        }"
        :aria-label="micState === 'listening' ? 'Stop' : 'Pronounce'"
        @click.stop="startMic"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </button>
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

.vc__mic {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border: none; background: transparent;
  color: var(--color-text-muted); cursor: pointer;
  border-radius: var(--radius-full);
  transition: all 200ms ease;
}
.vc__mic:hover { background: var(--color-bg-muted); color: var(--color-text); }
.vc__mic--listening { background: #fef2f2; color: #ef4444; animation: mic-pulse 1s ease-in-out infinite; }
.vc__mic--correct { background: #f0fdf4; color: #22c55e; }
.vc__mic--wrong { background: #fef2f2; color: #ef4444; }
@keyframes mic-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
</style>
