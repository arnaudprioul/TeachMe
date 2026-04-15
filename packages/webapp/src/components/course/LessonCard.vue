<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ILesson } from '~/composables/data/courses/lesson-types'
import type { ILessonProgress } from '~/composables/data/courses/lesson-types'

const props = defineProps<{
  lesson: ILesson
  progress: ILessonProgress
  unlocked: boolean
  localePrefix: string
}>()

defineEmits<{ click: [] }>()

const { t } = useI18n()
</script>

<template>
  <button
    class="lc"
    :class="{ 'lc--locked': !unlocked, 'lc--completed': progress.completed }"
    :disabled="!unlocked"
    data-cy="lesson-card"
    @click="$emit('click')"
  >
    <div class="lc__number">
      <span v-if="progress.completed" class="lc__check">✓</span>
      <span v-else-if="!unlocked" class="lc__lock">🔒</span>
      <span v-else>{{ lesson.id }}</span>
    </div>

    <div class="lc__body">
      <h3 class="lc__title">{{ t(`${localePrefix}.lessons.lesson`, { n: lesson.id }) }}</h3>
      <p class="lc__theme">{{ t(`${localePrefix}.lessons.theme.${lesson.themeKey}`) }}</p>
      <span class="lc__meta">{{ t(`${localePrefix}.lessons.wordsToLearn`, { n: lesson.words.length }) }}</span>
    </div>

    <div v-if="progress.bestScore > 0" class="lc__score">
      <span class="lc__score-value">{{ progress.bestScore }}%</span>
      <div class="lc__bar">
        <div class="lc__bar-fill" :style="{ width: `${progress.bestScore}%` }" />
      </div>
    </div>

    <svg class="lc__chevron" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<style scoped>
.lc {
  display: flex; align-items: center; gap: var(--space-4);
  width: 100%; padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); cursor: pointer;
  text-align: left; transition: all var(--transition-fast);
}
.lc:hover:not(:disabled) { border-color: var(--color-primary); box-shadow: var(--shadow-sm); }
.lc--locked { opacity: 0.55; cursor: not-allowed; }
.lc--completed { border-color: var(--color-success); }

.lc__number {
  width: 44px; height: 44px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: var(--color-bg-muted); border-radius: var(--radius-full);
  font-size: var(--text-lg); font-weight: 700; color: var(--color-text-secondary);
}
.lc--completed .lc__number { background: var(--color-success); color: #fff; }

.lc__check { font-size: var(--text-base); }
.lc__lock { font-size: var(--text-sm); }

.lc__body { flex: 1; min-width: 0; }
.lc__title { font-size: var(--text-base); font-weight: 600; color: var(--color-text); margin: 0; }
.lc__theme { font-size: var(--text-sm); color: var(--color-text-muted); margin: var(--space-1) 0 0; }
.lc__meta { font-size: var(--text-xs); color: var(--color-text-subtle); }

.lc__score { display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-1); flex-shrink: 0; }
.lc__score-value { font-size: var(--text-xs); font-weight: 600; color: var(--color-primary); }
.lc__bar { width: 60px; height: 4px; background: var(--color-bg-muted); border-radius: var(--radius-full); overflow: hidden; }
.lc__bar-fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); transition: width 300ms ease; }
.lc--completed .lc__bar-fill { background: var(--color-success); }
.lc--completed .lc__score-value { color: var(--color-success); }

.lc__chevron { flex-shrink: 0; color: var(--color-text-subtle); }
</style>
