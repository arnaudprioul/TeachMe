<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonQuizStore } from '~/stores/lesson-quiz.store'
import { useLessonExerciseStore } from '~/stores/lesson-exercise.store'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'
import { useReviewsStore } from '~/stores/reviews.store'
import { useToast } from '~/composables/useToast'
import type { TExerciseDifficulty } from '~/composables/data/courses/lesson-types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t, locale } = useI18n()
const route = useRoute()
const { lang, module, language, paths, tKey, courseKey } = useCourseContext()
const quiz = useLessonQuizStore()
const exerciseStore = useLessonExerciseStore()
const progressStore = useLessonProgressStore()
const reviews = useReviewsStore()
const toast = useToast()

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
      // 1 single batch delete call
      const ids = lesson.value.words
        .map(w => reviews.findCard(lang.value, w.id, courseKey.value, lessonId.value)?.id)
        .filter((id): id is string => !!id)
      if (ids.length) await reviews.removeBatch(ids)
      toast.success(t('lessonPage.removedFromReview'))
    } else {
      // 1 single batch add call
      const items = lesson.value.words
        .filter(w => !reviews.isInDeck(lang.value, w.id, courseKey.value, lessonId.value))
        .map(w => ({ lang: lang.value, wordId: w.id, courseId: courseKey.value, lessonId: lessonId.value }))
      if (items.length) await reviews.addBatch(items)
      toast.success(t('lessonPage.addedToReview', { n: items.length }))
    }
  } catch (err) {
    console.error('[toggleAllReview] failed', err)
    toast.error(t('common.error'))
  } finally {
    addingToReview.value = false
  }
}

const course = computed(() => language.value!)
const lessonId = computed(() => Number(route.params.id))
const lesson = computed(() => module.value?.lessons?.find(l => l.id === lessonId.value))

onMounted(() => {
  if (!lesson.value) { navigateTo(paths.value.root); return }
  if (isChildRoute.value) return

  // Resume: scroll to where the user left off
  const saved = progressStore.getProgress(courseKey.value, lessonId.value)
  if (saved.bestScore > 0) {
    // Wait for DOM to be fully rendered, then override the router's scroll-to-top
    const tryScroll = (retries: number) => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 800 || retries > 30) {
        const pct = Math.min(saved.bestScore, 100)
        const targetScroll = Math.round((pct / 100) * docHeight)
        window.scrollTo(0, targetScroll)
      } else {
        requestAnimationFrame(() => tryScroll(retries + 1))
      }
    }
    // Delay enough for the router scroll-to-top to complete first
    setTimeout(() => tryScroll(0), 500)
  }
})

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
let scrollSaveTimer: ReturnType<typeof setTimeout> | null = null

function onScroll() {
  scrollY.value = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? Math.min(100, Math.round((window.scrollY / docHeight) * 100)) : 0

  // Debounce: persist scroll progress every 500ms (only if higher than current best)
  if (scrollSaveTimer) clearTimeout(scrollSaveTimer)
  scrollSaveTimer = setTimeout(() => {
    const current = progressStore.getProgress(courseKey.value, lessonId.value)
    if (scrollProgress.value > current.bestScore && !progressStore.isCompleted(courseKey.value, lessonId.value)) {
      progressStore.recordAttempt(courseKey.value, lessonId.value, scrollProgress.value)
    }
  }, 500)
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (scrollSaveTimer) clearTimeout(scrollSaveTimer)
})

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

// ── Snackbar: scroll progress (computed in listener for reactivity) ──
const scrollProgress = ref(0)
const showSnackbar = computed(() => scrollY.value > 200)

// ── Exercise completion per difficulty ──
const EXERCISE_PASS_THRESHOLD = 50
const easyDone = computed(() => progressStore.getExerciseProgress(courseKey.value, lessonId.value, 'easy').bestScore >= EXERCISE_PASS_THRESHOLD)
const mediumDone = computed(() => progressStore.getExerciseProgress(courseKey.value, lessonId.value, 'medium').bestScore >= EXERCISE_PASS_THRESHOLD)
const hardDone = computed(() => progressStore.getExerciseProgress(courseKey.value, lessonId.value, 'hard').bestScore >= EXERCISE_PASS_THRESHOLD)
const allExercisesDone = computed(() => easyDone.value && mediumDone.value && hardDone.value)

// ── Auto-complete lesson when scroll 90%+ AND all exercises done ──
const lessonJustCompleted = ref(false)
watch([scrollProgress, allExercisesDone], ([scroll, exercises]) => {
  if (scroll >= 90 && exercises && !progressStore.isCompleted(courseKey.value, lessonId.value)) {
    progressStore.recordAttempt(courseKey.value, lessonId.value, 100, true)
    lessonJustCompleted.value = true
    setTimeout(() => { lessonJustCompleted.value = false }, 3000)
  }
})

// ── Bottom navigation ──
const prevLesson = computed(() => lesson.value && lesson.value.id > 1 ? lesson.value.id - 1 : null)
const nextLesson = computed(() => {
  const lessons = module.value?.lessons ?? []
  const next = lessons.find(l => l.id === lessonId.value + 1)
  return next ? next.id : null
})
const nextUnlocked = computed(() => nextLesson.value ? progressStore.isUnlocked(courseKey.value, nextLesson.value) : false)

// ── FAB section navigation ──
const fabOpen = ref(false)
const showFab = computed(() => scrollY.value > 300)

const fabSections = computed(() => [
  { id: 'section-vocab', labelKey: 'lessonPage.fabVocabulary', icon: 'book' },
  { id: 'section-content', labelKey: 'lessonPage.fabLesson', icon: 'document' },
  ...(hasExercises.value ? [{ id: 'section-exercises', labelKey: 'lessonPage.fabExercises', icon: 'lightning' }] : []),
  { id: 'section-nav', labelKey: 'lessonPage.fabNavigation', icon: 'arrow' },
])

// ── FAB: build section list from lesson content blocks ──
const fabContentSections = computed(() => {
  if (!lesson.value?.content) return []
  const sections: Array<{ id: string; label: string }> = []
  let sectionIdx = 0
  for (const block of lesson.value.content) {
    if (block.type === 'SECTION_HEADER' && block.sectionHeader) {
      const label = t(block.sectionHeader.titleKey)
      sections.push({ id: `section-part-${sectionIdx}`, label })
      sectionIdx++
    }
  }
  return sections
})

// Count how many SECTION_HEADER blocks are before index i
function contentSectionIndex(blockIndex: number): number {
  let count = 0
  const blocks = lesson.value?.content ?? []
  for (let j = 0; j < blockIndex; j++) {
    if (blocks[j].type === 'SECTION_HEADER') count++
  }
  return count
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const headerOffset = 80
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset
  window.scrollTo({ top, behavior: 'smooth' })
  fabOpen.value = false
}


function onFabClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.fab')) fabOpen.value = false
}

// ── Results sidebar ──
const showResults = computed(() => route.query.showResults as TExerciseDifficulty | undefined)
const resultsSidebarOpen = computed(() => !!showResults.value && !!exerciseStore.session && exerciseStore.isFinished)

function resolveKey(key: string): string {
  return key.startsWith('__raw:') ? key.slice(6) : t(key)
}

function exerciseLabel(exerciseId: string): string {
  const ex = exerciseStore.session?.exercises.find(e => e.id === exerciseId)
  if (!ex) return exerciseId
  if (ex.questionKey) return resolveKey(ex.questionKey)
  if (ex.sentenceTemplate) return ex.sentenceTemplate.replace('___', '…')
  if (ex.sourceKey) return resolveKey(ex.sourceKey)
  if (ex.correctOrder) return ex.correctOrder.join(' ')
  return exerciseId
}

function closeResults() {
  navigateTo({ path: route.path, query: {} }, { replace: true })
}

function retryExercise() {
  const diff = showResults.value || 'easy'
  closeResults()
  navigateTo({ path: paths.value.lessonExercises(lessonId.value), query: { difficulty: diff } })
}

const resultsScore = computed(() => exerciseStore.score)
const resultsPassed = computed(() => resultsScore.value.percentage >= EXERCISE_PASS_THRESHOLD)

// ── Detect if we're on a child route (exercises, quiz, results) ──
const isChildRoute = computed(() => {
  const path = route.path
  const lessonBase = paths.value.lesson(lessonId.value)
  return path !== lessonBase && path.startsWith(lessonBase + '/')
})

onMounted(() => document.addEventListener('click', onFabClickOutside))
onUnmounted(() => document.removeEventListener('click', onFabClickOutside))
</script>

<template>
  <!-- Child routes (exercises, quiz, results) render their own page -->
  <NuxtPage v-if="isChildRoute" />

  <div v-else-if="lesson" class="lp" :class="{ 'lp--sidebar-open': resultsSidebarOpen }" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle, '--cc-l': course?.colorLight }">

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
        { label: t(tKey('lessons.title')), to: paths.root },
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
        <NuxtLink :to="paths.root" class="hero__back" :aria-label="t('lessonPage.backToLevel')">
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
    <section id="section-vocab" class="vocab-section" v-scroll-reveal>
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
    <div id="section-content"></div>
    <template v-if="hasContent">
      <template v-for="(block, i) in lesson.content" :key="i">
        <div v-if="block.type === 'SECTION_HEADER'" :id="`section-part-${contentSectionIndex(i)}`"></div>
        <LessonContentBlock :block="block" />
      </template>
    </template>

    <!-- ════════════════════════════════════════════════════
         EXERCISES — Cinematic cards
         ════════════════════════════════════════════════════ -->
    <section id="section-exercises" v-if="hasExercises" class="ex-section" v-scroll-reveal>
      <div class="wave-section ex-section__fill">
        <div class="contained">
          <div class="ex-header">
            <span class="ex-chip">{{ t('lessonPage.exercises') }}</span>
            <h2>{{ t('lessonPage.exercises') }}</h2>
            <p>{{ lesson.exercises!.length }} {{ t('lessonPage.exercises').toLowerCase() }}</p>
          </div>

          <div class="ex-grid" v-scroll-reveal.stagger>
            <NuxtLink
              :to="{ path: paths.lessonExercises(lessonId), query: { difficulty: 'easy' } }"
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
              :to="{ path: paths.lessonExercises(lessonId), query: { difficulty: 'medium' } }"
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
              :to="{ path: paths.lessonExercises(lessonId), query: { difficulty: 'hard' } }"
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
         BOTTOM NAVIGATION
         ════════════════════════════════════════════════════ -->
    <nav id="section-nav" class="contained bottom-nav">
      <NuxtLink
        v-if="prevLesson"
        :to="paths.lesson(prevLesson)"
        class="btn-ghost bottom-nav__btn"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        {{ t('lessonPage.previousLesson', { n: prevLesson }) }}
      </NuxtLink>
      <span v-else class="bottom-nav__spacer"></span>

      <NuxtLink :to="paths.root" class="btn-ghost bottom-nav__btn bottom-nav__btn--center">
        {{ t('lessonPage.backToLevel') }}
      </NuxtLink>

      <NuxtLink
        v-if="nextLesson && nextUnlocked"
        :to="paths.lesson(nextLesson)"
        class="btn-ghost bottom-nav__btn"
      >
        {{ t('lessonPage.nextLessonNav', { n: nextLesson }) }}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </NuxtLink>
      <span v-else-if="nextLesson" class="btn-ghost bottom-nav__btn bottom-nav__btn--disabled">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        {{ t('lessonPage.nextLessonNav', { n: nextLesson }) }}
      </span>
      <span v-else class="bottom-nav__spacer"></span>
    </nav>

    <!-- ════════════════════════════════════════════════════
         FAB — Section navigation
         ════════════════════════════════════════════════════ -->
    <Transition name="fab-slide">
      <div v-if="showFab" class="fab" @click.stop>
        <!-- Menu items -->
        <Transition name="fab-menu">
          <div v-if="fabOpen" class="fab__menu">
            <div class="fab__scroll">
              <!-- Vocabulary -->
              <button class="fab__item fab__item--icon" @click="scrollToSection('section-vocab')">
                <span class="fab__item-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                </span>
                <span>{{ t('lessonPage.fabVocabulary') }}</span>
              </button>

              <!-- Parts of the lesson -->
              <button
                v-for="(sec, idx) in fabContentSections"
                :key="sec.id"
                class="fab__item fab__item--part"
                @click="scrollToSection(sec.id)"
              >
                <span class="fab__item-num">{{ idx + 1 }}</span>
                <span>{{ sec.label }}</span>
              </button>

              <!-- Exercises -->
              <button v-if="hasExercises" class="fab__item fab__item--icon" @click="scrollToSection('section-exercises')">
                <span class="fab__item-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </span>
                <span>{{ t('lessonPage.fabExercises') }}</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- FAB button -->
        <button
          class="fab__btn"
          :class="{ 'fab__btn--open': fabOpen }"
          :aria-label="t('lessonPage.fabNavigation')"
          @click="fabOpen = !fabOpen"
        >
          <!-- Menu icon (3 lines) -->
          <svg v-if="!fabOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          <!-- Close icon -->
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </Transition>

    <!-- ════════════════════════════════════════════════════
         FIXED SNACKBAR — scroll progress + exercise chips
         ════════════════════════════════════════════════════ -->
    <Transition name="snackbar-slide">
      <div v-if="showSnackbar" class="snackbar" aria-label="Lesson progress">
        <!-- Progress bar -->
        <div class="snackbar__progress-track">
          <div class="snackbar__progress-fill" :style="{ width: `${scrollProgress}%` }"></div>
        </div>

        <div class="snackbar__content contained">
          <!-- Left: back to level + scroll percentage -->
          <NuxtLink :to="paths.root" class="snackbar__back" :title="t('lessonPage.backToLevel')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </NuxtLink>
          <span class="snackbar__pct">{{ scrollProgress }}%</span>

          <!-- Center: completion message -->
          <Transition name="snackbar-complete">
            <span v-if="lessonJustCompleted" class="snackbar__complete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {{ t('lessonPage.lessonComplete') }}
            </span>
          </Transition>

          <!-- Right: exercise indicators -->
          <div class="snackbar__exercises">
            <NuxtLink
              v-for="diff in ([
                { key: 'easy', done: easyDone, color: '#22c55e' },
                { key: 'medium', done: mediumDone, color: '#f59e0b' },
                { key: 'hard', done: hardDone, color: '#ef4444' },
              ] as const)"
              :key="diff.key"
              :to="{ path: paths.lessonExercises(lessonId), query: { difficulty: diff.key } }"
              class="snackbar__ex"
              :class="{ 'snackbar__ex--done': diff.done }"
              :style="{ '--ex-color': diff.color }"
              :title="t(`lessonPage.${diff.key}`)"
            >
              <svg v-if="diff.done" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span v-else class="snackbar__ex-dot"></span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ════════════════════════════════════════════════════
         RESULTS SIDEBAR
         ════════════════════════════════════════════════════ -->
    <Transition name="sidebar-slide">
      <div v-if="resultsSidebarOpen" class="rs-overlay" @click.self="closeResults">
        <aside class="rs">
          <div class="rs__header">
            <h3 class="rs__title">{{ t('lessonPage.resultsSidebarTitle') }}</h3>
            <button class="rs__close" aria-label="Close" @click="closeResults">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="rs__score-block" :class="resultsPassed ? 'rs__score-block--pass' : 'rs__score-block--fail'">
            <div class="rs__score-top">
              <span class="rs__diff-badge">{{ t(`lessonPage.${showResults}`) }}</span>
              <span class="rs__score-pct">{{ resultsScore.percentage }}%</span>
            </div>
            <div class="rs__score-bar">
              <div class="rs__score-fill" :style="{ width: `${resultsScore.percentage}%` }"></div>
            </div>
            <span class="rs__pass-label">{{ resultsPassed ? t('lessonPage.passed') : t('lessonPage.failed') }}</span>
          </div>

          <div class="rs__results-list">
            <div
              v-for="(result, i) in exerciseStore.session!.results"
              :key="i"
              class="rs__item"
              :class="result.correct ? 'rs__item--correct' : 'rs__item--wrong'"
            >
              <span class="rs__item-num">{{ i + 1 }}</span>
              <span class="rs__item-label">{{ exerciseLabel(result.exerciseId) }}</span>
              <span class="rs__item-icon" v-if="result.correct">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span class="rs__item-icon" v-else>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </span>
              <button
                v-if="!result.correct"
                class="rs__item-review"
                @click="scrollToSection('section-content'); closeResults()"
              >{{ t('lessonPage.reviewLesson') }}</button>
            </div>
          </div>

          <div class="rs__actions">
            <button class="rs__btn rs__btn--primary" @click="retryExercise">{{ t('lessonPage.retryExercises') }}</button>
            <button class="rs__btn rs__btn--ghost" @click="closeResults">{{ t('lessonPage.close') }}</button>
          </div>
        </aside>
      </div>
    </Transition>
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
   BOTTOM NAVIGATION
   ══════════════════════════════════════ */
.bottom-nav {
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--space-10) var(--space-6) var(--space-16);
  gap: var(--space-3);
}
.bottom-nav__btn {
  min-width: 0;
  white-space: nowrap;
}
.bottom-nav__btn--center {
  text-align: center;
}
.bottom-nav__btn--disabled {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  color: var(--color-text-muted);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm); font-weight: 600;
  opacity: 0.5; cursor: not-allowed;
}
.bottom-nav__spacer { flex: 1; }

/* ══════════════════════════════════════
   FIXED SNACKBAR
   ══════════════════════════════════════ */
.snackbar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.85);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
}
:root.dark .snackbar {
  background: rgba(20, 20, 30, 0.85);
}

.snackbar__progress-track {
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--color-bg-muted);
}
.snackbar__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--cc, var(--color-primary)), color-mix(in srgb, var(--cc, var(--color-primary)) 60%, #06b6d4));
  transition: width 150ms ease-out;
  border-radius: 0 2px 2px 0;
}

.snackbar__content {
  display: flex; align-items: center; gap: var(--space-4);
  height: 52px;
  position: relative;
}

.snackbar__back {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; flex-shrink: 0;
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all 200ms ease;
}
.snackbar__back:hover {
  background: color-mix(in srgb, var(--cc) 10%, transparent);
  color: var(--cc, var(--color-primary));
}

.snackbar__pct {
  font-size: var(--text-xs); font-weight: 700;
  color: var(--color-text-muted);
  min-width: 36px;
  font-variant-numeric: tabular-nums;
}

.snackbar__complete {
  display: inline-flex; align-items: center; gap: var(--space-1);
  font-size: var(--text-sm); font-weight: 700;
  color: #22c55e;
  white-space: nowrap;
}

.snackbar__exercises {
  display: flex; gap: var(--space-2);
  margin-left: auto; align-items: center;
}

.snackbar__ex {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full);
  text-decoration: none;
  background: var(--color-bg-muted);
  border: 2px solid var(--color-border);
  color: var(--color-text-muted);
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
.snackbar__ex-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-text-subtle);
}
.snackbar__ex--done {
  background: color-mix(in srgb, var(--ex-color) 12%, transparent);
  border-color: var(--ex-color);
  color: var(--ex-color);
}
.snackbar__ex--done .snackbar__ex-dot { display: none; }
.snackbar__ex:hover {
  transform: scale(1.1);
  border-color: var(--ex-color, var(--color-border-strong));
}

/* Snackbar slide animation */
.snackbar-slide-enter-active,
.snackbar-slide-leave-active {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease;
}
.snackbar-slide-enter-from,
.snackbar-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Completion text animation */
.snackbar-complete-enter-active {
  transition: opacity 400ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
}
.snackbar-complete-leave-active {
  transition: opacity 300ms ease;
}
.snackbar-complete-enter-from {
  opacity: 0; transform: translateY(6px);
}
.snackbar-complete-leave-to {
  opacity: 0;
}

/* ══════════════════════════════════════
   FAB — Section navigation
   ══════════════════════════════════════ */
.fab {
  position: fixed;
  bottom: 80px;
  right: var(--space-6);
  z-index: 45;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-3);
}

.fab__btn {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--cc, var(--color-primary));
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--cc, var(--color-primary)) 35%, transparent);
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.fab__btn:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px color-mix(in srgb, var(--cc, var(--color-primary)) 45%, transparent);
}

.fab__btn--open {
  background: var(--color-bg-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.fab__menu {
  padding: var(--space-2);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  min-width: 200px; max-width: 260px;
}
:root.dark .fab__menu { background: rgba(20, 20, 30, 0.9); }

/* Single scrollable list — everything flows together */
.fab__scroll {
  display: flex; flex-direction: column; gap: 1px;
  max-height: min(55vh, 360px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.fab__item {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: none; background: transparent;
  border-radius: var(--radius-md);
  font-size: var(--text-xs); font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer; transition: all 150ms ease;
  white-space: nowrap; text-align: left;
}
.fab__item:hover {
  background: color-mix(in srgb, var(--cc) 8%, transparent);
  color: var(--cc, var(--color-primary));
}
/* Icon items — vocab, exercises */
.fab__item-icon {
  width: 22px; height: 22px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--cc) 10%, var(--color-bg-muted));
  color: var(--cc, var(--color-primary));
  transition: all 150ms ease;
}
.fab__item-icon svg { opacity: 0.8; }
.fab__item--icon:hover .fab__item-icon {
  background: color-mix(in srgb, var(--cc) 18%, transparent);
}
.fab__item--icon:hover .fab__item-icon svg { opacity: 1; }

/* Part items — slightly indented, with number pill */
.fab__item--part { padding-left: calc(var(--space-3) + 4px); }
.fab__item-num {
  width: 18px; height: 18px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.55rem; font-weight: 800;
  border-radius: var(--radius-full);
  background: var(--color-bg-muted);
  color: var(--color-text-muted);
}
.fab__item--part span:last-child {
  overflow: hidden; text-overflow: ellipsis;
}

/* FAB slide animation */
.fab-slide-enter-active,
.fab-slide-leave-active {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease;
}
.fab-slide-enter-from,
.fab-slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* FAB menu animation */
.fab-menu-enter-active {
  transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease;
}
.fab-menu-leave-active {
  transition: transform 200ms ease, opacity 150ms ease;
}
.fab-menu-enter-from {
  transform: translateY(12px) scale(0.95);
  opacity: 0;
}
.fab-menu-leave-to {
  transform: translateY(8px) scale(0.97);
  opacity: 0;
}

/* ══════════════════════════════════════
   RESULTS SIDEBAR
   ══════════════════════════════════════ */
.lp--sidebar-open {
  margin-left: 360px;
  transition: margin-left 350ms cubic-bezier(0.16, 1, 0.3, 1);
}

.rs-overlay {
  position: fixed; top: 0; right: 0; bottom: 0; left: 0;
  z-index: 40;
  pointer-events: none;
}

.rs {
  position: fixed; top: var(--header-h, 56px); left: 0;
  width: 360px; height: calc(100vh - var(--header-h, 56px));
  z-index: 40;
  display: flex; flex-direction: column;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px) saturate(180%);
  border-right: 1px solid var(--color-border);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
  pointer-events: all;
  overflow-y: auto;
}
:root.dark .rs {
  background: rgba(20, 20, 30, 0.92);
}

.rs__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}
.rs__title {
  font-size: var(--text-lg); font-weight: 700;
  color: var(--color-text); margin: 0;
}
.rs__close {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: var(--radius-full);
  border: none; background: transparent;
  color: var(--color-text-muted); cursor: pointer;
  transition: all 200ms ease;
}
.rs__close:hover {
  background: var(--color-bg-muted); color: var(--color-text);
}

/* Score block */
.rs__score-block {
  padding: var(--space-5) var(--space-6);
  margin: var(--space-4) var(--space-4) 0;
  border-radius: var(--radius-xl);
  display: flex; flex-direction: column; gap: var(--space-2);
}
.rs__score-block--pass {
  background: #f0fdf4; border: 1px solid #bbf7d0;
}
.rs__score-block--fail {
  background: #fef2f2; border: 1px solid #fecaca;
}
:root.dark .rs__score-block--pass { background: rgba(22, 163, 74, 0.1); border-color: rgba(22, 163, 74, 0.3); }
:root.dark .rs__score-block--fail { background: rgba(220, 38, 38, 0.1); border-color: rgba(220, 38, 38, 0.3); }

.rs__score-top {
  display: flex; align-items: center; justify-content: space-between;
}
.rs__diff-badge {
  font-size: var(--text-xs); font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--cc, var(--color-primary));
  padding: 2px var(--space-2);
  background: color-mix(in srgb, var(--cc) 12%, transparent);
  border-radius: var(--radius-full);
}
.rs__score-pct {
  font-size: var(--text-2xl); font-weight: 800;
  color: var(--color-text);
}
.rs__score-bar {
  height: 6px; background: var(--color-bg-muted);
  border-radius: var(--radius-full); overflow: hidden;
}
.rs__score-fill {
  height: 100%; border-radius: var(--radius-full);
  transition: width 600ms ease;
}
.rs__score-block--pass .rs__score-fill { background: #22c55e; }
.rs__score-block--fail .rs__score-fill { background: #ef4444; }
.rs__pass-label {
  font-size: var(--text-xs); font-weight: 700;
}
.rs__score-block--pass .rs__pass-label { color: #16a34a; }
.rs__score-block--fail .rs__pass-label { color: #dc2626; }

/* Results list */
.rs__results-list {
  flex: 1; overflow-y: auto;
  padding: var(--space-4);
  display: flex; flex-direction: column; gap: var(--space-2);
}
.rs__item {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  transition: background 150ms ease;
}
.rs__item--correct { background: #f0fdf4; }
.rs__item--wrong { background: #fef2f2; }
:root.dark .rs__item--correct { background: rgba(22, 163, 74, 0.08); }
:root.dark .rs__item--wrong { background: rgba(220, 38, 38, 0.08); }

.rs__item-num {
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--text-xs); font-weight: 700;
  border-radius: var(--radius-full);
  background: var(--color-bg-muted);
  color: var(--color-text-muted);
  flex-shrink: 0;
}
.rs__item-label {
  flex: 1; font-size: var(--text-sm); font-weight: 500;
  color: var(--color-text-secondary);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.rs__item-icon {
  flex-shrink: 0; display: flex; align-items: center;
}
.rs__item-review {
  font-size: var(--text-xs); font-weight: 600;
  color: var(--cc, var(--color-primary));
  background: transparent; border: none;
  cursor: pointer; white-space: nowrap;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity 150ms ease;
}
.rs__item-review:hover { opacity: 0.7; }

/* Actions */
.rs__actions {
  padding: var(--space-4) var(--space-6) var(--space-6);
  display: flex; flex-direction: column; gap: var(--space-2);
  flex-shrink: 0;
  border-top: 1px solid var(--color-border);
}
.rs__btn {
  padding: var(--space-3) var(--space-5);
  border: none; border-radius: var(--radius-xl);
  font-size: var(--text-sm); font-weight: 700;
  cursor: pointer; transition: all 200ms ease;
  text-align: center;
}
.rs__btn--primary {
  background: var(--cc, var(--color-primary)); color: #fff;
}
.rs__btn--primary:hover {
  transform: translateY(-1px); box-shadow: var(--shadow-md);
}
.rs__btn--ghost {
  background: transparent; color: var(--color-text-muted);
}
.rs__btn--ghost:hover {
  background: var(--color-bg-muted); color: var(--color-text);
}

/* Sidebar slide transition */
.sidebar-slide-enter-active {
  transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease;
}
.sidebar-slide-leave-active {
  transition: transform 300ms ease, opacity 200ms ease;
}
.sidebar-slide-enter-from {
  transform: translateX(-100%); opacity: 0;
}
.sidebar-slide-leave-to {
  transform: translateX(-100%); opacity: 0;
}

/* ══════════════════════════════════════
   PRINT
   ══════════════════════════════════════ */
@media print {
  .lp-shapes { display: none !important; }
  .snackbar { display: none !important; }
  .fab { display: none !important; }
  .rs-overlay { display: none !important; }
  .hero, .ex-section, .bottom-nav, .vocab-bar__actions, .vocab-footer { display: none !important; }
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
  .bottom-nav { flex-wrap: wrap; justify-content: center; gap: var(--space-2); padding-bottom: calc(var(--space-16) + 56px); }
  .bottom-nav__spacer { display: none; }
  .snackbar__pct { display: none; }
  .lp { padding-bottom: 0; }
  .fab { bottom: 70px; right: var(--space-4); }
  .fab__btn { width: 42px; height: 42px; }
  .lp--sidebar-open { margin-left: 0; }
  .rs-overlay { pointer-events: all; background: rgba(0, 0, 0, 0.3); }
  .rs { width: 100%; }
}
</style>
