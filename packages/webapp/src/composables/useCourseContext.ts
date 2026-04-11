import { computed } from 'vue'
import { getCourseModule } from '~/composables/data/courses'
import { useCourses } from '~/composables/useCourses'

/**
 * Central composable for course pages.
 * Reads route params and resolves the course module + helpers.
 */
export function useCourseContext() {
  const route = useRoute()
  const { getBySlug } = useCourses()

  const lang = computed(() => (route.params.lang as string) || '')
  const course = computed(() => (route.params.course as string) || '')
  const courseKey = computed(() => `${lang.value}-${course.value}`)

  const module = computed(() => getCourseModule(lang.value, course.value))
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
  }))

  /** Returns a fully-qualified locale key under the course's localePrefix. */
  function tKey(suffix: string): string {
    const prefix = module.value?.config.localePrefix
    if (!prefix) return suffix
    return `${prefix}.${suffix}`
  }

  return { lang, course, courseKey, module, language, exists, basePath, paths, tKey }
}
