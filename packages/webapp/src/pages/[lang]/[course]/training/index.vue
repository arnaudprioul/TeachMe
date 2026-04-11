<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTrainingStore } from '~/stores/training.store'
import type { TrainingMode } from '~/composables/useCourseTraining'
import { useCourseData } from '~/composables/useCourseData'
import { useCourseContext } from '~/composables/useCourseContext'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const { lang, language, module, paths, tKey } = useCourseContext()
const training = useTrainingStore()
const { basicConsonants, doubleConsonants, basicVowels, compoundVowels } = useCourseData()

const course = computed(() => language.value!)

watchEffect(() => {
  if (module.value) training.bind(module.value)
})

const mode = computed({
  get: () => training.config.mode,
  set: (v: TrainingMode) => { training.config.mode = v },
})

const typeCounts = computed(() => ({
  basicConsonants: basicConsonants.value.length,
  doubleConsonants: doubleConsonants.value.length,
  basicVowels: basicVowels.value.length,
  compoundVowels: compoundVowels.value.length,
}))
</script>

<template>
  <div class="tc page-container" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle }">

    <Breadcrumb :items="[
      { label: t('nav.dashboard'), to: '/dashboard' },
      { label: t(`courses.${lang}.name`), to: paths.languageRoot },
      { label: t(tKey('title')), to: paths.root },
      { label: t('training.content') },
    ]" />

    <h1 class="tc__title">{{ t('training.content') }}</h1>

    <!-- ── Mode toggle ── -->
    <div class="tc__toggle" data-cy="training-mode-toggle">
      <button
        class="tc__toggle-btn"
        :class="{ 'tc__toggle-btn--active': mode === 'smart' }"
        data-cy="training-mode-smart"
        @click="mode = 'smart'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
        {{ t('training.smart') }}
      </button>
      <button
        class="tc__toggle-btn"
        :class="{ 'tc__toggle-btn--active': mode === 'custom' }"
        data-cy="training-mode-custom"
        @click="mode = 'custom'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        {{ t('training.custom') }}
      </button>
    </div>

    <!-- ═══════ SMART MODE ═══════ -->
    <template v-if="mode === 'smart'">
      <p class="tc__desc">{{ t('training.smartDesc') }}</p>

      <!-- Not yet practiced -->
      <section class="tc__section">
        <h2 class="tc__section-label">{{ t('training.notYetPracticed') }}</h2>
        <div class="tc__card tc__card--new" data-cy="training-new-chars">
          <div class="tc__card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </div>
          <div class="tc__card-body">
            <span class="tc__card-title">{{ t('training.newChars', { count: training.poolCount }) }}</span>
            <span class="tc__card-sub">{{ t('training.newCharsPriority') }}</span>
          </div>
        </div>
      </section>

      <!-- Already practiced (locked) -->
      <section class="tc__section">
        <h2 class="tc__section-label">{{ t('training.alreadyPracticed') }}</h2>
        <div class="tc__card tc__card--locked" data-cy="training-already-practiced">
          <div class="tc__card-icon tc__card-icon--muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div class="tc__card-body">
            <span class="tc__card-title tc__card-title--muted">{{ t('training.unlockByTraining') }}</span>
            <div class="tc__locked-items">
              <span class="tc__locked-tag">{{ t('training.leastMasteredScore') }}</span>
              <span class="tc__locked-tag">{{ t('training.leastMasteredStreak') }}</span>
              <span class="tc__locked-tag">{{ t('training.leastReviewed') }}</span>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ═══════ CUSTOM MODE ═══════ -->
    <template v-else>
      <section class="tc__section">
        <h2 class="tc__section-label">{{ t('training.selectTypes') }}</h2>

        <div class="tc__types" data-cy="training-type-list">
          <label class="tc__type-row">
            <input
              v-model="training.config.includeBasicConsonants"
              type="checkbox"
              class="tc__checkbox"
              data-cy="training-type-basic-consonants"
            />
            <span class="tc__type-label">{{ t(tKey('basicConsonants')) }}</span>
            <span class="tc__type-count">{{ typeCounts.basicConsonants }}</span>
          </label>

          <label class="tc__type-row">
            <input
              v-model="training.config.includeDoubleConsonants"
              type="checkbox"
              class="tc__checkbox"
              data-cy="training-type-double-consonants"
            />
            <span class="tc__type-label">{{ t(tKey('doubleConsonants')) }}</span>
            <span class="tc__type-count">{{ typeCounts.doubleConsonants }}</span>
          </label>

          <label class="tc__type-row">
            <input
              v-model="training.config.includeBasicVowels"
              type="checkbox"
              class="tc__checkbox"
              data-cy="training-type-basic-vowels"
            />
            <span class="tc__type-label">{{ t(tKey('basicVowels')) }}</span>
            <span class="tc__type-count">{{ typeCounts.basicVowels }}</span>
          </label>

          <label class="tc__type-row">
            <input
              v-model="training.config.includeCompoundVowels"
              type="checkbox"
              class="tc__checkbox"
              data-cy="training-type-compound-vowels"
            />
            <span class="tc__type-label">{{ t(tKey('compoundVowels')) }}</span>
            <span class="tc__type-count">{{ typeCounts.compoundVowels }}</span>
          </label>
        </div>
      </section>
    </template>

    <!-- ── Footer: entries count + Next ── -->
    <div class="tc__footer">
      <span class="tc__entries" data-cy="training-entry-count">
        {{ t('training.entries', { count: training.poolCount }) }}
      </span>
      <NuxtLink
        :to="paths.settings"
        class="btn btn--primary btn--lg"
        :class="{ 'btn--disabled': training.poolCount === 0 }"
        data-cy="training-next"
        :aria-label="t('common.next')"
      >
        {{ t('common.next') }}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.tc {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.tc__title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

/* ── Mode toggle (segmented control) ── */
.tc__toggle {
  display: flex;
  gap: var(--space-2);
  background: var(--color-bg-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-2);
}

.tc__toggle-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 44px;
  padding: var(--space-3) var(--space-5);
  border: none;
  border-radius: var(--radius-lg);
  background: transparent;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tc__toggle-btn svg { flex-shrink: 0; }

.tc__toggle-btn:hover { color: var(--color-text); }
.tc__toggle-btn--active {
  background: var(--color-bg-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
}

/* ── Description ── */
.tc__desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* ── Sections ── */
.tc__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.tc__section-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

/* ── Cards — unified surface pattern ── */
.tc__card {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-5) var(--space-6);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  transition: border-color var(--transition-fast),
              box-shadow var(--transition-fast),
              transform var(--transition-fast);
}

.tc__card--new {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary);
}
.tc__card--new:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.tc__card--locked {
  background: var(--color-bg-muted);
  border-style: dashed;
  opacity: 0.65;
}

.tc__card-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--color-bg-surface);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.tc__card--locked .tc__card-icon,
.tc__card-icon--muted {
  background: var(--color-bg-surface);
  color: var(--color-text-subtle);
  border-color: var(--color-border);
}

.tc__card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
  min-width: 0;
}

.tc__card-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}
.tc__card-title--muted { color: var(--color-text-muted); }

.tc__card-sub {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.5;
}

.tc__locked-items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.tc__locked-tag {
  font-size: var(--text-xs);
  color: var(--color-text-subtle);
  background: var(--color-bg-surface);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
}

/* ── Custom mode type list ── */
.tc__types {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.tc__type-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}
.tc__type-row:hover { border-color: var(--color-border-strong); }

.tc__checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
  flex-shrink: 0;
  cursor: pointer;
}

.tc__type-label {
  flex: 1;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
}

.tc__type-count {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  background: var(--color-bg-muted);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  min-width: 28px;
  text-align: center;
}

/* ── Footer ── */
.tc__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-top: var(--space-5);
  margin-top: var(--space-2);
  border-top: 1px solid var(--color-border);
}

.tc__entries {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: 500;
}

.btn--disabled {
  opacity: 0.5;
  pointer-events: none;
}

.btn svg { margin-left: var(--space-1); }

/* ── Responsive ── */
@media (max-width: 480px) {
  .tc__toggle-btn {
    font-size: var(--text-xs);
    padding: var(--space-2) var(--space-3);
  }
  .tc__card {
    padding: var(--space-4) var(--space-5);
    gap: var(--space-4);
  }
  .tc__locked-items { flex-direction: column; }
}
</style>
