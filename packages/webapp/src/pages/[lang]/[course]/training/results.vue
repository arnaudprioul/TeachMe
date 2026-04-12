<script setup lang="ts">
import { computed, onMounted, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTrainingStore } from '~/stores/training.store'
import { useCourseContext } from '~/composables/useCourseContext'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const training = useTrainingStore()
const { language, module, paths } = useCourseContext()

const course = computed(() => language.value!)

watchEffect(() => {
  if (module.value) training.bind(module.value)
})

// Redirect if no session
onMounted(() => {
  if (!training.session) navigateTo(paths.value.training)
})

const emoji = computed(() => {
  const pct = training.score.percentage
  if (pct === 100) return '🎉'
  if (pct >= 80) return '🔥'
  if (pct >= 50) return '👏'
  return '💪'
})
</script>

<template>
  <div class="results page-container" :style="{ '--color-course': course.color }">
    <template v-if="training.session">
      <div class="results__hero">
        <span class="results__emoji">{{ emoji }}</span>
        <h1>{{ t('training.trainingComplete') }}</h1>
      </div>

      <div class="results__scores">
        <div class="score-card">
          <span class="score-card__value">{{ training.score.correct }}/{{ training.score.total }}</span>
          <span class="score-card__label">{{ t('training.yourScore') }}</span>
          <div class="score-card__bar">
            <div class="score-card__fill" :style="{ width: `${training.score.percentage}%` }" />
          </div>
          <span class="score-card__pct">{{ training.score.percentage }}%</span>
        </div>

        <div class="score-card score-card--streak">
          <span class="score-card__value">{{ training.bestStreak }}</span>
          <span class="score-card__label">{{ t('training.bestStreak') }}</span>
        </div>
      </div>

      <!-- Question review -->
      <div class="results__review">
        <div
          v-for="(result, i) in training.session.results"
          :key="i"
          class="review-item"
          :class="result.correct ? 'review-item--correct' : 'review-item--wrong'"
        >
          <span class="review-item__icon">{{ result.correct ? '✓' : '✗' }}</span>
          <span class="review-item__char">{{ training.session.questions[i]?.item.symbol }}</span>
          <span class="review-item__rom">{{ training.session.questions[i]?.item.romanization }}</span>
        </div>
      </div>

      <div class="results__actions">
        <button class="btn btn--primary btn--full" @click="training.start(); navigateTo(paths.play)">
          {{ t('training.tryAgain') }}
        </button>
        <NuxtLink :to="paths.training" class="btn btn--ghost btn--full">
          {{ t('training.backToMenu') }}
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<style scoped>
.results {
  display: flex; flex-direction: column; gap: var(--space-8);
  padding-top: var(--space-10); padding-bottom: var(--space-10);
  max-width: 520px; margin: 0 auto;
}

.results__hero {
  text-align: center; display: flex; flex-direction: column;
  align-items: center; gap: var(--space-3);
}
.results__emoji { font-size: 4rem; line-height: 1; }
.results__hero h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--color-text); }

.results__scores {
  display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4);
}

.score-card {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
  padding: var(--space-6); background: var(--color-bg-surface);
  border: 1px solid var(--color-border); border-radius: var(--radius-xl);
  text-align: center;
}
.score-card__value { font-size: var(--text-3xl); font-weight: 700; color: var(--color-primary); }
.score-card__label { font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.score-card__bar {
  width: 100%; height: 8px; background: var(--color-bg-muted);
  border-radius: var(--radius-full); overflow: hidden;
}
.score-card__fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); transition: width 500ms ease; }
.score-card__pct { font-size: var(--text-sm); font-weight: 600; color: var(--color-text-secondary); }

.score-card--streak .score-card__value { color: var(--color-course); }

/* Review */
.results__review {
  display: flex; flex-wrap: wrap; gap: var(--space-2);
}

.review-item {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg); font-size: var(--text-sm);
}
.review-item--correct { background: #f0fdf4; }
.review-item--wrong { background: #fef2f2; }
.review-item__icon { font-weight: 700; }
.review-item--correct .review-item__icon { color: #22c55e; }
.review-item--wrong .review-item__icon { color: #ef4444; }
.review-item__char { font-family: var(--font-cjk-kr); font-weight: 600; color: var(--color-text); }
.review-item__rom { color: var(--color-text-muted); }

.results__actions { display: flex; flex-direction: column; gap: var(--space-3); }
</style>
