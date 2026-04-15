<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonExerciseStore } from '~/stores/lesson-exercise.store'
import type { TExerciseDifficulty } from '~/composables/data/courses/lesson-types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const { module, language, paths } = useCourseContext()
const store = useLessonExerciseStore()

const course = computed(() => language.value!)
const lessonId = computed(() => Number(route.params.id))
const lesson = computed(() => module.value?.lessons?.find(l => l.id === lessonId.value))
const difficulty = computed<TExerciseDifficulty>(() => (route.query.difficulty as TExerciseDifficulty) || 'easy')

onMounted(() => {
  if (!store.session || !store.isFinished) {
    navigateTo(paths.value.lesson(lessonId.value))
  }
})

const emoji = computed(() => {
  const p = store.score.percentage
  if (p === 100) return '🎉'
  if (p >= 80) return '🔥'
  if (p >= 60) return '👏'
  return '💪'
})

// Next difficulty, if any
const nextDifficulty = computed<TExerciseDifficulty | null>(() => {
  if (difficulty.value === 'easy') return 'medium'
  if (difficulty.value === 'medium') return 'hard'
  return null
})

function retry() {
  navigateTo(`${paths.value.lessonExercises(lessonId.value)}?difficulty=${difficulty.value}`)
}

function nextLevel() {
  if (!nextDifficulty.value) return
  navigateTo(`${paths.value.lessonExercises(lessonId.value)}?difficulty=${nextDifficulty.value}`)
}
</script>

<template>
  <div v-if="store.session && lesson" class="xr page-container" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle }">
    <div class="xr__hero">
      <span class="xr__emoji">{{ emoji }}</span>
      <h1>{{ t('lessonPage.exercisesResultsTitle') }}</h1>
      <p class="xr__diff">{{ t(`lessonPage.${difficulty}`) }}</p>
    </div>

    <div class="xr__scores">
      <div class="sc">
        <span class="sc__value">{{ store.score.correct }}/{{ store.score.total }}</span>
        <span class="sc__label">{{ t('lessons.yourScore') }}</span>
        <div class="sc__bar">
          <div class="sc__fill" :style="{ width: `${store.score.percentage}%` }" />
        </div>
        <span class="sc__pct">{{ store.score.percentage }}%</span>
      </div>
      <div class="sc sc--streak">
        <span class="sc__value">🔥 {{ store.bestStreak }}</span>
        <span class="sc__label">{{ t('training.bestStreak') }}</span>
      </div>
    </div>

    <div class="xr__review">
      <h3>{{ t('lessonPage.reviewAll') }}</h3>
      <div class="xr__review-grid">
        <div
          v-for="(result, i) in store.session.results" :key="i"
          class="ri" :class="result.correct ? 'ri--correct' : 'ri--wrong'"
        >
          <span class="ri__num">{{ i + 1 }}</span>
          <span class="ri__icon">{{ result.correct ? '✓' : '✗' }}</span>
          <span class="ri__attempts" v-if="result.attempts > 1">{{ result.attempts }} {{ t('lessonPage.tryAttempts') }}</span>
        </div>
      </div>
    </div>

    <div class="xr__actions">
      <button
        v-if="nextDifficulty && store.score.percentage >= 60"
        class="xr__btn xr__btn--primary"
        @click="nextLevel"
      >
        {{ t('lessonPage.tryHarder') }} →
      </button>
      <button class="xr__btn xr__btn--secondary" @click="retry">
        {{ t('lessons.tryAgain') }}
      </button>
      <NuxtLink :to="paths.lesson(lessonId)" class="xr__btn xr__btn--ghost">
        {{ t('lessonPage.backToLesson') }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.xr {
  display: flex; flex-direction: column; gap: var(--space-8);
  padding-top: var(--space-10); padding-bottom: var(--space-10);
  max-width: 560px; margin: 0 auto;
}

.xr__hero { text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
.xr__emoji { font-size: 4.5rem; line-height: 1; }
.xr__hero h1 { font-size: var(--text-3xl); font-weight: 800; color: var(--color-text); margin: 0; letter-spacing: -0.02em; }
.xr__diff {
  display: inline-block; margin: 0;
  font-size: var(--text-xs); font-weight: 700; color: var(--cc, var(--color-primary));
  text-transform: uppercase; letter-spacing: 0.1em;
  padding: 2px var(--space-3); background: var(--cc-s, var(--color-primary-subtle));
  border-radius: var(--radius-full);
}

/* Score cards */
.xr__scores { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-3); }
.sc {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
  padding: var(--space-6); background: var(--color-bg-surface);
  border: 1px solid var(--color-border); border-radius: var(--radius-2xl);
  text-align: center;
}
.sc__value { font-size: var(--text-3xl); font-weight: 800; color: var(--cc, var(--color-primary)); }
.sc__label { font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.sc__bar { width: 100%; height: 8px; background: var(--color-bg-muted); border-radius: var(--radius-full); overflow: hidden; }
.sc__fill {
  height: 100%; background: linear-gradient(90deg, var(--cc, var(--color-primary)), color-mix(in srgb, var(--cc, var(--color-primary)) 70%, #fff));
  border-radius: var(--radius-full); transition: width 600ms ease;
}
.sc__pct { font-size: var(--text-sm); font-weight: 700; color: var(--color-text-secondary); }
.sc--streak .sc__value { color: #d97706; }

/* Review grid */
.xr__review h3 { font-size: var(--text-base); font-weight: 700; color: var(--color-text); margin: 0 0 var(--space-3); }
.xr__review-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: var(--space-2); }
.ri {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  position: relative;
}
.ri--correct { background: #f0fdf4; color: #166534; }
.ri--wrong { background: #fef2f2; color: #991b1b; }
.ri__num { font-size: var(--text-xs); opacity: 0.6; font-weight: 600; }
.ri__icon { font-size: var(--text-lg); font-weight: 800; }
.ri__attempts { font-size: 0.6rem; opacity: 0.7; }

/* Actions */
.xr__actions { display: flex; flex-direction: column; gap: var(--space-3); }
.xr__btn {
  padding: var(--space-4) var(--space-6);
  border: none; border-radius: var(--radius-xl);
  font-size: var(--text-base); font-weight: 700;
  cursor: pointer; transition: all var(--transition-fast);
  text-align: center; text-decoration: none; display: block;
}
.xr__btn--primary { background: var(--cc, var(--color-primary)); color: #fff; }
.xr__btn--primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.xr__btn--secondary {
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  color: var(--color-text);
}
.xr__btn--secondary:hover { border-color: var(--cc, var(--color-primary)); }
.xr__btn--ghost { background: transparent; color: var(--color-text-muted); }
.xr__btn--ghost:hover { color: var(--color-text); }
</style>
