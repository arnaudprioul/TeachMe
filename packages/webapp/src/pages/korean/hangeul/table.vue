<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCourses } from '~/composables/useCourses'
definePageMeta({ layout: 'default', middleware: 'auth' })
const { t } = useI18n()
const { getBySlug } = useCourses()
const course = getBySlug('korean')!

// Choseong (initial consonants) in Unicode order — id matches useHangeul
const consonants = [
  { id: 'giyeok', symbol: 'ㄱ', rom: 'g' },
  { id: 'ssang-giyeok', symbol: 'ㄲ', rom: 'kk' },
  { id: 'nieun', symbol: 'ㄴ', rom: 'n' },
  { id: 'digeut', symbol: 'ㄷ', rom: 'd' },
  { id: 'ssang-digeut', symbol: 'ㄸ', rom: 'tt' },
  { id: 'rieul', symbol: 'ㄹ', rom: 'r' },
  { id: 'mieum', symbol: 'ㅁ', rom: 'm' },
  { id: 'bieup', symbol: 'ㅂ', rom: 'b' },
  { id: 'ssang-bieup', symbol: 'ㅃ', rom: 'pp' },
  { id: 'siot', symbol: 'ㅅ', rom: 's' },
  { id: 'ssang-siot', symbol: 'ㅆ', rom: 'ss' },
  { id: 'ieung', symbol: 'ㅇ', rom: '—' },
  { id: 'jieut', symbol: 'ㅈ', rom: 'j' },
  { id: 'ssang-jieut', symbol: 'ㅉ', rom: 'jj' },
  { id: 'chieut', symbol: 'ㅊ', rom: 'ch' },
  { id: 'kieuk', symbol: 'ㅋ', rom: 'k' },
  { id: 'tieut', symbol: 'ㅌ', rom: 't' },
  { id: 'pieup', symbol: 'ㅍ', rom: 'p' },
  { id: 'hieut', symbol: 'ㅎ', rom: 'h' },
]

// Jungseong (medial vowels) in Unicode order — id matches useHangeul
const vowels = [
  { id: 'a', symbol: 'ㅏ', rom: 'a' },
  { id: 'ae', symbol: 'ㅐ', rom: 'ae' },
  { id: 'ya', symbol: 'ㅑ', rom: 'ya' },
  { id: 'yae', symbol: 'ㅒ', rom: 'yae' },
  { id: 'eo', symbol: 'ㅓ', rom: 'eo' },
  { id: 'e', symbol: 'ㅔ', rom: 'e' },
  { id: 'yeo', symbol: 'ㅕ', rom: 'yeo' },
  { id: 'ye', symbol: 'ㅖ', rom: 'ye' },
  { id: 'o', symbol: 'ㅗ', rom: 'o' },
  { id: 'wa', symbol: 'ㅘ', rom: 'wa' },
  { id: 'wae', symbol: 'ㅙ', rom: 'wae' },
  { id: 'oe', symbol: 'ㅚ', rom: 'oe' },
  { id: 'yo', symbol: 'ㅛ', rom: 'yo' },
  { id: 'u', symbol: 'ㅜ', rom: 'u' },
  { id: 'wo', symbol: 'ㅝ', rom: 'wo' },
  { id: 'we', symbol: 'ㅞ', rom: 'we' },
  { id: 'wi', symbol: 'ㅟ', rom: 'wi' },
  { id: 'yu', symbol: 'ㅠ', rom: 'yu' },
  { id: 'eu', symbol: 'ㅡ', rom: 'eu' },
  { id: 'ui', symbol: 'ㅢ', rom: 'ui' },
  { id: 'i', symbol: 'ㅣ', rom: 'i' },
]

// Generate syllable: consonant index × 588 + vowel index × 28 + 0xAC00
function syllable(ci: number, vi: number): string {
  return String.fromCharCode(0xAC00 + ci * 588 + vi * 28)
}
</script>

<template>
  <div class="table-page" :style="{ '--color-course': course.color, '--color-course-subtle': course.colorSubtle }">
    <Breadcrumb :items="[
      { label: t('nav.dashboard'), to: '/dashboard' },
      { label: t('courses.korean'), to: '/korean' },
      { label: t('korean.hangeul'), to: '/korean/hangeul' },
      { label: t('korean.hangeulSection.tableTitle') },
    ]" />

    <div class="table-page__header">
      <h1>{{ t('korean.hangeulSection.tableTitle') }}</h1>
      <p>{{ t('korean.hangeulSection.tableDesc') }}</p>
    </div>

    <div class="table-wrap">
      <table class="syllable-table">
        <thead>
          <tr>
            <th class="cell cell--corner" />
            <th v-for="(v, vi) in vowels" :key="vi" class="cell cell--vowel">
              <NuxtLink :to="`/korean/hangeul/practice/${v.id}`" class="cell__link">
                <span class="cell__char">{{ v.symbol }}</span>
                <span class="cell__rom">{{ v.rom }}</span>
              </NuxtLink>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, ci) in consonants" :key="ci">
            <th class="cell cell--cons">
              <NuxtLink :to="`/korean/hangeul/practice/${c.id}`" class="cell__link">
                <span class="cell__char">{{ c.symbol }}</span>
                <span class="cell__rom">{{ c.rom }}</span>
              </NuxtLink>
            </th>
            <td v-for="(v, vi) in vowels" :key="vi" class="cell cell--syl">
              <NuxtLink :to="`/korean/hangeul/practice/${c.id}`" class="cell__syl-link">
                {{ syllable(ci, vi) }}
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-8) var(--space-4);
}

.table-page__header h1 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-text);
}

.table-page__header p {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

/* Scrollable wrapper */
.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-bg-surface);
}

.syllable-table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}

/* ── Cells ── */
.cell {
  padding: 0;
  text-align: center;
  vertical-align: middle;
  border: 1px solid var(--color-border);
  height: 40px;
  font-size: var(--text-xs);
}

.cell--corner {
  position: sticky;
  left: 0;
  z-index: 3;
  background: var(--color-bg-muted);
  width: 50px;
}

/* Vowel headers (top row) */
.cell--vowel {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--color-primary-subtle);
  padding: var(--space-2) var(--space-1);
}

.cell--vowel .cell__char {
  display: block;
  font-family: var(--font-cjk-kr);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1.2;
}

.cell--vowel .cell__rom {
  display: block;
  font-size: 0.6rem;
  color: var(--color-text-subtle);
}

/* Consonant headers (first column) */
.cell--cons {
  position: sticky;
  left: 0;
  z-index: 2;
  background: var(--color-course-subtle);
  padding: var(--space-1) var(--space-2);
}

.cell--cons .cell__char {
  display: block;
  font-family: var(--font-cjk-kr);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-course);
  line-height: 1.2;
}

.cell--cons .cell__rom {
  display: block;
  font-size: 0.6rem;
  color: var(--color-text-subtle);
}

/* Syllable cells */
.cell--syl {
  font-family: var(--font-cjk-kr);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  background: var(--color-bg-surface);
  cursor: default;
  transition: background 100ms, color 100ms;
}

.cell--syl:hover {
  background: var(--color-primary-subtle);
}

/* Links */
.cell__link {
  display: flex; flex-direction: column; align-items: center;
  gap: 1px; text-decoration: none; color: inherit;
  width: 100%; height: 100%; justify-content: center;
  padding: var(--space-1);
}
.cell__link:hover .cell__char { opacity: 0.7; }

.cell__syl-link {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%;
  text-decoration: none; color: inherit;
  transition: color 100ms;
}
.cell__syl-link:hover {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
