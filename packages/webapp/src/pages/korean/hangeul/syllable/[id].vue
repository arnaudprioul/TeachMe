<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHangeul } from '~/composables/useHangeul'
import { useHangeulAudio } from '~/composables/useHangeulAudio'
import { useCourses } from '~/composables/useCourses'
definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const route = useRoute()
const { getById } = useHangeul()
const { getBySlug } = useCourses()
const course = getBySlug('korean')!
const { speak, isSpeaking, isSupported } = useHangeulAudio()

// Choseong & Jungseong order in Unicode
const CHOSEONG_IDS = [
  'giyeok', 'ssang-giyeok', 'nieun', 'digeut', 'ssang-digeut', 'rieul',
  'mieum', 'bieup', 'ssang-bieup', 'siot', 'ssang-siot', 'ieung',
  'jieut', 'ssang-jieut', 'chieut', 'kieuk', 'tieut', 'pieup', 'hieut',
]

const JUNGSEONG_IDS = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye',
  'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we',
  'wi', 'yu', 'eu', 'ui', 'i',
]

const CHOSEONG_ROM: Record<string, string> = {
  'giyeok': 'g', 'ssang-giyeok': 'kk', 'nieun': 'n', 'digeut': 'd',
  'ssang-digeut': 'tt', 'rieul': 'r', 'mieum': 'm', 'bieup': 'b',
  'ssang-bieup': 'pp', 'siot': 's', 'ssang-siot': 'ss', 'ieung': '',
  'jieut': 'j', 'ssang-jieut': 'jj', 'chieut': 'ch', 'kieuk': 'k',
  'tieut': 't', 'pieup': 'p', 'hieut': 'h',
}

// Parse the route id (e.g., "giyeok-a")
const parsedIds = computed(() => {
  const id = route.params.id as string
  // Find the consonant that matches the start
  for (const cId of CHOSEONG_IDS) {
    if (id.startsWith(cId + '-')) {
      const vId = id.slice(cId.length + 1)
      if (JUNGSEONG_IDS.includes(vId)) {
        return { consonantId: cId, vowelId: vId }
      }
    }
  }
  return null
})

const consonant = computed(() => parsedIds.value ? getById(parsedIds.value.consonantId) : null)
const vowel = computed(() => parsedIds.value ? getById(parsedIds.value.vowelId) : null)

// Build the syllable from Unicode
const syllable = computed(() => {
  if (!parsedIds.value) return ''
  const ci = CHOSEONG_IDS.indexOf(parsedIds.value.consonantId)
  const vi = JUNGSEONG_IDS.indexOf(parsedIds.value.vowelId)
  if (ci < 0 || vi < 0) return ''
  return String.fromCharCode(0xAC00 + ci * 588 + vi * 28)
})

const romanization = computed(() => {
  if (!parsedIds.value || !vowel.value) return ''
  const cRom = CHOSEONG_ROM[parsedIds.value.consonantId] ?? ''
  return cRom + vowel.value.romanization
})

// Layout description (vertical vs horizontal vowel)
const layout = computed(() => {
  const v = parsedIds.value?.vowelId
  if (!v) return 'cv'
  // Horizontal vowels (placed below): ㅗ ㅛ ㅜ ㅠ ㅡ + composed
  const horizontal = ['o', 'yo', 'u', 'yu', 'eu', 'wa', 'wae', 'oe', 'wo', 'we', 'wi', 'ui']
  return horizontal.includes(v) ? 'horizontal' : 'vertical'
})
</script>

<template>
  <div class="syl page-container" :style="{ '--cc': course.color, '--cc-s': course.colorSubtle }">
    <Breadcrumb :items="[
      { label: t('nav.dashboard'), to: '/dashboard' },
      { label: t('courses.korean'), to: '/korean' },
      { label: t('korean.hangeul'), to: '/korean/hangeul' },
      { label: t('korean.hangeulSection.tableTitle'), to: '/korean/hangeul/table' },
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
          <span>{{ t('korean.practice.listen') }}</span>
        </button>
      </div>

      <!-- Composition breakdown -->
      <section class="card">
        <h2 class="card__title">Composition</h2>
        <div class="composition">
          <NuxtLink :to="`/korean/hangeul/practice/${consonant.id}`" class="comp-part">
            <span class="comp-part__char" :style="{ color: course.color }">{{ consonant.symbol }}</span>
            <span class="comp-part__name">{{ locale === 'fr' ? consonant.nameFr : consonant.name }}</span>
            <span class="comp-part__rom">{{ consonant.romanization }}</span>
            <span class="comp-part__type">{{ t(`korean.charType_${consonant.type}`) }}</span>
          </NuxtLink>

          <span class="comp-op">+</span>

          <NuxtLink :to="`/korean/hangeul/practice/${vowel.id}`" class="comp-part">
            <span class="comp-part__char" style="color: var(--color-primary)">{{ vowel.symbol }}</span>
            <span class="comp-part__name">{{ locale === 'fr' ? vowel.nameFr : vowel.name }}</span>
            <span class="comp-part__rom">{{ vowel.romanization }}</span>
            <span class="comp-part__type">{{ t(`korean.charType_${vowel.type}`) }}</span>
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
      <NuxtLink to="/korean/hangeul/table" class="btn btn--primary">Back to table</NuxtLink>
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
