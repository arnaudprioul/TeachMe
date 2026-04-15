<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReviewsStore } from '~/stores/reviews.store'
import { useAuthStore } from '~/stores/auth.store'
import { useCourses } from '~/composables/useCourses'
import { resolveReviewCards } from '~/composables/useReviewCards'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const reviews = useReviewsStore()
const auth = useAuthStore()
const { getBySlug } = useCourses()

onMounted(() => {
  if (auth.isAuthenticated) reviews.load() // all langs
})

/** Groups of review cards by language, with the language metadata joined in. */
const groups = computed(() => {
  const byLang = new Map<string, ReturnType<typeof resolveReviewCards>>()
  for (const card of reviews.cards) {
    const arr = byLang.get(card.lang) ?? []
    arr.push(...resolveReviewCards([card]))
    byLang.set(card.lang, arr)
  }
  return Array.from(byLang.entries())
    .map(([langSlug, cards]) => ({
      langSlug,
      language: getBySlug(langSlug),
      cards,
      dueCount: cards.filter(c => !c.nextReviewAt || new Date(c.nextReviewAt) <= new Date()).length,
    }))
    .sort((a, b) => a.langSlug.localeCompare(b.langSlug))
})

const totalCards = computed(() => reviews.cards.length)
const totalDue = computed(() => groups.value.reduce((sum, g) => sum + g.dueCount, 0))

async function removeCard(id: string) {
  await reviews.remove(id)
}

function startReview(langSlug?: string) {
  navigateTo(langSlug ? `/vocabulary/review?lang=${langSlug}` : '/vocabulary/review')
}
</script>

<template>
  <div class="vocab-page page-container">
    <div class="contained">
      <Breadcrumb :items="[
        { label: t('nav.dashboard'), to: '/dashboard' },
        { label: t('vocabulary.title') },
      ]" />

      <div class="vocab-page__hero">
        <span class="vocab-page__icon">⭐</span>
        <h1>{{ t('vocabulary.title') }}</h1>
        <p class="vocab-page__sub">{{ t('vocabulary.subtitle') }}</p>
      </div>

      <!-- Global stats + review all CTA (only when there's content) -->
      <div v-if="totalCards > 0" class="vocab-page__global">
        <div class="vocab-page__stats">
          <span class="vocab-page__count">{{ t('vocabulary.cardsCount', { n: totalCards }) }}</span>
          <span v-if="totalDue > 0" class="vocab-page__due">{{ t('vocabulary.dueCount', { n: totalDue }) }}</span>
        </div>
        <button class="vocab-page__cta" @click="startReview()">
          {{ t('vocabulary.startReviewAll') }}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="totalCards === 0" class="vocab-page__empty">
        <span class="vocab-page__empty-icon">📚</span>
        <p>{{ t('vocabulary.empty') }}</p>
      </div>

      <!-- Language sections -->
      <section
        v-for="group in groups" :key="group.langSlug"
        class="lang-section"
        :style="{ '--cc': group.language?.color, '--cc-s': group.language?.colorSubtle }"
      >
        <div class="lang-section__head">
          <div class="lang-section__title">
            <span class="lang-section__flag">{{ group.language?.flag }}</span>
            <h2>{{ t(`courses.${group.langSlug}.name`) }}</h2>
            <span class="lang-section__count">{{ t('vocabulary.cardsCount', { n: group.cards.length }) }}</span>
            <span v-if="group.dueCount > 0" class="lang-section__due">{{ t('vocabulary.dueCount', { n: group.dueCount }) }}</span>
          </div>
          <button class="lang-section__review-btn" @click="startReview(group.langSlug)">
            {{ t('vocabulary.startReview') }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        <div class="lang-section__grid">
          <div v-for="c in group.cards" :key="c.id" class="rc">
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
              <span class="rc__reps" :title="`${c.srs.repetitions} successful reviews`">{{ c.srs.repetitions }}×</span>
              <button class="rc__remove" aria-label="remove" @click="removeCard(c.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.vocab-page { padding: var(--space-6) 0 var(--space-16); }
.contained { max-width: 960px; margin: 0 auto; padding: 0 var(--space-6); }

.vocab-page__hero { text-align: center; margin: var(--space-10) 0 var(--space-8); }
.vocab-page__icon { font-size: 3rem; display: block; margin-bottom: var(--space-2); }
.vocab-page__hero h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: var(--color-text); letter-spacing: -0.03em; margin: 0; }
.vocab-page__sub { font-size: var(--text-base); color: var(--color-text-muted); margin-top: var(--space-3); }

.vocab-page__global {
  display: flex; justify-content: space-between; align-items: center; gap: var(--space-4);
  margin-bottom: var(--space-8); padding: var(--space-5) var(--space-6);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl); flex-wrap: wrap;
}
.vocab-page__stats { display: flex; gap: var(--space-3); align-items: center; }
.vocab-page__count { font-size: var(--text-sm); color: var(--color-text-muted); font-weight: 600; }
.vocab-page__due {
  font-size: var(--text-xs); font-weight: 700;
  color: #d97706; background: #fef3c7;
  padding: 2px var(--space-3); border-radius: var(--radius-full);
}
.vocab-page__cta {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary); color: #fff; border: none;
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

/* Language section */
.lang-section { margin-bottom: var(--space-10); }
.lang-section__head {
  display: flex; justify-content: space-between; align-items: center; gap: var(--space-3);
  margin-bottom: var(--space-4); flex-wrap: wrap;
  padding-bottom: var(--space-3); border-bottom: 2px solid var(--cc, var(--color-border));
}
.lang-section__title { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.lang-section__flag { font-size: 1.6rem; }
.lang-section__head h2 { font-size: var(--text-xl); font-weight: 700; color: var(--color-text); margin: 0; }
.lang-section__count { font-size: var(--text-xs); color: var(--color-text-muted); font-weight: 600; padding: 2px var(--space-3); background: var(--color-bg-muted); border-radius: var(--radius-full); }
.lang-section__due {
  font-size: var(--text-xs); font-weight: 700; color: #d97706;
  background: #fef3c7; padding: 2px var(--space-3); border-radius: var(--radius-full);
}
.lang-section__review-btn {
  display: inline-flex; align-items: center; gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  background: var(--cc, var(--color-primary)); color: #fff; border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 700; cursor: pointer;
  transition: all var(--transition-fast);
}
.lang-section__review-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-sm); }

.lang-section__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-3); }

/* Review card */
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
.rc__reps { font-size: 0.7rem; color: var(--color-text-muted); font-weight: 700; padding: 2px var(--space-2); background: var(--color-bg-muted); border-radius: var(--radius-full); }
.rc__remove {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border: none; background: transparent;
  color: var(--color-text-muted); cursor: pointer;
  border-radius: var(--radius-full);
}
.rc__remove:hover { background: #fef2f2; color: #ef4444; }
</style>
