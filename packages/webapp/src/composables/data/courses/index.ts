import type { ICourseModule } from './types'
import { koreanHangeul } from './korean-hangeul'
import { japaneseHiragana } from './japanese-hiragana'
import { japaneseKatakana } from './japanese-katakana'

export const COURSE_REGISTRY: Record<string, ICourseModule> = {
  [koreanHangeul.key]:    koreanHangeul,
  [japaneseHiragana.key]: japaneseHiragana,
  [japaneseKatakana.key]: japaneseKatakana,
}

export function getCourseModule(lang: string, course: string): ICourseModule | undefined {
  return COURSE_REGISTRY[`${lang}-${course}`]
}

export function getCourseKey(lang: string, course: string): string {
  return `${lang}-${course}`
}

export function listCourses(): ICourseModule[] {
  return Object.values(COURSE_REGISTRY)
}

export function listCoursesForLanguage(lang: string): ICourseModule[] {
  return listCourses().filter(m => m.lang === lang)
}
