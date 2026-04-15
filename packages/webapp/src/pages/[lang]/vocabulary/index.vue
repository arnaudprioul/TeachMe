<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReviewsStore } from '~/stores/reviews.store'
import { useAuthStore } from '~/stores/auth.store'
import { useCourses } from '~/composables/useCourses'
import { resolveReviewCards } from '~/composables/useReviewCards'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const route = useRoute()
const reviews = useReviewsStore()
const auth = useAuthStore()
const { getBySlug } = useCourses()

const langSlug = computed(() => (route.params.lang as string) || '')
const language = computed(() => getBySlug(langSlug.value))

onMounted(() => {
  if (auth.isAuthenticated) reviews.load(langSlug.value)
})

const cards = computed(() => resolveReviewCards(reviews.forLang(langSlug.value)))
const dueCount = computed(() => reviews.dueCards(langSlug.value).length)

async function removeCard(id: string) {
  await reviews.remove(id)
}

function startReview() {
  navigateTo(`/${langSlug.value}/vocabulary/review`)
}
</script>

<template>
  <div class="vocab-page page-container" :style="{ '--cc': language?.color, '--cc-s': language?.colorSubtle }">
    <div class="contained">
      <Breadcrumb :items="[
        { label: t('nav.dashboard'), to: '/dashboard' },
        { label: t(`courses.${langSlug}.name`), to: `/${langSlug}` },
        { label: t('vocabulary.title') },
      ]" />

      <div class="vocab-page__hero">
        <span class="vocab-page__flag">{{ language?.flag }}</span>
        <h1>{{ t('vocabulary.title') }}</h1>
        <p class="vocab-page__sub">{{ t('vocabulary.subtitle') }}</p>
      </div>

      <div v-if="cards.length > 0" class="vocab-page__header-row">
        <div class="vocab-page__stats">
          <span class="vocab-page__count">{{ t('vocabulary.cardsCount', { n: cards.length }) }}</span>
          <span v-if="dueCount > 0" class="vocab-page__due">{{ t('vocabulary.dueCount', { n: dueCount }) }}</span>
        </div>
        <button class="vocab-page__cta" @click="startReview">
          {{ t('vocabulary.startReview') }}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>

      <div v-if="cards.length === 0" class="vocab-page__empty">
        <span class="vocab-page__empty-icon">📚</span>
        <p>{{ t('vocabulary.empty') }}</p>
      </div>

      <div v-else class="vocab-page__grid">
        <div v-for="c in cards" :key="c.id" class="rc">
          <div class="rc__visual">
            <img v-if="c.word?.image" :src="c.word.image" :alt="c.word.translation" />
            <span v-else-if="c.word?.emoji" class="rc__emoji">{{ c.word.emoji }}</span>
          </div>
          <div class="rc__body">
            <span class="rc__word">{{ c.word?.word ?? c.wordId }}</span>
            <span class="rc__rom">{{ c.word?.romanization }}</span>
            <span class="rc__tl">{{ locale === 'fr' ? c.word?.translationFr : c.word?.translation }}</span>
          </div>
          <div class="rc__meta">
            <span class="rc__reps" :title="`${c.srs.repetitions} successful reviews`">
              {{ c.srs.repetitions }}×
            </span>
            <button class="rc__remove" :aria-label="'remove'" @click="removeCard(c.id)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vocab-page { padding: var(--space-6) 0 var(--space-16); }
.contained { max-width: 960px; margin: 0 auto; padding: 0 var(--space-6); }

.vocab-page__hero { text-align: center; margin: var(--space-10) 0 var(--space-8); }
.vocab-page__flag { font-size: 3rem; display: block; margin-bottom: var(--space-2); }
.vocab-page__hero h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: var(--color-text); letter-spacing: -0.03em; margin: 0; }
.vocab-page__sub { font-size: var(--text-base); color: var(--color-text-muted); margin-top: var(--space-3); }

.vocab-page__header-row {
  display: flex; justify-content: space-between; align-items: center; gap: var(--space-4);
  margin-bottom: var(--space-6); flex-wrap: wrap;
}
.vocab-page__stats { display: flex; gap: var(--space-3); align-items: center; }
.vocab-page__count { font-size: var(--text-sm); color: var(--color-text-muted); }
.vocab-page__due {
  font-size: var(--text-xs); font-weight: 700;
  color: #d97706; background: #fef3c7;
  padding: 2px var(--space-3); border-radius: var(--radius-full);
}
.vocab-page__cta {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--cc, var(--color-primary)); color: #fff; border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-sm); font-weight: 700; cursor: pointer;
  transition: all var(--transition-fast);
}
.vocab-page__cta:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.vocab-page__cta svg { transition: transform 200ms ease; }
.vocab-page__cta:hover svg { transform: translateX(3px); }

.vocab-page__empty {
  text-align: center; padding: var(--space-16) var(--space-6);
  color: var(--color-text-muted);
}
.vocab-page__empty-icon { font-size: 3rem; display: block; margin-bottom: var(--space-4); }

.vocab-page__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-3); }

.rc {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}
.rc__visual { width: 48px; height: 48px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.rc__visual img { width: 48px; height: 48px; object-fit: contain; }
.rc__emoji { font-size: 1.6rem; }
.rc__body { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.rc__word { font-size: var(--text-sm); font-weight: 700; color: var(--color-text); font-family: var(--font-cjk-kr); overflow: hidden; text-overflow: ellipsis; }
.rc__rom { font-size: 0.7rem; color: var(--color-text-muted); }
.rc__tl { font-size: 0.7rem; color: var(--color-text-secondary); }
.rc__meta { display: flex; align-items: center; gap: var(--space-1); flex-shrink: 0; }
.rc__reps {
  font-size: 0.7rem; color: var(--color-text-muted); font-weight: 700;
  padding: 2px var(--space-2); background: var(--color-bg-muted); border-radius: var(--radius-full);
}
.rc__remove {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border: none; background: transparent;
  color: var(--color-text-muted); cursor: pointer;
  border-radius: var(--radius-full);
}
.rc__remove:hover { background: #fef2f2; color: #ef4444; }
</style>
