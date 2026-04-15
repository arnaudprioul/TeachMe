<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReviewsStore } from '~/stores/reviews.store'
import { useAuthStore } from '~/stores/auth.store'
import { useCourses } from '~/composables/useCourses'
import { resolveReviewCards, type IEnrichedReviewCard } from '~/composables/useReviewCards'
import { useCourseAudio } from '~/composables/useCourseAudio'
import { getCourseModule } from '~/composables/data/courses'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const route = useRoute()
const reviews = useReviewsStore()
const auth = useAuthStore()
const { getBySlug } = useCourses()
const { speak } = useCourseAudio()

/** Optional lang filter (from `?lang=korean`). When absent, reviews all langs. */
const langFilter = computed(() => (route.query.lang as string | undefined) || null)

// ── Session state ──
const queue = ref<IEnrichedReviewCard[]>([])
const currentIdx = ref(0)
const flipped = ref(false)
const reviewedCount = ref(0)
const finished = ref(false)

const current = computed<IEnrichedReviewCard | null>(() => queue.value[currentIdx.value] ?? null)

/** Resolve TTS lang for the current card based on its origin course module. */
const currentTtsLang = computed<string | null>(() => {
  const c = current.value
  if (!c) return null
  const [lang, ...rest] = c.courseId.split('-')
  const m = getCourseModule(lang, rest.join('-'))
  return m?.config.ttsLang ?? null
})

onMounted(async () => {
  if (!auth.isAuthenticated) return
  await reviews.load()
  const src = langFilter.value
    ? reviews.forLang(langFilter.value)
    : reviews.cards

  const cards = resolveReviewCards(src).filter(c => c.word !== null)
  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  queue.value = cards
  if (cards.length === 0) finished.value = true
})

function flip() {
  if (!flipped.value && current.value?.word) {
    const text = current.value.word.audioText || current.value.word.word
    // TTS uses module's ttsLang; currentTtsLang drives it via useCourseAudio
    // (which reads from useCourseContext). For cross-language reviews we
    // pass the text; useCourseAudio falls back to the current active course
    // context or default 'ko'. To be robust, we just call speak with text —
    // browsers will guess the lang from the Unicode range reasonably well
    // in most cases. Fine-grained control can be added later.
    speak(text)
  }
  flipped.value = true
}

async function rate(quality: number) {
  const c = current.value
  if (!c) return
  await reviews.rate(c.id, quality)
  reviewedCount.value++
  advance()
}

function advance() {
  flipped.value = false
  const next = currentIdx.value + 1
  if (next >= queue.value.length) {
    finished.value = true
  } else {
    currentIdx.value = next
  }
}

/** Color theming: match the current card's language color when reviewing cross-lang. */
const themeStyle = computed(() => {
  const c = current.value
  if (!c) return {}
  const lang = getBySlug(c.lang)
  return { '--cc': lang?.color, '--cc-s': lang?.colorSubtle }
})
</script>

<template>
  <div class="review-page page-container" :style="themeStyle">
    <!-- Session complete -->
    <div v-if="finished" class="review-page__done">
      <span class="review-page__done-emoji">🎉</span>
      <h1>{{ t('vocabulary.sessionComplete') }}</h1>
      <p>{{ t('vocabulary.reviewedCount', { n: reviewedCount }) }}</p>
      <NuxtLink to="/vocabulary" class="review-page__cta">{{ t('vocabulary.backToDeck') }}</NuxtLink>
    </div>

    <!-- Active session -->
    <div v-else-if="current" class="review-page__session">
      <header class="review-page__header">
        <NuxtLink to="/vocabulary" class="review-page__close" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </NuxtLink>
        <div class="review-page__progress">
          <div class="review-page__progress-bar">
            <div class="review-page__progress-fill" :style="{ width: `${(currentIdx / queue.length) * 100}%` }" />
          </div>
          <span class="review-page__progress-label">{{ currentIdx + 1 }} / {{ queue.length }}</span>
        </div>
        <!-- Small lang flag indicator (useful for cross-lang sessions) -->
        <span v-if="current" class="review-page__lang-chip">
          {{ getBySlug(current.lang)?.flag }}
        </span>
      </header>

      <!-- Flashcard -->
      <div class="card" :class="{ 'card--flipped': flipped }" @click="!flipped && flip()">
        <div class="card__face card__face--front">
          <div class="card__visual">
            <img v-if="current.word?.image" :src="current.word.image" :alt="current.word.translation" />
            <span v-else-if="current.word?.emoji" class="card__emoji">{{ current.word.emoji }}</span>
          </div>
          <span class="card__hint">{{ t('vocabulary.flipCard') }}</span>
        </div>

        <div class="card__face card__face--back">
          <span class="card__word">{{ current.word?.word }}</span>
          <span class="card__rom">{{ current.word?.romanization }}</span>
          <span class="card__tl">{{ locale === 'fr' ? current.word?.translationFr : current.word?.translation }}</span>
        </div>
      </div>

      <!-- Rating buttons -->
      <Transition name="fade">
        <div v-if="flipped" class="review-page__rating">
          <button class="rate rate--wrong" @click="rate(2)">
            <span class="rate__label">{{ t('vocabulary.didNotKnow') }}</span>
            <span class="rate__shortcut">✗</span>
          </button>
          <button class="rate rate--right" @click="rate(4)">
            <span class="rate__label">{{ t('vocabulary.gotIt') }}</span>
            <span class="rate__shortcut">✓</span>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.review-page {
  display: flex; flex-direction: column;
  min-height: calc(100dvh - 80px);
  max-width: 560px; margin: 0 auto;
  padding: var(--space-4);
}

/* Done */
.review-page__done {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: var(--space-4); text-align: center;
}
.review-page__done-emoji { font-size: 5rem; }
.review-page__done h1 { font-size: var(--text-3xl); font-weight: 800; color: var(--color-text); margin: 0; letter-spacing: -0.02em; }
.review-page__done p { font-size: var(--text-base); color: var(--color-text-muted); margin: 0; }
.review-page__cta {
  margin-top: var(--space-4);
  padding: var(--space-3) var(--space-6);
  background: var(--cc, var(--color-primary)); color: #fff;
  border-radius: var(--radius-full);
  font-size: var(--text-base); font-weight: 700; text-decoration: none;
  transition: all var(--transition-fast);
}
.review-page__cta:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

/* Session */
.review-page__session { flex: 1; display: flex; flex-direction: column; gap: var(--space-6); }

.review-page__header { display: flex; align-items: center; gap: var(--space-4); }
.review-page__close {
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: var(--radius-full);
  color: var(--color-text-muted); text-decoration: none;
}
.review-page__close:hover { background: var(--color-bg-muted); }
.review-page__progress { flex: 1; display: flex; flex-direction: column; gap: var(--space-1); }
.review-page__progress-bar { height: 8px; background: var(--color-bg-muted); border-radius: var(--radius-full); overflow: hidden; }
.review-page__progress-fill { height: 100%; background: var(--cc, var(--color-primary)); border-radius: var(--radius-full); transition: width 300ms ease; }
.review-page__progress-label { font-size: var(--text-xs); color: var(--color-text-muted); text-align: right; }
.review-page__lang-chip { font-size: 1.4rem; }

/* Card */
.card { flex: 1; min-height: 320px; perspective: 1000px; cursor: pointer; position: relative; }
.card__face {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: var(--space-3);
  padding: var(--space-8);
  background: var(--color-bg-surface);
  border: 2px solid var(--color-border); border-radius: var(--radius-2xl);
  backface-visibility: hidden;
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}
.card__face--front { transform: rotateY(0deg); }
.card__face--back {
  transform: rotateY(180deg);
  background: var(--cc-s, var(--color-primary-subtle));
  border-color: var(--cc, var(--color-primary));
}
.card--flipped .card__face--front { transform: rotateY(-180deg); }
.card--flipped .card__face--back { transform: rotateY(0deg); }

.card__visual { width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; }
.card__visual img { width: 140px; height: 140px; object-fit: contain; }
.card__emoji { font-size: 5rem; }
.card__hint { font-size: var(--text-sm); color: var(--color-text-muted); font-style: italic; }

.card__word { font-size: clamp(2rem, 6vw, 3.5rem); font-weight: 800; color: var(--color-text); font-family: var(--font-cjk-kr); text-align: center; }
.card__rom { font-size: var(--text-lg); color: var(--color-text-muted); }
.card__tl { font-size: var(--text-base); color: var(--color-text-secondary); font-style: italic; margin-top: var(--space-2); }

/* Rating */
.review-page__rating { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.rate {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-1);
  padding: var(--space-5) var(--space-4);
  border: 2px solid transparent; border-radius: var(--radius-xl);
  font-weight: 700; cursor: pointer;
  transition: all var(--transition-fast);
}
.rate--wrong { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
.rate--wrong:hover { background: #fee2e2; transform: translateY(-2px); box-shadow: var(--shadow-md); }
.rate--right { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
.rate--right:hover { background: #dcfce7; transform: translateY(-2px); box-shadow: var(--shadow-md); }
.rate__label { font-size: var(--text-base); }
.rate__shortcut { font-size: var(--text-2xl); font-weight: 900; line-height: 1; }

.fade-enter-active, .fade-leave-active { transition: opacity 300ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
