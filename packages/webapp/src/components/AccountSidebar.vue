<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFavoritesStore } from '~/stores/favorites.store'
import { useReviewsStore } from '~/stores/reviews.store'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'

const { t } = useI18n()
const route = useRoute()
const favorites = useFavoritesStore()
const reviews = useReviewsStore()
const lessonProgress = useLessonProgressStore()

const exercisesBadge = computed(() => {
  let count = 0
  for (const ep of Object.values(lessonProgress.byExercise)) {
    if (ep.bestScore >= 50) count++
  }
  return count || undefined
})

const items = computed(() => [
  {
    id: 'overview',
    label: t('profile.tabOverview'),
    to: { path: '/profile', query: {} },
    active: route.path === '/profile' && !route.query.tab,
    icon: 'user',
  },
  {
    id: 'vocabulary',
    label: t('vocabulary.title'),
    to: '/vocabulary',
    active: route.path.startsWith('/vocabulary'),
    icon: 'star',
    badge: reviews.cards.length || undefined,
  },
  {
    id: 'exercises',
    label: t('profile.tabExercises'),
    to: { path: '/profile', query: { tab: 'exercises' } },
    active: route.path === '/profile' && route.query.tab === 'exercises',
    icon: 'bolt',
    badge: exercisesBadge.value,
  },
  {
    id: 'favorites',
    label: t('profile.tabFavorites'),
    to: { path: '/profile', query: { tab: 'favorites' } },
    active: route.path === '/profile' && route.query.tab === 'favorites',
    icon: 'heart',
    badge: favorites.totalCount || undefined,
  },
  {
    id: 'settings',
    label: t('profile.settings'),
    to: { path: '/profile', query: { tab: 'settings' } },
    active: route.path === '/profile' && route.query.tab === 'settings',
    icon: 'settings',
  },
])
</script>

<template>
  <aside class="sidebar">
    <nav class="sidebar__nav">
      <NuxtLink
        v-for="item in items" :key="item.id"
        :to="item.to"
        class="sb-link"
        :class="{ 'sb-link--active': item.active }"
      >
        <span class="sb-link__icon">
          <svg v-if="item.icon === 'user'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <svg v-else-if="item.icon === 'star'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <svg v-else-if="item.icon === 'heart'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <svg v-else-if="item.icon === 'bolt'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <svg v-else-if="item.icon === 'settings'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </span>
        <span class="sb-link__label">{{ item.label }}</span>
        <span v-if="item.badge" class="sb-link__badge">{{ item.badge }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky; top: var(--space-6);
  width: 240px; flex-shrink: 0;
}
.sidebar__nav { display: flex; flex-direction: column; gap: 2px; }

.sb-link {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm); font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.sb-link:hover { background: var(--color-bg-muted); color: var(--color-text); }
.sb-link--active {
  background: var(--color-primary-subtle); color: var(--color-primary);
  font-weight: 600;
}
.sb-link__icon {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; flex-shrink: 0;
}
.sb-link__label { flex: 1; }
.sb-link__badge {
  font-size: 0.7rem; font-weight: 700;
  padding: 1px var(--space-2);
  background: var(--color-bg-surface); color: var(--color-text-muted);
  border-radius: var(--radius-full);
}
.sb-link--active .sb-link__badge {
  background: var(--color-primary); color: #fff;
}

@media (max-width: 900px) {
  .sidebar { position: static; width: 100%; }
  .sidebar__nav { flex-direction: row; overflow-x: auto; padding-bottom: var(--space-2); }
  .sb-link { flex-shrink: 0; }
  .sb-link__label { white-space: nowrap; }
}
</style>
