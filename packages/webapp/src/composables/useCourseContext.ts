import { computed, ref, watch } from 'vue'
import { getCourseModule } from '~/composables/data/courses'
import { useCourses } from '~/composables/useCourses'
import type { ICourseModule } from '~/composables/data/courses/types'

/**
 * Central composable for course pages.
 * Reads route params and resolves the course module + helpers.
 *
 * Lesson-based courses (Korean Level 1, Japanese Level 1) are fetched from
 * the API at `/api/v1/courses/:id`. Character-based courses (Hangeul,
 * Hiragana, Katakana) are still loaded from the static registry because
 * they carry non-serializable data (stroke SVGs, category predicates,
 * imported image assets).
 */
export function useCourseContext() {
  const route = useRoute()
  const { getBySlug } = useCourses()

  const lang = computed(() => (route.params.lang as string) || '')
  const course = computed(() => (route.params.course as string) || '')
  const courseKey = computed(() => `${lang.value}-${course.value}`)

  // Static module lookup (character courses + fallback for lesson courses
  // while the API request is in flight — prevents blank flash on navigation).
  const staticModule = computed(() => getCourseModule(lang.value, course.value))

  // API-fetched module, populated when the course is lesson-based.
  const apiModule = ref<ICourseModule | null>(null)

  function isLessonCourse(m: ICourseModule | undefined): boolean {
    return !!m?.lessons && m.lessons.length > 0
  }

  // Fetch from API for lesson courses whenever courseKey changes.
  watch(courseKey, async (key) => {
    if (!key || !lang.value || !course.value) {
      apiModule.value = null
      return
    }
    const sm = staticModule.value
    if (!isLessonCourse(sm)) {
      // Character course or unknown course — no API fetch, use static.
      apiModule.value = null
      return
    }

    try {
      const res = await $fetch<{ data: ICourseModule }>(`/api/v1/courses/${key}`)
      apiModule.value = res.data
    } catch (err) {
      console.warn(`[useCourseContext] API fetch failed for ${key}, falling back to static:`, err)
      apiModule.value = null
    }
  }, { immediate: true })

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
  }))

  /** Returns a fully-qualified locale key under the course's localePrefix. */
  function tKey(suffix: string): string {
    const prefix = module.value?.config.localePrefix
    if (!prefix) return suffix
    return `${prefix}.${suffix}`
  }

  return { lang, course, courseKey, module, language, exists, basePath, paths, tKey }
}
