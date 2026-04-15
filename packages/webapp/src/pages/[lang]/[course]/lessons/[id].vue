<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonQuizStore } from '~/stores/lesson-quiz.store'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const route = useRoute()
const { lang, module, language, paths, tKey } = useCourseContext()
const quiz = useLessonQuizStore()

const course = computed(() => language.value!)
const lessonId = computed(() => Number(route.params.id))
const lesson = computed(() => module.value?.lessons?.find(l => l.id === lessonId.value))

onMounted(() => { if (!lesson.value) navigateTo(paths.value.lessons) })

const hasContent = computed(() => !!lesson.value?.content?.length)
const hasExercises = computed(() => !!lesson.value?.exercises?.length)

function startVocabQuiz() {
  if (!lesson.value) return
  quiz.bind(lesson.value)
  quiz.start()
  navigateTo(paths.value.lessonQuiz(lessonId.value))
}

function printVocab() { window.print() }

// Floating word characters for hero
const heroChars = computed(() => {
  const w = lesson.value?.words ?? []
  const slots = [
    { x: '8%', y: '10%', s: '2.8rem', d: '0s', o: 0.08 },
    { x: '55%', y: '5%', s: '2rem', d: '0.5s', o: 0.06 },
    { x: '82%', y: '18%', s: '3.2rem', d: '1.1s', o: 0.07 },
    { x: '25%', y: '35%', s: '3rem', d: '0.3s', o: 0.09 },
    { x: '68%', y: '40%', s: '2.2rem', d: '1.8s', o: 0.05 },
    { x: '12%', y: '65%', s: '2.4rem', d: '0.8s', o: 0.06 },
    { x: '48%', y: '70%', s: '3.5rem', d: '1.4s', o: 0.08 },
    { x: '88%', y: '55%', s: '2rem', d: '0.2s', o: 0.05 },
  ]
  return slots.map((s, i) => ({
    ...s,
    char: w[(i * 3 + 1) % w.length]?.word.charAt(0) ?? '',
  }))
})
</script>

<template>
  <div v-if="lesson" class="lp" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle, '--cc-l': course?.colorLight }">

    <div class="contained bc-row">
      <Breadcrumb :items="[
        { label: t('nav.dashboard'), to: '/dashboard' },
        { label: t(`courses.${lang}.name`), to: paths.languageRoot },
        { label: t(tKey('title')), to: paths.root },
        { label: t(tKey('lessons.title')), to: paths.lessons },
        { label: t(tKey('lessons.lesson'), { n: lesson.id }) },
      ]" />
    </div>

    <!-- ════════════════════════════════════════════════════
         HERO — full width, gradient
         ════════════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero__cloud" aria-hidden="true">
        <span
          v-for="(s, i) in heroChars" :key="i" class="hero__char"
          :style="{ left: s.x, top: s.y, fontSize: s.s, animationDelay: s.d, opacity: s.o }"
        >{{ s.char }}</span>
      </div>
      <div class="hero__inner contained">
        <NuxtLink :to="paths.lessons" class="hero__back" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </NuxtLink>
        <span class="hero__eyebrow">{{ t(tKey('lessons.lesson'), { n: lesson.id }) }}</span>
        <h1>{{ t(tKey(`lessons.theme.${lesson.themeKey}`)) }}</h1>
        <p class="hero__sub">{{ t(tKey('lessons.wordsToLearn'), { n: lesson.words.length }) }}</p>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
         VOCABULARY — full-width warm band
         ════════════════════════════════════════════════════ -->
    <section class="band band--warm">
      <div class="contained">
        <div class="section-head">
          <span class="chip chip--warm">{{ t('lessonPage.vocabulary') }}</span>
          <h2>{{ t(tKey(`lessons.theme.${lesson.themeKey}`)) }}</h2>
          <p>{{ t(tKey('lessons.studyWords')) }}</p>
        </div>

        <div class="vocab-grid">
          <VocabCard
            v-for="word in lesson.words" :key="word.id"
            :word="word" :locale="(locale as 'en' | 'fr')"
          />
        </div>

        <div class="section-actions">
          <button class="cta-btn" @click="startVocabQuiz">
            {{ t('lessonPage.trainVocab') }}
          </button>
          <button class="cta-btn cta-btn--ghost" @click="printVocab">
            {{ t('lessonPage.downloadPdf') }}
          </button>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
         COURSE — each block is its own full-width section
         ════════════════════════════════════════════════════ -->
    <template v-if="hasContent">
      <LessonContentBlock
        v-for="(block, i) in lesson.content" :key="i"
        :block="block"
      />
    </template>

    <!-- ════════════════════════════════════════════════════
         EXERCISES — full-width accent band
         ════════════════════════════════════════════════════ -->
    <section v-if="hasExercises" class="band band--accent">
      <div class="contained exercises">
        <h2>{{ t('lessonPage.exercises') }}</h2>
        <p class="exercises__sub">{{ lesson.exercises!.length }} {{ t('lessonPage.exercises').toLowerCase() }}</p>

        <div class="exercises__grid">
          <NuxtLink
            :to="`${paths.lesson(lessonId)}/exercises?difficulty=easy`"
            class="ex-card"
          >
            <span class="ex-card__level">{{ t('lessonPage.easy') }}</span>
            <span class="ex-card__count">{{ lesson.exercises!.filter(e => e.difficulty === 'easy').length }}</span>
            <span class="ex-card__label">{{ t('lessonPage.exercises').toLowerCase() }}</span>
          </NuxtLink>

          <NuxtLink
            :to="`${paths.lesson(lessonId)}/exercises?difficulty=medium`"
            class="ex-card"
          >
            <span class="ex-card__level">{{ t('lessonPage.medium') }}</span>
            <span class="ex-card__count">{{ lesson.exercises!.filter(e => e.difficulty === 'medium').length }}</span>
            <span class="ex-card__label">{{ t('lessonPage.exercises').toLowerCase() }}</span>
          </NuxtLink>

          <NuxtLink
            :to="`${paths.lesson(lessonId)}/exercises?difficulty=hard`"
            class="ex-card"
          >
            <span class="ex-card__level">{{ t('lessonPage.hard') }}</span>
            <span class="ex-card__count">{{ lesson.exercises!.filter(e => e.difficulty === 'hard').length }}</span>
            <span class="ex-card__label">{{ t('lessonPage.exercises').toLowerCase() }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
         BACK
         ════════════════════════════════════════════════════ -->
    <div class="contained back-row">
      <NuxtLink :to="paths.lessons" class="btn btn--ghost">{{ t('common.back') }}</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.lp { display: flex; flex-direction: column; }
.contained { max-width: 960px; margin: 0 auto; width: 100%; padding: 0 var(--space-6); }
.bc-row { padding-top: var(--space-4); padding-bottom: 0; }

/* ══════════ HERO ══════════ */
.hero {
  position: relative; overflow: hidden;
  background: linear-gradient(160deg, var(--cc) 0%, color-mix(in srgb, var(--cc) 60%, #1a1035) 100%);
  padding: var(--space-16) 0 var(--space-12); color: #fff; text-align: center;
}
.hero__cloud { position: absolute; inset: 0; pointer-events: none; }
.hero__char {
  position: absolute; font-family: var(--font-cjk-kr); font-weight: 700;
  color: #fff; animation: hero-bob 6s ease-in-out infinite;
}
@keyframes hero-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
.hero__inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: var(--space-3); }
.hero__back {
  position: absolute; left: 0; top: 0;
  width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full); color: rgba(255,255,255,0.7); text-decoration: none;
}
.hero__back:hover { background: rgba(255,255,255,0.15); color: #fff; }
.hero__eyebrow { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.6; }
.hero h1 { font-size: var(--text-4xl); font-weight: 800; margin: 0; letter-spacing: -0.02em; }
.hero__sub { font-size: var(--text-sm); opacity: 0.7; }

/* ══════════ BANDS ══════════ */
.band { padding: var(--space-10) 0; }
.band--warm { background: var(--cc-s, #fff8f0); }
.band--muted { background: var(--color-bg-muted); }
.band--accent {
  background: linear-gradient(135deg, color-mix(in srgb, var(--cc) 10%, #fff) 0%, var(--color-bg-muted) 100%);
}

/* ══════════ CHIPS ══════════ */
.chip {
  display: inline-block; padding: 3px var(--space-3); border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
}
.chip--warm { background: color-mix(in srgb, var(--cc) 15%, #fff); color: var(--cc); }
.chip--cool { background: var(--color-primary-subtle); color: var(--color-primary); }

/* ══════════ SECTION HEAD ══════════ */
.section-head { margin-bottom: var(--space-6); }
.section-head h2 { font-size: var(--text-xl); font-weight: 700; color: var(--color-text); margin: var(--space-2) 0 0; }
.section-head p { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-1); }

.section-actions { display: flex; justify-content: center; gap: var(--space-3); margin-top: var(--space-8); flex-wrap: wrap; }

/* ══════════ VOCAB GRID ══════════ */
.vocab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-3);
}

/* ══════════ CTA BUTTON ══════════ */
.cta-btn {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--cc, var(--color-primary)); color: #fff; border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-sm); font-weight: 700; cursor: pointer;
  transition: all var(--transition-fast); box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
.cta-btn--ghost {
  background: transparent; color: var(--color-text-secondary);
  border: 1px solid var(--color-border); box-shadow: none;
}
.cta-btn--ghost:hover { border-color: var(--color-border-strong); background: var(--color-bg-surface); transform: none; box-shadow: none; }

/* ══════════ COURSE ══════════ */

/* ══════════ EXERCISES ══════════ */
.exercises { text-align: center; }
.exercises h2 { font-size: var(--text-xl); font-weight: 700; color: var(--color-text); margin: 0; }
.exercises__sub { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-1); }
.exercises__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); margin-top: var(--space-6); }

.ex-card {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
  padding: var(--space-6) var(--space-4);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl); text-decoration: none;
  transition: all 200ms ease;
}
.ex-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--cc); }
.ex-card__level { font-size: var(--text-sm); font-weight: 700; color: var(--cc, var(--color-primary)); text-transform: uppercase; letter-spacing: 0.05em; }
.ex-card__count { font-size: var(--text-3xl); font-weight: 800; color: var(--color-text); }
.ex-card__label { font-size: var(--text-xs); color: var(--color-text-muted); }

/* ══════════ BACK ══════════ */
.back-row { display: flex; justify-content: center; padding: var(--space-10) 0 var(--space-16); }

/* ══════════ PRINT ══════════ */
@media print {
  .hero, .course-intro, .course-blocks, .exercises, .band--accent, .back-row, .section-actions { display: none !important; }
  .band--warm { background: #fff !important; padding: var(--space-4) 0 !important; }
  .vocab-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 6px !important; }
}

/* ══════════ RESPONSIVE ══════════ */
@media (max-width: 640px) {
  .hero { padding: var(--space-10) 0 var(--space-8); }
  .hero h1 { font-size: var(--text-2xl); }
  .vocab-grid { grid-template-columns: 1fr; }
  .exercises__grid { grid-template-columns: 1fr; }
}
</style>
