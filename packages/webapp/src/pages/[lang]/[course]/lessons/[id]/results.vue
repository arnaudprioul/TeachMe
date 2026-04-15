<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonQuizStore } from '~/stores/lesson-quiz.store'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const route = useRoute()
const { module, language, courseKey, paths, tKey } = useCourseContext()
const quiz = useLessonQuizStore()
const progressStore = useLessonProgressStore()

const course = computed(() => language.value!)
const lessonId = computed(() => Number(route.params.id))
const lesson = computed(() => module.value?.lessons?.find(l => l.id === lessonId.value))

onMounted(() => {
  if (!quiz.session) navigateTo(paths.value.lessons)
})

const emoji = computed(() => {
  const pct = quiz.score.percentage
  if (pct === 100) return '🎉'
  if (pct >= 80) return '🔥'
  if (pct >= 60) return '👏'
  return '💪'
})

const nextLesson = computed(() => {
  if (!module.value?.lessons || !lesson.value) return null
  return module.value.lessons.find(l => l.id === lesson.value!.id + 1) ?? null
})

const canGoNext = computed(() => {
  if (!nextLesson.value) return false
  return progressStore.isUnlocked(courseKey.value, nextLesson.value.id)
})

function retry() {
  if (!lesson.value) return
  quiz.bind(lesson.value)
  quiz.start()
  navigateTo(paths.value.lessonQuiz(lessonId.value))
}
</script>

<template>
  <div v-if="quiz.session" class="lr page-container" :style="{ '--color-course': course?.color }">
    <div class="lr__hero">
      <span class="lr__emoji">{{ emoji }}</span>
      <h1>{{ t('lessons.quizComplete') }}</h1>
    </div>

    <div class="lr__scores">
      <div class="sc">
        <span class="sc__value">{{ quiz.score.correct }}/{{ quiz.score.total }}</span>
        <span class="sc__label">{{ t('lessons.yourScore') }}</span>
        <div class="sc__bar">
          <div class="sc__fill" :style="{ width: `${quiz.score.percentage}%` }" />
        </div>
        <span class="sc__pct">{{ quiz.score.percentage }}%</span>
      </div>
      <div class="sc sc--streak">
        <span class="sc__value">{{ quiz.bestStreak }}</span>
        <span class="sc__label">{{ t('training.bestStreak') }}</span>
      </div>
    </div>

    <!-- Word review -->
    <div class="lr__review">
      <div
        v-for="(result, i) in quiz.session.results"
        :key="i"
        class="ri"
        :class="result.correct ? 'ri--correct' : 'ri--wrong'"
      >
        <span class="ri__icon">{{ result.correct ? '✓' : '✗' }}</span>
        <span class="ri__emoji">{{ quiz.session.questions[i]?.word.emoji }}</span>
        <span class="ri__word">{{ quiz.session.questions[i]?.word.word }}</span>
        <span class="ri__rom">{{ quiz.session.questions[i]?.word.romanization }}</span>
      </div>
    </div>

    <div class="lr__actions">
      <button v-if="canGoNext" class="btn btn--primary btn--full" @click="navigateTo(paths.lesson(nextLesson!.id))">
        {{ t('lessons.nextLesson') }} →
      </button>
      <button class="btn btn--ghost btn--full" @click="retry">
        {{ t('lessons.tryAgain') }}
      </button>
      <NuxtLink :to="paths.lesson(lessonId)" class="btn btn--ghost btn--full">
        {{ t('lessons.reviewVocab') }}
      </NuxtLink>
      <NuxtLink :to="paths.lessons" class="btn btn--ghost btn--full">
        {{ t('lessons.backToLessons') }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.lr {
  display: flex; flex-direction: column; gap: var(--space-8);
  padding-top: var(--space-10); padding-bottom: var(--space-10);
  max-width: 520px; margin: 0 auto;
}

.lr__hero {
  text-align: center; display: flex; flex-direction: column;
  align-items: center; gap: var(--space-3);
}
.lr__emoji { font-size: 4rem; line-height: 1; }
.lr__hero h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--color-text); }

.lr__scores { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-4); }

.sc {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
  padding: var(--space-6); background: var(--color-bg-surface);
  border: 1px solid var(--color-border); border-radius: var(--radius-xl);
  text-align: center;
}
.sc__value { font-size: var(--text-3xl); font-weight: 700; color: var(--color-primary); }
.sc__label { font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.sc__bar { width: 100%; height: 8px; background: var(--color-bg-muted); border-radius: var(--radius-full); overflow: hidden; }
.sc__fill { height: 100%; background: var(--color-primary); border-radius: var(--radius-full); transition: width 500ms ease; }
.sc__pct { font-size: var(--text-sm); font-weight: 600; color: var(--color-text-secondary); }
.sc--streak .sc__value { color: var(--color-course, var(--color-primary)); }

.lr__review { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.ri {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg); font-size: var(--text-sm);
}
.ri--correct { background: #f0fdf4; }
.ri--wrong { background: #fef2f2; }
.ri__icon { font-weight: 700; }
.ri--correct .ri__icon { color: #22c55e; }
.ri--wrong .ri__icon { color: #ef4444; }
.ri__emoji { font-size: var(--text-base); }
.ri__word { font-family: var(--font-cjk-kr); font-weight: 600; color: var(--color-text); }
.ri__rom { color: var(--color-text-muted); }

.lr__actions { display: flex; flex-direction: column; gap: var(--space-3); }
</style>
