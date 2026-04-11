<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useHangeul } from '~/composables/useHangeul'
import { useHangeulAudio } from '~/composables/useHangeulAudio'
import { useCourses } from '~/composables/useCourses'
import { HANGEUL_PHONETICS } from '~/composables/data/hangeulPhonetics'
import { getSpeechText } from '~/composables/data/hangeulSpeech'
definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const route = useRoute()
const { getById, getPrev, getNext } = useHangeul()
const { getBySlug } = useCourses()
const course = getBySlug('korean')!

const charId = computed(() => route.params.id as string)
const char = computed(() => getById(charId.value))
const prev = computed(() => char.value ? getPrev(char.value.id) : undefined)
const next = computed(() => char.value ? getNext(char.value.id) : undefined)

const phonetic = computed(() => {
  const data = HANGEUL_PHONETICS[charId.value]
  return data?.[locale.value] ?? data?.en
})

const localizedName = computed(() =>
  locale.value === 'fr' ? char.value?.nameFr : char.value?.name,
)

const { speak, isSpeaking, isSupported } = useHangeulAudio()
const drawMode = ref(false)
</script>

<template>
  <div class="p" :style="{ '--color-course': course.color, '--color-course-subtle': course.colorSubtle }">

    <!-- ══════ DRAW MODE (full-screen) ══════ -->
    <div v-if="drawMode && char" class="draw-overlay">
      <div class="draw-header">
        <button class="draw-close" @click="drawMode = false" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="draw-header__title">
          <span>{{ localizedName }}</span>
          <span class="draw-header__rom">{{ char.romanization }}</span>
        </div>
        <button v-if="isSupported" class="draw-sound" @click="speak(getSpeechText(char.id, char.symbol))" :class="{ 'draw-sound--active': isSpeaking }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </button>
      </div>
      <WritingCanvas :char-id="charId" />
    </div>

    <!-- ══════ NORMAL VIEW ══════ -->
    <template v-if="!drawMode">
      <div class="page-container p__inner">
        <Breadcrumb :items="[
          { label: t('nav.dashboard'), to: '/dashboard' },
          { label: t('courses.korean'), to: '/korean' },
          { label: t('korean.hangeul'), to: '/korean/hangeul' },
          { label: t('korean.hangeulSection.tableTitle'), to: '/korean/hangeul/table' },
          { label: char?.symbol ?? '...' },
        ]" />

        <template v-if="char">
          <!-- ── Quick nav prev/next at top ── -->
          <div class="quick-nav">
            <NuxtLink to="/korean/hangeul/table" class="quick-nav__back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              {{ t('korean.backToGrid') }}
            </NuxtLink>
            <div class="quick-nav__arrows">
              <NuxtLink v-if="prev" :to="`/korean/hangeul/practice/${prev.id}`" class="quick-nav__arrow" :aria-label="t('korean.prevChar')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                <span class="quick-nav__arrow-char">{{ prev.symbol }}</span>
              </NuxtLink>
              <span v-else class="quick-nav__placeholder" />
              <NuxtLink v-if="next" :to="`/korean/hangeul/practice/${next.id}`" class="quick-nav__arrow" :aria-label="t('korean.nextChar')">
                <span class="quick-nav__arrow-char">{{ next.symbol }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </NuxtLink>
              <span v-else class="quick-nav__placeholder" />
            </div>
          </div>

          <!-- ── Hero: character + stroke order ── -->
          <div class="char-hero">
            <div class="char-hero__display">
              <StrokeAnimation :char-id="charId" />
            </div>

            <div class="char-hero__info">
              <h1 class="char-hero__name">{{ localizedName }}</h1>
              <div class="char-hero__rom">{{ char.romanization }}</div>
              <div class="char-hero__meta">
                <span>{{ t(`korean.charType_${char.type}`) }}</span>
                <span class="meta-dot">·</span>
                <span>{{ t(`korean.charSubtype_${char.subtype}`) }}</span>
                <span class="meta-dot">·</span>
                <span>{{ t('korean.strokeCount', { n: char.strokeCount }) }}</span>
              </div>
            </div>

            <div class="char-hero__actions">
              <button v-if="isSupported" class="act" @click="speak(getSpeechText(char.id, char.symbol))" :class="{ 'act--active': isSpeaking }" :aria-label="t('korean.practice.playSound')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                <span>{{ t('korean.practice.listen') }}</span>
              </button>
              <button class="act act--primary" @click="drawMode = true" :aria-label="t('korean.practice.write')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>{{ t('korean.practice.write') }}</span>
              </button>
            </div>
          </div>

          <div class="sections">
          <!-- ── Phonetics ── -->
          <section v-if="phonetic" class="card">
            <h2 class="card__title">{{ t('korean.practice.phonetics') }}</h2>
            <div class="rows">
              <div class="row">
                <span class="row__label">IPA</span>
                <span class="row__val row__val--mono">/{{ char.ipa }}/</span>
              </div>
              <div class="row">
                <span class="row__label">{{ t('korean.practice.soundsLike') }}</span>
                <span class="row__val">{{ phonetic.soundsLike }}</span>
              </div>
              <div class="row">
                <span class="row__label">{{ t('korean.practice.mouthDesc') }}</span>
                <span class="row__val">{{ phonetic.mouthDescription }}</span>
              </div>
            </div>
            <div v-if="phonetic.tip" class="tip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              {{ phonetic.tip }}
            </div>
          </section>

          <!-- ── Mouth position ── -->
          <section class="card">
            <h2 class="card__title">{{ t('korean.practice.mouthPosition') }}</h2>
            <MouthDiagram :place="char.articulation" />
          </section>

          <!-- ── Jamo infos ── -->
          <section class="card">
            <h2 class="card__title">Jamo</h2>
            <div class="rows">
              <div class="row">
                <span class="row__label">Name</span>
                <span class="row__val">{{ localizedName }}</span>
              </div>
              <div class="row">
                <span class="row__label">Kind</span>
                <span class="row__val">{{ t(`korean.charType_${char.type}`) }} — {{ t(`korean.charSubtype_${char.subtype}`) }}</span>
              </div>
            </div>
          </section>

          <!-- ── Examples ── -->
          <section class="card">
            <h2 class="card__title">{{ t('korean.examples') }}</h2>
            <div class="examples">
              <div v-for="ex in char.examples" :key="ex.syllable" class="ex">
                <span class="ex__char">{{ ex.syllable }}</span>
                <span class="ex__rom">{{ ex.romanization }}</span>
              </div>
            </div>
          </section>

          <!-- ── Prev / Next big buttons ── -->
          <nav class="char-nav">
            <NuxtLink v-if="prev" :to="`/korean/hangeul/practice/${prev.id}`" class="nav-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              <span class="nav-link__char">{{ prev.symbol }}</span>
              <span class="nav-link__label">{{ t('korean.prevChar') }}</span>
            </NuxtLink>
            <span v-else />
            <NuxtLink v-if="next" :to="`/korean/hangeul/practice/${next.id}`" class="nav-link">
              <span class="nav-link__label">{{ t('korean.nextChar') }}</span>
              <span class="nav-link__char">{{ next.symbol }}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </NuxtLink>
            <span v-else />
          </nav>
          </div>
        </template>

        <template v-else>
          <p style="color: var(--color-text-muted)">{{ t('common.error') }}</p>
          <NuxtLink to="/korean/hangeul/table" class="btn btn--primary">{{ t('korean.backToGrid') }}</NuxtLink>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.p { display: flex; flex-direction: column; }
.p__inner { display: flex; flex-direction: column; gap: var(--space-5); }
.sections { display: flex; flex-direction: column; gap: var(--space-5); }

/* ══════════ Quick nav (back + arrows) ══════════ */
.quick-nav {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-3);
}

.quick-nav__back {
  display: inline-flex; align-items: center; gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface); color: var(--color-text-secondary);
  font-size: var(--text-xs); font-weight: 500; text-decoration: none;
  transition: all var(--transition-fast);
}
.quick-nav__back:hover { border-color: var(--color-border-strong); color: var(--color-text); }

.quick-nav__arrows {
  display: flex; align-items: center; gap: var(--space-2);
}

.quick-nav__arrow {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface); color: var(--color-text-secondary);
  font-size: var(--text-sm); text-decoration: none;
  transition: all var(--transition-fast);
}
.quick-nav__arrow:hover { border-color: var(--color-course); color: var(--color-course); }
.quick-nav__arrow-char { font-family: var(--font-cjk-kr); font-weight: 600; }
.quick-nav__placeholder { width: 56px; }

/* ══════════ HERO — character + strokes ══════════ */
.char-hero {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: var(--space-4);
  padding: var(--space-8) var(--space-6);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
}

.char-hero__display {
  width: 240px; height: 240px;
  display: flex; align-items: center; justify-content: center;
}


.char-hero__info {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-1);
}

.char-hero__name { font-size: var(--text-lg); font-weight: 600; color: var(--color-text); }
.char-hero__rom { font-size: var(--text-xl); font-weight: 500; color: var(--color-text-muted); }

.char-hero__meta {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--text-xs); color: var(--color-text-subtle);
  margin-top: var(--space-1);
}
.meta-dot { color: var(--color-border-strong); }

/* Action buttons */
.char-hero__actions {
  display: flex; gap: var(--space-2); margin-top: var(--space-4);
}

.act {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full); border: 1px solid var(--color-border);
  background: var(--color-bg-surface); color: var(--color-text-muted);
  font-size: var(--text-xs); font-weight: 500; cursor: pointer;
  transition: all 150ms;
}
.act span { display: none; }
.act:hover { border-color: var(--color-border-strong); color: var(--color-text); }
.act--active { color: var(--color-primary); border-color: var(--color-primary); }
.act--primary { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.act--primary:hover { opacity: 0.85; }

@media (min-width: 480px) {
  .act span { display: inline; }
}

/* ══════════ CARDS ══════════ */
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

.rows { display: flex; flex-direction: column; gap: var(--space-3); }
.row { display: flex; flex-direction: column; gap: 2px; }
.row__label { font-size: var(--text-xs); color: var(--color-text-subtle); font-weight: 500; }
.row__val { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.5; }
.row__val--mono { font-family: var(--font-mono); font-size: var(--text-base); color: var(--color-primary); font-weight: 600; }

.tip {
  display: flex; align-items: flex-start; gap: var(--space-2);
  padding: var(--space-3); background: var(--color-bg-muted);
  border-radius: var(--radius-md); font-size: var(--text-xs);
  color: var(--color-text-muted); line-height: 1.5;
}
.tip svg { flex-shrink: 0; margin-top: 1px; }

.examples { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.ex {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-muted); border-radius: var(--radius-lg);
}
.ex__char { font-size: 1.5rem; font-weight: 600; font-family: var(--font-cjk-kr); color: var(--color-text); line-height: 1; }
.ex__rom { font-size: 0.6875rem; color: var(--color-text-muted); }

/* ══════════ NAV ══════════ */
.char-nav {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: var(--space-4); border-top: 1px solid var(--color-border);
}

.nav-link {
  display: flex; align-items: center; gap: var(--space-2);
  text-decoration: none; color: var(--color-text-muted); transition: color 150ms;
}
.nav-link:hover { color: var(--color-text); }
.nav-link__char { font-family: var(--font-cjk-kr); font-size: var(--text-lg); font-weight: 600; color: var(--color-text); }
.nav-link__label { font-size: var(--text-sm); }

/* ══════════ DRAW OVERLAY ══════════ */
.draw-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: var(--color-bg);
  display: flex; flex-direction: column;
  overflow-y: auto;
}

.draw-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-surface); flex-shrink: 0;
}

.draw-close {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full); border: none;
  background: var(--color-bg-muted); color: var(--color-text-muted); cursor: pointer;
}
.draw-close:hover { color: var(--color-text); }

.draw-header__title {
  display: flex; flex-direction: column; align-items: center; gap: 1px;
}
.draw-header__title span:first-child { font-size: var(--text-sm); font-weight: 600; color: var(--color-text); }
.draw-header__rom { font-size: var(--text-xs); color: var(--color-text-muted); }

.draw-sound {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full); border: 1px solid var(--color-border);
  background: var(--color-bg-surface); color: var(--color-primary); cursor: pointer;
}
.draw-sound--active { background: var(--color-primary); color: #fff; }

.draw-overlay :deep(.wc) { flex: 1; padding: var(--space-3) 0; }
.draw-overlay :deep(.wc__area) { padding: 0; }
.draw-overlay :deep(.wc__canvas) { max-width: none; border-radius: 0; border-left: none; border-right: none; }

@media (max-width: 480px) {
  .char-hero__display { width: 180px; height: 180px; }
}
</style>
