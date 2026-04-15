<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonExerciseStore } from '~/stores/lesson-exercise.store'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'
import { useCourseAudio } from '~/composables/useCourseAudio'
import { LESSON_EXERCISE_TYPE } from '~/composables/data/courses/lesson-types'
import type { TExerciseDifficulty } from '~/composables/data/courses/lesson-types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const { courseKey, language, module, paths } = useCourseContext()
const store = useLessonExerciseStore()
const progressStore = useLessonProgressStore()
const { speak } = useCourseAudio()

const course = computed(() => language.value!)
const lessonId = computed(() => Number(route.params.id))
const lesson = computed(() => module.value?.lessons?.find(l => l.id === lessonId.value))
const difficulty = computed<TExerciseDifficulty>(() => (route.query.difficulty as TExerciseDifficulty) || 'easy')

// ── Local state ──
const answered = ref<null | boolean>(null) // null=unanswered, true=correct, false=wrong (not yet committed)
const committed = ref(false)                // the result has been finalized (can't retry)
const textInput = ref('')
const selectedQcm = ref<number | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const shakeKey = ref(0) // bump to retrigger shake animation on wrong

// REORDER — two zones
const reorderBank = ref<string[]>([])      // available words (top)
const reorderAnswer = ref<string[]>([])    // user's sentence (bottom)

const ex = computed(() => store.currentExercise)

// ── Lifecycle ──
onMounted(async () => {
  if (!lesson.value?.exercises?.length) {
    navigateTo(paths.value.lessons)
    return
  }
  store.start(lessonId.value, lesson.value.exercises!, difficulty.value)
  resetLocalState()
})

// Reset local state whenever a new exercise loads
watch(() => store.session?.currentIndex, () => {
  resetLocalState()
})

// Auto-navigate to results when session finishes
watch(() => store.isFinished, (finished) => {
  if (finished && store.session) {
    // Persist best score + streak
    progressStore.recordExerciseAttempt(courseKey.value, lessonId.value, difficulty.value, {
      scorePercent: store.score.percentage,
      bestStreak: store.bestStreak,
    })
    navigateTo(`${paths.value.lessonExercisesResults(lessonId.value)}?difficulty=${difficulty.value}`)
  }
})

function resetLocalState() {
  answered.value = null
  committed.value = false
  textInput.value = ''
  selectedQcm.value = null

  // init reorder
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
  committed.value = ok  // correct = committed; wrong = can retry
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

// After a wrong answer: reset local state so user can try again
function handleRetry() {
  answered.value = null
  selectedQcm.value = null
  // Keep the text / reorder so user can tweak rather than restart from scratch
  nextTick(() => inputRef.value?.focus())
}

// Give up — commit the false result and proceed
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
  // The watcher above handles navigation when session finishes
}

// Play the correct Korean/Japanese text when user gets it right
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

// Speaker for manual replay
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
      <Transition name="streak-fade">
        <span v-if="store.streak > 1" class="ep__streak">
          🔥 {{ store.streak }}
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

      <!-- REORDER — two zones -->
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
          <span v-if="reorderBank.length === 0" class="ep__zone-empty ep__zone-empty--small">—</span>
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

      <!-- Actions — submit / retry / skip -->
      <div class="ep__actions">
        <!-- Submit button for input-based exercises (shown when not yet answered) -->
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

        <!-- Retry button (shown after wrong but not committed) -->
        <template v-else-if="answered === false && !committed">
          <button class="ep__btn ep__btn--primary" @click="handleRetry">{{ t('lessonPage.retry') }}</button>
          <button class="ep__btn ep__btn--ghost" @click="handleGiveUp">{{ t('lessonPage.showAnswer') }}</button>
        </template>
      </div>
    </div>

    <!-- Feedback bar (shown when an answer is committed) -->
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
        <button class="ep__btn ep__btn--primary ep__btn--sm" @click="handleNext">{{ t('lessons.next') }} →</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ep { display: flex; flex-direction: column; min-height: 100dvh; max-width: 560px; margin: 0 auto; padding: var(--space-4); }

/* ═══ Header ═══ */
.ep__header { display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-6); }
.ep__close {
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: var(--radius-full);
  color: var(--color-text-muted); text-decoration: none;
  transition: background var(--transition-fast); flex-shrink: 0;
}
.ep__close:hover { background: var(--color-bg-muted); }
.ep__progress-wrap { flex: 1; display: flex; flex-direction: column; gap: var(--space-1); }
.ep__progress-bar { height: 8px; background: var(--color-bg-muted); border-radius: var(--radius-full); overflow: hidden; }
.ep__progress-fill { height: 100%; background: var(--cc, var(--color-primary)); border-radius: var(--radius-full); transition: width 300ms ease; }
.ep__progress-label { font-size: var(--text-xs); color: var(--color-text-muted); text-align: right; }
.ep__streak {
  font-size: var(--text-sm); font-weight: 800;
  padding: var(--space-1) var(--space-3);
  background: #fef3c7; color: #92400e;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* ═══ Body ═══ */
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

/* ═══ QCM ═══ */
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

/* ═══ Input ═══ */
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

/* ═══ Reorder ═══ */
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

/* ═══ Actions ═══ */
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

/* ═══ Feedback bar ═══ */
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

/* ═══ Transitions ═══ */
.slide-up-enter-active { transition: transform 250ms ease, opacity 250ms ease; }
.slide-up-enter-from { transform: translateY(30px); opacity: 0; }
.streak-fade-enter-active, .streak-fade-leave-active { transition: all 300ms ease; }
.streak-fade-enter-from, .streak-fade-leave-to { opacity: 0; transform: scale(0.5); }
</style>
