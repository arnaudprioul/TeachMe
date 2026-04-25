<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonExerciseStore } from '~/stores/lesson-exercise.store'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'
import { useCourseAudio } from '~/composables/useCourseAudio'
import { useSpeechRecognition } from '~/composables/useSpeechRecognition'
import { LESSON_EXERCISE_TYPE } from '~/composables/data/courses/lesson-types'
import type { TExerciseDifficulty } from '~/composables/data/courses/lesson-types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t: $t, locale } = useI18n()
// Resolve i18n keys OR raw strings (prefixed with __raw:)
function t(key: string): string {
  return key.startsWith('__raw:') ? key.slice(6) : $t(key)
}
const route = useRoute()
const { courseKey, language, module, paths } = useCourseContext()
const store = useLessonExerciseStore()
const progressStore = useLessonProgressStore()
const { speak } = useCourseAudio()
const speechRecognition = useSpeechRecognition()

// User's UI language code for TTS (en, fr, etc.)
const userLang = computed(() => locale.value.split('-')[0])

// SPEAK exercise state
const speakResult = ref<'idle' | 'listening' | 'success' | 'fail'>('idle')
const speakTranscript = ref('')
const speakFallbackMode = ref(false) // text input fallback when speech not supported

const course = computed(() => language.value!)
const lessonId = computed(() => Number(route.params.id))
const lesson = computed(() => module.value?.lessons?.find(l => l.id === lessonId.value))
const difficulty = computed<TExerciseDifficulty>(() => (route.query.difficulty as TExerciseDifficulty) || 'easy')

// ── Local state ──
const answered = ref<null | boolean>(null) // null=unanswered, true=correct, false=wrong
const committed = ref(false)
const skipped = ref(false)                 // true when user clicked "I don't know"
const textInput = ref('')
const isComposing = ref(false) // IME composition in progress (Japanese/Korean input)
const selectedQcm = ref<number | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const shakeKey = ref(0) // bump to retrigger shake animation on wrong

// REORDER — two zones
const reorderBank = ref<string[]>([])      // available words (top)
const reorderAnswer = ref<string[]>([])    // user's sentence (bottom)

const ex = computed(() => store.currentExercise)

// ── Lifecycle ──
// Wait for module to be available before starting
let stopWatch: (() => void) | null = null
stopWatch = watch(
  () => lesson.value,
  (l) => {
    if (l === undefined) return // module not loaded yet
    if (!l?.exercises?.length) {
      navigateTo(paths.value.lesson(lessonId.value))
      return
    }
    store.start(lessonId.value, l.exercises!, difficulty.value, false, l.words)
    resetLocalState()
    nextTick(() => stopWatch?.())
  },
  { immediate: true },
)

// Reset local state whenever a new exercise loads
watch(() => store.session?.currentIndex, () => {
  resetLocalState()
})

// Auto-navigate to lesson page with results sidebar when session finishes
watch(() => store.isFinished, (finished) => {
  if (finished && store.session) {
    // Persist best score + streak
    progressStore.recordExerciseAttempt(courseKey.value, lessonId.value, difficulty.value, {
      scorePercent: store.score.percentage,
      bestStreak: store.bestStreak,
    })
    navigateTo({
      path: paths.value.lesson(lessonId.value),
      query: { showResults: difficulty.value },
    })
  }
})

const isLastExercise = computed(() => store.progress.current === store.progress.total)

function resetLocalState() {
  answered.value = null
  committed.value = false
  skipped.value = false
  textInput.value = ''
  selectedQcm.value = null

  // SPEAK reset
  speakResult.value = 'idle'
  speakTranscript.value = ''
  speakFallbackMode.value = false

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

// ── Answer handlers — wrong or right, always commit and show Next ──
function handleQcm(idx: number) {
  if (answered.value !== null) return
  selectedQcm.value = idx
  const ok = store.answerQcm(idx)
  answered.value = ok
  committed.value = true
  if (!ok) shakeKey.value++
  playAnswerAudio()
}

function handleFillBlank() {
  if (answered.value !== null || !textInput.value.trim()) return
  const ok = store.answerFillBlank(textInput.value)
  answered.value = ok
  committed.value = true
  if (!ok) shakeKey.value++
  playAnswerAudio()
}

function handleReorder() {
  if (answered.value !== null) return
  const ok = store.answerReorder(reorderAnswer.value)
  answered.value = ok
  committed.value = true
  if (!ok) shakeKey.value++
  playAnswerAudio()
}

function handleTranslate() {
  if (answered.value !== null || !textInput.value.trim()) return
  const ok = store.answerTranslate(textInput.value)
  answered.value = ok
  committed.value = true
  if (!ok) shakeKey.value++
  playAnswerAudio()
}

// ── Mic for text-input exercises (FILL_BLANK, TRANSLATE) ──
const inputMicListening = ref(false)

function startInputMic() {
  if (answered.value !== null || !speechRecognition.isSupported.value) return
  inputMicListening.value = true
  speechRecognition.transcript.value = ''
  speechRecognition.error.value = null
  const ttsLang = module.value?.config.ttsLang ?? 'ko-KR'
  speechRecognition.start(ttsLang)
}

// Watch transcript for input mic — fill the text input
watch(() => speechRecognition.transcript.value, (val) => {
  if (!val || !inputMicListening.value) return
  textInput.value = val
  inputMicListening.value = false
})

watch(() => speechRecognition.isListening.value, (v) => {
  if (!v && inputMicListening.value) inputMicListening.value = false
})

function handleSpeakStart() {
  if (answered.value !== null) return
  if (!speechRecognition.isSupported.value) {
    speakFallbackMode.value = true
    return
  }
  speakResult.value = 'listening'
  speakTranscript.value = ''
  speechRecognition.transcript.value = ''
  speechRecognition.error.value = null
  const ttsLang = module.value?.config.ttsLang ?? 'ko-KR'
  speechRecognition.start(ttsLang)
}

function handleSpeakStop() {
  speechRecognition.stop()
}

// Watch speech recognition for results
watch(() => speechRecognition.transcript.value, (val) => {
  if (!val || answered.value !== null) return
  speakTranscript.value = val
  const ok = store.answerSpeak(val)
  answered.value = ok
  committed.value = true
  speakResult.value = ok ? 'success' : 'fail'
  if (!ok) shakeKey.value++
  playAnswerAudio()
})

watch(() => speechRecognition.error.value, (err) => {
  if (!err) return
  if (err === 'not-allowed') {
    speakResult.value = 'idle'
  } else if (err === 'no-speech') {
    speakResult.value = 'idle'
  } else {
    speakResult.value = 'idle'
  }
})

watch(() => speechRecognition.isListening.value, (listening) => {
  // When listening stops without a transcript and without an error, reset to idle
  if (!listening && speakResult.value === 'listening' && !speakTranscript.value) {
    speakResult.value = 'idle'
  }
})

function handleSpeakFallback() {
  if (answered.value !== null || !textInput.value.trim()) return
  const ok = store.answerSpeak(textInput.value)
  speakTranscript.value = textInput.value
  answered.value = ok
  committed.value = true
  speakResult.value = ok ? 'success' : 'fail'
  if (!ok) shakeKey.value++
  playAnswerAudio()
}

function handleSkip() {
  if (answered.value !== null) return
  store.skip()
  answered.value = false
  committed.value = true
  skipped.value = true
  playAnswerAudio()
}

function handleNext() {
  store.next()
  // The watcher above handles navigation when session finishes
}

/**
 * Play audio for the correct answer on EVERY committed answer (correct or wrong).
 * This lets the user hear the right pronunciation regardless of their answer.
 */
function playAnswerAudio() {
  const e = store.currentExercise
  if (!e) return
  let text = ''
  let lang: string | undefined // undefined = course lang (ko/ja), string = override

  if (e.type === LESSON_EXERCISE_TYPE.QCM && e.options) {
    const correctOpt = e.options.find(o => o.correct)
    if (correctOpt) {
      text = t(correctOpt.labelKey)
      // Dynamic QCM type 0 "What does X mean?" → answer is a translation → user lang
      // Dynamic QCM type 2 "Which word means X?" → answer is target word → course lang
      // Static QCM (i18n key) → answer is in target language → course lang
      if (correctOpt.labelKey.startsWith('__raw:')) {
        // Check if the text looks like a translation (ASCII/latin) vs target language
        const isLatin = /^[\x00-\x7F\u00C0-\u024F\s]+$/.test(text)
        if (isLatin) lang = userLang.value
        // else: course lang (default)
      }
      // Static QCM options are in target language → course lang (default)
    }
  } else if (e.type === LESSON_EXERCISE_TYPE.FILL_BLANK && e.answer) {
    // Hard difficulty: no auto audio for FILL_BLANK
    if (difficulty.value === 'hard') return
    // Easy + Medium: play the complete word in course lang
    text = (e.sentenceTemplate ?? '').replace('___', e.answer)
  } else if (e.type === LESSON_EXERCISE_TYPE.TRANSLATE && e.targetAnswer) {
    // Target answer is in target language → course lang
    text = e.targetAnswer
  } else if (e.type === LESSON_EXERCISE_TYPE.REORDER && e.correctOrder) {
    // Reordered sentence in target language → course lang
    text = e.correctOrder.join(' ')
  } else if (e.type === LESSON_EXERCISE_TYPE.SPEAK && e.speakText) {
    text = e.speakText
  }

  if (text) speak(text, lang)
}

// Speaker for manual replay
function replayAudio() {
  playAnswerAudio()
}

const canHearAudio = computed(() => {
  const e = store.currentExercise
  if (!e) return false
  return (
    (e.type === LESSON_EXERCISE_TYPE.QCM && !!e.options?.some(o => o.correct)) ||
    (e.type === LESSON_EXERCISE_TYPE.FILL_BLANK && !!e.answer) ||
    (e.type === LESSON_EXERCISE_TYPE.TRANSLATE && !!e.targetAnswer) ||
    (e.type === LESSON_EXERCISE_TYPE.REORDER && !!e.correctOrder) ||
    (e.type === LESSON_EXERCISE_TYPE.SPEAK && !!e.speakText)
  )
})

/** Extract katakana words from text and return them with romanization hints */
const properNameHints = computed(() => {
  const e = store.currentExercise
  if (!e) return ''
  // Get the target text that the user needs to type
  let target = ''
  if (e.type === LESSON_EXERCISE_TYPE.TRANSLATE && e.targetAnswer) target = e.targetAnswer
  else if (e.type === LESSON_EXERCISE_TYPE.FILL_BLANK && e.sentenceTemplate) target = e.sentenceTemplate.replace('___', e.answer ?? '')

  // Find katakana sequences (proper nouns: マイク, アメリカ, etc.)
  const katakanaMatches = target.match(/[\u30A0-\u30FF]{2,}/g)
  if (!katakanaMatches || katakanaMatches.length === 0) return ''

  // Look up romanization from vocabulary
  const words = store.session?.words ?? []
  const hints: string[] = []
  for (const kata of katakanaMatches) {
    const w = words.find(v => v.word.includes(kata))
    if (w) hints.push(`${kata} = ${w.romanization}`)
    else hints.push(kata) // show katakana at least
  }
  return hints.join(' · ')
})

const correctAnswerText = computed(() => {
  const e = store.currentExercise
  if (!e) return ''
  if (e.type === LESSON_EXERCISE_TYPE.QCM && e.options) {
    const correctOpt = e.options.find(o => o.correct)
    if (correctOpt) {
      const label = correctOpt.labelKey
      return label.startsWith('__raw:') ? label.slice(6) : t(label)
    }
  }
  if (e.type === LESSON_EXERCISE_TYPE.FILL_BLANK && e.answer) return e.answer
  if (e.type === LESSON_EXERCISE_TYPE.TRANSLATE && e.targetAnswer) return e.targetAnswer
  if (e.type === LESSON_EXERCISE_TYPE.REORDER && e.correctOrder) return e.correctOrder.join(' ')
  if (e.type === LESSON_EXERCISE_TYPE.SPEAK && e.speakText) return `${e.speakText} (${e.speakRomanization ?? ''})`
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
        <p v-if="ex.sourceKey" class="ep__hint">{{ t(ex.sourceKey) }}</p>
        <p v-if="properNameHints && !committed" class="ep__name-hint">{{ properNameHints }}</p>
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
            @compositionstart="isComposing = true"
            @compositionend="isComposing = false"
            @keydown.enter="!isComposing && handleFillBlank()"
          />
          <button
            v-if="speechRecognition.isSupported.value && answered === null"
            class="ep__input-mic"
            :class="{ 'ep__input-mic--active': inputMicListening }"
            @click="startInputMic"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </button>
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
        <p v-if="properNameHints && !committed" class="ep__name-hint">{{ properNameHints }}</p>
        <div class="ep__input-row">
          <input
            ref="inputRef"
            v-model="textInput"
            class="ep__input"
            :class="{ 'ep__input--correct': answered === true, 'ep__input--wrong': answered === false }"
            :disabled="answered === true || committed"
            :placeholder="t('lessonPage.typeAnswer')"
            @compositionstart="isComposing = true"
            @compositionend="isComposing = false"
            @keydown.enter="!isComposing && handleTranslate()"
          />
          <button
            v-if="speechRecognition.isSupported.value && answered === null"
            class="ep__input-mic"
            :class="{ 'ep__input-mic--active': inputMicListening }"
            @click="startInputMic"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </button>
        </div>
      </template>

      <!-- SPEAK -->
      <template v-if="ex.type === LESSON_EXERCISE_TYPE.SPEAK">
        <p class="ep__instruction">{{ t('lessonPage.speakInstruction') }}</p>
        <p v-if="ex.sourceKey" class="ep__hint">{{ t(ex.sourceKey) }}</p>
        <p class="ep__speak-text">{{ ex.speakText }}</p>
        <p class="ep__speak-romanization">{{ ex.speakRomanization }}</p>

        <!-- Not supported banner -->
        <p v-if="!speechRecognition.isSupported.value && !speakFallbackMode" class="ep__speak-unsupported">
          {{ t('lessonPage.speechNotSupported') }}
        </p>

        <!-- Mic permission denied -->
        <p v-if="speechRecognition.error.value === 'not-allowed'" class="ep__speak-error">
          {{ t('lessonPage.micPermissionDenied') }}
        </p>

        <!-- No speech detected -->
        <p v-if="speechRecognition.error.value === 'no-speech'" class="ep__speak-error">
          {{ t('lessonPage.noSpeechDetected') }}
        </p>

        <!-- Microphone button -->
        <div v-if="!speakFallbackMode && answered === null" class="ep__mic-wrap">
          <button
            class="ep__mic-btn"
            :class="{
              'ep__mic-btn--listening': speakResult === 'listening',
            }"
            :disabled="answered !== null"
            :aria-label="speakResult === 'listening' ? t('lessonPage.listening') : t('lessonPage.tapToSpeak')"
            @click="speakResult === 'listening' ? handleSpeakStop() : handleSpeakStart()"
          >
            <svg v-if="speakResult !== 'listening'" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="1" width="6" height="12" rx="3" />
              <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
              <line x1="12" y1="18" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
            <svg v-else width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="3" />
            </svg>
          </button>
          <span class="ep__mic-label">
            {{ speakResult === 'listening' ? t('lessonPage.listening') : t('lessonPage.tapToSpeak') }}
          </span>
          <span v-if="speakResult === 'idle' && !speechRecognition.error.value" class="ep__speak-hint">{{ t('lessonPage.speakHint') }}</span>
        </div>

        <!-- Transcript display -->
        <div v-if="speakTranscript && committed" class="ep__speak-transcript" :class="{ 'ep__speak-transcript--correct': answered === true, 'ep__speak-transcript--wrong': answered === false }">
          <span class="ep__speak-transcript-label">{{ t('lessonPage.youSaid') }}</span>
          <span class="ep__speak-transcript-text">{{ speakTranscript }}</span>
        </div>

        <!-- Fallback text input (when speech not supported) -->
        <div v-if="speakFallbackMode && answered === null" class="ep__input-row">
          <input
            ref="inputRef"
            v-model="textInput"
            class="ep__input"
            :placeholder="t('lessonPage.typeAnswer')"
            @compositionstart="isComposing = true"
            @compositionend="isComposing = false"
            @keydown.enter="!isComposing && handleSpeakFallback()"
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
          <button
            v-else-if="ex.type === LESSON_EXERCISE_TYPE.SPEAK && speakFallbackMode"
            class="ep__btn ep__btn--primary"
            :disabled="!textInput.trim()"
            @click="handleSpeakFallback"
          >{{ t('lessonPage.check') }}</button>

          <button class="ep__btn ep__btn--skip" @click="handleSkip">{{ t('lessons.iDontKnow') }}</button>
        </template>
      </div>
    </div>

    <!-- Feedback bar (shown when an answer is committed) -->
    <Transition name="slide-up">
      <div v-if="committed" class="fb" :class="answered ? 'fb--correct' : skipped ? 'fb--skipped' : 'fb--wrong'">
        <div class="fb__info">
          <div class="fb__label-row">
            <span class="fb__label">{{ answered ? t('lessons.correct') : skipped ? t('lessons.iDontKnow') : t('lessons.incorrect') }}</span>
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
        <button class="ep__btn ep__btn--primary ep__btn--sm" @click="handleNext">{{ isLastExercise ? t('lessonPage.finish') : t('lessons.next') + ' \u2192' }}</button>
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
.ep__skip-btn {
  flex-shrink: 0;
  padding: var(--space-1-5) var(--space-3);
  background: transparent; border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 600;
  color: var(--color-text-muted); cursor: pointer;
  transition: all 200ms ease;
  white-space: nowrap;
}
.ep__skip-btn:hover {
  background: #fff7ed; border-color: #f59e0b; color: #b45309;
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
.ep__name-hint {
  font-size: var(--text-xs); color: var(--color-text-muted); text-align: center; margin: 0;
  padding: var(--space-1) var(--space-3);
  background: color-mix(in srgb, var(--cc) 6%, var(--color-bg-muted));
  border-radius: var(--radius-full);
  font-style: italic;
}
.ep__hint {
  font-size: var(--text-base); font-weight: 600; color: var(--color-text-secondary);
  text-align: center; margin: 0;
  padding: var(--space-2) var(--space-4);
  background: var(--color-bg-muted); border-radius: var(--radius-lg);
}
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
.ep__input-row { display: flex; gap: var(--space-3); width: 100%; align-items: center; }
.ep__input-mic {
  width: 44px; height: 44px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--color-border); background: var(--color-bg-surface);
  border-radius: var(--radius-full); color: var(--color-text-muted);
  cursor: pointer; transition: all 200ms ease;
}
.ep__input-mic:hover { border-color: var(--color-text-subtle); color: var(--color-text); }
.ep__input-mic--active {
  border-color: #ef4444; background: #fef2f2; color: #ef4444;
  animation: input-mic-pulse 1s ease-in-out infinite;
}
@keyframes input-mic-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
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
.ep__actions {
  display: flex; flex-direction: column; gap: var(--space-2); width: 100%;
  position: sticky; bottom: var(--space-4);
  padding-top: var(--space-4);
  margin-top: auto;
  background: linear-gradient(to bottom, transparent, var(--color-bg) 30%);
  padding-bottom: var(--space-2);
}
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
.ep__btn--skip {
  background: transparent; color: #b45309;
  border: 1px solid #fbbf24;
}
.ep__btn--skip:hover { background: #fff7ed; }
.ep__btn--sm { padding: var(--space-2) var(--space-5); font-size: var(--text-sm); }

/* ═══ SPEAK ═══ */
.ep__speak-text {
  font-size: var(--text-3xl); font-weight: 800; color: var(--color-text);
  font-family: var(--font-cjk-kr); text-align: center;
  margin: 0; letter-spacing: -0.01em;
}
.ep__speak-romanization {
  font-size: var(--text-base); color: var(--color-text-muted);
  text-align: center; margin: 0; font-style: italic;
}
.ep__speak-unsupported {
  font-size: var(--text-sm); color: var(--color-text-muted);
  text-align: center; margin: 0;
  padding: var(--space-3) var(--space-4);
  background: #fff7ed; border: 1px solid #fbbf24;
  border-radius: var(--radius-lg);
}
.ep__speak-error {
  font-size: var(--text-sm); color: #b91c1c;
  text-align: center; margin: 0;
  padding: var(--space-2) var(--space-4);
  background: #fef2f2; border-radius: var(--radius-lg);
}
.ep__mic-wrap {
  display: flex; flex-direction: column; align-items: center;
  gap: var(--space-2); padding: var(--space-4) 0;
}
.ep__mic-btn {
  display: flex; align-items: center; justify-content: center;
  width: 88px; height: 88px;
  border-radius: var(--radius-full);
  border: 3px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: all 200ms ease;
  position: relative;
}
.ep__mic-btn:hover:not(:disabled) {
  border-color: var(--cc, var(--color-primary));
  background: var(--cc-s, var(--color-primary-subtle));
  transform: scale(1.05);
}
.ep__mic-btn:disabled { cursor: default; opacity: 0.5; }
.ep__mic-btn--listening {
  border-color: var(--color-error);
  background: #fef2f2;
  color: var(--color-error);
  animation: mic-pulse 1.5s ease-in-out infinite;
}
@keyframes mic-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 0 0 16px rgba(239, 68, 68, 0); }
}
.ep__mic-label {
  font-size: var(--text-sm); font-weight: 600;
  color: var(--color-text-secondary);
}
.ep__speak-hint {
  font-size: var(--text-xs); color: var(--color-text-muted);
  font-style: italic;
}
.ep__speak-transcript {
  display: flex; flex-direction: column; align-items: center;
  gap: var(--space-1); width: 100%;
  padding: var(--space-4);
  border-radius: var(--radius-xl);
  border: 2px solid var(--color-border);
  background: var(--color-bg-surface);
}
.ep__speak-transcript--correct { border-color: var(--color-success); background: #f0fdf4; }
.ep__speak-transcript--wrong { border-color: var(--color-error); background: #fef2f2; }
.ep__speak-transcript-label {
  font-size: var(--text-xs); color: var(--color-text-muted);
  font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
}
.ep__speak-transcript-text {
  font-size: var(--text-lg); font-weight: 600;
  font-family: var(--font-cjk-kr);
  color: var(--color-text);
}

/* ═══ Feedback bar ═══ */
.fb {
  position: sticky; bottom: 0; display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-4); padding: var(--space-5) var(--space-6);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  margin-top: var(--space-4); margin-left: calc(-1 * var(--space-4)); margin-right: calc(-1 * var(--space-4));
}
.fb--correct { background: #f0fdf4; border-top: 3px solid var(--color-success); }
.fb--wrong { background: #fef2f2; border-top: 3px solid var(--color-error); }
.fb--skipped { background: #fff7ed; border-top: 3px solid #f59e0b; }
.fb__info { display: flex; flex-direction: column; gap: var(--space-1); flex: 1; }
.fb__label-row { display: flex; align-items: center; gap: var(--space-2); }
.fb__label { font-size: var(--text-base); font-weight: 800; }
.fb--correct .fb__label { color: var(--color-success); }
.fb--wrong .fb__label { color: var(--color-error); }
.fb--skipped .fb__label { color: #d97706; }
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
