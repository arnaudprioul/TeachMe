import { getDb } from '~/server/db/connection'
import type { ICourseModule } from '~/composables/data/courses/types'
import type { ILesson, ILessonWord, ILessonContentBlock, ILessonExercise } from '~/composables/data/courses/lesson-types'

/**
 * Shapes returned by the API. They match the TS source-of-truth types
 * so the frontend can drop-in replace static imports with fetch calls.
 */

export interface ILanguageRow {
  id: string
  flag: string
  color: string
  colorLight: string
  colorSubtle: string
  status: 'available' | 'coming_soon'
}

/** Summary row used in the list endpoint. */
export interface ICourseSummary {
  key: string
  lang: string
  course: string
  kind: 'characters' | 'lessons'
  localePrefix: string
  officialLevel: string | null
  estimatedDuration: string | null
  heroImage: string | null
}

/** Nested shape matching ICourseModule so the frontend can use it as-is. */
export interface ICourseModuleDTO {
  key: string
  lang: string
  course: string
  config: {
    localePrefix: string
    ttsLang: string
    ttsVoicePrefs: string[]
    officialLevel?: string
    estimatedDuration?: string
    heroImage: string
    categories: []
  }
  levelIntro?: {
    descriptionKey: string
    objectiveKeys: string[]
    officialLevelInfoKey?: string
    officialLevelLink?: string
  }
  lessons?: ILesson[]
}

// ═══════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback
  if (typeof value === 'string') {
    try { return JSON.parse(value) as T } catch { return fallback }
  }
  return value as T
}

// ═══════════════════════════════════════════════════════
// Languages
// ═══════════════════════════════════════════════════════

export async function listLanguages(): Promise<ILanguageRow[]> {
  const db = getDb()
  const rows = await db('languages').select('*').orderBy('sort_order', 'asc')
  return rows.map(r => ({
    id: r.id,
    flag: r.flag,
    color: r.color,
    colorLight: r.color_light,
    colorSubtle: r.color_subtle,
    status: r.status,
  }))
}

export async function getLanguage(id: string): Promise<ILanguageRow | null> {
  const langs = await listLanguages()
  return langs.find(l => l.id === id) ?? null
}

// ═══════════════════════════════════════════════════════
// Courses
// ═══════════════════════════════════════════════════════

export async function listCourses(lang?: string): Promise<ICourseSummary[]> {
  const db = getDb()
  const q = db('courses').select('*').orderBy('sort_order', 'asc')
  if (lang) q.where('language_id', lang)
  const rows = await q
  return rows.map(toCourseSummary)
}

export async function getCourse(id: string): Promise<ICourseModuleDTO | null> {
  const db = getDb()
  const row = await db('courses').where({ id }).first()
  if (!row) return null

  const dto: ICourseModuleDTO = {
    key: row.id,
    lang: row.language_id,
    course: row.slug,
    config: {
      localePrefix: row.locale_prefix,
      ttsLang: row.tts_lang,
      ttsVoicePrefs: parseJson<string[]>(row.tts_voice_prefs, []),
      officialLevel: row.official_level ?? undefined,
      estimatedDuration: row.estimated_duration ?? undefined,
      heroImage: row.hero_image ?? '',
      categories: [],
    },
  }

  const introRow = await db('level_intros').where({ course_id: id }).first()
  if (introRow) {
    dto.levelIntro = {
      descriptionKey: introRow.description_key,
      objectiveKeys: parseJson<string[]>(introRow.objective_keys, []),
      officialLevelInfoKey: introRow.official_level_info_key ?? undefined,
      officialLevelLink: introRow.official_level_link ?? undefined,
    }
  }

  return dto
}

function toCourseSummary(r: Record<string, unknown>): ICourseSummary {
  return {
    key: r.id as string,
    lang: r.language_id as string,
    course: r.slug as string,
    kind: r.kind as 'characters' | 'lessons',
    localePrefix: r.locale_prefix as string,
    officialLevel: (r.official_level as string | null) ?? null,
    estimatedDuration: (r.estimated_duration as string | null) ?? null,
    heroImage: (r.hero_image as string | null) ?? null,
  }
}

// ═══════════════════════════════════════════════════════
// Lessons
// ═══════════════════════════════════════════════════════

export async function listLessons(courseId: string): Promise<ILesson[]> {
  const db = getDb()
  const lessons = await db('lessons').where({ course_id: courseId }).orderBy('sort_order', 'asc')
  return Promise.all(lessons.map(r => hydrateLesson(r)))
}

export async function getLesson(courseId: string, lessonNumber: number): Promise<ILesson | null> {
  const db = getDb()
  const row = await db('lessons').where({ course_id: courseId, lesson_number: lessonNumber }).first()
  if (!row) return null
  return hydrateLesson(row)
}

async function hydrateLesson(row: Record<string, unknown>): Promise<ILesson> {
  const db = getDb()
  const lessonRowId = row.id as string

  const [words, blocks, exercises] = await Promise.all([
    db('lesson_words').where({ lesson_id: lessonRowId }).orderBy('sort_order', 'asc'),
    db('lesson_content_blocks').where({ lesson_id: lessonRowId }).orderBy('sort_order', 'asc'),
    db('lesson_exercises').where({ lesson_id: lessonRowId }).orderBy('sort_order', 'asc'),
  ])

  const courseId = row.course_id as string
  const levelMatch = courseId.match(/level-(\d+)/)
  const level = levelMatch ? parseInt(levelMatch[1], 10) : 1

  const lesson: ILesson = {
    id: row.lesson_number as number,
    level,
    themeKey: row.theme_key as string,
    words: words.map(toWord),
    content: blocks.length > 0 ? blocks.map(toBlock) : undefined,
    exercises: exercises.length > 0 ? exercises.map(toExercise) : undefined,
  }

  return lesson
}

function toWord(r: Record<string, unknown>): ILessonWord {
  return {
    id: r.id as string,
    word: r.word as string,
    romanization: r.romanization as string,
    translation: r.translation_en as string,
    translationFr: r.translation_fr as string,
    image: (r.image_path as string | null) ?? undefined,
    emoji: (r.emoji as string | null) ?? undefined,
    audioText: (r.audio_text as string | null) ?? undefined,
  }
}

function toBlock(r: Record<string, unknown>): ILessonContentBlock {
  const data = parseJson<Record<string, unknown>>(r.data, {})
  return {
    type: r.block_type as ILessonContentBlock['type'],
    ...data,
  } as ILessonContentBlock
}

function toExercise(r: Record<string, unknown>): ILessonExercise {
  const data = parseJson<Record<string, unknown>>(r.data, {})
  return {
    id: r.id as string,
    type: r.exercise_type as ILessonExercise['type'],
    difficulty: r.difficulty as ILessonExercise['difficulty'],
    ...data,
  } as ILessonExercise
}
