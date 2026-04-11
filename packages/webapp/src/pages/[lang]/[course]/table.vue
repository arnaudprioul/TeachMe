<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const { lang, language, module, paths, tKey } = useCourseContext()

const course = computed(() => language.value!)

// ── Two rendering modes, picked from the module ────────────────────────
//
// 1. **composer-driven matrix** (Korean): the module declares an
//    `ISyllableComposer`, so we render an `initials × medials` table
//    with composed syllables in each cell.
// 2. **flat character grid** (Japanese hiragana / katakana, any course
//    without a composer): we just render every character as a card,
//    grouped by category. No fake syllable arithmetic.
const composer = computed(() => module.value?.syllables ?? null)
const hasMatrix = computed(() => composer.value !== null)

// Matrix-mode helpers — each row is an "initial" (e.g. consonant), each
// column is a "medial" (e.g. vowel). The composer's id arrays are
// already in the canonical iteration order for the script.
function buildSyllable(ci: number, vi: number) {
  return composer.value?.build(ci, vi) ?? { id: '', symbol: '', romanization: '' }
}

// Flat-grid helpers — group the module's characters by their category
// declarations so the table page mirrors the same hierarchy as the
// landing page.
const characterGroups = computed(() => {
  const m = module.value
  if (!m) return []
  return m.config.categories
    .map(cat => ({
      id: cat.id,
      labelKey: cat.labelKey,
      chars: m.characters.filter(c => cat.matches(c)),
    }))
    .filter(g => g.chars.length > 0)
})

// Resolve a character display label (symbol + romanization) by id, used
// to render the matrix headers without re-hardcoding the Korean lists.
function charById(id: string) {
  return module.value?.characters.find(c => c.id === id)
}
</script>

<template>
  <div class="table-page" :style="{ '--color-course': course?.color, '--color-course-subtle': course?.colorSubtle }">
    <Breadcrumb :items="[
      { label: t('nav.dashboard'), to: '/dashboard' },
      { label: t(`courses.${lang}.name`), to: paths.languageRoot },
      { label: t(tKey('title')), to: paths.root },
      { label: t(tKey('section.tableTitle')) },
    ]" />

    <div class="table-page__header">
      <h1>{{ t(tKey('section.tableTitle')) }}</h1>
      <p>{{ t(tKey('section.tableDesc')) }}</p>
    </div>

    <!-- ═══ MODE 1 — Composer-driven matrix (Korean Hangeul) ═══ -->
    <div v-if="hasMatrix && composer" class="table-wrap">
      <table class="syllable-table">
        <thead>
          <tr>
            <th class="cell cell--corner" />
            <th
              v-for="(v, vi) in composer.medials"
              :key="vi"
              class="cell cell--vowel"
            >
              <NuxtLink :to="paths.practice(v.id)" class="cell__link">
                <span class="cell__char">{{ charById(v.id)?.symbol ?? '' }}</span>
                <span class="cell__rom">{{ v.rom }}</span>
              </NuxtLink>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, ci) in composer.initials" :key="ci">
            <th class="cell cell--cons">
              <NuxtLink :to="paths.practice(c.id)" class="cell__link">
                <span class="cell__char">{{ charById(c.id)?.symbol ?? '' }}</span>
                <span class="cell__rom">{{ c.rom || '—' }}</span>
              </NuxtLink>
            </th>
            <td
              v-for="(v, vi) in composer.medials"
              :key="vi"
              class="cell cell--syl"
            >
              <NuxtLink :to="paths.syllable(`${c.id}-${v.id}`)" class="cell__syl-link">
                {{ buildSyllable(ci, vi).symbol }}
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ═══ MODE 2 — Flat character grid (Japanese kana, any course
         without a composer) ═══ -->
    <div v-else class="char-groups">
      <section
        v-for="group in characterGroups"
        :key="group.id"
        class="char-group"
      >
        <h2 class="char-group__title">{{ t(group.labelKey) }} <span class="light">({{ group.chars.length }})</span></h2>
        <div class="char-group__grid">
          <NuxtLink
            v-for="c in group.chars"
            :key="c.id"
            :to="paths.practice(c.id)"
            class="char-tile"
          >
            <span class="char-tile__sym">{{ c.symbol }}</span>
            <span class="char-tile__rom">{{ c.romanization }}</span>
          </NuxtLink>
        </div>
      </section>
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

/* ── Flat character grid (no composer) ── */
.char-groups { display: flex; flex-direction: column; gap: var(--space-8); }
.char-group { display: flex; flex-direction: column; gap: var(--space-4); }
.char-group__title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
}
.char-group__title .light { font-weight: 400; color: var(--color-text-muted); }
.char-group__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--space-2);
}
.char-tile {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-1);
  padding: var(--space-3) var(--space-2);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-fast);
}
.char-tile:hover {
  border-color: var(--color-course, var(--color-border-strong));
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}
.char-tile__sym {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1;
}
.char-tile__rom {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
</style>
