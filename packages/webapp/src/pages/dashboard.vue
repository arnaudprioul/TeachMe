<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth.store'
import { useCourses } from '~/composables/useCourses'
definePageMeta({ layout: 'default', middleware: 'auth' })
const { t } = useI18n()
const auth = useAuthStore()
const { available, comingSoon } = useCourses()
</script>

<template>
  <div class="dash page-container">
    <div class="dash__header">
      <h1 class="dash__greeting">{{ t('dashboard.greeting', { name: auth.user?.username ?? t('dashboard.defaultName') }) }}</h1>
      <p class="dash__sub">{{ t('dashboard.subtitle') }}</p>
    </div>

    <!-- Active courses -->
    <section v-if="available.length">
      <h2 class="section-label">{{ t('dashboard.myCourses') }}</h2>
      <div class="course-grid">
        <NuxtLink
          v-for="course in available" :key="course.slug"
          :to="course.route"
          class="course-card"
          :data-cy="`course-${course.slug}`"
        >
          <span class="course-card__flag">{{ course.flag }}</span>
          <span class="course-card__name">{{ t(`courses.${course.slug}`) }}</span>
          <span class="course-card__desc">{{ t(`courses.${course.slug}Desc`) }}</span>
          <span class="course-card__badge" :style="{ background: course.colorSubtle, color: course.color }">{{ t('common.available') }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Coming soon -->
    <section v-if="comingSoon.length">
      <h2 class="section-label">{{ t('dashboard.explore') }}</h2>
      <div class="course-grid course-grid--compact">
        <div
          v-for="course in comingSoon" :key="course.slug"
          class="course-card course-card--locked"
          :data-cy="`course-${course.slug}`"
        >
          <span class="course-card__flag">{{ course.flag }}</span>
          <span class="course-card__name">{{ t(`courses.${course.slug}`) }}</span>
          <span class="course-card__badge course-card__badge--muted">{{ t('common.soon') }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dash {
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
}

.dash__header { text-align: center; }

.dash__greeting {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.025em;
}

.dash__sub {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.section-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-3);
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
}

.course-grid--compact {
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.course-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-6) var(--space-4);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  text-decoration: none;
  text-align: center;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.course-card:not(.course-card--locked):hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.course-card--locked {
  opacity: 0.5;
  cursor: default;
}

.course-card__flag { font-size: 2.2rem; line-height: 1; }

.course-card__name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.course-card__desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.4;
}

.course-card__badge {
  display: inline-flex;
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 500;
}

.course-card__badge--muted {
  background: var(--color-bg-muted);
  color: var(--color-text-muted);
}
</style>
