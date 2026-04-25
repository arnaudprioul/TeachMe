<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiLocales } from '~/composables/useUiLocales'
import { useAuthStore } from '~/stores/auth.store'
import { useStatsStore } from '~/stores/stats.store'
import { useFavoritesStore } from '~/stores/favorites.store'
import { useLessonProgressStore } from '~/stores/lesson-progress.store'
import { useTheme, type ThemeMode } from '~/composables/useTheme'
import { useCourses } from '~/composables/useCourses'
import { COURSE_REGISTRY } from '~/composables/data/courses'
import type { ICourseCharacter } from '~/composables/data/courses/types'
import type { TExerciseDifficulty } from '~/composables/data/courses/lesson-types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const { locale, setLocale, locales: uiLocales } = useUiLocales()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const stats = useStatsStore()
const favorites = useFavoritesStore()
const lessonProgress = useLessonProgressStore()
const { mode, setTheme } = useTheme()
const { courses } = useCourses()

type ProfileTab = 'overview' | 'favorites' | 'settings' | 'exercises'
const VALID_TABS: ProfileTab[] = ['overview', 'favorites', 'settings', 'exercises']

function tabFromQuery(): ProfileTab {
  const q = route.query.tab as string | undefined
  return q && VALID_TABS.includes(q as ProfileTab) ? (q as ProfileTab) : 'overview'
}

const activeTab = ref<ProfileTab>(tabFromQuery())

// Keep the URL query in sync with the active tab so deep-links work
// both ways: ?tab=settings opens the settings tab, and clicking a tab
// updates the URL without a full navigation.
watch(activeTab, (tab) => {
  const query = tab === 'overview' ? {} : { tab }
  router.replace({ query })
})

// Also react if the route query changes externally (browser back/forward)
watch(() => route.query.tab, () => {
  activeTab.value = tabFromQuery()
})

const userInitial = computed(() => auth.user?.username?.[0]?.toUpperCase() ?? '?')

interface IFavoriteGroup {
  courseKey: string
  lang: string
  course: string
  langName: string
  courseName: string
  flag?: string
  color?: string
  chars: ICourseCharacter[]
}

const favoriteGroups = computed<IFavoriteGroup[]>(() =>
  favorites.courseKeys.map(courseKey => {
    const module = COURSE_REGISTRY[courseKey]
    const dash = courseKey.indexOf('-')
    const lang = courseKey.slice(0, dash)
    const course = courseKey.slice(dash + 1)
    const courseInfo = courses.find(c => c.slug === lang)
    const ids = favorites.listForCourse(courseKey)
    const chars = module
      ? ids.map(id => module.characters.find(c => c.id === id)).filter((c): c is ICourseCharacter => !!c)
      : []
    return {
      courseKey,
      lang,
      course,
      langName: t(`courses.${lang}.name`),
      courseName: t(`courses.${lang}.${course.replace(/-/g, '')}.title`),
      flag: courseInfo?.flag,
      color: courseInfo?.color,
      chars,
    }
  }).filter(g => g.chars.length > 0),
)

const langStatsList = computed(() =>
  stats.activeCourses.map(courseKey => {
    const dash = courseKey.indexOf('-')
    const lang = courseKey.slice(0, dash)
    const course = courseKey.slice(dash + 1)
    const courseInfo = courses.find(c => c.slug === lang)
    const s = stats.getStats(courseKey)
    return {
      courseKey,
      lang,
      course,
      langName: t(`courses.${lang}.name`),
      courseName: t(`courses.${lang}.${course.replace(/-/g, '')}.title`),
      flag: courseInfo?.flag,
      color: courseInfo?.color,
      ...s,
      accuracy: s.totalAnswered > 0 ? Math.round((s.totalCorrect / s.totalAnswered) * 100) : 0,
    }
  }),
)

// ── Lesson & exercise progress data ──

const DIFFICULTIES: TExerciseDifficulty[] = ['easy', 'medium', 'hard']

/** Extract unique course keys from lesson and exercise progress */
function extractProgressCourseKeys(): string[] {
  const keys = new Set<string>()
  for (const key of Object.keys(lessonProgress.byLesson)) {
    const parts = key.split(':')
    if (parts.length >= 2) keys.add(parts.slice(0, -1).join(':'))
  }
  for (const key of Object.keys(lessonProgress.byExercise)) {
    const parts = key.split(':')
    if (parts.length >= 3) keys.add(parts.slice(0, -2).join(':'))
  }
  return Array.from(keys)
}

/** Global lesson/exercise summary stats for the overview tab */
const lessonExerciseSummary = computed(() => {
  let lessonsStarted = 0
  let lessonsCompleted = 0
  let exercisesCompleted = 0
  const scoresByDifficulty: Record<TExerciseDifficulty, number[]> = { easy: [], medium: [], hard: [] }

  for (const progress of Object.values(lessonProgress.byLesson)) {
    if (progress.attempts > 0) lessonsStarted++
    if (progress.completed) lessonsCompleted++
  }
  for (const [key, ep] of Object.entries(lessonProgress.byExercise)) {
    if (ep.attempts > 0) exercisesCompleted++
    // Parse difficulty from key (last segment)
    const parts = key.split(':')
    const diff = parts[parts.length - 1] as TExerciseDifficulty
    if (DIFFICULTIES.includes(diff) && ep.bestScore > 0) {
      scoresByDifficulty[diff].push(ep.bestScore)
    }
  }

  const avgByDifficulty = DIFFICULTIES.map(d => ({
    difficulty: d,
    avg: scoresByDifficulty[d].length > 0
      ? Math.round(scoresByDifficulty[d].reduce((a, b) => a + b, 0) / scoresByDifficulty[d].length)
      : null,
    count: scoresByDifficulty[d].length,
  }))

  return { lessonsStarted, lessonsCompleted, exercisesCompleted, avgByDifficulty }
})

/** Per-course lesson + exercise progress for overview */
interface ICourseProgressSummary {
  courseKey: string
  lang: string
  course: string
  langName: string
  courseName: string
  flag?: string
  color?: string
  totalLessons: number
  completedLessons: number
  exercisesByDifficulty: { difficulty: TExerciseDifficulty; avg: number | null; count: number }[]
}

const courseProgressList = computed<ICourseProgressSummary[]>(() => {
  const courseKeys = extractProgressCourseKeys()
  return courseKeys.map(courseKey => {
    const dash = courseKey.indexOf('-')
    const lang = courseKey.slice(0, dash)
    const course = courseKey.slice(dash + 1)
    const courseInfo = courses.find(c => c.slug === lang)
    const mod = COURSE_REGISTRY[courseKey]
    const totalLessons = mod?.lessons?.length ?? 0

    // Count completed lessons for this course
    let completedLessons = 0
    for (const [key, progress] of Object.entries(lessonProgress.byLesson)) {
      if (key.startsWith(`${courseKey}:`) && progress.completed) completedLessons++
    }

    // Exercise score averages per difficulty for this course
    const scoresByDiff: Record<TExerciseDifficulty, number[]> = { easy: [], medium: [], hard: [] }
    for (const [key, ep] of Object.entries(lessonProgress.byExercise)) {
      if (key.startsWith(`${courseKey}:`) && ep.bestScore > 0) {
        const parts = key.split(':')
        const diff = parts[parts.length - 1] as TExerciseDifficulty
        if (DIFFICULTIES.includes(diff)) scoresByDiff[diff].push(ep.bestScore)
      }
    }

    const exercisesByDifficulty = DIFFICULTIES.map(d => ({
      difficulty: d,
      avg: scoresByDiff[d].length > 0
        ? Math.round(scoresByDiff[d].reduce((a, b) => a + b, 0) / scoresByDiff[d].length)
        : null,
      count: scoresByDiff[d].length,
    }))

    return {
      courseKey,
      lang,
      course,
      langName: t(`courses.${lang}.name`),
      courseName: t(`courses.${lang}.${course.replace(/-/g, '')}.title`),
      flag: courseInfo?.flag,
      color: courseInfo?.color,
      totalLessons,
      completedLessons,
      exercisesByDifficulty,
    }
  }).filter(c => c.totalLessons > 0 || c.completedLessons > 0)
})

// ── Exercises tab data ──

interface IExerciseLessonEntry {
  lessonId: number
  themeKey: string
  difficulties: {
    difficulty: TExerciseDifficulty
    bestScore: number
    attempts: number
    passed: boolean
    hasAttempt: boolean
  }[]
}

interface IExerciseCourseGroup {
  courseKey: string
  lang: string
  course: string
  langName: string
  courseName: string
  flag?: string
  color?: string
  localePrefix: string
  lessons: IExerciseLessonEntry[]
}

const exerciseCourseGroups = computed<IExerciseCourseGroup[]>(() => {
  const courseKeys = extractProgressCourseKeys()
  return courseKeys.map(courseKey => {
    const dash = courseKey.indexOf('-')
    const lang = courseKey.slice(0, dash)
    const course = courseKey.slice(dash + 1)
    const courseInfo = courses.find(c => c.slug === lang)
    const mod = COURSE_REGISTRY[courseKey]
    if (!mod?.lessons?.length) return null

    const localePrefix = mod.config.localePrefix

    // Find lessons that have any exercise progress
    const lessonMap = new Map<number, IExerciseLessonEntry>()

    for (const [key, ep] of Object.entries(lessonProgress.byExercise)) {
      if (!key.startsWith(`${courseKey}:`)) continue
      const parts = key.split(':')
      const diff = parts[parts.length - 1] as TExerciseDifficulty
      const lessonId = Number(parts[parts.length - 2])
      if (isNaN(lessonId) || !DIFFICULTIES.includes(diff)) continue

      if (!lessonMap.has(lessonId)) {
        const lesson = mod.lessons!.find(l => l.id === lessonId)
        lessonMap.set(lessonId, {
          lessonId,
          themeKey: lesson?.themeKey ?? '',
          difficulties: DIFFICULTIES.map(d => ({
            difficulty: d,
            bestScore: 0,
            attempts: 0,
            passed: false,
            hasAttempt: false,
          })),
        })
      }

      const entry = lessonMap.get(lessonId)!
      const diffEntry = entry.difficulties.find(d => d.difficulty === diff)!
      diffEntry.bestScore = ep.bestScore
      diffEntry.attempts = ep.attempts
      diffEntry.passed = ep.bestScore >= 50
      diffEntry.hasAttempt = ep.attempts > 0
    }

    // Only include available courses
    if (!courseInfo || courseInfo.status !== 'available') return null

    // Also include lessons from the module that have exercises but no attempts yet
    for (const lesson of mod.lessons!) {
      if (lesson.exercises?.length && !lessonMap.has(lesson.id)) {
        lessonMap.set(lesson.id, {
          lessonId: lesson.id,
          themeKey: lesson.themeKey,
          difficulties: DIFFICULTIES.map(d => ({
            difficulty: d,
            bestScore: 0,
            attempts: 0,
            passed: false,
            hasAttempt: false,
          })),
        })
      }
    }

    if (lessonMap.size === 0) return null

    const lessons = Array.from(lessonMap.values()).sort((a, b) => a.lessonId - b.lessonId)

    return {
      courseKey,
      lang,
      course,
      langName: t(`courses.${lang}.name`),
      courseName: t(`courses.${lang}.${course.replace(/-/g, '')}.title`),
      flag: courseInfo?.flag,
      color: courseInfo?.color,
      localePrefix,
      lessons,
    }
  }).filter((g): g is IExerciseCourseGroup => !!g)
})

// Collapse state for exercise groups
const exerciseCollapseOpen = ref<Record<string, boolean>>({})
function toggleExerciseGroup(key: string) {
  exerciseCollapseOpen.value[key] = !exerciseCollapseOpen.value[key]
}

function difficultyLabel(d: TExerciseDifficulty): string {
  if (d === 'easy') return t('profile.exerciseEasy')
  if (d === 'medium') return t('profile.exerciseMedium')
  return t('profile.exerciseHard')
}

function exerciseRoute(lang: string, course: string, lessonId: number, difficulty: TExerciseDifficulty): string {
  return `/${lang}/${course}/lessons/${lessonId}/exercises?difficulty=${difficulty}`
}
</script>

<template>
  <div class="profile page-container">
    <Breadcrumb :items="[
      { label: t('nav.dashboard'), to: '/dashboard' },
      { label: t('profile.title') },
    ]" />

    <!-- ── Header ── -->
    <header class="profile__header">
      <div class="profile__avatar">{{ userInitial }}</div>
      <div class="profile__info">
        <h1>{{ auth.user?.username }}</h1>
        <p v-if="auth.user?.email">{{ auth.user.email }}</p>
      </div>
    </header>

    <!-- ── Sidebar + content ── -->
    <div class="profile__layout">
      <AccountSidebar />
      <div class="profile__content">

    <!-- ── OVERVIEW ── -->
    <div v-if="activeTab === 'overview'" class="tab-content">
      <!-- Global stats -->
      <section class="card">
        <h2 class="card__title">{{ t('profile.stats') }}</h2>
        <div class="stat-grid">
          <div class="stat">
            <span class="stat__value">{{ stats.totals.sessions }}</span>
            <span class="stat__label">{{ t('profile.totalSessions') }}</span>
          </div>
          <div class="stat">
            <span class="stat__value">{{ stats.totals.correct }}</span>
            <span class="stat__label">{{ t('profile.totalCorrect') }}</span>
          </div>
          <div class="stat">
            <span class="stat__value">{{ stats.totals.bestStreak }}</span>
            <span class="stat__label">{{ t('profile.bestStreak') }}</span>
          </div>
          <div class="stat">
            <span class="stat__value">{{ stats.accuracy }}%</span>
            <span class="stat__label">{{ t('profile.accuracy') }}</span>
          </div>
        </div>
      </section>

      <!-- Lesson & exercise summary stats -->
      <section class="card">
        <h2 class="card__title">{{ t('profile.courseProgress') }}</h2>
        <div class="stat-grid">
          <div class="stat">
            <span class="stat__value">{{ lessonExerciseSummary.lessonsStarted }}</span>
            <span class="stat__label">{{ t('profile.totalLessonsStarted') }}</span>
          </div>
          <div class="stat">
            <span class="stat__value">{{ lessonExerciseSummary.lessonsCompleted }}</span>
            <span class="stat__label">{{ t('profile.totalLessonsCompleted') }}</span>
          </div>
          <div class="stat">
            <span class="stat__value">{{ lessonExerciseSummary.exercisesCompleted }}</span>
            <span class="stat__label">{{ t('profile.totalExercises') }}</span>
          </div>
          <div v-for="d in lessonExerciseSummary.avgByDifficulty" :key="d.difficulty" class="stat">
            <span class="stat__value">{{ d.avg !== null ? `${d.avg}%` : '--' }}</span>
            <span class="stat__label">{{ t('profile.bestScore') }} ({{ difficultyLabel(d.difficulty) }})</span>
          </div>
        </div>
      </section>

      <!-- Per-course progress -->
      <section v-for="cp in courseProgressList" :key="cp.courseKey" class="card">
        <h2 class="card__title">
          <img v-if="cp.flag" :src="cp.flag" alt="" class="card__flag" />
          {{ cp.langName }} · {{ cp.courseName }}
        </h2>
        <div class="course-progress-row">
          <div class="course-progress-row__info">
            <span class="course-progress-row__lessons">
              {{ t('profile.lessonsCompleted', { done: cp.completedLessons, total: cp.totalLessons }) }}
            </span>
            <div class="course-progress-row__bar">
              <div class="course-progress-row__fill" :style="{ width: cp.totalLessons > 0 ? `${Math.round((cp.completedLessons / cp.totalLessons) * 100)}%` : '0%', background: cp.color }" />
            </div>
          </div>
          <div class="course-progress-row__diffs">
            <div v-for="d in cp.exercisesByDifficulty" :key="d.difficulty" class="diff-pill">
              <span class="diff-pill__label">{{ difficultyLabel(d.difficulty) }}</span>
              <span class="diff-pill__value" :class="{ 'diff-pill__value--na': d.avg === null }">{{ d.avg !== null ? `${d.avg}%` : '--' }}</span>
            </div>
          </div>
          <NuxtLink :to="`/${cp.lang}/${cp.course}`" class="btn btn--sm btn--primary">
            {{ t('profile.continueBtn') }}
          </NuxtLink>
        </div>
      </section>

      <!-- Languages -->
      <section class="card">
        <h2 class="card__title">{{ t('profile.languages') }}</h2>
        <div v-if="langStatsList.length === 0" class="empty">
          {{ t('profile.noLanguages') }}
        </div>
        <div v-else class="lang-list">
          <div v-for="l in langStatsList" :key="l.courseKey" class="lang-row">
            <img v-if="l.flag" :src="l.flag" alt="" class="lang-row__flag-img" />
            <div class="lang-row__info">
              <span class="lang-row__name">{{ l.langName }} · {{ l.courseName }}</span>
              <span class="lang-row__meta">{{ l.totalSessions }} sessions · {{ l.accuracy }}% accuracy</span>
            </div>
            <div class="lang-row__bar">
              <div class="lang-row__fill" :style="{ width: `${l.accuracy}%`, background: l.color }" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ── EXERCISES ── -->
    <div v-if="activeTab === 'exercises'" class="tab-content">
      <section v-if="exerciseCourseGroups.length === 0" class="card">
        <h2 class="card__title">{{ t('profile.tabExercises') }}</h2>
        <div class="empty">{{ t('profile.noExercises') }}</div>
      </section>
      <section v-for="group in exerciseCourseGroups" :key="group.courseKey" class="card">
        <div class="ex-group__header" @click="toggleExerciseGroup(group.courseKey)">
          <img v-if="group.flag" :src="group.flag" alt="" class="card__flag" />
          <h2 class="card__title" style="margin:0;flex:1">{{ group.langName }} · {{ group.courseName }}</h2>
          <span class="ex-group__count">{{ group.lessons.length }} {{ t(group.lessons.length > 1 ? 'profile.totalLessonsStarted' : 'profile.totalLessonsCompleted').toLowerCase() }}</span>
          <svg
            class="ex-group__chevron"
            :class="{ 'ex-group__chevron--open': exerciseCollapseOpen[group.courseKey] }"
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          ><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="ex-group__collapse" :class="{ 'ex-group__collapse--open': exerciseCollapseOpen[group.courseKey] }">
          <div class="ex-group__body">
            <div v-for="lesson in group.lessons" :key="lesson.lessonId" class="exercise-lesson">
              <div class="exercise-lesson__header">
                <span class="exercise-lesson__id">{{ t(`${group.localePrefix}.lessons.lesson`, { n: lesson.lessonId }) }}</span>
                <span class="exercise-lesson__theme">{{ t(`${group.localePrefix}.lessons.theme.${lesson.themeKey}`) }}</span>
              </div>
              <div class="exercise-difficulty-grid">
                <div v-for="d in lesson.difficulties" :key="d.difficulty" class="diff-card" :class="[`diff-card--${d.difficulty}`, { 'diff-card--pass': d.passed, 'diff-card--fail': d.hasAttempt && !d.passed }]">
                  <span class="diff-card__label">{{ difficultyLabel(d.difficulty) }}</span>
                  <template v-if="d.hasAttempt">
                    <span class="diff-card__score">{{ d.bestScore }}%</span>
                    <span class="diff-card__badge" :class="d.passed ? 'diff-card__badge--pass' : 'diff-card__badge--fail'">
                      {{ d.passed ? t('profile.pass') : t('profile.fail') }}
                    </span>
                    <span class="diff-card__attempts">{{ t('profile.attempts', { n: d.attempts }) }}</span>
                  </template>
                  <template v-else>
                    <span class="diff-card__muted">{{ t('profile.notStarted') }}</span>
                  </template>
                  <NuxtLink :to="exerciseRoute(group.lang, group.course, lesson.lessonId, d.difficulty)" class="btn btn--xs btn--ghost diff-card__retry">
                    {{ t('profile.retry') }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ── FAVORITES ── -->
    <div v-if="activeTab === 'favorites'" class="tab-content">
      <section v-if="favoriteGroups.length === 0" class="card">
        <h2 class="card__title">{{ t('profile.favorites') }}</h2>
        <div class="empty">{{ t('profile.noFavorites') }}</div>
      </section>
      <section v-for="group in favoriteGroups" :key="group.courseKey" class="card">
        <h2 class="card__title"><img v-if="group.flag" :src="group.flag" alt="" style="width:22px;height:16px;object-fit:cover;border-radius:3px;vertical-align:middle;margin-right:6px" />{{ group.langName }} · {{ group.courseName }}</h2>
        <div class="fav-grid">
          <NuxtLink
            v-for="c in group.chars" :key="c.id"
            :to="`/${group.lang}/${group.course}/practice/${c.id}`"
            class="fav-tile"
          >
            <span class="fav-tile__char">{{ c.symbol }}</span>
            <span class="fav-tile__rom">{{ c.romanization }}</span>
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- ── SETTINGS ── -->
    <div v-if="activeTab === 'settings'" class="tab-content">
      <!-- Appearance -->
      <section class="card">
        <h2 class="card__title">{{ t('profile.appearance') }}</h2>

        <div class="setting">
          <div class="setting__label">
            <span>{{ t('profile.theme') }}</span>
          </div>
          <div class="seg">
            <button
              v-for="opt in (['system','light','dark'] as ThemeMode[])" :key="opt"
              class="seg__btn" :class="{ 'seg__btn--active': mode === opt }"
              @click="setTheme(opt)"
            >{{ t(`profile.theme${opt[0].toUpperCase() + opt.slice(1)}`) }}</button>
          </div>
        </div>

        <div class="setting">
          <div class="setting__label">
            <span>{{ t('profile.language') }}</span>
          </div>
          <div class="lang-picker">
            <button
              v-for="l in uiLocales" :key="l.code"
              class="lang-pill" :class="{ 'lang-pill--active': locale === l.code }"
              @click="setLocale(l.code as 'en' | 'fr')"
            >
              <span class="lang-pill__flag">{{ l.flag }}</span>
              <span class="lang-pill__name">{{ l.nativeName }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Account -->
      <section class="card">
        <h2 class="card__title">{{ t('profile.account') }}</h2>

        <div class="setting">
          <div class="setting__label">
            <span>{{ t('profile.username') }}</span>
            <span class="setting__value">{{ auth.user?.username }}</span>
          </div>
        </div>

        <div v-if="auth.user?.email" class="setting">
          <div class="setting__label">
            <span>{{ t('profile.email') }}</span>
            <span class="setting__value">{{ auth.user.email }}</span>
          </div>
        </div>

        <div class="setting">
          <button class="btn btn--ghost btn--sm">{{ t('profile.changePassword') }}</button>
        </div>
      </section>

      <!-- Danger zone -->
      <section class="card card--danger">
        <h2 class="card__title">{{ t('profile.deleteAccount') }}</h2>
        <p class="warning">{{ t('profile.deleteAccountWarning') }}</p>
        <button class="btn btn--danger btn--sm">{{ t('profile.deleteAccount') }}</button>
      </section>
    </div>
      </div><!-- /.profile__content -->
    </div><!-- /.profile__layout -->
  </div>
</template>

<style scoped>
.profile {
  display: flex; flex-direction: column; gap: var(--space-6);
  max-width: 1200px; margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Header */
.profile__header {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-6) 0;
}

.profile__avatar {
  width: 72px; height: 72px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-primary-subtle); color: var(--color-primary);
  font-size: var(--text-2xl); font-weight: 700;
}

.profile__info h1 { font-size: var(--text-2xl); font-weight: 600; color: var(--color-text); }
.profile__info p { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 2px; }

/* Layout with sidebar */
.profile__layout { display: flex; gap: var(--space-8); align-items: flex-start; }
.profile__content { flex: 1; display: flex; flex-direction: column; gap: var(--space-4); min-width: 0; }

@media (max-width: 900px) {
  .profile__layout { flex-direction: column; gap: var(--space-4); }
}

.tab-content { display: flex; flex-direction: column; gap: var(--space-4); }

/* Card */
.card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  display: flex; flex-direction: column; gap: var(--space-4);
}

.card__title {
  font-size: var(--text-xs); font-weight: 600; color: var(--color-text-muted);
  text-transform: uppercase; letter-spacing: 0.05em;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.card--danger { border-color: var(--color-error); }
.card--danger .card__title { color: var(--color-error); }
.warning { font-size: var(--text-xs); color: var(--color-text-muted); }

/* Stats */
.stat-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-4);
}

.stat {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: var(--space-4) var(--space-2);
  background: var(--color-bg-muted); border-radius: var(--radius-lg);
}
.stat__value { font-size: var(--text-2xl); font-weight: 700; color: var(--color-primary); }
.stat__label { font-size: var(--text-xs); color: var(--color-text-muted); }

/* Empty */
.empty {
  padding: var(--space-6); text-align: center;
  font-size: var(--text-sm); color: var(--color-text-muted);
}

/* Languages */
.lang-list { display: flex; flex-direction: column; gap: var(--space-3); }

.lang-row {
  display: grid; grid-template-columns: auto 1fr 100px; gap: var(--space-3);
  align-items: center;
  padding: var(--space-3); background: var(--color-bg-muted);
  border-radius: var(--radius-lg);
}

.lang-row__flag { font-size: 1.5rem; }
.lang-row__info { display: flex; flex-direction: column; gap: 1px; }
.lang-row__name { font-size: var(--text-sm); font-weight: 600; color: var(--color-text); }
.lang-row__meta { font-size: var(--text-xs); color: var(--color-text-muted); }

.lang-row__bar {
  height: 6px; background: var(--color-border);
  border-radius: var(--radius-full); overflow: hidden;
}
.lang-row__fill { height: 100%; transition: width 400ms ease; }

/* Favorites */
.fav-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--space-2);
}

.fav-tile {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: var(--space-3); background: var(--color-bg-muted);
  border-radius: var(--radius-lg); text-decoration: none;
  transition: all 150ms;
}
.fav-tile:hover { background: var(--color-primary-subtle); }
.fav-tile__char { font-family: var(--font-cjk-kr); font-size: 1.5rem; font-weight: 600; color: var(--color-text); }
.fav-tile__rom { font-size: 0.6875rem; color: var(--color-text-muted); }

/* Settings */
.setting {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}
.setting:last-child { border-bottom: none; }

.setting__label {
  display: flex; flex-direction: column; gap: 2px;
}
.setting__label > span:first-child {
  font-size: var(--text-sm); font-weight: 500; color: var(--color-text);
}
.setting__value { font-size: var(--text-xs); color: var(--color-text-muted); }

/* Segmented */
.seg {
  display: flex; gap: 2px; padding: 2px;
  background: var(--color-bg-muted); border-radius: var(--radius-md);
}
.seg__btn {
  padding: var(--space-1-5) var(--space-3);
  border: none; background: transparent;
  font-size: var(--text-xs); font-weight: 500;
  color: var(--color-text-muted); cursor: pointer;
  border-radius: var(--radius-sm);
}
.seg__btn--active {
  background: var(--color-bg-surface); color: var(--color-text);
  box-shadow: var(--shadow-xs);
}

/* Language picker */
.lang-picker {
  display: flex; flex-wrap: wrap; gap: var(--space-2);
}
.lang-pill {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-bg-surface);
  color: var(--color-text-secondary);
  font-size: var(--text-sm); font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.lang-pill:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}
.lang-pill--active {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
}
.lang-pill__flag { font-size: 1.1rem; line-height: 1; }

/* Flag images in card titles and lang rows */
.card__flag {
  width: 22px; height: 16px; object-fit: cover;
  border-radius: 3px; vertical-align: middle;
  margin-right: 6px;
}

.lang-row__flag-img {
  width: 28px; height: 20px; object-fit: cover;
  border-radius: 3px;
}

/* Course progress row (overview) */
.course-progress-row {
  display: flex; flex-direction: column; gap: var(--space-3);
}

.course-progress-row__info {
  display: flex; flex-direction: column; gap: var(--space-2);
}

.course-progress-row__lessons {
  font-size: var(--text-sm); font-weight: 500; color: var(--color-text);
}

.course-progress-row__bar {
  height: 6px; background: var(--color-border);
  border-radius: var(--radius-full); overflow: hidden;
}

.course-progress-row__fill {
  height: 100%; transition: width 400ms ease;
  border-radius: var(--radius-full);
}

.course-progress-row__diffs {
  display: flex; gap: var(--space-2); flex-wrap: wrap;
}

.diff-pill {
  display: flex; align-items: center; gap: var(--space-1-5);
  padding: var(--space-1) var(--space-2-5);
  background: var(--color-bg-muted);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
}

.diff-pill__label {
  color: var(--color-text-muted); font-weight: 500;
}

.diff-pill__value {
  font-weight: 700; color: var(--color-text);
}

.diff-pill__value--na {
  color: var(--color-text-muted);
}

/* Exercises tab */
/* Exercise group collapse */
.ex-group__header {
  display: flex; align-items: center; gap: var(--space-3);
  cursor: pointer; padding: var(--space-2) 0;
  transition: color 150ms ease;
}
.ex-group__header:hover { color: var(--color-primary); }
.ex-group__count { font-size: var(--text-xs); color: var(--color-text-muted); white-space: nowrap; }
.ex-group__chevron {
  flex-shrink: 0; color: var(--color-text-muted);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.ex-group__chevron--open { transform: rotate(180deg); }
.ex-group__collapse {
  display: grid; grid-template-rows: 0fr;
  transition: grid-template-rows 350ms cubic-bezier(0.16, 1, 0.3, 1);
}
.ex-group__collapse--open { grid-template-rows: 1fr; }
.ex-group__body { overflow: hidden; }

.exercise-lesson {
  display: flex; flex-direction: column; gap: var(--space-3);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border);
}

.exercise-lesson:last-child { border-bottom: none; }

.exercise-lesson__header {
  display: flex; align-items: baseline; gap: var(--space-2);
}

.exercise-lesson__id {
  font-size: var(--text-sm); font-weight: 600; color: var(--color-text);
}

.exercise-lesson__theme {
  font-size: var(--text-xs); color: var(--color-text-muted);
}

.exercise-difficulty-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3);
}

@media (max-width: 600px) {
  .exercise-difficulty-grid { grid-template-columns: 1fr; }
}

.diff-card {
  display: flex; flex-direction: column; align-items: center; gap: var(--space-1-5);
  padding: var(--space-3);
  background: var(--color-bg-muted);
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  text-align: center;
}

.diff-card--pass { border-color: var(--color-success, #22c55e); }
.diff-card--fail { border-color: var(--color-error); }

.diff-card__label {
  font-size: var(--text-xs); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.diff-card__score {
  font-size: var(--text-xl); font-weight: 700; color: var(--color-text);
}

.diff-card__badge {
  font-size: 0.65rem; font-weight: 700;
  padding: 1px var(--space-2);
  border-radius: var(--radius-full);
  text-transform: uppercase; letter-spacing: 0.04em;
}

.diff-card__badge--pass {
  background: var(--color-success-subtle, #dcfce7); color: var(--color-success, #22c55e);
}

.diff-card__badge--fail {
  background: var(--color-error-subtle, #fde8ea); color: var(--color-error);
}

.diff-card__attempts {
  font-size: var(--text-xs); color: var(--color-text-muted);
}

.diff-card__muted {
  font-size: var(--text-xs); color: var(--color-text-muted); padding: var(--space-2) 0;
}

.diff-card__retry {
  margin-top: auto;
}

/* Extra button size not in globals */
.btn--xs { padding: var(--space-1) var(--space-2-5); font-size: var(--text-xs); }
</style>
