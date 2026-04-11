<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTrainingStore } from '~/stores/training.store'
import { getSpeechText } from '~/composables/data/hangeulSpeech'
import { useHangeulAudio } from '~/composables/useHangeulAudio'
import { useCourses } from '~/composables/useCourses'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const training = useTrainingStore()
const { speak, isSpeaking, isSupported } = useHangeulAudio()
const { getBySlug } = useCourses()
const course = getBySlug('korean')!

// Redirect if no session
onMounted(() => {
  if (!training.session) navigateTo('/korean/hangeul/training')
})

// ── Local state ──
const answered = ref<boolean | null>(null) // null = not answered, true = correct, false = wrong
const selectedId = ref<string | null>(null)
const textInput = ref('')
const showFeedback = ref(false)

// ── Derived ──
const question = computed(() => training.currentQuestion)
const progress = computed(() => training.progress)
const difficulty = computed(() => training.session?.config.difficulty ?? 'easy')
const hardInput = computed(() => {
  if (!question.value) return 'keyboard'
  return question.value.type === 'recognition' ? 'keyboard' : 'drawing'
})
const isEasy = computed(() => difficulty.value === 'easy')
const isHard = computed(() => difficulty.value === 'hard')

const localizedType = computed(() => {
  if (!question.value) return ''
  const item = question.value.item
  if (item.type === 'syllable') return 'Syllable'
  return t(`korean.charType_${item.jamoType}`)
})

// Auto-play sound on new question
watch(question, (q) => {
  if (!q) return
  answered.value = null
  selectedId.value = null
  textInput.value = ''
  showFeedback.value = false

  if (training.session?.config.autoSound && q.type === 'recognition') {
    nextTick(() => speak(q.item.type === 'jamo' ? getSpeechText(q.item.id, q.item.symbol) : q.item.symbol))
  }
})

// ── Easy mode: QCM answer ──
function selectAnswer(charId: string) {
  if (answered.value !== null) return // already answered
  selectedId.value = charId
  const correct = training.answer(charId)
  answered.value = correct ?? false
  showFeedback.value = true
}

// ── Easy mode: "I don't know" ──
function skipQuestion() {
  if (answered.value !== null) return
  training.skip()
  answered.value = false
  showFeedback.value = true
}

// ── Hard mode: submit text ──
function submitText() {
  if (answered.value !== null || !textInput.value.trim()) return
  const correct = training.answerText(textInput.value)
  answered.value = correct
  showFeedback.value = true
}

// ── Hard mode: skip (keyboard/drawing) ──
function skipHard() {
  if (answered.value !== null) return
  training.skip()
  answered.value = false
  showFeedback.value = true
}

// ── Hard mode drawing: verify (mark as correct since we can't auto-detect) ──
function verifyDrawing() {
  if (answered.value !== null) return
  // For drawing, we count it as a self-graded correct attempt
  // The user can override with edit result buttons
  if (!training.session || !question.value) return
  training.session.results.push({
    itemId: question.value.item.id,
    correct: true,
    type: question.value.type,
    answeredAt: Date.now(),
  })
  training.streak++
  if (training.streak > training.bestStreak) {
    training.bestStreak = training.streak
  }
  answered.value = true
  showFeedback.value = true
}

// ── Override result ──
function overrideResult(correct: boolean) {
  training.overrideLastResult(correct)
  answered.value = correct
}

// ── Next question ──
function goNext() {
  training.next()
  if (training.isFinished) {
    navigateTo('/korean/hangeul/training/results')
  }
}

// ── Close training ──
function closeTraining() {
  navigateTo('/korean/hangeul/training')
}

// ── Play sound ──
function playSound() {
  if (!question.value) return
  const item = question.value.item
  speak(item.type === 'jamo' ? getSpeechText(item.id, item.symbol) : item.symbol)
}

// ── Option class helpers ──
function optionClass(optId: string) {
  if (answered.value === null) return 'opt'
  const isCorrectOption = optId === question.value?.item.id
  const isSelected = optId === selectedId.value
  if (isCorrectOption) return 'opt opt--correct'
  if (isSelected && !isCorrectOption) return 'opt opt--wrong'
  return 'opt opt--dimmed'
}

// WritingCanvas ref for reset
const canvasRef = ref<InstanceType<any> | null>(null)
</script>

<template>
  <div class="play" :style="{ '--color-course': course.color }">
    <template v-if="training.session && question">
      <!-- ══════ HEADER ══════ -->
      <header class="play-header">
        <button class="play-header__close" @click="closeTraining" aria-label="Close" data-cy="training-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <span class="play-header__progress">{{ t('training.questionOf', { current: progress.current, total: progress.total }) }}</span>
        <button
          v-if="isSupported"
          class="play-header__sound"
          :class="{ 'play-header__sound--active': isSpeaking }"
          @click="playSound"
          :aria-label="t('korean.practice.playSound')"
          data-cy="training-sound"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </button>
        <span v-else />
      </header>

      <!-- ══════ EASY MODE — RECOGNITION (char → romanization) ══════ -->
      <div v-if="isEasy && question.type === 'recognition'" class="play-body">
        <div class="play-prompt">
          <span class="play-prompt__char">{{ question.item.symbol }}</span>
          <span class="play-prompt__type">{{ localizedType }}</span>
          <Transition name="fade">
            <span v-if="training.streak > 0" class="play-prompt__streak">
              {{ t('training.streak', { n: training.streak }) }}
            </span>
          </Transition>
        </div>

        <div class="play-actions">
          <button
            v-if="answered === null"
            class="btn-skip"
            @click="skipQuestion"
            data-cy="training-idk"
          >{{ t('training.iDontKnow') }}</button>
        </div>

        <div class="opts-grid" data-cy="training-options">
          <button
            v-for="opt in question.options"
            :key="opt.id"
            :class="optionClass(opt.id)"
            @click="selectAnswer(opt.id)"
            :disabled="answered !== null"
            :data-cy="`opt-${opt.id}`"
          >{{ opt.romanization }}</button>
        </div>

        <!-- Feedback bar -->
        <Transition name="slide-up">
          <div v-if="showFeedback" class="feedback-bar" :class="answered ? 'feedback-bar--correct' : 'feedback-bar--wrong'">
            <div class="feedback-bar__left">
              <button class="fb-btn" @click="goNext" :aria-label="t('training.details')" data-cy="training-details">
                {{ t('training.details') }}
              </button>
            </div>
            <div class="feedback-bar__center">
              <span class="feedback-bar__label">{{ answered ? t('training.correct') : t('training.incorrect') }}</span>
              <span v-if="!answered" class="feedback-bar__answer">{{ t('training.correctAnswer') }} {{ question.item.romanization }}</span>
              <div class="feedback-bar__override">
                <button class="override-btn override-btn--wrong" @click="overrideResult(false)" :class="{ active: answered === false }" aria-label="Mark wrong" data-cy="override-wrong">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <button class="override-btn override-btn--correct" @click="overrideResult(true)" :class="{ active: answered === true }" aria-label="Mark correct" data-cy="override-correct">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            </div>
            <div class="feedback-bar__right">
              <button class="next-btn" @click="goNext" data-cy="training-next">
                {{ t('training.nextQuestion') }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- ══════ EASY MODE — WRITING (romanization → character) ══════ -->
      <div v-else-if="isEasy && question.type === 'writing'" class="play-body">
        <div class="play-prompt">
          <span class="play-prompt__rom">{{ question.item.romanization }}</span>
          <span class="play-prompt__type">{{ localizedType }}</span>
          <Transition name="fade">
            <span v-if="training.streak > 0" class="play-prompt__streak">
              {{ t('training.streak', { n: training.streak }) }}
            </span>
          </Transition>
        </div>

        <div class="play-actions">
          <button
            v-if="answered === null"
            class="btn-skip"
            @click="skipQuestion"
            data-cy="training-idk"
          >{{ t('training.iDontKnow') }}</button>
        </div>

        <div class="opts-grid opts-grid--chars" data-cy="training-options">
          <button
            v-for="opt in question.options"
            :key="opt.id"
            :class="optionClass(opt.id)"
            @click="selectAnswer(opt.id)"
            :disabled="answered !== null"
            :data-cy="`opt-${opt.id}`"
          >{{ opt.symbol }}</button>
        </div>

        <!-- Feedback bar -->
        <Transition name="slide-up">
          <div v-if="showFeedback" class="feedback-bar" :class="answered ? 'feedback-bar--correct' : 'feedback-bar--wrong'">
            <div class="feedback-bar__left">
              <button class="fb-btn" @click="goNext" :aria-label="t('training.details')" data-cy="training-details">
                {{ t('training.details') }}
              </button>
            </div>
            <div class="feedback-bar__center">
              <span class="feedback-bar__label">{{ answered ? t('training.correct') : t('training.incorrect') }}</span>
              <span v-if="!answered" class="feedback-bar__answer">{{ t('training.correctAnswer') }} {{ question.item.symbol }} ({{ question.item.romanization }})</span>
              <div class="feedback-bar__override">
                <button class="override-btn override-btn--wrong" @click="overrideResult(false)" :class="{ active: answered === false }" aria-label="Mark wrong" data-cy="override-wrong">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <button class="override-btn override-btn--correct" @click="overrideResult(true)" :class="{ active: answered === true }" aria-label="Mark correct" data-cy="override-correct">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            </div>
            <div class="feedback-bar__right">
              <button class="next-btn" @click="goNext" data-cy="training-next">
                {{ t('training.nextQuestion') }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- ══════ HARD MODE — KEYBOARD (char → type romanization) ══════ -->
      <div v-else-if="isHard && hardInput === 'keyboard'" class="play-body">
        <div class="play-prompt">
          <span class="play-prompt__char">{{ question.item.symbol }}</span>
          <span class="play-prompt__type">{{ localizedType }}</span>
          <Transition name="fade">
            <span v-if="training.streak > 0" class="play-prompt__streak">
              {{ t('training.streak', { n: training.streak }) }}
            </span>
          </Transition>
        </div>

        <div class="hard-input">
          <input
            v-model="textInput"
            type="text"
            class="hard-input__field"
            :placeholder="t('training.typeAnswer')"
            :disabled="answered !== null"
            @keydown.enter="submitText"
            data-cy="training-text-input"
          />
          <div class="hard-input__actions">
            <button class="btn-skip" @click="skipHard" :disabled="answered !== null" data-cy="training-skip">
              {{ t('training.skip') }}
            </button>
            <button class="btn-submit" @click="submitText" :disabled="answered !== null || !textInput.trim()" data-cy="training-submit">
              {{ t('training.submit') }}
            </button>
          </div>
        </div>

        <!-- Feedback bar -->
        <Transition name="slide-up">
          <div v-if="showFeedback" class="feedback-bar" :class="answered ? 'feedback-bar--correct' : 'feedback-bar--wrong'">
            <div class="feedback-bar__left">
              <button class="fb-btn" @click="goNext" :aria-label="t('training.details')" data-cy="training-details">
                {{ t('training.details') }}
              </button>
            </div>
            <div class="feedback-bar__center">
              <span class="feedback-bar__label">{{ answered ? t('training.correct') : t('training.incorrect') }}</span>
              <span v-if="!answered" class="feedback-bar__answer">{{ t('training.correctAnswer') }} {{ question.item.romanization }}</span>
              <div class="feedback-bar__override">
                <button class="override-btn override-btn--wrong" @click="overrideResult(false)" :class="{ active: answered === false }" aria-label="Mark wrong" data-cy="override-wrong">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <button class="override-btn override-btn--correct" @click="overrideResult(true)" :class="{ active: answered === true }" aria-label="Mark correct" data-cy="override-correct">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            </div>
            <div class="feedback-bar__right">
              <button class="next-btn" @click="goNext" data-cy="training-next">
                {{ t('training.nextQuestion') }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- ══════ HARD MODE — DRAWING (romanization → draw character) ══════ -->
      <div v-else-if="isHard && hardInput === 'drawing'" class="play-body">
        <div class="play-prompt">
          <span class="play-prompt__rom">{{ question.item.romanization }}</span>
          <span class="play-prompt__type">{{ localizedType }}</span>
          <Transition name="fade">
            <span v-if="training.streak > 0" class="play-prompt__streak">
              {{ t('training.streak', { n: training.streak }) }}
            </span>
          </Transition>
        </div>

        <div class="draw-area">
          <div class="draw-area__placeholder" v-if="answered === null">
            {{ t('training.drawBelow') }}
          </div>
          <WritingCanvas ref="canvasRef" :char-id="question.item.id" />
        </div>

        <div class="draw-actions">
          <button class="btn-skip" @click="skipHard" :disabled="answered !== null" data-cy="training-idk">
            {{ t('training.iDontKnow') }}
          </button>
          <button class="btn-verify" @click="verifyDrawing" :disabled="answered !== null" data-cy="training-verify">
            {{ t('training.verify') }}
          </button>
        </div>

        <!-- Feedback bar -->
        <Transition name="slide-up">
          <div v-if="showFeedback" class="feedback-bar" :class="answered ? 'feedback-bar--correct' : 'feedback-bar--wrong'">
            <div class="feedback-bar__left">
              <button class="fb-btn" @click="goNext" :aria-label="t('training.details')" data-cy="training-details">
                {{ t('training.details') }}
              </button>
            </div>
            <div class="feedback-bar__center">
              <span class="feedback-bar__label">{{ answered ? t('training.correct') : t('training.incorrect') }}</span>
              <span v-if="!answered" class="feedback-bar__answer">{{ t('training.correctAnswer') }} {{ question.item.symbol }}</span>
              <div class="feedback-bar__override">
                <button class="override-btn override-btn--wrong" @click="overrideResult(false)" :class="{ active: answered === false }" aria-label="Mark wrong" data-cy="override-wrong">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <button class="override-btn override-btn--correct" @click="overrideResult(true)" :class="{ active: answered === true }" aria-label="Mark correct" data-cy="override-correct">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            </div>
            <div class="feedback-bar__right">
              <button class="next-btn" @click="goNext" data-cy="training-next">
                {{ t('training.nextQuestion') }}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </template>
  </div>
</template>

<style scoped>
.play {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg);
}

/* ══════════ HEADER ══════════ */
.play-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  flex-shrink: 0;
}

.play-header__close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-bg-muted);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.play-header__close:hover {
  color: var(--color-text);
  background: var(--color-border);
}

.play-header__progress {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-muted);
}

.play-header__sound {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.play-header__sound:hover {
  border-color: var(--color-primary);
}
.play-header__sound--active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

/* ══════════ BODY ══════════ */
.play-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-10) var(--space-6);
  padding-bottom: 120px; /* space for feedback bar */
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}

/* ══════════ PROMPT ══════════ */
.play-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.play-prompt__char {
  font-family: var(--font-cjk-kr);
  font-size: 7rem;
  font-weight: 400;
  line-height: 1;
  color: var(--color-text);
  user-select: none;
}

.play-prompt__rom {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.play-prompt__type {
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.play-prompt__streak {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-warning);
  background: var(--color-warning-subtle);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
}

/* ══════════ PLAY ACTIONS (I don't know) ══════════ */
.play-actions {
  margin-bottom: var(--space-6);
  min-height: 40px;
}

.btn-skip {
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-full);
  border: 1px solid #a3a044;
  background: #f5f5dc;
  color: #6b6520;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-skip:hover:not(:disabled) {
  background: #e8e8c8;
}
.btn-skip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ══════════ OPTIONS GRID (QCM) ══════════ */
.opts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  width: 100%;
  max-width: 420px;
}

.opt {
  padding: var(--space-5) var(--space-4);
  border-radius: var(--radius-xl);
  border: 2px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-primary);
  font-size: var(--text-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: center;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.opt:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: var(--color-primary-subtle);
}

.opts-grid--chars .opt {
  font-family: var(--font-cjk-kr);
  font-size: var(--text-3xl);
  color: var(--color-text);
  min-height: 80px;
}

.opt--correct {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #16a34a;
}
.opts-grid--chars .opt--correct {
  color: #16a34a;
}

.opt--wrong {
  border-color: #ef4444;
  background: #fef2f2;
  color: #dc2626;
}
.opts-grid--chars .opt--wrong {
  color: #dc2626;
}

.opt--dimmed {
  opacity: 0.4;
  cursor: default;
}

/* ══════════ HARD MODE — KEYBOARD INPUT ══════════ */
.hard-input {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.hard-input__field {
  width: 100%;
  padding: var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-bg-surface);
  color: var(--color-text);
  font-size: var(--text-xl);
  font-weight: 500;
  text-align: center;
  outline: none;
  transition: border-color var(--transition-fast);
}
.hard-input__field:focus {
  border-color: var(--color-primary);
}
.hard-input__field:disabled {
  opacity: 0.6;
}
.hard-input__field::placeholder {
  color: var(--color-text-subtle);
  font-weight: 400;
}

.hard-input__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}

.btn-submit {
  padding: var(--space-2) var(--space-6);
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-submit:hover:not(:disabled) {
  opacity: 0.85;
}
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ══════════ HARD MODE — DRAWING ══════════ */
.draw-area {
  width: 100%;
  max-width: 420px;
  position: relative;
  margin-bottom: var(--space-4);
}

.draw-area__placeholder {
  position: absolute;
  top: var(--space-3);
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
  pointer-events: none;
  z-index: 1;
}

.draw-area :deep(.wc) {
  padding: 0;
}

.draw-actions {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.btn-verify {
  padding: var(--space-2) var(--space-6);
  border-radius: var(--radius-full);
  border: none;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-verify:hover:not(:disabled) {
  opacity: 0.85;
}
.btn-verify:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ══════════ FEEDBACK BAR ══════════ */
.feedback-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface);
  border-top: 2px solid var(--color-border);
  z-index: 50;
  gap: var(--space-3);
}

.feedback-bar--correct {
  border-top-color: #22c55e;
}
.feedback-bar--wrong {
  border-top-color: #ef4444;
}

.feedback-bar__left,
.feedback-bar__right {
  flex-shrink: 0;
}

.feedback-bar__center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  min-width: 0;
}

.feedback-bar__label {
  font-size: var(--text-sm);
  font-weight: 700;
}
.feedback-bar--correct .feedback-bar__label {
  color: #16a34a;
}
.feedback-bar--wrong .feedback-bar__label {
  color: #dc2626;
}

.feedback-bar__answer {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-align: center;
}

.feedback-bar__override {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.override-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-bg-muted);
  color: var(--color-text-subtle);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.override-btn:hover {
  border-color: var(--color-border-strong);
}
.override-btn--wrong.active {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}
.override-btn--correct.active {
  background: #f0fdf4;
  border-color: #22c55e;
  color: #22c55e;
}

.fb-btn {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.fb-btn:hover {
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.next-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-lg);
  border: none;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}
.next-btn:hover {
  opacity: 0.85;
}

/* ══════════ TRANSITIONS ══════════ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: transform 250ms ease, opacity 250ms ease;
}
.slide-up-leave-active {
  transition: transform 200ms ease, opacity 200ms ease;
}
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* ══════════ RESPONSIVE ══════════ */
@media (max-width: 480px) {
  .play-prompt__char {
    font-size: 5rem;
  }
  .play-prompt__rom {
    font-size: var(--text-3xl);
  }
  .opts-grid {
    max-width: 100%;
  }
  .feedback-bar {
    padding: var(--space-3) var(--space-3);
    flex-wrap: wrap;
    gap: var(--space-2);
  }
  .feedback-bar__left {
    display: none;
  }
  .feedback-bar__center {
    order: 2;
    width: 100%;
  }
  .feedback-bar__right {
    order: 1;
    width: 100%;
  }
  .next-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
