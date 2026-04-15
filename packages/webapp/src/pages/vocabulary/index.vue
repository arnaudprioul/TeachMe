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

const userInitial = computed(() => auth.user?.username?.[0]?.toUpperCase() ?? '?')

onMounted(() => {
  if (auth.isAuthenticated) reviews.load()
})

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
  <div class="profile page-container">
    <Breadcrumb :items="[
      { label: t('nav.dashboard'), to: '/dashboard' },
      { label: t('vocabulary.title') },
    ]" />

    <!-- ── Header (matches /profile) ── -->
    <header class="profile__header">
      <div class="profile__avatar">{{ userInitial }}</div>
      <div class="profile__info">
        <h1>{{ auth.user?.username }}</h1>
        <p v-if="auth.user?.email">{{ auth.user.email }}</p>
      </div>
    </header>

    <!-- ── Sidebar + content ── -->
    <div class="profile__layout">
      <AccountSidebar />
      <div class="profile__content">

        <!-- Empty state -->
        <section v-if="totalCards === 0" class="card">
          <h2 class="card__title">{{ t('vocabulary.title') }}</h2>
          <div class="empty-state">
            <span class="empty-state__icon">📚</span>
            <p>{{ t('vocabulary.empty') }}</p>
          </div>
        </section>

        <!-- Global overview + Review-all CTA -->
        <section v-else class="card">
          <h2 class="card__title">{{ t('vocabulary.title') }}</h2>
          <div class="overview">
            <div class="overview__stats">
              <div class="stat">
                <span class="stat__value">{{ totalCards }}</span>
                <span class="stat__label">{{ t('vocabulary.cardsCount', { n: '' }).trim() }}</span>
              </div>
              <div v-if="totalDue > 0" class="stat stat--due">
                <span class="stat__value">{{ totalDue }}</span>
                <span class="stat__label">{{ t('vocabulary.dueCount', { n: '' }).trim() }}</span>
              </div>
            </div>
            <button class="btn btn--primary btn--sm" @click="startReview()">
              {{ t('vocabulary.startReviewAll') }}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </section>

        <!-- One card per language -->
        <section
          v-for="group in groups" :key="group.langSlug"
          class="card"
        >
          <h2 class="card__title">{{ group.language?.flag }} {{ t(`courses.${group.langSlug}.name`) }}</h2>
          <div class="lang-head">
            <div class="lang-head__stats">
              <span class="lang-chip">{{ t('vocabulary.cardsCount', { n: group.cards.length }) }}</span>
              <span v-if="group.dueCount > 0" class="lang-chip lang-chip--due">{{ t('vocabulary.dueCount', { n: group.dueCount }) }}</span>
            </div>
            <button class="btn btn--ghost btn--sm" @click="startReview(group.langSlug)">
              {{ t('vocabulary.startReview') }}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

          <div class="rc-grid">
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

      </div><!-- /.profile__content -->
    </div><!-- /.profile__layout -->
  </div>
</template>

<style scoped>
/* Share the same base styles as /profile */
.profile {
  display: flex; flex-direction: column; gap: var(--space-6);
  max-width: 1200px; margin: 0 auto;
  padding: 0 var(--space-6);
}

.profile__header { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-6) 0; }
.profile__avatar {
  width: 72px; height: 72px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-primary-subtle); color: var(--color-primary);
  font-size: var(--text-2xl); font-weight: 700;
}
.profile__info h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--color-text); }
.profile__info p { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 2px; }

.profile__layout { display: flex; gap: var(--space-8); align-items: flex-start; }
.profile__content { flex: 1; display: flex; flex-direction: column; gap: var(--space-4); min-width: 0; }
@media (max-width: 900px) {
  .profile__layout { flex-direction: column; gap: var(--space-4); }
}

/* Card (same as /profile) */
.card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex; flex-direction: column; gap: var(--space-4);
}
.card__title {
  font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted);
  text-transform: uppercase; letter-spacing: 0.05em;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

/* Empty state */
.empty-state { text-align: center; padding: var(--space-6) var(--space-4); color: var(--color-text-muted); }
.empty-state__icon { font-size: 2.5rem; display: block; margin-bottom: var(--space-3); }
.empty-state p { margin: 0; font-size: var(--text-sm); }

/* Global overview */
.overview { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
.overview__stats { display: flex; gap: var(--space-6); }
.stat { display: flex; flex-direction: column; gap: 2px; }
.stat__value { font-size: var(--text-2xl); font-weight: 700; color: var(--color-text); }
.stat__label { font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.stat--due .stat__value { color: #d97706; }

/* Language head */
.lang-head { display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.lang-head__stats { display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap; }
.lang-chip {
  font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted);
  padding: 2px var(--space-3); background: var(--color-bg-muted); border-radius: var(--radius-full);
}
.lang-chip--due { background: #fef3c7; color: #92400e; }

/* Review card grid */
.rc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-2); }
.rc {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-muted); border-radius: var(--radius-lg);
}
.rc__visual { width: 40px; height: 40px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.rc__visual img { width: 40px; height: 40px; object-fit: contain; }
.rc__emoji { font-size: 1.3rem; }
.rc__body { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.rc__word { font-size: var(--text-sm); font-weight: 700; color: var(--color-text); font-family: var(--font-cjk-kr); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rc__rom { font-size: 0.7rem; color: var(--color-text-muted); }
.rc__tl { font-size: 0.7rem; color: var(--color-text-secondary); }
.rc__meta { display: flex; align-items: center; gap: var(--space-1); flex-shrink: 0; }
.rc__reps {
  font-size: 0.7rem; color: var(--color-text-muted); font-weight: 700;
  padding: 2px var(--space-2); background: var(--color-bg-surface); border-radius: var(--radius-full);
}
.rc__remove {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border: none; background: transparent;
  color: var(--color-text-muted); cursor: pointer;
  border-radius: var(--radius-full);
}
.rc__remove:hover { background: var(--color-bg-surface); color: #ef4444; }

/* Button with icon */
.btn svg { margin-left: 4px; }
</style>
