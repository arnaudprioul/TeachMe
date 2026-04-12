<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseData } from '~/composables/useCourseData'
import { useCourseAudio } from '~/composables/useCourseAudio'
import { useCourseContext } from '~/composables/useCourseContext'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const route = useRoute()
const { lang, language, module, paths, tKey } = useCourseContext()
const { getById } = useCourseData()
const { speak, isSpeaking, isSupported } = useCourseAudio()

const course = computed(() => language.value!)

// The whole page only makes sense for courses that have a syllable
// composer (currently Korean). For courses without one, redirect back
// to the course landing — there's nothing to display.
function bailIfNoComposer() {
  if (module.value && !module.value.syllables) {
    navigateTo(paths.value.root, { replace: true })
  }
}
onMounted(bailIfNoComposer)
watch(() => module.value?.key, bailIfNoComposer)

// Parse the route id (e.g. "giyeok-a") via the module's composer.
// Falls back to null if the module has no composer or the slug is
// invalid.
const parsedIds = computed(() => {
  const id = route.params.id as string
  return module.value?.syllables?.parse(id) ?? null
})

const consonant = computed(() => parsedIds.value ? getById(parsedIds.value.initialId) : null)
const vowel = computed(() => parsedIds.value ? getById(parsedIds.value.medialId) : null)

// Build the composed syllable + its romanization via the composer too
// — no more hardcoded Hangeul Unicode arithmetic.
const built = computed(() => {
  const m = module.value
  const p = parsedIds.value
  if (!m?.syllables || !p) return null
  const ci = m.syllables.initials.findIndex(i => i.id === p.initialId)
  const vi = m.syllables.medials.findIndex(v => v.id === p.medialId)
  if (ci < 0 || vi < 0) return null
  return m.syllables.build(ci, vi)
})

const syllable = computed(() => built.value?.symbol ?? '')
const romanization = computed(() => built.value?.romanization ?? '')

// Layout hint for the block diagram. Vowels whose canonical position is
// *below* the initial consonant (Hangeul: ㅗㅛㅜㅠㅡ + their composed
// forms) get the "horizontal" layout, vertical otherwise. Hardcoded for
// Korean for now — if other CJK courses ever ship a composer they can
// expose their own layout map via the module config.
const HORIZONTAL_VOWELS = new Set([
  'o', 'yo', 'u', 'yu', 'eu', 'wa', 'wae', 'oe', 'wo', 'we', 'wi', 'ui',
])
const layout = computed(() => {
  const v = parsedIds.value?.medialId
  if (!v) return 'vertical'
  return HORIZONTAL_VOWELS.has(v) ? 'horizontal' : 'vertical'
})
</script>

<template>
  <div class="syl page-container" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle }">
    <Breadcrumb :items="[
      { label: t('nav.dashboard'), to: '/dashboard' },
      { label: t(`courses.${lang}.name`), to: paths.languageRoot },
      { label: t(tKey('title')), to: paths.root },
      { label: t(tKey('section.tableTitle')), to: paths.table },
      { label: syllable },
    ]" />

    <template v-if="consonant && vowel">
      <!-- Hero -->
      <div class="syl__hero">
        <div class="syl__char">{{ syllable }}</div>
        <div class="syl__rom">{{ romanization }}</div>
        <div class="syl__meta">
          <span>Syllable</span>
          <span class="meta-dot">·</span>
          <span>{{ layout === 'horizontal' ? 'Stacked' : 'Side by side' }}</span>
        </div>

        <!-- Audio button -->
        <button v-if="isSupported" class="audio-btn" :class="{ 'audio-btn--active': isSpeaking }" @click="speak(syllable)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          <span>{{ t(tKey('practice.listen')) }}</span>
        </button>
      </div>

      <!-- Composition breakdown -->
      <section class="card">
        <h2 class="card__title">Composition</h2>
        <div class="composition">
          <NuxtLink :to="paths.practice(consonant.id)" class="comp-part">
            <span class="comp-part__char" :style="{ color: course.color }">{{ consonant.symbol }}</span>
            <span class="comp-part__name">{{ locale === 'fr' ? consonant.nameFr : consonant.name }}</span>
            <span class="comp-part__rom">{{ consonant.romanization }}</span>
            <span class="comp-part__type">{{ t(tKey(`charType_${consonant.type}`)) }}</span>
          </NuxtLink>

          <span class="comp-op">+</span>

          <NuxtLink :to="paths.practice(vowel.id)" class="comp-part">
            <span class="comp-part__char" style="color: var(--color-primary)">{{ vowel.symbol }}</span>
            <span class="comp-part__name">{{ locale === 'fr' ? vowel.nameFr : vowel.name }}</span>
            <span class="comp-part__rom">{{ vowel.romanization }}</span>
            <span class="comp-part__type">{{ t(tKey(`charType_${vowel.type}`)) }}</span>
          </NuxtLink>

          <span class="comp-op">=</span>

          <div class="comp-result">
            <span class="comp-part__char">{{ syllable }}</span>
            <span class="comp-part__rom">{{ romanization }}</span>
          </div>
        </div>
      </section>

      <!-- Pronunciation breakdown -->
      <section class="card">
        <h2 class="card__title">Pronunciation</h2>
        <div class="rows">
          <div class="row">
            <span class="row__label">Initial sound</span>
            <span class="row__val">{{ locale === 'fr' ? consonant.pronunciationFr : consonant.pronunciation }}</span>
          </div>
          <div class="row">
            <span class="row__label">Vowel sound</span>
            <span class="row__val">{{ locale === 'fr' ? vowel.pronunciationFr : vowel.pronunciation }}</span>
          </div>
          <div class="row">
            <span class="row__label">IPA</span>
            <span class="row__val row__val--mono">/{{ consonant.ipa }}{{ vowel.ipa }}/</span>
          </div>
        </div>
      </section>

      <!-- Block layout explanation -->
      <section class="card">
        <h2 class="card__title">Block Structure</h2>
        <p class="explain">
          This syllable uses a
          <strong>{{ layout === 'horizontal' ? 'stacked (top + bottom)' : 'side-by-side (left + right)' }}</strong>
          layout because the vowel
          <span class="kr">{{ vowel.symbol }}</span>
          is {{ layout === 'horizontal' ? 'horizontal' : 'vertical' }}.
        </p>
        <div class="block-demo" :class="`block-demo--${layout}`">
          <div class="block-demo__cell" :style="{ background: course.colorSubtle, color: course.color }">{{ consonant.symbol }}</div>
          <div class="block-demo__cell" style="background: var(--color-primary-subtle); color: var(--color-primary)">{{ vowel.symbol }}</div>
        </div>
      </section>
    </template>

    <template v-else>
      <p class="error">Syllable not found</p>
      <NuxtLink :to="paths.table" class="btn btn--primary">Back to table</NuxtLink>
    </template>
  </div>
</template>

<style scoped>
.syl { display: flex; flex-direction: column; gap: var(--space-5); }

/* ── Hero ── */
.syl__hero {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: var(--space-2);
  padding: var(--space-10) var(--space-6);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
}

.syl__char {
  font-family: var(--font-cjk-kr);
  font-size: 7rem; font-weight: 700;
  color: var(--color-text); line-height: 1;
}

.syl__rom {
  font-size: var(--text-2xl); font-weight: 600;
  color: var(--color-text-muted);
  margin-top: var(--space-2);
}

.syl__meta {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-xs); color: var(--color-text-subtle);
  margin-top: var(--space-2);
}
.meta-dot { color: var(--color-border-strong); }

.audio-btn {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full); border: 1px solid var(--color-border);
  background: var(--color-bg-surface); color: var(--color-text-muted);
  font-size: var(--text-xs); font-weight: 500; cursor: pointer;
  margin-top: var(--space-4);
  transition: all var(--transition-fast);
}
.audio-btn:hover { color: var(--color-primary); border-color: var(--color-primary); }
.audio-btn--active { color: var(--color-primary); border-color: var(--color-primary); background: var(--color-primary-subtle); }

/* ── Card ── */
.card {
  display: flex; flex-direction: column; gap: var(--space-3);
  padding: var(--space-5);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
}

.card__title {
  font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted);
  text-transform: uppercase; letter-spacing: 0.05em;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

/* Composition */
.composition {
  display: flex; align-items: center; justify-content: center;
  gap: var(--space-3); padding: var(--space-4) 0;
  flex-wrap: wrap;
}

.comp-part {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-muted);
  border-radius: var(--radius-lg);
  text-decoration: none;
  min-width: 100px;
  transition: all var(--transition-fast);
}
.comp-part:hover { background: var(--color-bg-surface); box-shadow: var(--shadow-sm); }

.comp-part__char {
  font-family: var(--font-cjk-kr);
  font-size: 2.5rem; font-weight: 700;
  line-height: 1;
}

.comp-part__name {
  font-size: var(--text-xs); font-weight: 600;
  color: var(--color-text); margin-top: var(--space-1);
}

.comp-part__rom {
  font-size: var(--text-xs); color: var(--color-text-muted);
}

.comp-part__type {
  font-size: 0.6rem; color: var(--color-text-subtle);
  text-transform: uppercase; letter-spacing: 0.05em;
}

.comp-op {
  font-size: var(--text-xl); font-weight: 300;
  color: var(--color-text-subtle);
}

.comp-result {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: var(--space-4) var(--space-5);
  background: var(--color-primary-subtle);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-lg);
  min-width: 100px;
}
.comp-result .comp-part__char { color: var(--color-primary); }
.comp-result .comp-part__rom { color: var(--color-primary-dark); font-weight: 600; }

/* Rows */
.rows { display: flex; flex-direction: column; gap: var(--space-3); }
.row { display: flex; flex-direction: column; gap: 2px; }
.row__label { font-size: var(--text-xs); color: var(--color-text-subtle); font-weight: 500; }
.row__val { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.5; }
.row__val--mono { font-family: var(--font-mono); font-size: var(--text-base); color: var(--color-primary); font-weight: 600; }

/* Block layout demo */
.explain {
  font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.6;
}
.explain strong { color: var(--color-text); }
.explain .kr { font-family: var(--font-cjk-kr); font-weight: 700; }

.block-demo {
  display: grid; gap: var(--space-2);
  width: 140px; height: 140px;
  margin: var(--space-4) auto 0;
  border: 2px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  padding: var(--space-2);
}
.block-demo--vertical {
  grid-template-columns: 1fr 1fr;
}
.block-demo--horizontal {
  grid-template-rows: 1fr 1fr;
}

.block-demo__cell {
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-cjk-kr); font-size: 2.5rem; font-weight: 700;
  border-radius: var(--radius-md);
}

.error { color: var(--color-text-muted); margin-bottom: var(--space-4); }

@media (max-width: 480px) {
  .syl__char { font-size: 5rem; }
  .composition { gap: var(--space-2); }
  .comp-part { padding: var(--space-3); min-width: 80px; }
  .comp-part__char { font-size: 2rem; }
}
</style>
