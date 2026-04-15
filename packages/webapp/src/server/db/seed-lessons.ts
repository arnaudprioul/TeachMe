import type knex from 'knex'
import { COURSES } from '~/composables/useCourses'
import { koreanLevel1 } from '~/composables/data/courses/korean-level-1'
import { japaneseLevel1 } from '~/composables/data/courses/japanese-level-1'
import type { ICourseModule } from '~/composables/data/courses/types'
import type { ILessonWord, ILessonContentBlock, ILessonExercise } from '~/composables/data/courses/lesson-types'

/**
 * Lesson-based courses only. Character-based courses (Hangeul, Hiragana,
 * Katakana) stay in code — they have deep coupling to stroke data,
 * category predicates, and binary assets that don't serialize cleanly.
 */
const LESSON_COURSES: ICourseModule[] = [koreanLevel1, japaneseLevel1]

type Db = ReturnType<typeof knex>

/**
 * Seed/sync lesson data from static TS modules into the DB.
 *
 * The TS data is the source of truth during iteration; this function
 * mirrors it to the DB on every server boot so the API can serve the
 * same content. It uses `INSERT OR REPLACE` (SQLite) / `ON CONFLICT`
 * (Postgres) for idempotency.
 */
export async function seedLessons(db: Db): Promise<void> {
  // ─── Languages ──────────────────────────────────────────────
  for (let i = 0; i < COURSES.length; i++) {
    const lang = COURSES[i]
    await upsert(db, 'languages', 'id', {
      id: lang.slug,
      flag: lang.flag,
      color: lang.color,
      color_light: lang.colorLight,
      color_subtle: lang.colorSubtle,
      status: lang.status,
      sort_order: i,
    })
  }

  // ─── Courses ───────────────────────────────────────────────
  for (let i = 0; i < LESSON_COURSES.length; i++) {
    const m = LESSON_COURSES[i]
    const kind: 'characters' | 'lessons' = 'lessons'
    await upsert(db, 'courses', 'id', {
      id: m.key,
      language_id: m.lang,
      slug: m.course,
      kind,
      locale_prefix: m.config.localePrefix,
      tts_lang: m.config.ttsLang,
      tts_voice_prefs: JSON.stringify(m.config.ttsVoicePrefs ?? []),
      official_level: m.config.officialLevel ?? null,
      estimated_duration: m.config.estimatedDuration ?? null,
      hero_image: typeof m.config.heroImage === 'string' ? m.config.heroImage : null,
      sort_order: i,
      has_origin_story: m.config.hasOriginStory ?? false,
      has_cosmology: m.config.hasCosmology ?? false,
      has_silent_initial_rule: m.config.hasSilentInitialRule ?? false,
      has_syllable_composition: m.config.hasSyllableComposition ?? false,
    })

    // Level intro (1:1 optional)
    if (m.levelIntro) {
      await upsert(db, 'level_intros', 'course_id', {
        course_id: m.key,
        description_key: m.levelIntro.descriptionKey,
        objective_keys: JSON.stringify(m.levelIntro.objectiveKeys),
        official_level_info_key: m.levelIntro.officialLevelInfoKey ?? null,
        official_level_link: m.levelIntro.officialLevelLink ?? null,
      })
    }

    // Lessons only for lesson-based courses
    if (m.lessons && m.lessons.length > 0) {
      await seedLessonsForCourse(db, m)
    }
  }
}

async function seedLessonsForCourse(db: Db, m: ICourseModule): Promise<void> {
  if (!m.lessons) return

  for (const lesson of m.lessons) {
    const lessonRowId = `${m.key}-lesson-${lesson.id}`
    await upsert(db, 'lessons', 'id', {
      id: lessonRowId,
      course_id: m.key,
      lesson_number: lesson.id,
      theme_key: lesson.themeKey,
      sort_order: lesson.id,
    })

    await seedWords(db, lessonRowId, lesson.words)

    if (lesson.content) {
      await seedContent(db, lessonRowId, lesson.content)
    }
    if (lesson.exercises) {
      await seedExercises(db, lessonRowId, lesson.exercises)
    }
  }
}

async function seedWords(db: Db, lessonId: string, words: ILessonWord[]): Promise<void> {
  // Wipe & rewrite to handle removals cleanly (small tables, fine to do on boot)
  await db('lesson_words').where({ lesson_id: lessonId }).delete()

  for (let i = 0; i < words.length; i++) {
    const w = words[i]
    await db('lesson_words').insert({
      id: w.id,
      lesson_id: lessonId,
      word: w.word,
      romanization: w.romanization,
      translation_en: w.translation,
      translation_fr: w.translationFr,
      image_path: w.image ?? null,
      emoji: w.emoji ?? null,
      audio_text: w.audioText ?? null,
      sort_order: i,
    })
  }
}

async function seedContent(db: Db, lessonId: string, blocks: ILessonContentBlock[]): Promise<void> {
  await db('lesson_content_blocks').where({ lesson_id: lessonId }).delete()

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    await db('lesson_content_blocks').insert({
      id: `${lessonId}-block-${i}`,
      lesson_id: lessonId,
      block_type: b.type,
      sort_order: i,
      data: JSON.stringify(blockPayload(b)),
    })
  }
}

async function seedExercises(db: Db, lessonId: string, exercises: ILessonExercise[]): Promise<void> {
  await db('lesson_exercises').where({ lesson_id: lessonId }).delete()

  for (let i = 0; i < exercises.length; i++) {
    const e = exercises[i]
    await db('lesson_exercises').insert({
      id: e.id,
      lesson_id: lessonId,
      exercise_type: e.type,
      difficulty: e.difficulty,
      sort_order: i,
      data: JSON.stringify(exercisePayload(e)),
    })
  }
}

/** Extract the polymorphic payload for a content block. */
function blockPayload(b: ILessonContentBlock): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (b.textKey !== undefined) payload.textKey = b.textKey
  if (b.culturalTitleKey !== undefined) payload.culturalTitleKey = b.culturalTitleKey
  if (b.example !== undefined) payload.example = b.example
  if (b.examples !== undefined) payload.examples = b.examples
  if (b.dialogue !== undefined) payload.dialogue = b.dialogue
  if (b.rule !== undefined) payload.rule = b.rule
  if (b.board !== undefined) payload.board = b.board
  if (b.characters !== undefined) payload.characters = b.characters
  if (b.vocabTable !== undefined) payload.vocabTable = b.vocabTable
  if (b.practiceInline !== undefined) payload.practiceInline = b.practiceInline
  if (b.sectionHeader !== undefined) payload.sectionHeader = b.sectionHeader
  if (b.sectionCta !== undefined) payload.sectionCta = b.sectionCta
  return payload
}

/** Extract the polymorphic payload for an exercise. */
function exercisePayload(e: ILessonExercise): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (e.questionKey !== undefined) payload.questionKey = e.questionKey
  if (e.options !== undefined) payload.options = e.options
  if (e.sentenceTemplate !== undefined) payload.sentenceTemplate = e.sentenceTemplate
  if (e.answer !== undefined) payload.answer = e.answer
  if (e.acceptedAnswers !== undefined) payload.acceptedAnswers = e.acceptedAnswers
  if (e.correctOrder !== undefined) payload.correctOrder = e.correctOrder
  if (e.sourceKey !== undefined) payload.sourceKey = e.sourceKey
  if (e.targetAnswer !== undefined) payload.targetAnswer = e.targetAnswer
  return payload
}

/**
 * Idempotent insert: delete by primary key then insert. Works the same
 * across SQLite and Postgres and avoids the ON CONFLICT syntax
 * differences. Tables here are small so the cost is negligible.
 */
async function upsert<T extends Record<string, unknown>>(
  db: Db,
  table: string,
  pk: string,
  row: T,
): Promise<void> {
  await db(table).where({ [pk]: row[pk] }).delete()
  await db(table).insert(row)
}
