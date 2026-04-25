import { randomUUID } from 'node:crypto'
import { getDb } from '~/server/db/connection'

// ── Lesson progress ──

export interface ILessonProgressRow {
  id: string
  userId: string
  courseKey: string
  lessonId: string
  completed: boolean
  bestScore: number
  attempts: number
  lastAttemptAt: string | null
  createdAt: string
  updatedAt: string
}

function toLessonRow(r: Record<string, unknown>): ILessonProgressRow {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    courseKey: r.course_key as string,
    lessonId: r.lesson_id as string,
    completed: Boolean(r.completed),
    bestScore: Number(r.best_score),
    attempts: Number(r.attempts),
    lastAttemptAt: (r.last_attempt_at as any) ?? null,
    createdAt: (r.created_at as any) ?? null,
    updatedAt: (r.updated_at as any) ?? null,
  }
}

export async function getLessonProgress(userId: string, courseKey: string): Promise<ILessonProgressRow[]> {
  const db = getDb()
  const rows = await db('user_lesson_progress')
    .where({ user_id: userId, course_key: courseKey })
    .orderBy('lesson_id', 'asc')
  return rows.map(toLessonRow)
}

export async function upsertLessonProgress(
  userId: string,
  courseKey: string,
  lessonId: string,
  data: { completed?: boolean; bestScore?: number; attempts?: number },
): Promise<ILessonProgressRow> {
  const db = getDb()
  const now = new Date()

  const existing = await db('user_lesson_progress')
    .where({ user_id: userId, course_key: courseKey, lesson_id: lessonId })
    .first()

  if (existing) {
    const updates: Record<string, unknown> = { updated_at: now, last_attempt_at: now }
    if (data.completed !== undefined) updates.completed = data.completed
    if (data.bestScore !== undefined) updates.best_score = Math.max(Number(existing.best_score), data.bestScore)
    if (data.attempts !== undefined) updates.attempts = data.attempts

    await db('user_lesson_progress')
      .where({ id: existing.id })
      .update(updates)

    const row = await db('user_lesson_progress').where({ id: existing.id }).first()
    return toLessonRow(row!)
  }

  const id = randomUUID()
  await db('user_lesson_progress').insert({
    id,
    user_id: userId,
    course_key: courseKey,
    lesson_id: lessonId,
    completed: data.completed ?? false,
    best_score: data.bestScore ?? 0,
    attempts: data.attempts ?? 0,
    last_attempt_at: now,
    created_at: now,
    updated_at: now,
  })

  const row = await db('user_lesson_progress').where({ id }).first()
  return toLessonRow(row!)
}

// ── Exercise progress ──

export interface IExerciseProgressRow {
  id: string
  userId: string
  courseKey: string
  lessonId: string
  difficulty: string
  bestScore: number
  bestStreak: number
  attempts: number
  lastAttemptAt: string | null
  createdAt: string
  updatedAt: string
}

function toExerciseRow(r: Record<string, unknown>): IExerciseProgressRow {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    courseKey: r.course_key as string,
    lessonId: r.lesson_id as string,
    difficulty: r.difficulty as string,
    bestScore: Number(r.best_score),
    bestStreak: Number(r.best_streak),
    attempts: Number(r.attempts),
    lastAttemptAt: (r.last_attempt_at as any) ?? null,
    createdAt: (r.created_at as any) ?? null,
    updatedAt: (r.updated_at as any) ?? null,
  }
}

export async function getExerciseProgress(userId: string, courseKey: string): Promise<IExerciseProgressRow[]> {
  const db = getDb()
  const rows = await db('user_exercise_progress')
    .where({ user_id: userId, course_key: courseKey })
    .orderBy(['lesson_id', 'difficulty'])
  return rows.map(toExerciseRow)
}

export async function upsertExerciseProgress(
  userId: string,
  courseKey: string,
  lessonId: string,
  difficulty: string,
  data: { bestScore?: number; bestStreak?: number },
): Promise<IExerciseProgressRow> {
  const db = getDb()
  const now = new Date()

  const existing = await db('user_exercise_progress')
    .where({ user_id: userId, course_key: courseKey, lesson_id: lessonId, difficulty })
    .first()

  if (existing) {
    const updates: Record<string, unknown> = { updated_at: now, last_attempt_at: now }
    if (data.bestScore !== undefined) updates.best_score = Math.max(Number(existing.best_score), data.bestScore)
    if (data.bestStreak !== undefined) updates.best_streak = Math.max(Number(existing.best_streak), data.bestStreak)
    updates.attempts = Number(existing.attempts) + 1

    await db('user_exercise_progress')
      .where({ id: existing.id })
      .update(updates)

    const row = await db('user_exercise_progress').where({ id: existing.id }).first()
    return toExerciseRow(row!)
  }

  const id = randomUUID()
  await db('user_exercise_progress').insert({
    id,
    user_id: userId,
    course_key: courseKey,
    lesson_id: lessonId,
    difficulty,
    best_score: data.bestScore ?? 0,
    best_streak: data.bestStreak ?? 0,
    attempts: 1,
    last_attempt_at: now,
    created_at: now,
    updated_at: now,
  })

  const row = await db('user_exercise_progress').where({ id }).first()
  return toExerciseRow(row!)
}
