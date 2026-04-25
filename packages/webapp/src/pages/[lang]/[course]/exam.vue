<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonExerciseStore } from '~/stores/lesson-exercise.store'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'
import { useCourseAudio } from '~/composables/useCourseAudio'
import { LESSON_EXERCISE_TYPE } from '~/composables/data/courses/lesson-types'
import type { ILessonExercise } from '~/composables/data/courses/lesson-types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const { courseKey, language, module, paths } = useCourseContext()
const store = useLessonExerciseStore()
const progressStore = useLessonProgressStore()
const { speak } = useCourseAudio()

const course = computed(() => language.value!)
const lessons = computed(() => module.value?.lessons ?? [])

// ── Build exam exercises: 5 from each difficulty (easy, medium, hard) = 15 total ──
function buildExamExercises(): ILessonExercise[] {
  const allExercises = lessons.value.flatMap(l => l.exercises ?? [])
  const byDifficulty = {
    easy: allExercises.filter(e => e.difficulty === 'easy'),
    medium: allExercises.filter(e => e.difficulty === 'medium'),
    hard: allExercises.filter(e => e.difficulty === 'hard'),
  }

  function pickRandom(arr: ILessonExercise[], count: number): ILessonExercise[] {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, count)
  }

  return [
    ...pickRandom(byDifficulty.easy, 5),
    ...pickRandom(byDifficulty.medium, 5),
    ...pickRandom(byDifficulty.hard, 5),
  ]
}

// ── Exam state ──
const examFinished = ref(false)
const examScore = ref(0)
const examPassed = ref(false)

// ── Local exercise state ──
const answered = ref<null | boolean>(null)
const committed = ref(false)
const textInput = ref('')
const selectedQcm = ref<number | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const shakeKey = ref(0)
const reorderBank = ref<string[]>([])
const reorderAnswer = ref<string[]>([])

const ex = computed(() => store.currentExercise)

// ── Lifecycle ──
onMounted(() => {
  // Guard: exam must be unlocked (all lessons completed)
  if (!progressStore.isExamUnlocked(courseKey.value, lessons.value.length)) {
    navigateTo(paths.value.root)
    return
  }

  const examExercises = buildExamExercises()
  if (examExercises.length === 0) {
    navigateTo(paths.value.root)
    return
  }
  // Use 'easy' as placeholder difficulty — the exam mixes all difficulties
  store.start(0, examExercises, 'easy', true)
  resetLocalState()
})

watch(() => store.session?.currentIndex, () => {
  resetLocalState()
})

// When the exam session finishes, calculate score and persist
watch(() => store.isFinished, (finished) => {
  if (finished && store.session) {
    const pct = store.score.percentage
    examScore.value = pct
    examPassed.value = pct >= 70
    examFinished.value = true

    // Record exam attempt (lessonId 0 = exam)
    progressStore.recordAttempt(courseKey.value, 0, pct, examPassed.value)
  }
})

function resetLocalState() {
  answered.value = null
  committed.value = false
  textInput.value = ''
  selectedQcm.value = null

  const current = store.currentExercise
  if (current?.type === LESSON_EXERCISE_TYPE.REORDER && current.correctOrder) {
    const shuffled = [...current.correctOrder]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    reorderBank.value = shuffled
    reorderAnswer.value = []
  }

  nextTick(() => inputRef.value?.focus())
}

// ── REORDER helpers ──
function pickWord(idx: number) {
  if (answered.value !== null) return
  const w = reorderBank.value[idx]
  reorderBank.value = reorderBank.value.filter((_, i) => i !== idx)
  reorderAnswer.value = [...reorderAnswer.value, w]
}
function unpickWord(idx: number) {
  if (answered.value !== null) return
  const w = reorderAnswer.value[idx]
  reorderAnswer.value = reorderAnswer.value.filter((_, i) => i !== idx)
  reorderBank.value = [...reorderBank.value, w]
}

// ── Answer handlers ──
function handleQcm(idx: number) {
  if (answered.value !== null) return
  selectedQcm.value = idx
  const ok = store.answerQcm(idx)
  answered.value = ok
  committed.value = ok
  if (!ok) shakeKey.value++
  else playCorrectAudio()
}

function handleFillBlank() {
  if (answered.value !== null || !textInput.value.trim()) return
  const ok = store.answerFillBlank(textInput.value)
  answered.value = ok
  committed.value = ok
  if (!ok) shakeKey.value++
  else playCorrectAudio()
}

function handleReorder() {
  if (answered.value !== null) return
  const ok = store.answerReorder(reorderAnswer.value)
  answered.value = ok
  committed.value = ok
  if (!ok) shakeKey.value++
  else playCorrectAudio()
}

function handleTranslate() {
  if (answered.value !== null || !textInput.value.trim()) return
  const ok = store.answerTranslate(textInput.value)
  answered.value = ok
  committed.value = ok
  if (!ok) shakeKey.value++
  else playCorrectAudio()
}

function handleRetry() {
  answered.value = null
  selectedQcm.value = null
  nextTick(() => inputRef.value?.focus())
}

function handleGiveUp() {
  if (committed.value) return
  store.skip()
  answered.value = false
  committed.value = true
}

function handleSkip() {
  if (answered.value !== null) return
  store.skip()
  answered.value = false
  committed.value = true
}

function handleNext() {
  store.next()
}

function playCorrectAudio() {
  const e = store.currentExercise
  if (!e) return
  let text = ''
  if (e.type === LESSON_EXERCISE_TYPE.FILL_BLANK && e.answer) {
    text = (e.sentenceTemplate ?? '').replace('___', e.answer)
  } else if (e.type === LESSON_EXERCISE_TYPE.TRANSLATE && e.targetAnswer) {
    text = e.targetAnswer
  } else if (e.type === LESSON_EXERCISE_TYPE.REORDER && e.correctOrder) {
    text = e.correctOrder.join(' ')
  }
  if (text) speak(text)
}

function replayAudio() {
  const e = store.currentExercise
  if (!e) return
  if (e.type === LESSON_EXERCISE_TYPE.FILL_BLANK && e.answer) {
    speak((e.sentenceTemplate ?? '').replace('___', e.answer))
  } else if (e.type === LESSON_EXERCISE_TYPE.TRANSLATE && e.targetAnswer) {
    speak(e.targetAnswer)
  } else if (e.type === LESSON_EXERCISE_TYPE.REORDER && e.correctOrder) {
    speak(e.correctOrder.join(' '))
  }
}

const canHearAudio = computed(() => {
  const e = store.currentExercise
  if (!e) return false
  return (
    (e.type === LESSON_EXERCISE_TYPE.FILL_BLANK && !!e.answer) ||
    (e.type === LESSON_EXERCISE_TYPE.TRANSLATE && !!e.targetAnswer) ||
    (e.type === LESSON_EXERCISE_TYPE.REORDER && !!e.correctOrder)
  )
})

const correctAnswerText = computed(() => {
  const e = store.currentExercise
  if (!e) return ''
  if (e.type === LESSON_EXERCISE_TYPE.FILL_BLANK && e.answer) return e.answer
  if (e.type === LESSON_EXERCISE_TYPE.TRANSLATE && e.targetAnswer) return e.targetAnswer
  if (e.type === LESSON_EXERCISE_TYPE.REORDER && e.correctOrder) return e.correctOrder.join(' ')
  return ''
})

function retakeExam() {
  examFinished.value = false
  const examExercises = buildExamExercises()
  store.start(0, examExercises, 'easy', true)
  resetLocalState()
}

function backToLevel() {
  navigateTo(paths.value.root)
}
</script>

<template>
  <!-- ═══ Results screen ═══ -->
  <div v-if="examFinished" class="exam-results page-container" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle }">
    <div class="exam-results__hero">
      <!-- Trophy / X icon -->
      <div class="exam-results__icon-wrap" :class="examPassed ? 'exam-results__icon-wrap--pass' : 'exam-results__icon-wrap--fail'">
        <svg v-if="examPassed" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
        </svg>
        <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      </div>
      <h1>{{ examPassed ? t('levels.examPassed') : t('levels.examFailed') }}</h1>
      <p class="exam-results__badge">{{ t('levels.finalExam') }}</p>
    </div>

    <div class="exam-results__scores">
      <div class="exam-sc">
        <span class="exam-sc__value">{{ store.score.correct }}/{{ store.score.total }}</span>
        <span class="exam-sc__label">{{ t('lessons.yourScore') }}</span>
        <div class="exam-sc__bar">
          <div
            class="exam-sc__fill"
            :class="examPassed ? 'exam-sc__fill--pass' : 'exam-sc__fill--fail'"
            :style="{ width: `${examScore}%` }"
          />
        </div>
        <span class="exam-sc__pct">{{ t('levels.examScore', { n: examScore }) }}</span>
      </div>
      <div class="exam-sc exam-sc--streak">
        <span class="exam-sc__value exam-sc__value--streak">{{ store.bestStreak }}</span>
        <span class="exam-sc__label">{{ t('training.bestStreak') }}</span>
      </div>
    </div>

    <p v-if="!examPassed" class="exam-results__threshold">{{ t('levels.examPassThreshold') }}</p>

    <!-- Review grid -->
    <div class="exam-results__review">
      <h3>{{ t('lessonPage.reviewAll') }}</h3>
      <div class="exam-results__grid">
        <div
          v-for="(result, i) in store.session?.results" :key="i"
          class="exam-ri" :class="result.correct ? 'exam-ri--correct' : 'exam-ri--wrong'"
        >
          <span class="exam-ri__num">{{ i + 1 }}</span>
          <span class="exam-ri__icon">
            <svg v-if="result.correct" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </span>
        </div>
      </div>
    </div>

    <div class="exam-results__actions">
      <button v-if="!examPassed" class="exam-btn exam-btn--primary" @click="retakeExam">
        {{ t('levels.retakeExam') }}
      </button>
      <button class="exam-btn" :class="examPassed ? 'exam-btn--primary' : 'exam-btn--ghost'" @click="backToLevel">
        <template v-if="examPassed">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {{ t('lessonPage.backToLesson') }}
        </template>
        <template v-else>{{ t('lessonPage.backToLesson') }}</template>
      </button>
    </div>
  </div>

  <!-- ═══ Exercise screen ═══ -->
  <div v-else-if="store.session && ex" class="ep" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle }">
    <!-- Header -->
    <header class="ep__header">
      <NuxtLink :to="paths.root" class="ep__close" aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </NuxtLink>
      <div class="ep__progress-wrap">
        <div class="ep__exam-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
          <span>{{ t('levels.finalExam') }}</span>
        </div>
        <div class="ep__progress-bar"><div class="ep__progress-fill ep__progress-fill--exam" :style="{ width: `${store.progress.percentage}%` }" /></div>
        <span class="ep__progress-label">{{ t('lessons.questionOf', { current: store.progress.current, total: store.progress.total }) }}</span>
      </div>
      <Transition name="streak-fade">
        <span v-if="store.streak > 1" class="ep__streak">
          {{ store.streak }}
        </span>
      </Transition>
    </header>

    <div class="ep__body" :key="shakeKey" :class="{ 'ep__body--shake': answered === false && !committed }">
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
              'ep__opt--correct': answered === true && selectedQcm === i,
              'ep__opt--wrong': answered === false && selectedQcm === i,
              'ep__opt--reveal': committed && opt.correct,
            }"
            :disabled="answered !== null"
            @click="handleQcm(i)"
          >{{ t(opt.labelKey) }}</button>
        </div>
      </template>

      <!-- FILL BLANK -->
      <template v-if="ex.type === LESSON_EXERCISE_TYPE.FILL_BLANK">
        <p class="ep__instruction">{{ t('lessonPage.fillBlank') }}</p>
        <p class="ep__sentence-template" :class="{ 'ep__sentence-template--reveal': committed && !answered }">
          {{ committed && !answered ? ex.sentenceTemplate?.replace('___', ex.answer ?? '___') : ex.sentenceTemplate }}
        </p>
        <div class="ep__input-row">
          <input
            ref="inputRef"
            v-model="textInput"
            class="ep__input"
            :class="{ 'ep__input--correct': answered === true, 'ep__input--wrong': answered === false }"
            :disabled="answered === true || committed"
            :placeholder="t('lessonPage.typeAnswer')"
            @keydown.enter="handleFillBlank"
          />
        </div>
      </template>

      <!-- REORDER -->
      <template v-if="ex.type === LESSON_EXERCISE_TYPE.REORDER">
        <p class="ep__instruction">{{ t('lessonPage.reorderWords') }}</p>
        <p v-if="ex.sourceKey" class="ep__source">{{ t(ex.sourceKey) }}</p>

        <div class="ep__zone ep__zone--answer" :class="{
          'ep__zone--correct': answered === true,
          'ep__zone--wrong': answered === false,
        }">
          <span v-if="reorderAnswer.length === 0" class="ep__zone-empty">{{ t('lessonPage.yourAnswer') }}</span>
          <button
            v-for="(word, i) in reorderAnswer"
            :key="`a-${word}-${i}`"
            class="ep__word-chip ep__word-chip--answer"
            :disabled="answered === true"
            @click="unpickWord(i)"
          >{{ word }}</button>
        </div>

        <div class="ep__zone ep__zone--bank">
          <button
            v-for="(word, i) in reorderBank"
            :key="`b-${word}-${i}`"
            class="ep__word-chip ep__word-chip--bank"
            :disabled="answered === true"
            @click="pickWord(i)"
          >{{ word }}</button>
          <span v-if="reorderBank.length === 0" class="ep__zone-empty ep__zone-empty--small">--</span>
        </div>
      </template>

      <!-- TRANSLATE -->
      <template v-if="ex.type === LESSON_EXERCISE_TYPE.TRANSLATE">
        <p class="ep__instruction">{{ t('lessonPage.translateSentence') }}</p>
        <p class="ep__source">{{ t(ex.sourceKey!) }}</p>
        <div class="ep__input-row">
          <input
            ref="inputRef"
            v-model="textInput"
            class="ep__input"
            :class="{ 'ep__input--correct': answered === true, 'ep__input--wrong': answered === false }"
            :disabled="answered === true || committed"
            :placeholder="t('lessonPage.typeAnswer')"
            @keydown.enter="handleTranslate"
          />
        </div>
      </template>

      <!-- Actions -->
      <div class="ep__actions">
        <template v-if="answered === null">
          <button
            v-if="ex.type === LESSON_EXERCISE_TYPE.FILL_BLANK"
            class="ep__btn ep__btn--primary"
            :disabled="!textInput.trim()"
            @click="handleFillBlank"
          >{{ t('lessonPage.check') }}</button>
          <button
            v-else-if="ex.type === LESSON_EXERCISE_TYPE.TRANSLATE"
            class="ep__btn ep__btn--primary"
            :disabled="!textInput.trim()"
            @click="handleTranslate"
          >{{ t('lessonPage.check') }}</button>
          <button
            v-else-if="ex.type === LESSON_EXERCISE_TYPE.REORDER"
            class="ep__btn ep__btn--primary"
            :disabled="reorderAnswer.length === 0"
            @click="handleReorder"
          >{{ t('lessonPage.check') }}</button>

          <button class="ep__btn ep__btn--ghost" @click="handleSkip">{{ t('lessons.iDontKnow') }}</button>
        </template>

        <template v-else-if="answered === false && !committed">
          <button class="ep__btn ep__btn--primary" @click="handleRetry">{{ t('lessonPage.retry') }}</button>
          <button class="ep__btn ep__btn--ghost" @click="handleGiveUp">{{ t('lessonPage.showAnswer') }}</button>
        </template>
      </div>
    </div>

    <!-- Feedback bar -->
    <Transition name="slide-up">
      <div v-if="committed" class="fb" :class="answered ? 'fb--correct' : 'fb--wrong'">
        <div class="fb__info">
          <div class="fb__label-row">
            <span class="fb__label">{{ answered ? t('lessons.correct') : t('lessons.incorrect') }}</span>
            <button v-if="canHearAudio" class="fb__audio" aria-label="Replay audio" @click="replayAudio">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            </button>
          </div>
          <span v-if="!answered && correctAnswerText" class="fb__answer">
            {{ t('lessons.correctAnswer') }} <strong>{{ correctAnswerText }}</strong>
          </span>
        </div>
        <button class="ep__btn ep__btn--primary ep__btn--sm" @click="handleNext">{{ t('lessons.next') }} &rarr;</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* ═══ Exercise page (reuses the same patterns as lesson exercises) ═══ */
.ep { display: flex; flex-direction: column; min-height: 100dvh; max-width: 560px; margin: 0 auto; padding: var(--space-4); }

/* Header */
.ep__header { display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-6); }
.ep__close {
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: var(--radius-full);
  color: var(--color-text-muted); text-decoration: none;
  transition: background var(--transition-fast); flex-shrink: 0;
}
.ep__close:hover { background: var(--color-bg-muted); }
.ep__progress-wrap { flex: 1; display: flex; flex-direction: column; gap: var(--space-1); }
.ep__exam-label {
  display: flex; align-items: center; gap: var(--space-1);
  font-size: var(--text-xs); font-weight: 700; color: #d97706;
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: var(--space-1);
}
.ep__progress-bar { height: 8px; background: var(--color-bg-muted); border-radius: var(--radius-full); overflow: hidden; }
.ep__progress-fill { height: 100%; background: var(--cc, var(--color-primary)); border-radius: var(--radius-full); transition: width 300ms ease; }
.ep__progress-fill--exam { background: linear-gradient(90deg, #d97706, #f59e0b); }
.ep__progress-label { font-size: var(--text-xs); color: var(--color-text-muted); text-align: right; }
.ep__streak {
  font-size: var(--text-sm); font-weight: 800;
  padding: var(--space-1) var(--space-3);
  background: #fef3c7; color: #92400e;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Body */
.ep__body { flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--space-5); }
.ep__body--shake { animation: shake 400ms ease; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.ep__instruction { font-size: var(--text-sm); color: var(--color-text-muted); text-align: center; margin: 0; }
.ep__question { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); text-align: center; margin: 0; }
.ep__sentence-template {
  font-size: var(--text-2xl); font-weight: 700; color: var(--color-text);
  font-family: var(--font-cjk-kr); text-align: center;
  padding: var(--space-5) var(--space-6);
  background: var(--color-bg-muted); border-radius: var(--radius-2xl);
  width: 100%; margin: 0; letter-spacing: -0.01em;
}
.ep__sentence-template--reveal { background: #fef2f2; color: #7f1d1d; }
.ep__source {
  font-size: var(--text-lg); font-weight: 600; color: var(--color-text);
  text-align: center; padding: var(--space-4) var(--space-5);
  background: var(--color-bg-muted); border-radius: var(--radius-xl);
  width: 100%; margin: 0;
}

/* QCM */
.ep__options { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); width: 100%; }
.ep__opt {
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface); border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  font-size: var(--text-base); font-weight: 600; color: var(--color-text);
  font-family: var(--font-cjk-kr);
  cursor: pointer; transition: all var(--transition-fast); text-align: center;
  min-height: 64px;
}
.ep__opt:hover:not(:disabled) { border-color: var(--cc, var(--color-primary)); transform: translateY(-2px); }
.ep__opt--correct { border-color: var(--color-success); background: #f0fdf4; color: #166534; animation: bounce 400ms ease; }
.ep__opt--wrong { border-color: var(--color-error); background: #fef2f2; color: #991b1b; }
.ep__opt--reveal { border-color: var(--color-success); background: #f0fdf4; color: #166534; }
.ep__opt:disabled { cursor: default; transform: none; }
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Input */
.ep__input-row { display: flex; gap: var(--space-3); width: 100%; }
.ep__input {
  flex: 1; padding: var(--space-4) var(--space-5);
  border: 2px solid var(--color-border); border-radius: var(--radius-xl);
  font-size: var(--text-lg); font-family: var(--font-cjk-kr);
  background: var(--color-bg-surface); color: var(--color-text); outline: none;
  transition: all var(--transition-fast);
}
.ep__input:focus { border-color: var(--cc, var(--color-primary)); }
.ep__input--correct { border-color: var(--color-success); background: #f0fdf4; }
.ep__input--wrong { border-color: var(--color-error); background: #fef2f2; }

/* Reorder */
.ep__zone {
  width: 100%; min-height: 80px;
  display: flex; flex-wrap: wrap; gap: var(--space-2);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  transition: all var(--transition-fast);
}
.ep__zone--answer {
  background: var(--color-bg-surface);
  border: 2px dashed var(--color-border);
}
.ep__zone--bank {
  background: var(--color-bg-muted);
  border: 2px solid transparent;
}
.ep__zone--correct { border-color: var(--color-success); background: #f0fdf4; border-style: solid; }
.ep__zone--wrong { border-color: var(--color-error); background: #fef2f2; border-style: solid; }
.ep__zone-empty {
  width: 100%; text-align: center;
  font-size: var(--text-sm); color: var(--color-text-muted); font-style: italic;
  padding: var(--space-3);
}
.ep__zone-empty--small { font-size: var(--text-xs); padding: var(--space-2); }

.ep__word-chip {
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-surface); border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-base); font-weight: 600; font-family: var(--font-cjk-kr);
  color: var(--color-text); cursor: pointer;
  transition: all var(--transition-fast);
}
.ep__word-chip--bank:hover:not(:disabled) { border-color: var(--cc); background: var(--cc-s); transform: translateY(-2px); }
.ep__word-chip--answer { border-color: var(--cc, var(--color-primary)); background: var(--cc-s, var(--color-primary-subtle)); color: var(--cc, var(--color-primary)); }
.ep__word-chip:disabled { cursor: default; }

/* Actions */
.ep__actions { display: flex; flex-direction: column; gap: var(--space-2); width: 100%; margin-top: auto; padding-top: var(--space-4); }
.ep__btn {
  padding: var(--space-4) var(--space-6);
  border: none; border-radius: var(--radius-xl);
  font-size: var(--text-base); font-weight: 700;
  cursor: pointer; transition: all var(--transition-fast);
  text-align: center;
}
.ep__btn--primary { background: var(--cc, var(--color-primary)); color: #fff; }
.ep__btn--primary:not(:disabled):hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.ep__btn--primary:disabled { opacity: 0.4; cursor: not-allowed; }
.ep__btn--ghost { background: transparent; color: var(--color-text-muted); }
.ep__btn--ghost:hover { background: var(--color-bg-muted); color: var(--color-text); }
.ep__btn--sm { padding: var(--space-2) var(--space-5); font-size: var(--text-sm); }

/* Feedback bar */
.fb {
  position: sticky; bottom: 0; display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-4); padding: var(--space-5) var(--space-6);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  margin-top: var(--space-4); margin-left: calc(-1 * var(--space-4)); margin-right: calc(-1 * var(--space-4));
}
.fb--correct { background: #f0fdf4; border-top: 3px solid var(--color-success); }
.fb--wrong { background: #fef2f2; border-top: 3px solid var(--color-error); }
.fb__info { display: flex; flex-direction: column; gap: var(--space-1); flex: 1; }
.fb__label-row { display: flex; align-items: center; gap: var(--space-2); }
.fb__label { font-size: var(--text-base); font-weight: 800; }
.fb--correct .fb__label { color: var(--color-success); }
.fb--wrong .fb__label { color: var(--color-error); }
.fb__answer { font-size: var(--text-sm); color: var(--color-text-secondary); }
.fb__answer strong { font-family: var(--font-cjk-kr); }
.fb__audio {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: var(--radius-full);
  background: rgba(0,0,0,0.05); border: none; cursor: pointer;
  transition: background var(--transition-fast);
}
.fb__audio:hover { background: rgba(0,0,0,0.1); }

/* Transitions */
.slide-up-enter-active { transition: transform 250ms ease, opacity 250ms ease; }
.slide-up-enter-from { transform: translateY(30px); opacity: 0; }
.streak-fade-enter-active, .streak-fade-leave-active { transition: all 300ms ease; }
.streak-fade-enter-from, .streak-fade-leave-to { opacity: 0; transform: scale(0.5); }

/* ═══ Results page ═══ */
.exam-results {
  display: flex; flex-direction: column; gap: var(--space-8);
  padding-top: var(--space-10); padding-bottom: var(--space-10);
  max-width: 560px; margin: 0 auto;
  padding-left: var(--space-6); padding-right: var(--space-6);
}

.exam-results__hero {
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: var(--space-3);
}

.exam-results__icon-wrap {
  width: 88px; height: 88px;
  border-radius: var(--radius-full);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-2);
}

.exam-results__icon-wrap--pass {
  background: #fef3c7;
  color: #d97706;
  box-shadow: 0 0 40px rgba(217, 119, 6, 0.25);
}

.exam-results__icon-wrap--fail {
  background: #fef2f2;
  color: #ef4444;
}

.exam-results__hero h1 {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-text);
  margin: 0;
  letter-spacing: -0.02em;
}

.exam-results__badge {
  display: inline-block;
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  color: #d97706;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 2px var(--space-3);
  background: #fef3c7;
  border-radius: var(--radius-full);
}

/* Score cards */
.exam-results__scores {
  display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-3);
}

.exam-sc {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
  padding: var(--space-6); background: var(--color-bg-surface);
  border: 1px solid var(--color-border); border-radius: var(--radius-2xl);
  text-align: center;
}

.exam-sc__value {
  font-size: var(--text-3xl); font-weight: 800; color: #d97706;
}

.exam-sc__value--streak {
  color: #d97706;
}

.exam-sc__label {
  font-size: var(--text-xs); color: var(--color-text-muted);
  text-transform: uppercase; letter-spacing: 0.05em;
}

.exam-sc__bar {
  width: 100%; height: 8px;
  background: var(--color-bg-muted);
  border-radius: var(--radius-full); overflow: hidden;
}

.exam-sc__fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 600ms ease;
}

.exam-sc__fill--pass {
  background: linear-gradient(90deg, #d97706, #f59e0b);
}

.exam-sc__fill--fail {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.exam-sc__pct {
  font-size: var(--text-sm); font-weight: 700; color: var(--color-text-secondary);
}

.exam-sc--streak .exam-sc__value {
  color: #d97706;
}

.exam-results__threshold {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
  padding: var(--space-3) var(--space-5);
  background: #fef2f2;
  border-radius: var(--radius-lg);
  border: 1px solid #fecaca;
}

/* Review grid */
.exam-results__review h3 {
  font-size: var(--text-base); font-weight: 700; color: var(--color-text);
  margin: 0 0 var(--space-3);
}

.exam-results__grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(56px, 1fr)); gap: var(--space-2);
}

.exam-ri {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: var(--space-2);
  border-radius: var(--radius-lg);
}

.exam-ri--correct { background: #f0fdf4; color: #166534; }
.exam-ri--wrong { background: #fef2f2; color: #991b1b; }
.exam-ri__num { font-size: var(--text-xs); opacity: 0.6; font-weight: 600; }
.exam-ri__icon { display: flex; align-items: center; }

/* Actions */
.exam-results__actions {
  display: flex; flex-direction: column; gap: var(--space-3);
}

.exam-btn {
  padding: var(--space-4) var(--space-6);
  border: none; border-radius: var(--radius-xl);
  font-size: var(--text-base); font-weight: 700;
  cursor: pointer; transition: all var(--transition-fast);
  text-align: center; text-decoration: none;
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
}

.exam-btn--primary {
  background: #d97706; color: #fff;
}

.exam-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.3);
}

.exam-btn--ghost {
  background: transparent; color: var(--color-text-muted);
}

.exam-btn--ghost:hover {
  background: var(--color-bg-muted); color: var(--color-text);
}
</style>
