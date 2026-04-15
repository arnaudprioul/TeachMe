<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonExerciseStore } from '~/stores/lesson-exercise.store'
import { LESSON_EXERCISE_TYPE } from '~/composables/data/courses/lesson-types'
import type { TExerciseDifficulty } from '~/composables/data/courses/lesson-types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const { module, language, paths } = useCourseContext()
const store = useLessonExerciseStore()

const course = computed(() => language.value!)
const lessonId = computed(() => Number(route.params.id))
const lesson = computed(() => module.value?.lessons?.find(l => l.id === lessonId.value))

onMounted(() => {
  if (!lesson.value?.exercises?.length) { navigateTo(paths.value.lessons); return }
  const diff = (route.query.difficulty as TExerciseDifficulty) || 'easy'
  store.start(lessonId.value, lesson.value.exercises!, diff)
})

const ex = computed(() => store.currentExercise)
const answered = ref<null | boolean>(null)
const textInput = ref('')
const reorderItems = ref<string[]>([])
const selectedQcm = ref<number | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

// Initialize reorder items when exercise changes
function initReorder() {
  if (ex.value?.type === LESSON_EXERCISE_TYPE.REORDER && ex.value.correctOrder) {
    const shuffled = [...ex.value.correctOrder]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    reorderItems.value = shuffled
  }
}
onMounted(initReorder)

function moveWord(fromIdx: number, toIdx: number) {
  const arr = [...reorderItems.value]
  const [item] = arr.splice(fromIdx, 1)
  arr.splice(toIdx, 0, item)
  reorderItems.value = arr
}

function handleQcm(idx: number) {
  if (answered.value !== null) return
  selectedQcm.value = idx
  answered.value = store.answerQcm(idx)
}

function handleFillBlank() {
  if (answered.value !== null || !textInput.value.trim()) return
  answered.value = store.answerFillBlank(textInput.value)
}

function handleReorder() {
  if (answered.value !== null) return
  answered.value = store.answerReorder(reorderItems.value)
}

function handleTranslate() {
  if (answered.value !== null || !textInput.value.trim()) return
  answered.value = store.answerTranslate(textInput.value)
}

function handleSkip() {
  if (answered.value !== null) return
  store.skip()
  answered.value = false
}

function handleNext() {
  store.next()
  if (store.isFinished) {
    navigateTo(paths.value.lesson(lessonId.value))
    return
  }
  answered.value = null
  selectedQcm.value = null
  textInput.value = ''
  initReorder()
  nextTick(() => inputRef.value?.focus())
}
</script>

<template>
  <div v-if="store.session && ex" class="ep" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle }">
    <!-- Header -->
    <header class="ep__header">
      <NuxtLink :to="paths.lesson(lessonId)" class="ep__close" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </NuxtLink>
      <div class="ep__progress-wrap">
        <div class="ep__progress-bar"><div class="ep__progress-fill" :style="{ width: `${store.progress.percentage}%` }" /></div>
        <span class="ep__progress-label">{{ t('lessons.questionOf', { current: store.progress.current, total: store.progress.total }) }}</span>
      </div>
    </header>

    <div class="ep__body">
      <!-- QCM -->
      <template v-if="ex.type === LESSON_EXERCISE_TYPE.QCM">
        <p class="ep__instruction">{{ t('lessonPage.pickCorrectAnswer') }}</p>
        <p class="ep__question">{{ t(ex.questionKey!) }}</p>
        <div class="ep__options">
          <button
            v-for="(opt, i) in ex.options"
            :key="i"
            class="ep__opt"
            :class="{
              'ep__opt--correct': answered !== null && opt.correct,
              'ep__opt--wrong': answered !== null && selectedQcm === i && !opt.correct,
            }"
            :disabled="answered !== null"
            @click="handleQcm(i)"
          >{{ t(opt.labelKey) }}</button>
        </div>
      </template>

      <!-- FILL BLANK -->
      <template v-if="ex.type === LESSON_EXERCISE_TYPE.FILL_BLANK">
        <p class="ep__instruction">{{ t('lessonPage.fillBlank') }}</p>
        <p class="ep__sentence-template">{{ ex.sentenceTemplate }}</p>
        <div class="ep__input-row">
          <input ref="inputRef" v-model="textInput" class="ep__input" :disabled="answered !== null" @keydown.enter="handleFillBlank" />
          <button v-if="answered === null" class="btn btn--primary" :disabled="!textInput.trim()" @click="handleFillBlank">{{ t('lessonPage.check') }}</button>
        </div>
      </template>

      <!-- REORDER -->
      <template v-if="ex.type === LESSON_EXERCISE_TYPE.REORDER">
        <p class="ep__instruction">{{ t('lessonPage.reorderWords') }}</p>
        <div class="ep__reorder">
          <button
            v-for="(word, i) in reorderItems"
            :key="i"
            class="ep__word-chip"
            :disabled="answered !== null"
            @click="i < reorderItems.length - 1 && moveWord(i, i + 1)"
          >{{ word }}</button>
        </div>
        <button v-if="answered === null" class="btn btn--primary" @click="handleReorder">{{ t('lessonPage.check') }}</button>
      </template>

      <!-- TRANSLATE -->
      <template v-if="ex.type === LESSON_EXERCISE_TYPE.TRANSLATE">
        <p class="ep__instruction">{{ t('lessonPage.translateSentence') }}</p>
        <p class="ep__source">{{ t(ex.sourceKey!) }}</p>
        <div class="ep__input-row">
          <input ref="inputRef" v-model="textInput" class="ep__input" :disabled="answered !== null" @keydown.enter="handleTranslate" />
          <button v-if="answered === null" class="btn btn--primary" :disabled="!textInput.trim()" @click="handleTranslate">{{ t('lessonPage.check') }}</button>
        </div>
      </template>

      <!-- Skip -->
      <div v-if="answered === null" class="ep__skip">
        <button class="btn btn--ghost btn--sm" @click="handleSkip">{{ t('lessons.iDontKnow') }}</button>
      </div>
    </div>

    <!-- Feedback -->
    <Transition name="slide-up">
      <div v-if="answered !== null" class="fb" :class="answered ? 'fb--correct' : 'fb--wrong'">
        <div class="fb__info">
          <span class="fb__label">{{ answered ? t('lessons.correct') : t('lessons.incorrect') }}</span>
          <span v-if="!answered && ex.type === LESSON_EXERCISE_TYPE.FILL_BLANK" class="fb__answer">{{ t('lessons.correctAnswer') }} <strong>{{ ex.answer }}</strong></span>
          <span v-if="!answered && ex.type === LESSON_EXERCISE_TYPE.TRANSLATE" class="fb__answer">{{ t('lessons.correctAnswer') }} <strong>{{ ex.targetAnswer }}</strong></span>
          <span v-if="!answered && ex.type === LESSON_EXERCISE_TYPE.REORDER" class="fb__answer">{{ t('lessons.correctAnswer') }} <strong>{{ ex.correctOrder?.join(' ') }}</strong></span>
        </div>
        <button class="btn btn--primary btn--sm" @click="handleNext">{{ t('lessons.next') }} →</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ep { display: flex; flex-direction: column; min-height: 100dvh; max-width: 520px; margin: 0 auto; padding: var(--space-4); }

.ep__header { display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-6); }
.ep__close { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: var(--radius-full); color: var(--color-text-muted); text-decoration: none; transition: background var(--transition-fast); }
.ep__close:hover { background: var(--color-bg-muted); }
.ep__progress-wrap { flex: 1; display: flex; flex-direction: column; gap: var(--space-1); }
.ep__progress-bar { height: 8px; background: var(--color-bg-muted); border-radius: var(--radius-full); overflow: hidden; }
.ep__progress-fill { height: 100%; background: var(--cc, var(--color-primary)); border-radius: var(--radius-full); transition: width 300ms ease; }
.ep__progress-label { font-size: var(--text-xs); color: var(--color-text-muted); text-align: right; }

.ep__body { flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--space-5); }

.ep__instruction { font-size: var(--text-sm); color: var(--color-text-muted); text-align: center; }
.ep__question { font-size: var(--text-lg); font-weight: 600; color: var(--color-text); text-align: center; }
.ep__sentence-template { font-size: var(--text-xl); font-weight: 700; color: var(--color-text); font-family: var(--font-cjk-kr); text-align: center; }
.ep__source { font-size: var(--text-lg); font-weight: 600; color: var(--color-text); text-align: center; padding: var(--space-4); background: var(--color-bg-muted); border-radius: var(--radius-xl); width: 100%; }

.ep__options { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); width: 100%; }
.ep__opt {
  padding: var(--space-4); background: var(--color-bg-surface); border: 2px solid var(--color-border);
  border-radius: var(--radius-xl); font-size: var(--text-sm); font-weight: 500; color: var(--color-text);
  cursor: pointer; transition: all var(--transition-fast); text-align: center;
}
.ep__opt:hover:not(:disabled) { border-color: var(--cc, var(--color-primary)); }
.ep__opt--correct { border-color: var(--color-success); background: #f0fdf4; }
.ep__opt--wrong { border-color: var(--color-error); background: #fef2f2; }
.ep__opt:disabled { cursor: default; }

.ep__input-row { display: flex; gap: var(--space-3); width: 100%; }
.ep__input {
  flex: 1; padding: var(--space-3) var(--space-4); border: 2px solid var(--color-border);
  border-radius: var(--radius-lg); font-size: var(--text-base); font-family: var(--font-cjk-kr);
  background: var(--color-bg-surface); color: var(--color-text); outline: none;
  transition: border-color var(--transition-fast);
}
.ep__input:focus { border-color: var(--cc, var(--color-primary)); }

.ep__reorder { display: flex; flex-wrap: wrap; gap: var(--space-2); justify-content: center; }
.ep__word-chip {
  padding: var(--space-2) var(--space-4); background: var(--color-bg-surface); border: 2px solid var(--color-border);
  border-radius: var(--radius-full); font-size: var(--text-base); font-weight: 600; font-family: var(--font-cjk-kr);
  color: var(--color-text); cursor: grab; transition: all var(--transition-fast);
}
.ep__word-chip:hover:not(:disabled) { border-color: var(--cc); background: var(--cc-s); }

.ep__skip { margin-top: var(--space-2); }

/* Feedback */
.fb { position: sticky; bottom: 0; display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); padding: var(--space-4) var(--space-5); border-radius: var(--radius-xl) var(--radius-xl) 0 0; margin-top: auto; }
.fb--correct { background: #f0fdf4; border-top: 2px solid var(--color-success); }
.fb--wrong { background: #fef2f2; border-top: 2px solid var(--color-error); }
.fb__info { display: flex; flex-direction: column; gap: var(--space-1); }
.fb__label { font-size: var(--text-base); font-weight: 700; }
.fb--correct .fb__label { color: var(--color-success); }
.fb--wrong .fb__label { color: var(--color-error); }
.fb__answer { font-size: var(--text-sm); color: var(--color-text-secondary); }
.fb__answer strong { font-family: var(--font-cjk-kr); }

.slide-up-enter-active { transition: transform 250ms ease, opacity 250ms ease; }
.slide-up-enter-from { transform: translateY(20px); opacity: 0; }
</style>
