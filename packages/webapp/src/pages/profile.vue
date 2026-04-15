<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiLocales } from '~/composables/useUiLocales'
import { useAuthStore } from '~/stores/auth.store'
import { useStatsStore } from '~/stores/stats.store'
import { useFavoritesStore } from '~/stores/favorites.store'
import { useTheme, type ThemeMode } from '~/composables/useTheme'
import { useCourses } from '~/composables/useCourses'
import { COURSE_REGISTRY } from '~/composables/data/courses'
import type { ICourseCharacter } from '~/composables/data/courses/types'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const { locale, setLocale, locales: uiLocales } = useUiLocales()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const stats = useStatsStore()
const favorites = useFavoritesStore()
const { mode, setTheme } = useTheme()
const { courses } = useCourses()

type ProfileTab = 'overview' | 'favorites' | 'settings'
const VALID_TABS: ProfileTab[] = ['overview', 'favorites', 'settings']

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

      <!-- Languages -->
      <section class="card">
        <h2 class="card__title">{{ t('profile.languages') }}</h2>
        <div v-if="langStatsList.length === 0" class="empty">
          {{ t('profile.noLanguages') }}
        </div>
        <div v-else class="lang-list">
          <div v-for="l in langStatsList" :key="l.courseKey" class="lang-row">
            <span class="lang-row__flag">{{ l.flag }}</span>
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

    <!-- ── FAVORITES ── -->
    <div v-if="activeTab === 'favorites'" class="tab-content">
      <section v-if="favoriteGroups.length === 0" class="card">
        <h2 class="card__title">{{ t('profile.favorites') }}</h2>
        <div class="empty">{{ t('profile.noFavorites') }}</div>
      </section>
      <section v-for="group in favoriteGroups" :key="group.courseKey" class="card">
        <h2 class="card__title">{{ group.flag }} {{ group.langName }} · {{ group.courseName }}</h2>
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
</style>
