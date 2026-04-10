<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCourses } from '~/composables/useCourses'
definePageMeta({ layout: 'default', middleware: 'auth' })
const { t } = useI18n()
const { getBySlug } = useCourses()
const course = getBySlug('korean')!
</script>

<template>
  <div class="hub page-container" :style="{ '--color-course': course.color, '--color-course-subtle': course.colorSubtle }">
    <div class="hub__header">
      <span class="hub__flag">{{ course.flag }}</span>
      <h1 class="hub__title">{{ t('korean.hubTitle') }}</h1>
      <p class="hub__sub">{{ t('korean.hubSubtitle') }}</p>
    </div>

    <!-- Writing System (transversal) -->
    <section>
      <h2 class="section-label">{{ t('korean.writingSystem') }}</h2>
      <div class="hub__cards">
        <NuxtLink to="/korean/hangeul" class="skill-card" data-cy="hub-hangeul">
          <div class="skill-card__icon" :style="{ background: course.colorSubtle, color: course.color }">한</div>
          <div class="skill-card__body">
            <span class="skill-card__title">{{ t('korean.hangeul') }}</span>
            <span class="skill-card__desc">{{ t('korean.hangeulDesc') }}</span>
          </div>
          <svg class="skill-card__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </NuxtLink>

      </div>
    </section>

    <!-- Levels (coming soon) -->
    <section>
      <h2 class="section-label">{{ t('korean.levels') }}</h2>
      <div class="coming-soon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <p>{{ t('korean.levelsComingSoon') }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hub { display: flex; flex-direction: column; gap: var(--space-8); }

.hub__header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-1); }
.hub__flag { font-size: 2.5rem; line-height: 1; }
.hub__title { font-size: var(--text-2xl); font-weight: 600; color: var(--color-text); }
.hub__sub { font-size: var(--text-sm); color: var(--color-text-muted); }

section { display: flex; flex-direction: column; gap: var(--space-3); }
.section-label { font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

.hub__cards { display: flex; flex-direction: column; gap: var(--space-3); }

.skill-card {
  display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); text-decoration: none; transition: all var(--transition-fast);
}
.skill-card:hover { border-color: var(--color-border-strong); box-shadow: var(--shadow-sm); }

.skill-card__icon {
  width: 44px; height: 44px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  font-weight: 700; font-size: 1.4rem; font-family: var(--font-cjk-kr);
}

.skill-card__body { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.skill-card__title { font-size: var(--text-sm); font-weight: 600; color: var(--color-text); }
.skill-card__desc { font-size: var(--text-xs); color: var(--color-text-muted); }
.skill-card__chevron { color: var(--color-text-subtle); flex-shrink: 0; }

.coming-soon {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-5); background: var(--color-bg-muted);
  border: 1px dashed var(--color-border-strong); border-radius: var(--radius-xl);
  color: var(--color-text-muted);
}
.coming-soon p { font-size: var(--text-sm); line-height: 1.5; }
.coming-soon svg { flex-shrink: 0; }
</style>
