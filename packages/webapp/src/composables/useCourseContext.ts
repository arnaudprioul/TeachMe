import { computed, ref, watch } from 'vue'
import { getCourseModule } from '~/composables/data/courses'
import { useCourses } from '~/composables/useCourses'
import type { ICourseModule } from '~/composables/data/courses/types'

// ── Global cache: one fetch per courseKey, shared across all instances ──
const _apiCache = new Map<string, ICourseModule>()
const _fetchingKeys = new Set<string>()
const _apiModuleStore = ref<Record<string, ICourseModule | null>>({})

/**
 * Central composable for course pages.
 * Reads route params and resolves the course module + helpers.
 *
 * Lesson-based courses (Korean Level 1, Japanese Level 1) use the static
 * registry. Character-based courses (Hangeul, Hiragana, Katakana) also use
 * the static registry. API fetch is cached globally so it only happens once
 * per courseKey regardless of how many components call useCourseContext().
 */
export function useCourseContext() {
  const route = useRoute()
  const { getBySlug } = useCourses()

  const lang = computed(() => (route.params.lang as string) || '')
  const course = computed(() => (route.params.course as string) || '')
  const courseKey = computed(() => `${lang.value}-${course.value}`)

  const staticModule = computed(() => getCourseModule(lang.value, course.value))

  function isLessonCourse(m: ICourseModule | undefined): boolean {
    return !!m?.lessons && m.lessons.length > 0
  }

  // Fetch once per courseKey, cache globally
  watch(courseKey, async (key) => {
    if (!key || !lang.value || !course.value) return
    const sm = staticModule.value
    if (!isLessonCourse(sm)) return
    if (_apiCache.has(key)) {
      _apiModuleStore.value[key] = _apiCache.get(key)!
      return
    }
    if (_fetchingKeys.has(key)) return // already fetching

    _fetchingKeys.add(key)
    try {
      const res = await $fetch<{ data: ICourseModule }>(`/api/v1/courses/${key}`)
      _apiCache.set(key, res.data)
      _apiModuleStore.value = { ..._apiModuleStore.value, [key]: res.data }
    } catch (err) {
      console.warn(`[useCourseContext] API fetch failed for ${key}:`, err)
    } finally {
      _fetchingKeys.delete(key)
    }
  }, { immediate: true })

  const apiModule = computed(() => _apiModuleStore.value[courseKey.value] ?? null)

  const module = computed<ICourseModule | undefined>(() => apiModule.value ?? staticModule.value)
  const language = computed(() => getBySlug(lang.value))

  const exists = computed(() => !!module.value && !!language.value)

  const basePath = computed(() => `/${lang.value}/${course.value}`)

  const paths = computed(() => ({
    languageRoot: `/${lang.value}`,
    root:         basePath.value,
    table:        `${basePath.value}/table`,
    practice:     (id: string) => `${basePath.value}/practice/${id}`,
    syllable:     (id: string) => `${basePath.value}/syllable/${id}`,
    training:     `${basePath.value}/training`,
    settings:     `${basePath.value}/training/settings`,
    play:         `${basePath.value}/training/play`,
    results:      `${basePath.value}/training/results`,
    lessons:      `${basePath.value}/lessons`,
    lesson:       (id: number) => `${basePath.value}/lessons/${id}`,
    lessonQuiz:   (id: number) => `${basePath.value}/lessons/${id}/quiz`,
    lessonResults:(id: number) => `${basePath.value}/lessons/${id}/results`,
    lessonExercises:(id: number) => `${basePath.value}/lessons/${id}/exercises`,
    lessonExercisesResults: (id: number) => `${basePath.value}/lessons/${id}/exercises/results`,
    exam:         `${basePath.value}/exam`,
  }))

  /** Returns a fully-qualified locale key under the course's localePrefix. */
  function tKey(suffix: string): string {
    const prefix = module.value?.config.localePrefix
    if (!prefix) return suffix
    return `${prefix}.${suffix}`
  }

  return { lang, course, courseKey, module, language, exists, basePath, paths, tKey }
}
