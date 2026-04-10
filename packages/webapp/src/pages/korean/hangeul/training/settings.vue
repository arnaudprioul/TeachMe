<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTrainingStore } from '~/stores/training.store'
import type { Difficulty, QuestionType } from '~/composables/useTraining'
import { useCourses } from '~/composables/useCourses'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const router = useRouter()
const training = useTrainingStore()
const { getBySlug } = useCourses()
const course = getBySlug('korean')!

// ── Difficulty ──
const difficulties: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'easy', label: 'training.easy', desc: 'training.easyDesc' },
  { value: 'hard', label: 'training.hard', desc: 'training.hardDesc' },
  { value: 'auto', label: 'training.automatic', desc: 'training.automaticDesc' },
]

const activeDifficultyDesc = computed(() => {
  const d = difficulties.find(d => d.value === training.config.value.difficulty)
  return d ? t(d.desc) : ''
})

// ── Question types (both can be active) ──
const recognitionActive = computed(() =>
  training.config.value.questionType === 'recognition' || training.config.value.questionType === 'both'
)
const writingActive = computed(() =>
  training.config.value.questionType === 'writing' || training.config.value.questionType === 'both'
)

function toggleQuestionType(type: 'recognition' | 'writing') {
  const current = training.config.value.questionType
  if (type === 'recognition') {
    if (current === 'both') training.config.value.questionType = 'writing'
    else if (current === 'recognition') return // at least one must be active
    else training.config.value.questionType = 'both'
  } else {
    if (current === 'both') training.config.value.questionType = 'recognition'
    else if (current === 'writing') return // at least one must be active
    else training.config.value.questionType = 'both'
  }
}

// ── Question limit ──
function increment() {
  const max = training.poolCount.value
  if (training.config.value.questionLimit < max) {
    training.config.value.questionLimit = Math.min(training.config.value.questionLimit + 5, max)
  }
}

function decrement() {
  if (training.config.value.questionLimit > 5) {
    training.config.value.questionLimit = Math.max(training.config.value.questionLimit - 5, 5)
  }
}

// ── Start ──
function startTraining() {
  training.start()
  router.push('/korean/hangeul/training/play')
}
</script>

<template>
  <div class="page-container settings-page">
    <div class="contained">
      <Breadcrumb :items="[
        { label: t('nav.dashboard'), to: '/dashboard' },
        { label: t('courses.korean'), to: '/korean' },
        { label: t('training.title'), to: '/korean/hangeul/training' },
        { label: t('training.settings') },
      ]" />

      <h1 class="settings-page__title">{{ t('training.settings') }}</h1>

      <!-- ════════ 1. Answer input method ════════ -->
      <section class="settings-section">
        <h2 class="settings-section__label">{{ t('training.inputMethod') }}</h2>
        <div class="toggle-row">
          <button
            v-for="d in difficulties"
            :key="d.value"
            class="toggle-btn"
            :class="{ 'toggle-btn--active': training.config.value.difficulty === d.value }"
            data-cy="difficulty-toggle"
            @click="training.config.value.difficulty = d.value"
          >
            {{ t(d.label) }}
          </button>
        </div>
        <p class="settings-desc">{{ activeDifficultyDesc }}</p>
      </section>

      <!-- ════════ 2. Question types ════════ -->
      <section class="settings-section">
        <h2 class="settings-section__label">{{ t('training.questionTypes') }}</h2>
        <div class="toggle-row">
          <button
            class="toggle-btn"
            :class="{ 'toggle-btn--active': recognitionActive }"
            data-cy="question-type-recognition"
            @click="toggleQuestionType('recognition')"
          >
            <span class="toggle-btn__symbol">{{ t('training.recognitionSymbol') }}</span>
            {{ t('training.recognition') }}
          </button>
          <button
            class="toggle-btn"
            :class="{ 'toggle-btn--active': writingActive }"
            data-cy="question-type-writing"
            @click="toggleQuestionType('writing')"
          >
            <span class="toggle-btn__symbol">{{ t('training.writingSymbol') }}</span>
            {{ t('training.writing') }}
          </button>
        </div>
      </section>

      <!-- ════════ 3. Auto-play sound ════════ -->
      <section class="settings-section">
        <div class="switch-row">
          <div class="switch-row__text">
            <h2 class="settings-section__label">{{ t('training.autoSound') }}</h2>
            <p class="settings-desc">{{ t('training.autoSoundDesc') }}</p>
          </div>
          <label class="switch" data-cy="auto-sound-toggle">
            <input type="checkbox" v-model="training.config.value.autoSound" />
            <span class="switch__track"></span>
          </label>
        </div>
      </section>

      <!-- ════════ 4. Question limit ════════ -->
      <section class="settings-section">
        <h2 class="settings-section__label">{{ t('training.questionLimit') }}</h2>
        <div class="limit-row">
          <button
            class="limit-btn"
            :disabled="training.config.value.questionLimit <= 5"
            data-cy="limit-decrement"
            @click="decrement"
            aria-label="Decrease question limit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <span class="limit-value" data-cy="limit-value">{{ training.config.value.questionLimit }}</span>
          <button
            class="limit-btn"
            :disabled="training.config.value.questionLimit >= training.poolCount"
            data-cy="limit-increment"
            @click="increment"
            aria-label="Increase question limit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <p class="settings-desc">
          {{ t('training.questionsAvailable', { count: training.config.value.questionLimit, total: training.poolCount }) }}
        </p>
      </section>

      <!-- ════════ START ════════ -->
      <button
        class="start-btn"
        data-cy="start-training"
        @click="startTraining"
      >
        {{ t('training.start') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding-bottom: var(--space-16);
}

.contained {
  max-width: 640px;
  margin: 0 auto;
  width: 100%;
  padding: var(--space-4) var(--space-6) 0;
}

.settings-page__title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin-top: var(--space-6);
  margin-bottom: var(--space-8);
  letter-spacing: -0.02em;
}

/* ── Section ── */
.settings-section {
  margin-bottom: var(--space-8);
}

.settings-section__label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-3);
}

.settings-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-top: var(--space-2);
}

/* ── Toggle buttons ── */
.toggle-row {
  display: flex;
  gap: var(--space-2);
}

.toggle-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.toggle-btn:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.toggle-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.toggle-btn--active:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  color: var(--color-text-inverse);
}

.toggle-btn__symbol {
  font-family: var(--font-cjk-kr);
  font-weight: 600;
}

/* ── Switch ── */
.switch-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.switch-row__text {
  flex: 1;
}

.switch-row .settings-desc {
  margin-top: var(--space-1);
}

.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: var(--space-1);
}

.switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch__track {
  width: 44px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-border-strong);
  position: relative;
  transition: background var(--transition-fast);
}

.switch__track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-xs);
  transition: transform var(--transition-fast);
}

.switch input:checked + .switch__track {
  background: var(--color-primary);
}

.switch input:checked + .switch__track::after {
  transform: translateX(20px);
}

/* ── Question limit ── */
.limit-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.limit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.limit-btn:hover:not(:disabled) {
  border-color: var(--color-border-strong);
  background: var(--color-bg-muted);
}

.limit-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.limit-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  min-width: 48px;
  text-align: center;
}

/* ── Start button ── */
.start-btn {
  display: block;
  width: 100%;
  padding: var(--space-4);
  margin-top: var(--space-10);
  border: none;
  border-radius: var(--radius-xl);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.start-btn:hover {
  background: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}

.start-btn:active {
  transform: scale(0.99);
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .toggle-row {
    flex-direction: column;
  }

  .toggle-btn {
    flex: none;
  }
}
</style>
