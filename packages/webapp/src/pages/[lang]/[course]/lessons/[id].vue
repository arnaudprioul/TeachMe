<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonQuizStore } from '~/stores/lesson-quiz.store'
import { useReviewsStore } from '~/stores/reviews.store'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const route = useRoute()
const { lang, module, language, paths, tKey, courseKey } = useCourseContext()
const quiz = useLessonQuizStore()
const reviews = useReviewsStore()

const allInReview = computed(() => {
  if (!lesson.value?.words.length) return false
  return lesson.value.words.every(w =>
    reviews.isInDeck(lang.value, w.id, courseKey.value, lessonId.value)
  )
})

const addingToReview = ref(false)

async function toggleAllReview() {
  if (!lesson.value?.words.length || addingToReview.value) return
  addingToReview.value = true
  try {
    if (allInReview.value) {
      // Remove all from deck
      for (const w of lesson.value.words) {
        const card = reviews.findCard(lang.value, w.id, courseKey.value, lessonId.value)
        if (card) await reviews.remove(card.id)
      }
    } else {
      // Add missing to deck
      for (const w of lesson.value.words) {
        if (!reviews.isInDeck(lang.value, w.id, courseKey.value, lessonId.value)) {
          await reviews.add({ lang: lang.value, wordId: w.id, courseId: courseKey.value, lessonId: lessonId.value })
        }
      }
    }
  } finally {
    addingToReview.value = false
  }
}

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

// ── Vocab section collapse ──
const vocabOpen = ref(false)

// ── Floating abstract shapes (generated with seeded random) ──
const SHAPE_TYPES = ['ring', 'dot', 'cross', 'line', 'blob', 'square', 'tri'] as const

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

const floatingShapes = computed(() => {
  const rand = seededRandom(lessonId.value * 7919 + 42)
  const contentBlocks = lesson.value?.content?.length ?? 6
  // Estimate page height: hero(500) + vocab(400) + blocks * ~500 + exercises(400)
  const count = Math.min(45, Math.max(25, contentBlocks * 4))
  const shapes: Array<{
    type: string
    top: number
    left: number
    size: number
    opacity: number
    duration: number
    delay: number
    rotation: number
    borderWidth?: number
  }> = []

  for (let i = 0; i < count; i++) {
    const type = SHAPE_TYPES[Math.floor(rand() * SHAPE_TYPES.length)]
    const top = rand() * 96 + 2 // 2% to 98%
    const left = rand() * 90 + 2 // 2% to 92%
    const opacity = rand() * 0.5 + 0.2 // 20% to 70%

    let size: number
    if (type === 'ring') size = Math.floor(rand() * 160 + 50) // 50-210
    else if (type === 'blob') size = Math.floor(rand() * 120 + 60) // 60-180
    else if (type === 'line') size = Math.floor(rand() * 100 + 40) // 40-140
    else size = Math.floor(rand() * 20 + 8) // 8-28

    shapes.push({
      type,
      top,
      left,
      size,
      opacity,
      duration: Math.floor(rand() * 10 + 8), // 8-18s
      delay: -Math.floor(rand() * 12), // -12 to 0
      rotation: type === 'line' ? Math.floor(rand() * 50 - 25) : (type === 'square' ? 45 : 0),
      borderWidth: type === 'ring' ? Math.floor(rand() * 2 + 2) : undefined, // 2-3px
    })
  }
  return shapes
})

// ── Parallax on hero ──
const scrollY = ref(0)
function onScroll() { scrollY.value = window.scrollY }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Floating word characters for hero
const heroChars = computed(() => {
  const w = lesson.value?.words ?? []
  const slots = [
    { x: '8%', y: '12%', s: '3.2rem', d: '0s', o: 0.07 },
    { x: '55%', y: '6%', s: '2.2rem', d: '0.5s', o: 0.05 },
    { x: '85%', y: '20%', s: '3.8rem', d: '1.1s', o: 0.06 },
    { x: '22%', y: '38%', s: '3.4rem', d: '0.3s', o: 0.08 },
    { x: '72%', y: '42%', s: '2.6rem', d: '1.8s', o: 0.04 },
    { x: '10%', y: '68%', s: '2.8rem', d: '0.8s', o: 0.05 },
    { x: '48%', y: '72%', s: '4rem', d: '1.4s', o: 0.07 },
    { x: '90%', y: '58%', s: '2.4rem', d: '0.2s', o: 0.04 },
    { x: '35%', y: '15%', s: '2rem', d: '2.1s', o: 0.03 },
    { x: '65%', y: '75%', s: '2.8rem', d: '0.7s', o: 0.05 },
  ]
  return slots.map((s, i) => ({
    ...s,
    char: w[(i * 3 + 1) % w.length]?.word.charAt(0) ?? '',
  }))
})
</script>

<template>
  <div v-if="lesson" class="lp" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle, '--cc-l': course?.colorLight }">

    <!-- Global floating abstract shapes — dynamically generated with seeded random -->
    <div class="lp-shapes" aria-hidden="true">
      <span
        v-for="(s, i) in floatingShapes" :key="i"
        class="gs"
        :class="`gs--${s.type}`"
        :style="{
          top: `${s.top}%`,
          left: `${s.left}%`,
          width: s.type === 'tri' ? '0' : `${s.size}px`,
          height: s.type === 'line' ? '2px' : s.type === 'tri' ? '0' : s.type === 'blob' ? `${Math.floor(s.size * 0.8)}px` : `${s.size}px`,
          opacity: s.opacity,
          animationDuration: `${s.duration}s`,
          animationDelay: `${s.delay}s`,
          transform: s.rotation ? `rotate(${s.rotation}deg)` : undefined,
          borderWidth: s.type === 'ring' ? `${s.borderWidth}px` : s.type === 'tri' ? `0 ${Math.floor(s.size / 2)}px ${s.size}px ${Math.floor(s.size / 2)}px` : undefined,
        }"
      ></span>
    </div>

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
         HERO — Parallax + Aurora + Floating chars
         ════════════════════════════════════════════════════ -->
    <section class="hero">
      <!-- Aurora blobs -->
      <div class="hero__aurora" aria-hidden="true" :style="{ transform: `translateY(${scrollY * 0.15}px)` }">
        <div class="hero__blob hero__blob--1"></div>
        <div class="hero__blob hero__blob--2"></div>
        <div class="hero__blob hero__blob--3"></div>
      </div>

      <!-- Floating characters (parallax layer) -->
      <div class="hero__cloud" aria-hidden="true" :style="{ transform: `translateY(${scrollY * 0.3}px)` }">
        <span
          v-for="(s, i) in heroChars" :key="i" class="hero__char"
          :style="{ left: s.x, top: s.y, fontSize: s.s, animationDelay: s.d, opacity: s.o }"
        >{{ s.char }}</span>
      </div>

      <!-- Content -->
      <div class="hero__inner contained">
        <NuxtLink :to="paths.lessons" class="hero__back" aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </NuxtLink>
        <span class="hero__eyebrow">{{ t(tKey('lessons.lesson'), { n: lesson.id }) }}</span>
        <h1 class="hero__title">{{ t(tKey(`lessons.theme.${lesson.themeKey}`)) }}</h1>
        <p class="hero__sub">{{ t(tKey('lessons.wordsToLearn'), { n: lesson.words.length }) }}</p>

        <!-- Scroll indicator -->
        <div class="hero__scroll" aria-hidden="true">
          <div class="hero__scroll-line"></div>
        </div>
      </div>

      <!-- Organic wave divider -->
      <svg class="hero__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,70 C240,100 480,30 720,60 C960,90 1200,25 1440,55 L1440,100 L0,100 Z" fill="var(--color-bg)" />
        <path d="M0,80 C360,50 720,95 1080,65 C1260,55 1380,80 1440,70 L1440,100 L0,100 Z" fill="var(--color-bg)" opacity="0.5" />
      </svg>
    </section>

    <!-- ════════════════════════════════════════════════════
         VOCABULARY — Collapsible compact bar
         ════════════════════════════════════════════════════ -->
    <section class="vocab-section" v-scroll-reveal>
      <div class="contained">
        <div class="vocab-bar" @click="vocabOpen = !vocabOpen">
          <div class="vocab-bar__left">
            <span class="vocab-chip">{{ t('lessonPage.vocabulary') }}</span>
            <span class="vocab-bar__count">{{ lesson.words.length }} {{ t(tKey('lessons.wordsToLearn'), { n: lesson.words.length }) }}</span>
          </div>
          <div class="vocab-bar__actions" @click.stop>
            <button class="btn-sm" @click="startVocabQuiz">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              {{ t('lessonPage.trainVocab') }}
            </button>
            <button
              class="btn-sm btn-sm--ghost"
              :class="{ 'btn-sm--active': allInReview }"
              :disabled="addingToReview"
              @click="toggleAllReview"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" :fill="allInReview ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {{ t(allInReview ? 'lessonPage.removeFromReview' : 'lessonPage.addToReview') }}
            </button>
            <button class="btn-sm btn-sm--ghost" @click.stop="printVocab">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              {{ t('lessonPage.downloadPdf') }}
            </button>
          </div>
          <svg
            class="vocab-bar__chevron"
            :class="{ 'vocab-bar__chevron--open': vocabOpen }"
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          ><polyline points="6 9 12 15 18 9"/></svg>
        </div>

        <div class="vocab-collapse" :class="{ 'vocab-collapse--open': vocabOpen }">
          <div class="vocab-grid">
            <VocabCard
              v-for="word in lesson.words" :key="word.id"
              :word="word"
              :locale="(locale as 'en' | 'fr')"
              :lang="lang"
              :course-id="courseKey"
              :lesson-id="lessonId"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
         COURSE CONTENT — Each block is immersive
         ════════════════════════════════════════════════════ -->
    <template v-if="hasContent">
      <LessonContentBlock
        v-for="(block, i) in lesson.content" :key="i"
        :block="block"
      />
    </template>

    <!-- ════════════════════════════════════════════════════
         EXERCISES — Cinematic cards
         ════════════════════════════════════════════════════ -->
    <section v-if="hasExercises" class="ex-section" v-scroll-reveal>
      <div class="wave-section ex-section__fill">
        <div class="contained">
          <div class="ex-header">
            <span class="ex-chip">{{ t('lessonPage.exercises') }}</span>
            <h2>{{ t('lessonPage.exercises') }}</h2>
            <p>{{ lesson.exercises!.length }} {{ t('lessonPage.exercises').toLowerCase() }}</p>
          </div>

          <div class="ex-grid" v-scroll-reveal.stagger>
            <NuxtLink
              :to="`${paths.lesson(lessonId)}/exercises?difficulty=easy`"
              class="ex-card ex-card--easy"
            >
              <div class="ex-card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </div>
              <span class="ex-card__level">{{ t('lessonPage.easy') }}</span>
              <span class="ex-card__count">{{ lesson.exercises!.filter(e => e.difficulty === 'easy').length }}</span>
              <span class="ex-card__label">{{ t('lessonPage.exercises').toLowerCase() }}</span>
            </NuxtLink>

            <NuxtLink
              :to="`${paths.lesson(lessonId)}/exercises?difficulty=medium`"
              class="ex-card ex-card--medium"
            >
              <div class="ex-card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <span class="ex-card__level">{{ t('lessonPage.medium') }}</span>
              <span class="ex-card__count">{{ lesson.exercises!.filter(e => e.difficulty === 'medium').length }}</span>
              <span class="ex-card__label">{{ t('lessonPage.exercises').toLowerCase() }}</span>
            </NuxtLink>

            <NuxtLink
              :to="`${paths.lesson(lessonId)}/exercises?difficulty=hard`"
              class="ex-card ex-card--hard"
            >
              <div class="ex-card__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span class="ex-card__level">{{ t('lessonPage.hard') }}</span>
              <span class="ex-card__count">{{ lesson.exercises!.filter(e => e.difficulty === 'hard').length }}</span>
              <span class="ex-card__label">{{ t('lessonPage.exercises').toLowerCase() }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
         BACK
         ════════════════════════════════════════════════════ -->
    <div class="contained back-row">
      <NuxtLink :to="paths.lessons" class="btn-ghost">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        {{ t('common.back') }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.lp { display: flex; flex-direction: column; position: relative; }

/* ══════════ GLOBAL FLOATING SHAPES ══════════ */
.lp-shapes {
  position: absolute; inset: 0;
  pointer-events: none; overflow: hidden;
  z-index: 10;
}

.gs {
  position: absolute;
  animation: gs-drift ease-in-out infinite alternate;
}

.gs--ring {
  border: 2px solid var(--cc, var(--color-primary));
  border-radius: 50%;
}
.gs--dot {
  background: var(--cc, var(--color-primary));
  border-radius: 50%;
}
.gs--cross { }
.gs--cross::before,
.gs--cross::after {
  content: '';
  position: absolute;
  background: var(--cc, var(--color-primary));
  border-radius: 2px;
}
.gs--cross::before { width: 100%; height: 2.5px; top: 50%; left: 0; transform: translateY(-50%); }
.gs--cross::after { width: 2.5px; height: 100%; left: 50%; top: 0; transform: translateX(-50%); }

.gs--line {
  height: 2px;
  background: linear-gradient(90deg, var(--cc, var(--color-primary)), transparent);
}
.gs--blob {
  background: var(--cc, var(--color-primary));
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: gs-morph 18s ease-in-out infinite alternate;
}
.gs--square {
  border: 2px solid var(--cc, var(--color-primary));
  transform: rotate(45deg);
  animation-name: gs-drift-rotate;
}
.gs--tri {
  width: 0; height: 0;
  border-style: solid;
  border-color: transparent transparent var(--cc, var(--color-primary)) transparent;
}

@keyframes gs-drift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(15px, -12px); }
}
@keyframes gs-drift-rotate {
  0% { transform: rotate(45deg) translate(0, 0); }
  100% { transform: rotate(45deg) translate(10px, -8px); }
}
@keyframes gs-morph {
  0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: translate(0, 0); }
  33% { border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%; transform: translate(10px, -8px); }
  66% { border-radius: 40% 60% 60% 40% / 50% 50% 50% 50%; transform: translate(-6px, 5px); }
  100% { border-radius: 60% 40% 50% 50% / 40% 60% 40% 60%; transform: translate(4px, -10px); }
}
.contained { max-width: 960px; margin: 0 auto; width: 100%; padding: 0 var(--space-6); }
.bc-row { padding-top: var(--space-4); padding-bottom: 0; position: relative; z-index: 10; }

/* ══════════════════════════════════════
   HERO — Immersive parallax aurora
   ══════════════════════════════════════ */
.hero {
  position: relative; overflow: hidden;
  background: linear-gradient(170deg, #0f0f1a 0%, color-mix(in srgb, var(--cc) 25%, #0f0f1a) 50%, #0f0f1a 100%);
  padding: var(--space-20) 0 0; color: #fff; text-align: center;
  min-height: 420px;
}

/* Aurora blobs */
.hero__aurora {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.hero__blob {
  position: absolute; border-radius: 50%;
  filter: blur(100px); opacity: 0.4;
}
.hero__blob--1 {
  width: 400px; height: 400px; top: -15%; left: 20%;
  background: var(--cc, #6366f1);
  animation: aurora-move 15s ease-in-out infinite alternate;
}
.hero__blob--2 {
  width: 300px; height: 300px; bottom: -10%; right: 15%;
  background: color-mix(in srgb, var(--cc, #6366f1) 60%, #e11d48);
  animation: aurora-move 12s ease-in-out infinite alternate-reverse;
}
.hero__blob--3 {
  width: 200px; height: 200px; top: 30%; left: 55%;
  background: color-mix(in srgb, var(--cc, #6366f1) 70%, #06b6d4);
  animation: aurora-move 18s ease-in-out infinite alternate;
  animation-delay: -5s;
}
@keyframes aurora-move {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.2); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
}

/* Floating characters */
.hero__cloud { position: absolute; inset: 0; pointer-events: none; }
.hero__char {
  position: absolute; font-family: var(--font-cjk-jp); font-weight: 700;
  color: #fff; animation: hero-bob 6s ease-in-out infinite;
  text-shadow: 0 0 40px rgba(255,255,255,0.1);
}
@keyframes hero-bob {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-18px) rotate(3deg); }
}

/* Hero content */
.hero__inner {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center; gap: var(--space-3);
  padding-bottom: var(--space-16);
}
.hero__back {
  position: absolute; left: 0; top: 0;
  width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full); color: rgba(255,255,255,0.5); text-decoration: none;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 300ms ease;
  backdrop-filter: blur(8px);
}
.hero__back:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.2); }

.hero__eyebrow {
  font-size: var(--text-xs); font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.18em;
  color: var(--cc, rgba(255,255,255,0.5));
}
.hero__title {
  font-size: clamp(2.5rem, 7vw, 4rem);
  font-weight: 800; margin: 0; letter-spacing: -0.03em;
  background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.6) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero__sub { font-size: var(--text-sm); color: rgba(255,255,255,0.45); }

/* Scroll indicator */
.hero__scroll {
  margin-top: var(--space-8);
  width: 1px; height: 40px; position: relative;
  background: rgba(255,255,255,0.1);
  border-radius: 1px; overflow: hidden;
}
.hero__scroll-line {
  position: absolute; top: 0; left: 0; width: 100%; height: 50%;
  background: linear-gradient(180deg, transparent, var(--cc, rgba(255,255,255,0.6)));
  animation: scroll-hint 2s ease-in-out infinite;
}
@keyframes scroll-hint {
  0% { top: -50%; }
  100% { top: 100%; }
}

/* Hero wave */
.hero__wave {
  position: absolute; bottom: -1px; left: 0; width: 100%; z-index: 3;
  display: block;
}

/* ══════════════════════════════════════
   VOCABULARY — Collapsible compact bar
   ══════════════════════════════════════ */
.vocab-section { padding: var(--space-6) 0; }

.vocab-bar {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 250ms ease;
}
.vocab-bar:hover { border-color: var(--color-border-strong); box-shadow: var(--shadow-sm); }

.vocab-bar__left { display: flex; align-items: center; gap: var(--space-3); flex: 1; min-width: 0; }
.vocab-chip {
  display: inline-block; padding: 2px var(--space-2); border-radius: var(--radius-full);
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  background: color-mix(in srgb, var(--cc) 12%, transparent);
  color: var(--cc); flex-shrink: 0;
}
.vocab-bar__count { font-size: var(--text-sm); color: var(--color-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.vocab-bar__actions { display: flex; gap: var(--space-2); flex-shrink: 0; }

.vocab-bar__chevron {
  flex-shrink: 0; color: var(--color-text-muted);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.vocab-bar__chevron--open { transform: rotate(180deg); }

/* Collapse body */
.vocab-collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 400ms cubic-bezier(0.16, 1, 0.3, 1);
}
.vocab-collapse--open { grid-template-rows: 1fr; }
.vocab-collapse > * { overflow: hidden; }

.vocab-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-3);
  padding-top: var(--space-4);
}

/* Small action buttons */
.btn-sm {
  display: inline-flex; align-items: center; gap: var(--space-1);
  padding: var(--space-1-5) var(--space-3);
  background: var(--cc, var(--color-primary)); color: #fff;
  border: none; border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 700; cursor: pointer;
  transition: all 200ms ease; white-space: nowrap;
}
.btn-sm:hover { opacity: 0.85; }
.btn-sm--ghost {
  background: transparent; color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}
.btn-sm--ghost:hover { border-color: var(--color-border-strong); background: var(--color-bg-muted); }
.btn-sm--active {
  background: color-mix(in srgb, var(--cc) 10%, transparent);
  border-color: color-mix(in srgb, var(--cc) 30%, var(--color-border));
  color: var(--cc);
}

/* ══════════════════════════════════════
   BUTTONS
   ══════════════════════════════════════ */
.btn-primary {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: linear-gradient(135deg, var(--cc, var(--color-primary)), color-mix(in srgb, var(--cc, var(--color-primary)) 70%, #e11d48));
  color: #fff; border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-sm); font-weight: 700; cursor: pointer;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 15px color-mix(in srgb, var(--cc) 25%, transparent);
}
.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px color-mix(in srgb, var(--cc) 35%, transparent);
}

.btn-ghost {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: transparent; color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm); font-weight: 600; cursor: pointer;
  text-decoration: none;
  transition: all 250ms ease;
}
.btn-ghost:hover {
  border-color: var(--color-border-strong);
  background: var(--color-bg-muted);
  transform: translateY(-1px);
}
.btn-ghost--active {
  background: color-mix(in srgb, var(--cc) 10%, transparent);
  border-color: color-mix(in srgb, var(--cc) 30%, var(--color-border));
  color: var(--cc);
}

/* ══════════════════════════════════════
   EXERCISES SECTION
   ══════════════════════════════════════ */
.ex-section__fill {
  --wave-bg: color-mix(in srgb, var(--cc) 6%, var(--color-bg-muted));
}

.ex-header { text-align: center; margin-bottom: var(--space-8); }
.ex-chip {
  display: inline-block; padding: 3px var(--space-3); border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  background: color-mix(in srgb, var(--cc) 12%, transparent);
  color: var(--cc);
  margin-bottom: var(--space-2);
}
.ex-header h2 { font-size: var(--text-xl); font-weight: 700; color: var(--color-text); margin: var(--space-2) 0 0; }
.ex-header p { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-1); }

.ex-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); }

.ex-card {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-3);
  padding: var(--space-8) var(--space-4);
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-2xl); text-decoration: none;
  transition: all 350ms cubic-bezier(0.16, 1, 0.3, 1);
  position: relative; overflow: hidden;
}
.ex-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--card-accent, var(--cc)), color-mix(in srgb, var(--card-accent, var(--cc)) 50%, transparent));
  opacity: 0; transition: opacity 300ms ease;
}
.ex-card:hover::before { opacity: 1; }
.ex-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: color-mix(in srgb, var(--card-accent, var(--cc)) 30%, var(--color-border));
}

.ex-card--easy { --card-accent: #22c55e; }
.ex-card--medium { --card-accent: #f59e0b; }
.ex-card--hard { --card-accent: #ef4444; }

.ex-card__icon {
  width: 56px; height: 56px; display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-xl);
  background: color-mix(in srgb, var(--card-accent) 8%, var(--color-bg-muted));
  color: var(--card-accent);
  transition: all 350ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ex-card:hover .ex-card__icon { transform: scale(1.1) rotate(-5deg); }

.ex-card__level {
  font-size: var(--text-xs); font-weight: 700;
  color: var(--card-accent);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.ex-card__count { font-size: var(--text-4xl); font-weight: 800; color: var(--color-text); line-height: 1; }
.ex-card__label { font-size: var(--text-xs); color: var(--color-text-muted); }

/* ══════════════════════════════════════
   BACK ROW
   ══════════════════════════════════════ */
.back-row { display: flex; justify-content: center; padding: var(--space-10) 0 var(--space-16); }

/* ══════════════════════════════════════
   PRINT
   ══════════════════════════════════════ */
@media print {
  .lp-shapes { display: none !important; }
  .hero, .ex-section, .back-row, .vocab-bar__actions, .vocab-footer { display: none !important; }
  .vocab-section { padding: var(--space-4) 0 !important; }
  .vocab-collapse { grid-template-rows: 1fr !important; }
  .vocab-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 6px !important; }
}

/* ══════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════ */
@media (max-width: 640px) {
  .lp-shapes { display: none; }
  .hero { min-height: 320px; padding: var(--space-12) 0 0; }
  .hero__title { font-size: clamp(2rem, 10vw, 3rem); }
  .hero__inner { padding-bottom: var(--space-12); }
  .hero__scroll { display: none; }
  .vocab-grid { grid-template-columns: 1fr; }
  .vocab-bar { flex-wrap: wrap; }
  .vocab-bar__actions { width: 100%; justify-content: flex-start; }
  .ex-grid { grid-template-columns: 1fr; }
}
</style>
