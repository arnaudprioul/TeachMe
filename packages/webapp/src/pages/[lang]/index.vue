<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCourses } from '~/composables/useCourses'
import { useLanguageProfile } from '~/composables/useLanguageProfile'
import { listCoursesForLanguage } from '~/composables/data/courses'

definePageMeta({ layout: 'default', middleware: 'auth' })

const { t } = useI18n()
const route = useRoute()
const { getBySlug } = useCourses()

const langSlug = computed(() => route.params.lang as string)
const course = computed(() => getBySlug(langSlug.value))
const { profile, courses } = useLanguageProfile(langSlug.value)

// Pick the hero image from the first registered course module for this language
const heroImg = computed(() => {
  const modules = listCoursesForLanguage(langSlug.value)
  return modules[0]?.config.heroImage ?? ''
})
</script>

<template>
  <div class="lang" v-if="profile && course" :style="{ '--cc': course.color, '--cc-s': course.colorSubtle }">

    <!-- ════════ HERO — image background with overlay ════════ -->
    <section class="hero" :style="{ backgroundImage: heroImg ? `url(${heroImg})` : undefined }">
      <div class="hero__overlay" />
      <div class="hero__content contained">
        <Breadcrumb :items="[
          { label: t('nav.dashboard'), to: '/dashboard' },
          { label: t(profile.nameKey) },
        ]" />
        <span class="hero__flag">{{ profile.flag }}</span>
        <h1>{{ t(profile.heroTitleKey) }}</h1>
        <p>{{ t(profile.heroSubKey) }}</p>
      </div>
    </section>

    <!-- ════════ FACTS — stats band ════════ -->
    <section class="facts-band">
      <div class="contained facts">
        <div v-for="fact in profile.facts" :key="fact.labelKey" class="fact">
          <span class="fact__value">{{ fact.value }}</span>
          <span class="fact__label">{{ t(fact.labelKey) }}</span>
        </div>
      </div>
    </section>

    <!-- ════════ WHY LEARN — highlights ════════ -->
    <section class="why-section">
      <div class="contained">
        <div class="why-header">
          <h2>{{ t(`langProfile.${langSlug}.whyLearnTitle`) }}</h2>
          <p>{{ t(`langProfile.${langSlug}.whyLearnDesc`) }}</p>
        </div>

        <div class="highlights">
          <div v-for="h in profile.highlights" :key="h.titleKey" class="highlight">
            <span class="highlight__icon">{{ h.icon }}</span>
            <div class="highlight__body">
              <h3>{{ t(h.titleKey) }}</h3>
              <p>{{ t(h.descKey) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ COURSES ════════ -->
    <section class="courses-section">
      <div class="contained">
        <div class="courses-header">
          <h2>{{ t(`langProfile.${langSlug}.coursesTitle`) }}</h2>
          <p>{{ t(`langProfile.${langSlug}.coursesDesc`) }}</p>
        </div>

        <div class="courses-grid">
          <NuxtLink
            v-for="c in courses" :key="c.slug"
            :to="c.route"
            class="course-card"
            :class="{ 'course-card--locked': !c.available }"
          >
            <span class="course-card__icon">{{ c.icon }}</span>
            <div class="course-card__body">
              <h3>{{ t(c.titleKey) }}</h3>
              <p>{{ t(c.descKey) }}</p>
            </div>
            <svg v-if="c.available" class="course-card__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span v-else class="course-card__badge">{{ t('common.soon') }}</span>
          </NuxtLink>
        </div>

        <div class="coming-soon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <div>
            <h4>{{ t(`langProfile.${langSlug}.comingSoonTitle`) }}</h4>
            <p>{{ t(`langProfile.${langSlug}.comingSoonDesc`) }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lang { display: flex; flex-direction: column; }
.contained { max-width: 960px; margin: 0 auto; width: 100%; padding: 0 var(--space-6); }

/* ══════════ HERO ══════════ */
.hero {
  position: relative;
  min-height: 380px;
  background-size: cover;
  background-position: center 40%;
  display: flex;
  align-items: flex-end;
}

.hero__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    to top,
    var(--color-bg) 0%,
    color-mix(in srgb, var(--color-bg) 85%, transparent) 40%,
    color-mix(in srgb, var(--color-bg) 40%, transparent) 70%,
    transparent 100%
  );
}

.hero__content {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; gap: var(--space-3);
  padding-top: var(--space-16);
  padding-bottom: var(--space-8);
}

.hero__content :deep(.bc__link) { color: var(--color-text-muted); }
.hero__content :deep(.bc__current) { color: var(--color-text); }

.hero__flag { font-size: 2.5rem; line-height: 1; margin-top: var(--space-2); }

.hero__content h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700; color: var(--color-text);
  letter-spacing: -0.03em; line-height: 1.15;
}

.hero__content p {
  font-size: var(--text-base); color: var(--color-text-muted);
  line-height: 1.6; max-width: 500px;
}

/* ══════════ FACTS ══════════ */
.facts-band {
  background: var(--cc);
  padding: var(--space-5) 0;
}

.facts {
  display: flex; justify-content: space-around; flex-wrap: wrap; gap: var(--space-4);
}

.fact {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  min-width: 80px;
}
.fact__value { font-size: var(--text-2xl); font-weight: 700; color: #fff; }
.fact__label { font-size: var(--text-xs); color: rgba(255,255,255,0.7); }

/* ══════════ WHY LEARN ══════════ */
.why-section {
  padding: var(--space-16) 0;
}

.why-header { margin-bottom: var(--space-8); }
.why-header h2 { font-size: var(--text-2xl); font-weight: 600; color: var(--color-text); }
.why-header p {
  font-size: var(--text-sm); color: var(--color-text-muted);
  margin-top: var(--space-2); max-width: 500px; line-height: 1.6;
}

.highlights {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}

.highlight {
  display: flex; gap: var(--space-4); padding: var(--space-5);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); transition: all 150ms;
}
.highlight:hover { box-shadow: var(--shadow-md); border-color: var(--color-border-strong); }

.highlight__icon { font-size: 2rem; flex-shrink: 0; line-height: 1; }
.highlight__body h3 { font-size: var(--text-sm); font-weight: 600; color: var(--color-text); }
.highlight__body p {
  font-size: var(--text-xs); color: var(--color-text-muted); line-height: 1.5;
  margin-top: var(--space-1);
}

/* ══════════ COURSES ══════════ */
.courses-section {
  padding: var(--space-12) 0 var(--space-16);
  background: var(--color-bg-muted);
  border-top: 1px solid var(--color-border);
}

.courses-header { margin-bottom: var(--space-6); }
.courses-header h2 { font-size: var(--text-xl); font-weight: 600; color: var(--color-text); }
.courses-header p { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-1); }

.courses-grid { display: flex; flex-direction: column; gap: var(--space-3); }

.course-card {
  display: flex; align-items: center; gap: var(--space-5);
  padding: var(--space-5) var(--space-6);
  background: var(--color-bg-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); text-decoration: none; transition: all 150ms;
}
.course-card:not(.course-card--locked):hover { border-color: var(--cc); box-shadow: var(--shadow-md); }
.course-card--locked { opacity: 0.5; cursor: default; }

.course-card__icon {
  width: 48px; height: 48px; border-radius: var(--radius-lg);
  background: var(--cc-s); color: var(--cc);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-cjk-kr); font-size: 1.5rem; font-weight: 700; flex-shrink: 0;
}
.course-card__body { flex: 1; }
.course-card__body h3 { font-size: var(--text-sm); font-weight: 600; color: var(--color-text); }
.course-card__body p { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }
.course-card__chevron { color: var(--color-text-subtle); flex-shrink: 0; }
.course-card__badge {
  padding: 2px var(--space-2); border-radius: var(--radius-full);
  background: var(--color-bg-muted); font-size: 0.6rem; font-weight: 500; color: var(--color-text-muted);
}

.coming-soon {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-5); border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-xl); margin-top: var(--space-4);
  color: var(--color-text-subtle);
}
.coming-soon svg { flex-shrink: 0; }
.coming-soon h4 { font-size: var(--text-sm); font-weight: 600; color: var(--color-text-secondary); }
.coming-soon p { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }

/* ══════════ RESPONSIVE ══════════ */
@media (max-width: 640px) {
  .hero { min-height: 300px; }
  .highlights { grid-template-columns: 1fr; }
}
</style>
