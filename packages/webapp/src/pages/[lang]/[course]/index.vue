<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourseContext } from '~/composables/useCourseContext'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'
import { vScrollReveal } from '~/composables/useScrollReveal'
import type { ICourseCharacter } from '~/composables/data/courses/types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const { lang, courseKey, language, module, paths, tKey } = useCourseContext()
const progressStore = useLessonProgressStore()

const course = computed(() => language.value!)

// ── Level-based course detection ──
const isLevelCourse = computed(() => !!module.value?.levelIntro)
const lessons = computed(() => module.value?.lessons ?? [])
const totalWords = computed(() => lessons.value.reduce((sum, l) => sum + l.words.length, 0))
const completedLessons = computed(() => lessons.value.filter(l => progressStore.isCompleted(courseKey.value, l.id)).length)
const allLessonsCompleted = computed(() => lessons.value.length > 0 && completedLessons.value === lessons.value.length)
const examUnlocked = computed(() => progressStore.isExamUnlocked(courseKey.value, lessons.value.length))
const examPassed = computed(() => progressStore.isExamPassed(courseKey.value))
const progressPercent = computed(() => lessons.value.length > 0 ? Math.round((completedLessons.value / lessons.value.length) * 100) : 0)
const hasStarted = computed(() =>
  completedLessons.value > 0 ||
  lessons.value.some(l => progressStore.getProgress(courseKey.value, l.id).bestScore > 0)
)
const nextLessonId = computed(() => {
  const next = lessons.value.find(l => !progressStore.isCompleted(courseKey.value, l.id))
  return next?.id ?? lessons.value[0]?.id ?? 1
})

// ── River path calculations ──
const RIVER_WIDTH = 800
const CURVE_AMPLITUDE = 260
const LESSON_SPACING_Y = 180
const RIVER_TOP_Y = 60

// Total node count: lessons + 1 exam node at the end
const totalNodes = computed(() => lessons.value.length + 1)

const riverPathData = computed(() => {
  const count = totalNodes.value
  if (count === 0) return ''
  const centerX = RIVER_WIDTH / 2
  let d = `M ${centerX} ${RIVER_TOP_Y}`
  for (let i = 0; i < count - 1; i++) {
    const startY = RIVER_TOP_Y + i * LESSON_SPACING_Y
    const endY = startY + LESSON_SPACING_Y
    const midY = (startY + endY) / 2
    const direction = i % 2 === 0 ? 1 : -1
    const cx = centerX + direction * CURVE_AMPLITUDE
    d += ` Q ${cx} ${midY} ${centerX} ${endY}`
  }
  return d
})

const riverViewBoxHeight = computed(() => {
  const count = totalNodes.value
  return RIVER_TOP_Y + Math.max(0, (count - 1) * LESSON_SPACING_Y) + 60
})

// Lesson positions along the river path
const lessonPositions = computed(() => {
  const centerX = RIVER_WIDTH / 2
  return lessons.value.map((lesson, i) => {
    const y = RIVER_TOP_Y + i * LESSON_SPACING_Y
    const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right'
    const isCompleted = progressStore.isCompleted(courseKey.value, lesson.id)
    const isUnlocked = progressStore.isUnlocked(courseKey.value, lesson.id)
    const isCurrent = !isCompleted && isUnlocked && (i === 0 || progressStore.isCompleted(courseKey.value, lessons.value[i - 1]?.id))
    return {
      lesson,
      x: centerX,
      y,
      side,
      isCompleted,
      isUnlocked,
      isCurrent: isCurrent || (i === 0 && !isCompleted),
    }
  })
})

// Exam node position (after the last lesson)
const examPosition = computed(() => {
  const centerX = RIVER_WIDTH / 2
  const i = lessons.value.length // index after the last lesson
  const y = RIVER_TOP_Y + i * LESSON_SPACING_Y
  const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right'
  return { x: centerX, y, side }
})

// The "next lesson index" determines how far the orange river fills.
// It fills up to AND including the next lesson to complete (not just completed ones).
const nextLessonIndex = computed(() => {
  const idx = lessons.value.findIndex(l => !progressStore.isCompleted(courseKey.value, l.id))
  if (idx === -1) {
    // All lessons completed — check if exam is passed
    return examPassed.value ? totalNodes.value - 1 : lessons.value.length
  }
  return idx
})

const riverRef = ref<SVGPathElement | null>(null)
const riverTotalLength = ref(0)
// Length along the SVG path to reach each node point (computed via getPointAtLength binary search)
const nodeLengths = ref<number[]>([])

onMounted(() => {
  if (!riverRef.value) return
  const path = riverRef.value
  riverTotalLength.value = path.getTotalLength()

  // Find the length along the path that corresponds to each node's Y position
  const totalLen = riverTotalLength.value
  const nodeCount = totalNodes.value
  const lengths: number[] = []

  for (let i = 0; i < nodeCount; i++) {
    const targetY = RIVER_TOP_Y + i * LESSON_SPACING_Y
    // Binary search for the length where path.getPointAtLength(l).y ≈ targetY
    let lo = 0, hi = totalLen
    for (let step = 0; step < 50; step++) {
      const mid = (lo + hi) / 2
      const pt = path.getPointAtLength(mid)
      if (pt.y < targetY) lo = mid
      else hi = mid
    }
    lengths.push((lo + hi) / 2)
  }
  nodeLengths.value = lengths
})

const riverDashOffset = computed(() => {
  if (riverTotalLength.value === 0 || nodeLengths.value.length === 0) return riverTotalLength.value
  const nodeCount = totalNodes.value

  const currentIdx = nextLessonIndex.value
  const lessonCount = lessons.value.length
  const currentProgress = currentIdx < lessonCount
    ? progressStore.getProgress(courseKey.value, lessons.value[currentIdx].id).bestScore / 100
    : currentIdx === lessonCount
      ? (examPassed.value ? 1 : 0)
      : 1

  // Length up to the current node
  const currentNodeLen = nodeLengths.value[currentIdx] ?? riverTotalLength.value
  // Length to the next node (for interpolation)
  const nextNodeLen = currentIdx + 1 < nodeCount
    ? nodeLengths.value[currentIdx + 1]
    : riverTotalLength.value
  // Interpolate between current and next node based on progress
  const segmentLen = nextNodeLen - currentNodeLen
  const fillLength = currentNodeLen + segmentLen * currentProgress

  return riverTotalLength.value - Math.min(riverTotalLength.value, fillLength)
})

// ── Floating shapes for objectives section (Demo D style) ──
const objectiveShapes = [
  { top: '8%', left: '15%', size: 100, rotation: 15, opacity: 0.06, type: 'blob' },
  { top: '35%', left: '55%', size: 70, rotation: -20, opacity: 0.05, type: 'ring' },
  { top: '60%', left: '25%', size: 50, rotation: 45, opacity: 0.07, type: 'dot' },
  { top: '80%', left: '65%', size: 90, rotation: -10, opacity: 0.04, type: 'blob' },
]

// ── Parallax scroll ──
const scrollY = ref(0)
function onScroll() { scrollY.value = window.scrollY }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// ── Landing-page section flags (each section is rendered iff its flag
//    on the course config is true). Default false so a brand-new course
//    that doesn't opt in stays minimal. ────────────────────────────────
const cfg = computed(() => module.value?.config)
const hasOriginStory          = computed(() => cfg.value?.hasOriginStory          === true)
const hasCosmology            = computed(() => cfg.value?.hasCosmology            === true)
const hasSilentInitialRule    = computed(() => cfg.value?.hasSilentInitialRule    === true)
const hasSyllableComposition  = computed(() => cfg.value?.hasSyllableComposition  === true)
// The "Full Table" CTA is shown whenever the table page has *something*
// to render — either a syllables composer (Korean matrix) or one or
// more static grids declared in the config (Japanese gojuon, dakuten,
// yoon).
const hasSyllableTable        = computed(() =>
  !!module.value?.syllables
  || (!!cfg.value?.tableGrids && cfg.value.tableGrids.length > 0),
)

// ── Character categories drive the listing sections. Each course
//    declares its own categories in `module.config.categories`, so
//    Korean shows 4 sections (basic/double consonants + basic/compound
//    vowels) while Japanese hiragana shows 2 (vowels + gojuon). ───────
interface ISectionGroup {
  id: string
  labelKey: string
  chars: ICourseCharacter[]
}

const characterSections = computed<ISectionGroup[]>(() => {
  const m = module.value
  if (!m) return []
  return m.config.categories
    .map(cat => ({
      id: cat.id,
      labelKey: cat.labelKey,
      chars: (m.characters ?? []).filter(c => cat.matches(c)),
    }))
    .filter(g => g.chars.length > 0)
})

// ── Hero cloud: pick a deterministic-but-scattered sample of
//    characters from the active module so the floating background
//    feels alive without being random per refresh. ───────────────────
const HERO_CLOUD_SLOTS = [
  { x: '10%', y: '8%',  s: '2.8rem', d: '0s',   o: 0.9  },
  { x: '55%', y: '5%',  s: '2rem',   d: '0.5s', o: 0.5  },
  { x: '80%', y: '15%', s: '3.2rem', d: '1.1s', o: 0.8  },
  { x: '25%', y: '30%', s: '3.5rem', d: '0.3s', o: 1    },
  { x: '65%', y: '35%', s: '2.2rem', d: '1.8s', o: 0.45 },
  { x: '5%',  y: '55%', s: '2rem',   d: '0.8s', o: 0.55 },
  { x: '45%', y: '55%', s: '4rem',   d: '1.4s', o: 0.85 },
  { x: '85%', y: '50%', s: '2.5rem', d: '0.2s', o: 0.6  },
  { x: '30%', y: '72%', s: '2rem',   d: '1s',   o: 0.4  },
  { x: '70%', y: '75%', s: '3rem',   d: '1.6s', o: 0.7  },
  { x: '15%', y: '85%', s: '2.5rem', d: '0.6s', o: 0.5  },
  { x: '50%', y: '88%', s: '2rem',   d: '1.2s', o: 0.35 },
  { x: '90%', y: '82%', s: '2.2rem', d: '0.9s', o: 0.55 },
  { x: '40%', y: '15%', s: '1.8rem', d: '2s',   o: 0.3  },
]

// ── Exercise difficulty completion per lesson ──
function isExerciseDone(lessonId: number, difficulty: 'easy' | 'medium' | 'hard'): boolean {
  return progressStore.getExerciseProgress(courseKey.value, lessonId, difficulty).bestScore >= 50
}

function lessonHasAttempts(lessonId: number): boolean {
  const p = progressStore.getProgress(courseKey.value, lessonId)
  return p.attempts > 0
}

function lessonScrollPercent(lessonId: number): number {
  const p = progressStore.getProgress(courseKey.value, lessonId)
  return p.bestScore
}

const heroCloud = computed(() => {
  const chars = module.value?.characters ?? []
  if (chars.length === 0) return []
  return HERO_CLOUD_SLOTS.map((slot, i) => ({
    ...slot,
    // Coprime stride so consecutive slots pick non-adjacent characters
    // even on small alphabets — for Hangeul (40 chars) this gives a
    // visually scattered cloud, for hiragana (46) idem.
    symbol: chars[(i * 7 + 3) % chars.length]?.symbol ?? '',
  }))
})
</script>

<template>
  <!-- ════════════════════════════════════════════════════════════════
       LEVEL-BASED COURSE (vocabulary lessons)
       ════════════════════════════════════════════════════════════════ -->
  <div v-if="isLevelCourse" class="lvl" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle }">

    <div class="contained bc-row">
      <Breadcrumb :items="[
        { label: t('nav.dashboard'), to: '/dashboard' },
        { label: t(`courses.${lang}.name`), to: paths.languageRoot },
        { label: t(tKey('title')) },
      ]" />
    </div>

    <!-- ════════ 1. HERO (Aurora + Giant Watermark) ════════ -->
    <section class="lvl-hero">
      <!-- Aurora blobs -->
      <div class="lvl-hero__aurora" aria-hidden="true" :style="{ transform: `translateY(${scrollY * 0.1}px)` }">
        <div class="lvl-hero__blob lvl-hero__blob--1"></div>
        <div class="lvl-hero__blob lvl-hero__blob--2"></div>
        <div class="lvl-hero__blob lvl-hero__blob--3"></div>
      </div>

      <!-- Giant progress watermark -->
      <div class="lvl-hero__watermark" aria-hidden="true">{{ progressPercent }}%</div>

      <!-- Floating decorative Korean characters -->
      <div class="lvl-hero__deco" aria-hidden="true">
        <span class="lvl-float" style="top:8%;left:6%;font-size:2.6rem;animation-delay:0s">&#xC548;</span>
        <span class="lvl-float" style="top:15%;right:10%;font-size:1.8rem;animation-delay:1.2s">&#xB155;</span>
        <span class="lvl-float" style="top:55%;left:3%;font-size:2rem;animation-delay:0.6s">&#xAC10;</span>
        <span class="lvl-float" style="top:70%;right:5%;font-size:2.4rem;animation-delay:1.8s">&#xC0AC;</span>
        <span class="lvl-float" style="bottom:15%;right:15%;font-size:1.6rem;animation-delay:0.3s">&#xB124;</span>
        <span class="lvl-float" style="bottom:10%;left:12%;font-size:1.9rem;animation-delay:1.5s">&#xC8FC;</span>
      </div>

      <div class="lvl-hero__inner contained" v-scroll-reveal>
        <img
          v-if="course?.flag"
          :src="course.flag"
          :alt="t(`courses.${lang}.name`)"
          class="lvl-hero__flag"
          width="56"
          height="56"
        />
        <span v-if="module?.config.officialLevel" class="lvl-hero__badge">{{ module.config.officialLevel }}</span>
        <h1>{{ t(tKey('title')) }}</h1>
        <p class="lvl-hero__desc">{{ t(module!.levelIntro!.descriptionKey) }}</p>

        <div class="lvl-hero__stats">
          <div class="lvl-stat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            <span class="lvl-stat__val">{{ lessons.length }}</span>
            <span class="lvl-stat__label">{{ t('levels.lessonsCount', { n: '' }).trim() }}</span>
          </div>
          <div class="lvl-stat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            <span class="lvl-stat__val">{{ totalWords }}</span>
            <span class="lvl-stat__label">{{ t('levels.wordsCount', { n: '' }).trim() }}</span>
          </div>
          <div v-if="module?.config.estimatedDuration" class="lvl-stat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="lvl-stat__val">{{ module.config.estimatedDuration }}</span>
            <span class="lvl-stat__label">{{ t('levels.progress') }}</span>
          </div>
        </div>

        <!-- Level validated badge -->
        <div v-if="examPassed" class="lvl-hero__validated">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
          <span>{{ t('levels.examPassed') }}</span>
        </div>

        <button class="lvl-hero__cta" @click="navigateTo(paths.lesson(nextLessonId))">
          {{ hasStarted ? t('levels.continueLearning') : t('levels.startLearning') }}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>

      <!-- Wave divider -->
      <svg class="lvl-hero__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,70 C240,100 480,30 720,60 C960,90 1200,25 1440,55 L1440,100 L0,100 Z" fill="var(--color-bg)" />
        <path d="M0,80 C360,50 720,95 1080,65 C1260,55 1380,80 1440,70 L1440,100 L0,100 Z" fill="var(--color-bg)" opacity="0.5" />
      </svg>
    </section>

    <!-- ════════ 2. ABOUT LEVEL (editorial, gradient left border) ════════ -->
    <section v-if="module?.levelIntro?.officialLevelInfoKey" class="lvl-about contained" v-scroll-reveal>
      <div class="lvl-about__block">
        <div class="lvl-about__header">
          <span v-if="module?.config.officialLevel" class="lvl-about__badge">{{ module.config.officialLevel }}</span>
          <h2><span class="lvl-about__light">{{ t('levels.aboutLevel').split(' ')[0] }}</span> {{ t('levels.aboutLevel').split(' ').slice(1).join(' ') }}</h2>
        </div>
        <p class="lvl-about__text">{{ t(module.levelIntro.officialLevelInfoKey) }}</p>
        <a
          v-if="module.levelIntro.officialLevelLink"
          :href="module.levelIntro.officialLevelLink"
          target="_blank" rel="noopener noreferrer"
          class="lvl-about__link"
        >
          {{ t('levels.officialSite') }}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
        </a>
      </div>
    </section>

    <!-- ════════ 3. YOU WILL LEARN (Demo D split layout) ════════ -->
    <section
      v-if="module?.levelIntro?.objectiveKeys?.length"
      class="lvl-objectives wave-section"
      :style="{ '--wave-bg': 'color-mix(in srgb, var(--cc) 6%, var(--color-bg-muted))' }"
    >
      <div class="contained">
        <div class="lvl-objectives__layout" v-scroll-reveal>
          <div class="lvl-objectives__text">
            <span class="lvl-objectives__eyebrow">{{ t('levels.whatYouWillLearn').split(' ')[0] }}</span>
            <h2 class="lvl-objectives__title">{{ t('levels.whatYouWillLearn') }}</h2>
            <div class="lvl-objectives__list" v-scroll-reveal.stagger>
              <div
                v-for="(key, i) in module.levelIntro.objectiveKeys"
                :key="i"
                class="lvl-obj"
                :class="{ 'lvl-obj--done': i < completedLessons }"
              >
                <span class="lvl-obj__marker">
                  <svg v-if="i < completedLessons" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span v-else>{{ i + 1 }}</span>
                </span>
                <span class="lvl-obj__text">{{ t(key) }}</span>
              </div>
            </div>
          </div>

          <!-- Decorative floating shapes -->
          <div class="lvl-objectives__deco" aria-hidden="true">
            <div
              v-for="(shape, i) in objectiveShapes"
              :key="i"
              class="lvl-deco-shape"
              :class="`lvl-deco-shape--${shape.type}`"
              :style="{
                top: shape.top,
                left: shape.left,
                width: shape.size + 'px',
                height: shape.size + 'px',
                transform: `rotate(${shape.rotation}deg)`,
                opacity: shape.opacity,
                animationDelay: `${i * 2}s`,
              }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ 4. LESSONS (Winding River - Demo E) ════════ -->
    <section class="lvl-river">
      <div class="lvl-river__wrap contained">
        <div class="lvl-river__header" v-scroll-reveal>
          <span class="lvl-river__num" aria-hidden="true">{{ lessons.length }}</span>
          <div>
            <h2>{{ t(tKey('lessons.title')) }}</h2>
            <p class="lvl-river__sub">{{ t(tKey('lessons.desc')) }}</p>
          </div>
        </div>

        <!-- Desktop: SVG river -->
        <div class="lvl-river__canvas" aria-hidden="true">
          <svg
            :viewBox="`0 0 ${RIVER_WIDTH} ${riverViewBoxHeight}`"
            preserveAspectRatio="xMidYMid meet"
            class="lvl-river__svg"
          >
            <defs>
              <linearGradient id="lvlRiverGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ea580c" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#ea580c" stop-opacity="0.1" />
              </linearGradient>
              <filter id="lvlRiverBlur">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <!-- Background dim river -->
            <path
              :d="riverPathData"
              fill="none"
              stroke="#3a3a50"
              stroke-width="7"
              stroke-linecap="round"
              opacity="0.4"
            />

            <!-- Glow track behind the fill -->
            <path
              :d="riverPathData"
              fill="none"
              stroke="url(#lvlRiverGlow)"
              stroke-width="20"
              stroke-linecap="round"
              opacity="0.3"
            />

            <!-- Orange filled path (progress up to next lesson) -->
            <path
              ref="riverRef"
              :d="riverPathData"
              fill="none"
              stroke="#ea580c"
              stroke-width="7"
              stroke-linecap="round"
              filter="url(#lvlRiverBlur)"
              :stroke-dasharray="riverTotalLength"
              :stroke-dashoffset="riverDashOffset"
              class="lvl-river__fill"
            />

            <!-- Lesson node dots on the river -->
            <template v-for="pos in lessonPositions" :key="'dot-' + pos.lesson.id">
              <circle
                :cx="pos.x"
                :cy="pos.y"
                :r="pos.isCurrent ? 12 : 8"
                :fill="pos.isUnlocked ? '#ea580c' : '#2a2a3e'"
                :stroke="pos.isUnlocked ? '#ea580c' : '#3a3a50'"
                stroke-width="2"
                :opacity="pos.isUnlocked ? 1 : 0.3"
                :class="{ 'lvl-river__node--pulse': pos.isCurrent }"
              />
              <!-- Dashed connector line to card -->
              <line
                :x1="pos.side === 'left' ? pos.x - 14 : pos.x + 14"
                :y1="pos.y"
                :x2="pos.side === 'left' ? pos.x - 60 : pos.x + 60"
                :y2="pos.y"
                :stroke="pos.isUnlocked ? '#ea580c' : '#3a3a50'"
                stroke-width="2"
                stroke-dasharray="4 3"
                :opacity="pos.isUnlocked ? 0.6 : 0.15"
              />
            </template>

            <!-- Exam node (special golden node) -->
            <circle
              :cx="examPosition.x"
              :cy="examPosition.y"
              :r="examPassed ? 16 : (examUnlocked ? 16 : 12)"
              :fill="examPassed ? '#d97706' : (examUnlocked ? '#d97706' : '#2a2a3e')"
              :stroke="examPassed ? '#f59e0b' : (examUnlocked ? '#f59e0b' : '#3a3a50')"
              stroke-width="3"
              :opacity="examUnlocked ? 1 : 0.3"
              :class="{ 'lvl-river__node--pulse': examUnlocked && !examPassed }"
            />
            <!-- Trophy icon inside the exam node -->
            <g v-if="examUnlocked || examPassed" :transform="`translate(${examPosition.x - 8}, ${examPosition.y - 8})`">
              <path d="M6 2h4v1h4v4c0 1.5-1 3-3 3.5V12h1v1H4v-1h1v-1.5C3 10 2 8.5 2 7V3h4V2zm-3 2v3c0 1 .8 2 2 2.5V12h6V9.5c1.2-.5 2-1.5 2-2.5V4h-3V3H6V4H3z" fill="#fff" fill-opacity="0.9" />
            </g>
            <!-- Dashed connector line to exam card -->
            <line
              :x1="examPosition.side === 'left' ? examPosition.x - 18 : examPosition.x + 18"
              :y1="examPosition.y"
              :x2="examPosition.side === 'left' ? examPosition.x - 60 : examPosition.x + 60"
              :y2="examPosition.y"
              :stroke="examUnlocked ? '#f59e0b' : '#3a3a50'"
              stroke-width="2"
              stroke-dasharray="4 3"
              :opacity="examUnlocked ? 0.6 : 0.15"
            />
          </svg>
        </div>

        <!-- Lesson cards positioned along the river -->
        <div class="lvl-river__cards" :style="{ minHeight: riverViewBoxHeight + 'px' }">
          <div
            v-for="(pos, idx) in lessonPositions"
            :key="pos.lesson.id"
            v-scroll-reveal
            :class="[
              'lvl-rcard',
              `lvl-rcard--${pos.side}`,
              { 'lvl-rcard--completed': pos.isCompleted },
              { 'lvl-rcard--current': pos.isCurrent },
              { 'lvl-rcard--locked': !pos.isUnlocked },
            ]"
            :style="{ top: `${pos.y - 40}px`, '--sr-delay': `${idx * 80}ms` }"
            @click="pos.isUnlocked && navigateTo(paths.lesson(pos.lesson.id))"
          >
            <span class="lvl-rcard__num">{{ pos.lesson.id }}</span>
            <div class="lvl-rcard__body">
              <h3 class="lvl-rcard__title">
                {{ t(tKey(`lessons.theme.${pos.lesson.themeKey}`)) }}
              </h3>
              <span class="lvl-rcard__meta">
                {{ pos.lesson.words.length }} {{ t('levels.wordsCount', { n: '' }).trim() }}
              </span>
              <!-- Exercise completion dots -->
              <div v-if="pos.isUnlocked" class="lvl-exdots">
                <span
                  v-for="diff in ([
                    { key: 'easy' as const, color: '#22c55e' },
                    { key: 'medium' as const, color: '#f59e0b' },
                    { key: 'hard' as const, color: '#ef4444' },
                  ])"
                  :key="diff.key"
                  class="lvl-exdot"
                  :class="{ 'lvl-exdot--done': isExerciseDone(pos.lesson.id, diff.key) }"
                  :style="{ '--dot-color': diff.color }"
                  :title="t(`lessonPage.${diff.key}`)"
                >
                  <svg v-if="isExerciseDone(pos.lesson.id, diff.key)" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span v-if="lessonHasAttempts(pos.lesson.id)" class="lvl-exdots__pct">{{ lessonScrollPercent(pos.lesson.id) }}%</span>
              </div>
            </div>
            <div class="lvl-rcard__icon">
              <!-- Completed check -->
              <svg v-if="pos.isCompleted" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <!-- Lock -->
              <svg v-else-if="!pos.isUnlocked" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>

          <!-- Exam card (special node at the end of the river) -->
          <div
            v-scroll-reveal
            :class="[
              'lvl-rcard lvl-rcard--exam',
              `lvl-rcard--${examPosition.side}`,
              { 'lvl-rcard--completed': examPassed },
              { 'lvl-rcard--current': examUnlocked && !examPassed },
              { 'lvl-rcard--locked': !examUnlocked },
            ]"
            :style="{ top: `${examPosition.y - 48}px`, '--sr-delay': `${lessons.length * 80}ms` }"
            @click="examUnlocked && navigateTo(paths.exam)"
          >
            <span class="lvl-rcard__exam-icon">
              <!-- Trophy SVG -->
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </span>
            <div class="lvl-rcard__body">
              <h3 class="lvl-rcard__title lvl-rcard__title--exam">{{ t('levels.finalExam') }}</h3>
              <span class="lvl-rcard__meta">
                <template v-if="examPassed">{{ t('levels.examPassed') }}</template>
                <template v-else-if="examUnlocked">{{ t('levels.examSubtitle') }}</template>
                <template v-else>{{ t('levels.examLocked') }}</template>
              </span>
            </div>
            <div class="lvl-rcard__icon">
              <svg v-if="examPassed" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <svg v-else-if="!examUnlocked" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <!-- Star for unlocked but not passed -->
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" stroke-width="1">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Mobile: simple vertical list (river hidden) -->
        <div class="lvl-river__mobile">
          <div
            v-for="(pos, idx) in lessonPositions"
            :key="'m-' + pos.lesson.id"
            v-scroll-reveal
            :class="[
              'lvl-mcard',
              { 'lvl-mcard--completed': pos.isCompleted },
              { 'lvl-mcard--current': pos.isCurrent },
              { 'lvl-mcard--locked': !pos.isUnlocked },
            ]"
            :style="{ '--sr-delay': `${idx * 60}ms` }"
            @click="pos.isUnlocked && navigateTo(paths.lesson(pos.lesson.id))"
          >
            <span class="lvl-mcard__num">{{ pos.lesson.id }}</span>
            <div class="lvl-mcard__body">
              <h3>{{ t(tKey(`lessons.theme.${pos.lesson.themeKey}`)) }}</h3>
              <span>{{ pos.lesson.words.length }} {{ t('levels.wordsCount', { n: '' }).trim() }}</span>
              <!-- Exercise completion dots -->
              <div v-if="pos.isUnlocked" class="lvl-exdots">
                <span
                  v-for="diff in ([
                    { key: 'easy' as const, color: '#22c55e' },
                    { key: 'medium' as const, color: '#f59e0b' },
                    { key: 'hard' as const, color: '#ef4444' },
                  ])"
                  :key="diff.key"
                  class="lvl-exdot"
                  :class="{ 'lvl-exdot--done': isExerciseDone(pos.lesson.id, diff.key) }"
                  :style="{ '--dot-color': diff.color }"
                  :title="t(`lessonPage.${diff.key}`)"
                >
                  <svg v-if="isExerciseDone(pos.lesson.id, diff.key)" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span v-if="lessonHasAttempts(pos.lesson.id)" class="lvl-exdots__pct">{{ lessonScrollPercent(pos.lesson.id) }}%</span>
              </div>
            </div>
            <svg v-if="pos.isCompleted" class="lvl-mcard__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else-if="!pos.isUnlocked" class="lvl-mcard__icon lvl-mcard__icon--lock" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>

          <!-- Exam card (mobile) -->
          <div
            v-scroll-reveal
            :class="[
              'lvl-mcard lvl-mcard--exam',
              { 'lvl-mcard--completed': examPassed },
              { 'lvl-mcard--current': examUnlocked && !examPassed },
              { 'lvl-mcard--locked': !examUnlocked },
            ]"
            :style="{ '--sr-delay': `${lessons.length * 60}ms` }"
            @click="examUnlocked && navigateTo(paths.exam)"
          >
            <span class="lvl-mcard__exam-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </span>
            <div class="lvl-mcard__body">
              <h3>{{ t('levels.finalExam') }}</h3>
              <span>
                <template v-if="examPassed">{{ t('levels.examPassed') }}</template>
                <template v-else-if="examUnlocked">{{ t('levels.examSubtitle') }}</template>
                <template v-else>{{ t('levels.examLocked') }}</template>
              </span>
            </div>
            <svg v-if="examPassed" class="lvl-mcard__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else-if="!examUnlocked" class="lvl-mcard__icon lvl-mcard__icon--lock" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="#d97706" stroke="#d97706" stroke-width="1">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- ════════════════════════════════════════════════════════════════
       CHARACTER-BASED COURSE (Hangeul, Hiragana, Katakana…)
       ════════════════════════════════════════════════════════════════ -->
  <div v-else class="lp" :style="{ '--cc': course?.color, '--cc-s': course?.colorSubtle }">

    <div class="contained bc-row">
      <Breadcrumb :items="[
        { label: t('nav.dashboard'), to: '/dashboard' },
        { label: t(`courses.${lang}.name`), to: paths.languageRoot },
        { label: t(tKey('title')) },
      ]" />
    </div>

    <!-- ════════ HERO ════════ -->
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__text">
          <span class="hero__pill"><img v-if="course?.flag" :src="course.flag" alt="" class="hero__pill-flag" /> {{ t(`courses.${lang}.name`) }}</span>
          <h1>{{ t(tKey('title')) }}</h1>
          <p>{{ t(tKey('desc')) }}</p>
          <div class="hero__actions">
            <NuxtLink v-if="hasSyllableTable" :to="paths.table" class="hero__ghost">{{ t(tKey('section.tableTitle')) }}</NuxtLink>
            <NuxtLink :to="paths.training" class="hero__cta">{{ t(tKey('training')) }}</NuxtLink>
          </div>
        </div>

        <div class="hero__cloud" aria-hidden="true">
          <span
            v-for="(slot, i) in heroCloud"
            :key="i"
            class="jamo"
            :style="{
              '--x': slot.x,
              '--y': slot.y,
              '--s': slot.s,
              '--d': slot.d,
              '--o': String(slot.o),
            }"
          >{{ slot.symbol }}</span>
        </div>
      </div>
    </section>

    <!-- ════════ ORIGIN STORY (Korean: King Sejong) ════════ -->
    <section v-if="hasOriginStory" class="story" id="story">
      <div class="story__inner contained">
        <div class="story__lead">
          <span class="story__eyebrow">{{ t(tKey('section.introEyebrow')) }}</span>
          <h2>{{ t(tKey('section.introP1')).split('.')[0] }}.</h2>
        </div>
        <div class="story__cols">
          <div class="story__col">
            <p>{{ t(tKey('section.introP1')).split('. ').slice(1).join('. ') }}</p>
          </div>
          <div class="story__col">
            <p>{{ t(tKey('section.introP2')) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ ORIGIN QUOTE ════════ -->
    <section v-if="hasOriginStory" class="quote-section">
      <div class="quote-section__inner contained">
        <div class="quote-section__mark" aria-hidden="true">"</div>
        <blockquote>
          <p>{{ t(tKey('section.introP3')) }}</p>
        </blockquote>
        <div class="quote-section__tag">
          <span class="quote-section__hanja">{{ t(tKey('section.introQuoteSource')) }}</span>
          <span>{{ t(tKey('section.introQuoteSourceLatin')) }}</span>
        </div>
      </div>
    </section>

    <!-- ════════ COSMOLOGY (Korean only) ════════ -->
    <template v-if="hasCosmology">
      <section class="band band--muted">
        <div class="contained">
          <span class="chip chip--cool">{{ t(tKey('section.jamoTitle')) }}</span>
          <h2 class="band__title">{{ t(tKey('section.jamoConsonantTitle')) }}</h2>
          <p class="band__sub">{{ t(tKey('section.jamoP1')) }}</p>

          <div class="shape-row">
            <div class="shape-pill" v-for="item in t(tKey('section.jamoConsonantList')).split(' | ')" :key="item">
              <span class="shape-pill__char">{{ item.split(' ')[0] }}</span>
              <span class="shape-pill__text">{{ item.split(': ').slice(1).join(': ') }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="contained cosmo">
        <h2>{{ t(tKey('section.jamoCosmologyTitle')) }}</h2>
        <p class="cosmo__sub">{{ t(tKey('section.jamoCosmologyP1')) }}</p>

        <div class="cosmo__grid">
          <div class="cosmo__card cosmo__card--sky">
            <span class="cosmo__sym">&#xB7;</span>
            <span class="cosmo__label">{{ t(tKey('section.jamoCosmologyHeaven')) }}</span>
          </div>
          <div class="cosmo__card cosmo__card--earth">
            <span class="cosmo__sym">&#x3161;</span>
            <span class="cosmo__label">{{ t(tKey('section.jamoCosmologyEarth')) }}</span>
          </div>
          <div class="cosmo__card cosmo__card--human">
            <span class="cosmo__sym">&#x3163;</span>
            <span class="cosmo__label">{{ t(tKey('section.jamoCosmologyHuman')) }}</span>
          </div>
        </div>

        <div class="eq-row">
          <span class="eq">&#x3163; + &#xB7; = <strong>&#x314F;</strong> <small>(a)</small></span>
          <span class="eq">&#xB7; + &#x3163; = <strong>&#x3153;</strong> <small>(eo)</small></span>
          <span class="eq">&#xB7; + &#x3161; = <strong>&#x3157;</strong> <small>(o)</small></span>
          <span class="eq">&#x3161; + &#xB7; = <strong>&#x315C;</strong> <small>(u)</small></span>
        </div>
      </section>
    </template>

    <!-- ════════ CHARACTER SECTIONS — generic, one section per category ════════ -->
    <section
      v-for="(group, idx) in characterSections"
      :key="group.id"
      :class="['char-section', idx % 2 === 0 ? 'band band--warm' : 'contained']"
    >
      <div :class="idx % 2 === 0 ? 'contained' : ''">
        <span class="chip" :class="idx % 2 === 0 ? 'chip--warm' : 'chip--cool'">{{ t(group.labelKey) }}</span>
        <h2 class="band__title">
          {{ t(group.labelKey) }}
          <span class="light">({{ group.chars.length }})</span>
        </h2>
        <div class="char-cards">
          <NuxtLink v-for="c in group.chars" :key="c.id" :to="paths.practice(c.id)" class="cc">
            <span class="cc__sym" :style="{ color: course?.color }">{{ c.symbol }}</span>
            <span class="cc__rom">{{ c.romanization }}</span>
            <span class="cc__name">{{ c.name }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ════════ SILENT ㅇ RULE (Korean only) ════════ -->
    <section v-if="hasSilentInitialRule" class="band band--indigo">
      <div class="rule-demo">
        <span class="rule-demo__c">&#x3147;</span>
        <span class="rule-demo__op">+</span>
        <span class="rule-demo__c">&#x314F;</span>
        <span class="rule-demo__op">=</span>
        <span class="rule-demo__c rule-demo__c--bright">&#xC544;</span>
      </div>
      <p class="rule-demo__text">{{ t(tKey('section.silentIeungRule')) }}</p>
    </section>

    <!-- ════════ SYLLABLE COMPOSITION (Korean only) ════════ -->
    <section v-if="hasSyllableComposition" class="contained split split--rev">
      <div class="split__text">
        <span class="chip chip--green">{{ t(tKey('section.syllablesTitle')) }}</span>
        <h2>{{ t(tKey('section.syllablesIntro')).split(':')[0] }}</h2>
        <p>{{ t(tKey('section.syllablesBlockExplanation')) }}</p>
      </div>
      <div class="split__diagrams">
        <div class="dg">
          <span class="dg__label">{{ t(tKey('section.cvPattern')) }}</span>
          <SyllableBlockDiagram mode="cv" :example="{ initial: '\u3131', medial: '\u314F', result: '\uAC00', romanization: 'ga' }" />
        </div>
        <div class="dg">
          <span class="dg__label">{{ t(tKey('section.cvcPattern')) }}</span>
          <SyllableBlockDiagram mode="cvc" :example="{ initial: '\u314E', medial: '\u314F', final: '\u3134', result: '\uD55C', romanization: 'han' }" />
        </div>
      </div>
    </section>

    <!-- ════════ CTAs — Table (only if course has a syllable composer) + Training ════════ -->
    <section class="cta-section">
      <div class="contained cta-grid">
        <NuxtLink v-if="hasSyllableTable" :to="paths.table" class="cta">
          <div class="cta__mosaic" aria-hidden="true">
            <span v-for="(slot, i) in heroCloud.slice(0, 16)" :key="i">{{ slot.symbol }}</span>
          </div>
          <div class="cta__body">
            <h3>{{ t(tKey('section.tableTitle')) }}</h3>
            <p>{{ t(tKey('section.tableDesc')) }}</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </NuxtLink>

        <NuxtLink :to="paths.training" class="cta cta--training">
          <div class="cta__icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <div class="cta__body">
            <h3>{{ t(tKey('training')) }}</h3>
            <p>{{ t(tKey('trainingDesc')) }}</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lp { display: flex; flex-direction: column; }

/* ── Utility ── */
.contained { max-width: 960px; margin: 0 auto; width: 100%; padding: 0 var(--space-6); }
.bc-row { padding-top: var(--space-4); padding-bottom: 0; }

.chip {
  display: inline-block; padding: 3px var(--space-3); border-radius: var(--radius-full);
  font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em;
}
.chip--warm { background: #fff4e0; color: #b45309; }
.chip--cool { background: #eef2ff; color: #4338ca; }
.chip--green { background: #dcfce7; color: #15803d; }
.light { font-weight: 400; color: var(--color-text-muted); }
.mt { margin-top: var(--space-8); font-size: var(--text-base); font-weight: 600; color: var(--color-text); }
.section-intro { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.7; margin: var(--space-2) 0 var(--space-4); max-width: 540px; }

/* ══════════ HERO ══════════ */
.hero {
  padding: var(--space-16) var(--space-6) var(--space-12);
  background: linear-gradient(160deg, var(--color-bg) 40%, var(--cc-s) 100%);
  overflow: hidden;
}

.hero__inner {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6);
  align-items: center; max-width: 1000px; margin: 0 auto;
}

.hero__text { display: flex; flex-direction: column; gap: var(--space-4); }

.hero__pill {
  display: inline-flex; align-items: center; gap: var(--space-2); width: fit-content;
  padding: var(--space-1-5) var(--space-3); border-radius: var(--radius-full);
  background: var(--cc-s); font-size: var(--text-xs); font-weight: 600; color: var(--cc);
}
.hero__pill-flag { width: 18px; height: 13px; object-fit: cover; border-radius: 2px; }

.hero__text h1 {
  font-size: clamp(2.2rem, 4.5vw, 3.2rem); font-weight: 700; color: var(--color-text);
  letter-spacing: -0.04em; line-height: 1.1;
}

.hero__text p {
  font-size: var(--text-base); color: var(--color-text-muted);
  line-height: 1.6; max-width: 380px;
}

.hero__actions { display: flex; gap: var(--space-3); margin-top: var(--space-2); }

.hero__cta {
  padding: 0.6rem 1.5rem; border-radius: var(--radius-lg);
  background: var(--color-primary); color: #fff;
  font-size: var(--text-sm); font-weight: 500; text-decoration: none;
  transition: opacity 150ms;
}
.hero__cta:hover { opacity: 0.85; }

.hero__ghost {
  padding: 0.6rem 1.5rem; border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-strong); background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--text-sm); font-weight: 500; text-decoration: none;
  transition: background 150ms;
}
.hero__ghost:hover { background: var(--color-bg-muted); }

/* Jamo cloud */
.hero__cloud {
  position: relative; width: 100%; min-height: 360px;
}

.jamo {
  position: absolute;
  left: var(--x); top: var(--y);
  font-family: var(--font-cjk-kr);
  font-size: var(--s);
  font-weight: 700;
  color: var(--cc);
  opacity: var(--o);
  animation: jamo-float 5s ease-in-out infinite;
  animation-delay: var(--d);
  pointer-events: none;
  user-select: none;
}

@keyframes jamo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* ══════════ STORY ══════════ */
.story {
  padding: var(--space-16) 0;
}
.story__inner {
  display: flex; flex-direction: column; gap: var(--space-8);
}
.story__lead {
  display: flex; flex-direction: column; gap: var(--space-3);
}
.story__eyebrow {
  font-size: var(--text-xs); font-weight: 600; color: var(--cc);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.story__lead h2 {
  font-size: var(--text-2xl); font-weight: 600; color: var(--color-text);
  line-height: 1.3; letter-spacing: -0.02em; max-width: 600px;
}
.story__cols {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8);
}
.story__col p {
  font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.8;
}

/* ══════════ QUOTE ══════════ */
.quote-section {
  padding: var(--space-16) 0;
  background: var(--color-primary-subtle);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}
.quote-section__inner {
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-5);
}
.quote-section__mark {
  font-size: 5rem; font-weight: 800; color: var(--color-primary); opacity: 0.15;
  line-height: 0.6; font-family: Georgia, serif;
}
.quote-section blockquote p {
  font-size: var(--text-lg); color: var(--color-text);
  font-style: italic; font-weight: 400; max-width: 580px;
  line-height: 1.7;
}
.quote-section__tag {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  margin-top: var(--space-2);
}
.quote-section__hanja {
  font-size: var(--text-base); font-family: var(--font-cjk-kr);
  color: var(--color-primary); letter-spacing: 0.15em; opacity: 0.6;
}
.quote-section__tag span:last-child {
  font-size: var(--text-xs); color: var(--color-text-subtle);
}

/* ══════════ SPLIT ══════════ */
.split {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-10);
  align-items: center; padding-top: var(--space-16); padding-bottom: var(--space-16);
}
.split--rev { direction: rtl; }
.split--rev > * { direction: ltr; }
.split__text { display: flex; flex-direction: column; gap: var(--space-3); }
.split__text h2 { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); line-height: 1.3; }
.split__text p { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.7; }

.split__diagrams {
  display: flex; flex-direction: column; gap: var(--space-5);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl); padding: var(--space-6);
}
.dg { display: flex; flex-direction: column; gap: var(--space-2); }
.dg__label { font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

/* ══════════ BANDS (full-width) ══════════ */
.band { padding: var(--space-12) var(--space-6); }
.band--muted { background: #f8f9fb; }
.band--warm { background: linear-gradient(180deg, #fffbf5, #fff7ed); }
.band--indigo { background: linear-gradient(135deg, #4338ca, #6366f1); text-align: center; padding: var(--space-10) var(--space-6); }

.band__title { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); margin-top: var(--space-2); }
.band__sub { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: 1.7; margin-top: var(--space-2); max-width: 540px; }

/* ══════════ SHAPES (jamo) ══════════ */
.shape-row {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-3); margin-top: var(--space-6);
}
.shape-pill {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) var(--space-4); background: #fff;
  border-radius: var(--radius-lg); border: 1px solid var(--color-border);
}
.shape-pill__char {
  font-size: 1.75rem; font-family: var(--font-cjk-kr); font-weight: 600;
  color: #4338ca; width: 32px; text-align: center; flex-shrink: 0;
}
.shape-pill__text { font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5; }

/* ══════════ COSMOLOGY ══════════ */
.cosmo { padding-top: var(--space-16); padding-bottom: var(--space-12); text-align: center; }
.cosmo h2 { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); }
.cosmo__sub { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-2); max-width: 480px; margin-inline: auto; line-height: 1.6; }
.cosmo__grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4);
  max-width: 540px; margin: var(--space-8) auto 0;
}
.cosmo__card {
  padding: var(--space-6) var(--space-4); border-radius: var(--radius-xl);
  display: flex; flex-direction: column; align-items: center; gap: var(--space-2);
}
.cosmo__card--sky   { background: #dbeafe; }
.cosmo__card--earth { background: #dcfce7; }
.cosmo__card--human { background: #fef9c3; }
.cosmo__sym { font-size: 3rem; font-family: var(--font-cjk-kr); font-weight: 600; line-height: 1; }
.cosmo__card--sky   .cosmo__sym { color: #2563eb; }
.cosmo__card--earth .cosmo__sym { color: #16a34a; }
.cosmo__card--human .cosmo__sym { color: #ca8a04; }
.cosmo__label { font-size: var(--text-xs); color: var(--color-text-secondary); line-height: 1.4; }

.eq-row {
  display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-3);
  margin-top: var(--space-8);
}
.eq {
  padding: var(--space-2) var(--space-4); background: var(--color-bg-muted);
  border-radius: var(--radius-full); font-family: var(--font-cjk-kr);
  font-size: 1.1rem; color: var(--color-text-muted); white-space: nowrap;
}
.eq strong { color: var(--color-primary); font-weight: 700; }
.eq small { font-size: var(--text-xs); font-family: var(--font-body); color: var(--color-text-subtle); }

/* ══════════ CHAR CARDS ══════════ */
.char-cards {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-3); margin-top: var(--space-4);
}
.char-cards--sm { grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); }

.cc {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: var(--space-4) var(--space-2);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); text-decoration: none;
  transition: all 150ms ease; cursor: pointer;
}
.cc:hover { border-color: var(--color-border-strong); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.cc__sym { font-size: 2.2rem; font-weight: 600; font-family: var(--font-cjk-kr); line-height: 1; }
.cc__rom { font-size: var(--text-xs); color: var(--color-text-muted); font-weight: 500; }
.cc__name { font-size: 0.6rem; color: var(--color-text-subtle); }

/* ══════════ VOWELS SECTION ══════════ */
.vowels-section { padding-top: var(--space-16); padding-bottom: var(--space-10); }
.vowels-section h2 { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); margin-top: var(--space-2); }

/* ══════════ RULE ══════════ */
.rule-demo {
  display: flex; align-items: center; justify-content: center; gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.rule-demo__c {
  font-size: 3rem; font-family: var(--font-cjk-kr); font-weight: 600; color: rgba(255,255,255,0.6); line-height: 1;
}
.rule-demo__c--bright { color: #fff; font-weight: 800; }
.rule-demo__op { font-size: var(--text-xl); color: rgba(255,255,255,0.3); }
.rule-demo__text { font-size: var(--text-sm); color: rgba(255,255,255,0.85); max-width: 460px; margin: 0 auto; line-height: 1.6; }

/* ══════════ CTA ══════════ */
.cta-section { padding: var(--space-8) 0 var(--space-16); }
.cta-grid { display: flex; flex-direction: column; gap: var(--space-3); }
.cta--training { border-color: var(--color-primary); }
.cta--training:hover { border-color: var(--color-primary-dark); box-shadow: var(--shadow-lg); }
.cta__icon-wrap {
  width: 48px; height: 48px; border-radius: var(--radius-xl);
  background: var(--color-primary-subtle); color: var(--color-primary);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.cta {
  display: flex; align-items: center; gap: var(--space-5);
  padding: var(--space-6); background: var(--color-bg-surface);
  border: 1px solid var(--color-border); border-radius: var(--radius-2xl);
  text-decoration: none; transition: all 150ms ease;
}
.cta:hover { border-color: var(--cc); box-shadow: var(--shadow-lg); }
.cta__mosaic {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px;
  width: 72px; flex-shrink: 0;
  font-family: var(--font-cjk-kr); font-size: 0.6rem; font-weight: 500; color: var(--cc);
}
.cta__mosaic span {
  width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;
  background: var(--cc-s); border-radius: 3px;
}
.cta__body { flex: 1; }
.cta__body h3 { font-size: var(--text-base); font-weight: 600; color: var(--color-text); }
.cta__body p { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 2px; }
.cta svg { color: var(--color-text-subtle); flex-shrink: 0; }

/* ══════════ RESPONSIVE (character-based) ══════════ */
@media (max-width: 640px) {
  .split { grid-template-columns: 1fr; gap: var(--space-6); padding-top: var(--space-10); padding-bottom: var(--space-10); }
  .split--rev { direction: ltr; }
  .hero__inner { grid-template-columns: 1fr; }
  .hero__cloud { min-height: 220px; }
  .story__cols { grid-template-columns: 1fr; gap: var(--space-4); }
  .cosmo__grid { grid-template-columns: 1fr; max-width: 200px; }
  .hero { padding: var(--space-16) var(--space-6) var(--space-10); }
  .hero h1 { font-size: var(--text-2xl); }
  .hero__scatter span { font-size: 2rem; }
  .eq-row { flex-direction: column; align-items: center; }
  .shape-row { grid-template-columns: 1fr; }
  .rule-demo__c { font-size: 2rem; }
}

/* ══════════════════════════════════════════════════════════════════
   LEVEL-BASED COURSE LANDING — REWRITTEN
   ══════════════════════════════════════════════════════════════════ */
.lvl {
  display: flex;
  flex-direction: column;
}

/* ────────────────────────────────────
   1. HERO — Aurora + Giant Watermark
   ──────────────────────────────────── */
.lvl-hero {
  position: relative;
  overflow: hidden;
  background: #0f0f1a;
  padding: var(--space-16) 0 0;
  color: #fff;
  text-align: center;
  min-height: 520px;
}

/* Aurora blobs */
.lvl-hero__aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.lvl-hero__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.35;
}

.lvl-hero__blob--1 {
  width: 480px;
  height: 420px;
  background: var(--cc, #6366f1);
  top: -20%;
  left: 10%;
  animation: lvl-aurora 15s ease-in-out infinite alternate;
}

.lvl-hero__blob--2 {
  width: 350px;
  height: 320px;
  background: color-mix(in srgb, var(--cc, #6366f1) 60%, #e11d48);
  bottom: -5%;
  right: 8%;
  animation: lvl-aurora 12s ease-in-out infinite alternate-reverse;
  opacity: 0.25;
}

.lvl-hero__blob--3 {
  width: 260px;
  height: 240px;
  background: color-mix(in srgb, var(--cc, #6366f1) 70%, #06b6d4);
  top: 35%;
  left: 55%;
  animation: lvl-aurora 18s ease-in-out infinite alternate;
  animation-delay: -5s;
  opacity: 0.2;
}

@keyframes lvl-aurora {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.2); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
}

/* Giant translucent progress watermark */
.lvl-hero__watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(10rem, 20vw, 14rem);
  font-weight: 900;
  color: rgba(255, 255, 255, 0.06);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  white-space: nowrap;
  letter-spacing: -0.04em;
}

/* Floating decorative characters */
.lvl-hero__deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.lvl-float {
  position: absolute;
  font-family: var(--font-cjk-kr);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.08);
  animation: lvl-bob 6s ease-in-out infinite;
}

@keyframes lvl-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.lvl-hero__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding-bottom: var(--space-16);
  max-width: 960px;
  margin: 0 auto;
  padding-left: var(--space-6);
  padding-right: var(--space-6);
}

.lvl-hero__flag {
  width: 56px;
  height: 56px;
  object-fit: contain;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.4));
  border-radius: var(--radius-lg);
}

.lvl-hero__badge {
  display: inline-block;
  padding: var(--space-1) var(--space-4);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.lvl-hero h1 {
  font-size: clamp(1.8rem, 4.5vw, 3rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.lvl-hero__desc {
  font-size: var(--text-base);
  opacity: 0.75;
  max-width: 480px;
  line-height: 1.7;
  margin: 0;
}

/* Stats */
.lvl-hero__stats {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: var(--space-3);
}

.lvl-stat {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
}

.lvl-stat svg {
  opacity: 0.5;
  flex-shrink: 0;
}

.lvl-stat__val {
  font-weight: 700;
}

.lvl-stat__label {
  opacity: 0.6;
  font-size: var(--text-xs);
}

/* CTA */
.lvl-hero__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-5);
  padding: var(--space-3) var(--space-8);
  background: var(--cc, #6366f1);
  color: #fff;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  transition: all 200ms ease;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 40px color-mix(in srgb, var(--cc) 30%, transparent);
}

.lvl-hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px color-mix(in srgb, var(--cc) 40%, transparent);
}

.lvl-hero__cta svg {
  transition: transform 200ms;
}

.lvl-hero__cta:hover svg {
  transform: translateX(4px);
}

/* Level validated badge */
.lvl-hero__validated {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: rgba(217, 119, 6, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--radius-full);
  color: #fbbf24;
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.02em;
}

/* Wave divider */
.lvl-hero__wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  pointer-events: none;
  z-index: 3;
}

/* ────────────────────────────────────
   2. ABOUT LEVEL — Editorial, gradient left border
   ──────────────────────────────────── */
.lvl-about {
  margin-top: var(--space-10);
}

.lvl-about__block {
  position: relative;
  padding-left: var(--space-6);
}

.lvl-about__block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(180deg, var(--cc, var(--color-primary)), color-mix(in srgb, var(--cc, var(--color-primary)) 40%, transparent));
  border-radius: var(--radius-full);
}

.lvl-about__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.lvl-about__badge {
  font-size: var(--text-xs);
  font-weight: 800;
  color: #fff;
  background: var(--cc, var(--color-primary));
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.lvl-about__header h2 {
  font-size: clamp(1.4rem, 3vw, var(--text-2xl));
  font-weight: 800;
  color: var(--color-text);
  margin: 0;
  letter-spacing: -0.02em;
}
.lvl-about__light { font-weight: 300; }

.lvl-about__text {
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.8;
  color: var(--color-text-secondary);
  max-width: 640px;
}

.lvl-about__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--cc, var(--color-primary));
  text-decoration: none;
}

.lvl-about__link:hover {
  text-decoration: underline;
}

/* ────────────────────────────────────
   3. YOU WILL LEARN — Split layout (Demo D)
   ──────────────────────────────────── */
.lvl-objectives {
  margin-top: var(--space-10);
}

.lvl-objectives__layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-10);
  align-items: center;
}

.lvl-objectives__eyebrow {
  display: inline-block;
  font-size: var(--text-xs); font-weight: 800;
  color: var(--cc, var(--color-primary));
  text-transform: uppercase; letter-spacing: 0.15em;
  margin-bottom: var(--space-2);
}
.lvl-objectives__title {
  font-size: clamp(1.6rem, 3.5vw, var(--text-2xl));
  font-weight: 800;
  color: var(--color-text);
  margin: 0 0 var(--space-6);
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-text) 40%, var(--cc, var(--color-primary)) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}

.lvl-objectives__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.lvl-obj {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all 200ms ease;
}

.lvl-obj:hover {
  border-color: var(--cc);
  box-shadow: var(--shadow-sm);
}

.lvl-obj--done {
  border-color: var(--color-success);
  background: #f0fdf4;
}

.lvl-obj__marker {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--cc-s, var(--color-primary-subtle));
  font-size: 0.65rem;
  font-weight: 800;
}

.lvl-obj__marker span {
  color: var(--cc, var(--color-primary));
}

.lvl-obj--done .lvl-obj__marker {
  background: var(--color-success);
  color: #fff;
}

.lvl-obj__text {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  flex: 1;
}

.lvl-obj--done .lvl-obj__text {
  color: var(--color-text-muted);
}

/* Decorative floating shapes (right side) */
.lvl-objectives__deco {
  position: relative;
  min-height: 280px;
}

.lvl-deco-shape {
  position: absolute;
  background: var(--cc, var(--color-primary));
  animation: lvl-deco-drift 10s ease-in-out infinite;
}

.lvl-deco-shape--blob {
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}

.lvl-deco-shape--ring {
  background: none;
  border: 3px solid var(--cc, var(--color-primary));
  border-radius: 50%;
}

.lvl-deco-shape--dot {
  border-radius: 50%;
}

@keyframes lvl-deco-drift {
  0%, 100% { transform: translate(0, 0) rotate(var(--r, 0deg)); }
  50% { transform: translate(15px, -20px) rotate(calc(var(--r, 0deg) + 10deg)); }
}

/* ────────────────────────────────────
   4. LESSONS — Winding River (Demo E)
   ──────────────────────────────────── */
.lvl-river {
  padding: var(--space-10) 0 var(--space-16);
  position: relative;
}

.lvl-river__wrap {
  position: relative;
}

.lvl-river__header {
  display: flex; align-items: center; gap: var(--space-5);
  margin-bottom: var(--space-8);
}
.lvl-river__num {
  font-size: clamp(3rem, 8vw, 5rem); font-weight: 900;
  color: var(--cc, var(--color-primary)); opacity: 0.1;
  line-height: 1; flex-shrink: 0;
}
.lvl-river__header h2 {
  font-size: clamp(1.6rem, 3.5vw, var(--text-2xl));
  font-weight: 800;
  color: var(--color-text);
  margin: 0; letter-spacing: -0.02em;
}
.lvl-river__sub {
  margin: var(--space-1) 0 0;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

/* Desktop SVG river canvas */
.lvl-river__canvas {
  position: absolute;
  top: 56px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;
  pointer-events: none;
  z-index: 0;
}

.lvl-river__svg {
  width: 100%;
  height: auto;
}

.lvl-river__fill {
  transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Pulsing current node */
.lvl-river__node--pulse {
  animation: lvl-node-pulse 2s ease-in-out infinite;
}

@keyframes lvl-node-pulse {
  0%, 100% { r: 12; opacity: 1; }
  50% { r: 16; opacity: 0.7; }
}

/* Lesson cards along the river */
.lvl-river__cards {
  position: relative;
  z-index: 1;
  display: none;
}

.lvl-rcard {
  position: absolute;
  width: 260px;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 200ms ease;
  box-shadow: var(--shadow-sm);
}

.lvl-rcard:hover {
  border-color: #ea580c;
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.lvl-rcard--left {
  right: calc(50% + 80px);
}

.lvl-rcard--right {
  left: calc(50% + 80px);
}

.lvl-rcard--completed {
  border-color: #ea580c;
  background: color-mix(in srgb, #fff7ed 50%, var(--color-bg-surface));
}

.lvl-rcard--current {
  border-color: #ea580c;
  box-shadow: 0 0 20px rgba(234, 88, 12, 0.25);
  animation: lvl-card-glow 3s ease-in-out infinite;
}

@keyframes lvl-card-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(234, 88, 12, 0.2); }
  50% { box-shadow: 0 0 30px rgba(234, 88, 12, 0.4); }
}

.lvl-rcard--locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.lvl-rcard--locked:hover {
  transform: none;
  box-shadow: var(--shadow-sm);
  border-color: var(--color-border);
}

.lvl-rcard__num {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff7ed;
  color: #ea580c;
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  font-weight: 800;
}

.lvl-rcard--completed .lvl-rcard__num {
  background: #ea580c;
  color: #fff;
}

.lvl-rcard__body {
  flex: 1;
  min-width: 0;
}

.lvl-rcard__title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lvl-rcard__meta {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
  display: block;
}

.lvl-rcard__icon {
  flex-shrink: 0;
  color: var(--color-text-subtle);
}

/* ── Mobile lesson list ── */
.lvl-river__mobile {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.lvl-mcard {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 200ms ease;
}

.lvl-mcard:hover {
  border-color: #ea580c;
  box-shadow: var(--shadow-md);
}

.lvl-mcard--completed {
  border-color: #ea580c;
  background: color-mix(in srgb, #fff7ed 30%, var(--color-bg-surface));
}

.lvl-mcard--current {
  border-color: #ea580c;
  box-shadow: 0 0 16px rgba(234, 88, 12, 0.25);
}

.lvl-mcard--locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.lvl-mcard--locked:hover {
  border-color: var(--color-border);
  box-shadow: none;
}

.lvl-mcard__num {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff7ed;
  color: #ea580c;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 800;
}

.lvl-mcard--completed .lvl-mcard__num {
  background: #ea580c;
  color: #fff;
}

.lvl-mcard__body {
  flex: 1;
  min-width: 0;
}

.lvl-mcard__body h3 {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.lvl-mcard__body span {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.lvl-mcard__icon {
  flex-shrink: 0;
}

.lvl-mcard__icon--lock {
  color: var(--color-text-subtle);
}

/* ── Exercise completion dots (shared by rcard & mcard) ── */
.lvl-exdots {
  display: flex;
  align-items: center;
  gap: var(--space-1-5);
  margin-top: 4px;
}

.lvl-exdot {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-muted);
  border: 1.5px solid var(--color-border);
  color: var(--color-text-subtle);
  transition: all 200ms ease;
}

.lvl-exdot--done {
  background: color-mix(in srgb, var(--dot-color) 15%, transparent);
  border-color: var(--dot-color);
  color: var(--dot-color);
}

.lvl-exdots__pct {
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--color-text-muted);
  margin-left: var(--space-1);
  font-variant-numeric: tabular-nums;
}

/* ── Exam card (desktop river) ── */
.lvl-rcard--exam {
  width: 280px;
  border: 2px solid #d97706;
  background: linear-gradient(135deg, #fffbeb 0%, var(--color-bg-surface) 100%);
  box-shadow: 0 0 20px rgba(217, 119, 6, 0.15);
}

.lvl-rcard--exam.lvl-rcard--locked {
  border-color: var(--color-border);
  background: var(--color-bg-surface);
  box-shadow: none;
}

.lvl-rcard--exam.lvl-rcard--current {
  animation: lvl-exam-glow 3s ease-in-out infinite;
}

@keyframes lvl-exam-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(217, 119, 6, 0.25); }
  50% { box-shadow: 0 0 35px rgba(217, 119, 6, 0.45); }
}

.lvl-rcard--exam:hover:not(.lvl-rcard--locked) {
  border-color: #f59e0b;
}

.lvl-rcard__exam-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef3c7;
  color: #d97706;
  border-radius: var(--radius-full);
}

.lvl-rcard--exam.lvl-rcard--completed .lvl-rcard__exam-icon {
  background: #d97706;
  color: #fff;
}

.lvl-rcard--exam.lvl-rcard--locked .lvl-rcard__exam-icon {
  background: var(--color-bg-muted);
  color: var(--color-text-subtle);
}

.lvl-rcard__title--exam {
  color: #92400e;
}

.lvl-rcard--exam.lvl-rcard--locked .lvl-rcard__title--exam {
  color: var(--color-text);
}

/* ── Exam card (mobile) ── */
.lvl-mcard--exam {
  border: 2px solid #d97706;
  background: linear-gradient(135deg, #fffbeb 0%, var(--color-bg-surface) 100%);
}

.lvl-mcard--exam.lvl-mcard--locked {
  border-color: var(--color-border);
  background: var(--color-bg-surface);
}

.lvl-mcard--exam.lvl-mcard--current {
  box-shadow: 0 0 20px rgba(217, 119, 6, 0.3);
}

.lvl-mcard--exam:hover:not(.lvl-mcard--locked) {
  border-color: #f59e0b;
}

.lvl-mcard__exam-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef3c7;
  color: #d97706;
  border-radius: var(--radius-full);
}

.lvl-mcard--exam.lvl-mcard--completed .lvl-mcard__exam-icon {
  background: #d97706;
  color: #fff;
}

.lvl-mcard--exam.lvl-mcard--locked .lvl-mcard__exam-icon {
  background: var(--color-bg-muted);
  color: var(--color-text-subtle);
}

.lvl-mcard--exam .lvl-mcard__body h3 {
  color: #92400e;
}

.lvl-mcard--exam.lvl-mcard--locked .lvl-mcard__body h3 {
  color: var(--color-text);
}

/* ══════════ RESPONSIVE — Level-based ══════════ */

/* Desktop: show river + cards, hide mobile list */
@media (min-width: 769px) {
  .lvl-river__cards {
    display: block;
  }

  .lvl-river__mobile {
    display: none;
  }
}

/* Mobile: hide river, show list */
@media (max-width: 768px) {
  .lvl-river__canvas {
    display: none;
  }

  .lvl-river__cards {
    display: none;
  }

  .lvl-river__mobile {
    display: flex;
  }

  .lvl-hero {
    min-height: auto;
    padding-top: var(--space-10);
  }

  .lvl-hero h1 {
    font-size: var(--text-2xl);
  }

  .lvl-hero__stats {
    flex-direction: column;
    align-items: center;
  }

  .lvl-hero__cta {
    width: 100%;
    justify-content: center;
  }

  .lvl-hero__watermark {
    font-size: 8rem;
  }

  .lvl-objectives__layout {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .lvl-objectives__deco {
    display: none;
  }

  .lvl-hero__blob--1 {
    width: 300px;
    height: 260px;
  }

  .lvl-hero__blob--2 {
    width: 240px;
    height: 200px;
  }

  .lvl-hero__blob--3 {
    width: 180px;
    height: 160px;
  }
}
</style>
