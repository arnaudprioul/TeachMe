<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonQuizStore } from '~/stores/lesson-quiz.store'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'
import { LESSON_QUIZ_TYPE } from '~/composables/data/courses/lesson-types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const { language, module, courseKey, paths } = useCourseContext()
const quiz = useLessonQuizStore()
const progressStore = useLessonProgressStore()

const course = computed(() => language.value!)
const lessonId = computed(() => Number(route.params.id))

// Local UI state
const answered = ref<null | boolean>(null)
const selectedId = ref<string | null>(null)
const textInput = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  // If session was finished or lost but lesson is still bound, restart
  if (!quiz.session && quiz.lesson) {
    quiz.start()
  }
  // If no lesson bound at all, try to bind from route context
  if (!quiz.session && !quiz.lesson) {
    const lesson = module.value?.lessons?.find(l => l.id === lessonId.value)
    if (lesson) {
      quiz.bind(lesson)
      quiz.start()
    } else {
      navigateTo(paths.value.lessons)
    }
  }
})

const q = computed(() => quiz.currentQuestion)
const isSelect = computed(() =>
  q.value?.type === LESSON_QUIZ_TYPE.IMAGE_SELECT_WORD ||
  q.value?.type === LESSON_QUIZ_TYPE.IMAGE_WORDS_SELECT
)
const isType = computed(() => q.value?.type === LESSON_QUIZ_TYPE.IMAGE_TYPE_WORD)

function handleSelect(wordId: string) {
  if (answered.value !== null) return
  selectedId.value = wordId
  answered.value = quiz.answerSelect(wordId)
}

function handleSubmitText() {
  if (answered.value !== null || !textInput.value.trim()) return
  answered.value = quiz.answerText(textInput.value)
}

function handleSkip() {
  if (answered.value !== null) return
  quiz.skip()
  answered.value = false
}

function handleNext() {
  quiz.next()
  if (quiz.isFinished) {
    progressStore.recordAttempt(courseKey.value, lessonId.value, quiz.score.percentage)
    navigateTo(paths.value.lessonResults(lessonId.value))
    return
  }
  // Reset local state
  answered.value = null
  selectedId.value = null
  textInput.value = ''
  nextTick(() => { inputRef.value?.focus() })
}
</script>

<template>
  <div v-if="quiz.session && q" class="qz" :style="{ '--color-course': course?.color }">
    <!-- Header -->
    <header class="qz__header">
      <NuxtLink :to="paths.lessons" class="qz__close" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </NuxtLink>
      <div class="qz__progress-wrap">
        <div class="qz__progress-bar">
          <div class="qz__progress-fill" :style="{ width: `${quiz.progress.percentage}%` }" />
        </div>
        <span class="qz__progress-label">{{ t('lessons.questionOf', { current: quiz.progress.current, total: quiz.progress.total }) }}</span>
      </div>
    </header>

    <!-- Body -->
    <div class="qz__body">
      <!-- Prompt: Image or Emoji -->
      <div class="qz__prompt">
        <img v-if="q.word.image" :src="q.word.image" :alt="q.word.translation" class="qz__img" />
        <span v-else class="qz__emoji">{{ q.word.emoji }}</span>
        <Transition name="fade">
          <span v-if="quiz.streak > 1" class="qz__streak">{{ t('lessons.streak', { n: quiz.streak }) }}</span>
        </Transition>
      </div>

      <!-- Instruction -->
      <p class="qz__instruction">
        <template v-if="isSelect">{{ t('lessons.selectCorrectWord') }}</template>
        <template v-if="isType">{{ t('lessons.typeTheWord') }}</template>
      </p>

      <!-- Skip button -->
      <div v-if="answered === null" class="qz__skip">
        <button class="btn btn--ghost btn--sm" data-cy="btn-skip" @click="handleSkip">
          {{ t('lessons.iDontKnow') }}
        </button>
      </div>

      <!-- SELECT options -->
      <div v-if="isSelect && q.options" class="qz__options">
        <button
          v-for="opt in q.options"
          :key="opt.id"
          class="qz__opt"
          :class="{
            'qz__opt--selected': selectedId === opt.id,
            'qz__opt--correct': answered !== null && opt.id === q.word.id,
            'qz__opt--wrong': answered !== null && selectedId === opt.id && opt.id !== q.word.id,
          }"
          :disabled="answered !== null"
          data-cy="quiz-option"
          @click="handleSelect(opt.id)"
        >
          <span class="qz__opt-word">{{ opt.word }}</span>
          <span class="qz__opt-rom">{{ opt.romanization }}</span>
        </button>
      </div>

      <!-- TYPE input -->
      <div v-if="isType" class="qz__input-wrap">
        <input
          ref="inputRef"
          v-model="textInput"
          class="qz__input"
          :placeholder="t('lessons.typeTheWord')"
          :disabled="answered !== null"
          data-cy="quiz-input"
          @keydown.enter="handleSubmitText"
        />
        <button
          v-if="answered === null"
          class="btn btn--primary"
          :disabled="!textInput.trim()"
          data-cy="btn-submit"
          @click="handleSubmitText"
        >
          {{ t('training.submit') }}
        </button>
      </div>
    </div>

    <!-- Feedback bar -->
    <Transition name="slide-up">
      <div v-if="answered !== null" class="fb" :class="answered ? 'fb--correct' : 'fb--wrong'">
        <div class="fb__info">
          <span class="fb__label">{{ answered ? t('lessons.correct') : t('lessons.incorrect') }}</span>
          <span v-if="!answered" class="fb__answer">
            {{ t('lessons.correctAnswer') }} <strong>{{ q.word.word }}</strong> ({{ q.word.romanization }})
          </span>
        </div>
        <button class="btn btn--primary btn--sm" data-cy="btn-next" @click="handleNext">
          {{ t('lessons.next') }} →
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.qz {
  display: flex; flex-direction: column;
  min-height: 100dvh; max-width: 520px; margin: 0 auto;
  padding: var(--space-4);
}

/* Header */
.qz__header { display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-6); }
.qz__close {
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: var(--radius-full);
  color: var(--color-text-muted); text-decoration: none;
  transition: background var(--transition-fast);
}
.qz__close:hover { background: var(--color-bg-muted); }
.qz__progress-wrap { flex: 1; display: flex; flex-direction: column; gap: var(--space-1); }
.qz__progress-bar { height: 8px; background: var(--color-bg-muted); border-radius: var(--radius-full); overflow: hidden; }
.qz__progress-fill { height: 100%; background: var(--color-course, var(--color-primary)); border-radius: var(--radius-full); transition: width 300ms ease; }
.qz__progress-label { font-size: var(--text-xs); color: var(--color-text-muted); text-align: right; }

/* Body */
.qz__body { flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--space-5); }

/* Prompt */
.qz__prompt { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
.qz__img { width: 120px; height: 120px; object-fit: contain; }
.qz__emoji { font-size: 5rem; line-height: 1; }
.qz__streak {
  font-size: var(--text-xs); font-weight: 600;
  color: var(--color-course, var(--color-primary));
  background: var(--color-primary-subtle); padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}

.qz__instruction { font-size: var(--text-sm); color: var(--color-text-muted); text-align: center; }

.qz__skip { margin-top: calc(-1 * var(--space-2)); }

/* Options grid */
.qz__options { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); width: 100%; }
.qz__opt {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-1);
  padding: var(--space-4); background: var(--color-bg-surface);
  border: 2px solid var(--color-border); border-radius: var(--radius-xl);
  cursor: pointer; transition: all var(--transition-fast);
}
.qz__opt:hover:not(:disabled) { border-color: var(--color-primary-light); }
.qz__opt--correct { border-color: var(--color-success); background: #f0fdf4; }
.qz__opt--wrong { border-color: var(--color-error); background: #fef2f2; }
.qz__opt:disabled { cursor: default; }
.qz__opt-word { font-size: var(--text-base); font-weight: 600; color: var(--color-text); font-family: var(--font-cjk-kr); }
.qz__opt-rom { font-size: var(--text-xs); color: var(--color-text-muted); }

/* Type input */
.qz__input-wrap { display: flex; gap: var(--space-3); width: 100%; }
.qz__input {
  flex: 1; padding: var(--space-3) var(--space-4);
  border: 2px solid var(--color-border); border-radius: var(--radius-lg);
  font-size: var(--text-base); font-family: var(--font-cjk-kr);
  background: var(--color-bg-surface); color: var(--color-text);
  outline: none; transition: border-color var(--transition-fast);
}
.qz__input:focus { border-color: var(--color-primary); }

/* Feedback */
.fb {
  position: sticky; bottom: 0;
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  margin-top: auto;
}
.fb--correct { background: #f0fdf4; border-top: 2px solid var(--color-success); }
.fb--wrong { background: #fef2f2; border-top: 2px solid var(--color-error); }
.fb__info { display: flex; flex-direction: column; gap: var(--space-1); }
.fb__label { font-size: var(--text-base); font-weight: 700; }
.fb--correct .fb__label { color: var(--color-success); }
.fb--wrong .fb__label { color: var(--color-error); }
.fb__answer { font-size: var(--text-sm); color: var(--color-text-secondary); }
.fb__answer strong { font-family: var(--font-cjk-kr); }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active { transition: transform 250ms ease, opacity 250ms ease; }
.slide-up-enter-from { transform: translateY(20px); opacity: 0; }
</style>
