import { randomUUID } from 'node:crypto'
import { getDb } from '~/server/db/connection'
import { initialSrsState, applyRating, nextReviewDate, type ISrsState } from '~/server/utils/sm2'

export interface IReviewCardRow {
  id: string
  userId: string
  lang: string
  wordId: string
  courseId: string
  lessonId: number
  srs: ISrsState
  nextReviewAt: string | null
  lastReviewedAt: string | null
  createdAt: string
}

function toRow(r: Record<string, unknown>): IReviewCardRow {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    lang: r.lang as string,
    wordId: r.word_id as string,
    courseId: r.course_id as string,
    lessonId: Number(r.lesson_id),
    srs: {
      easeFactor: Number(r.ease_factor),
      intervalDays: Number(r.interval_days),
      repetitions: Number(r.repetitions),
    },
    nextReviewAt: (r.next_review_at as any) ?? null,
    lastReviewedAt: (r.last_reviewed_at as any) ?? null,
    createdAt: (r.created_at as any) ?? null,
  }
}

export async function listCards(userId: string, lang?: string): Promise<IReviewCardRow[]> {
  const db = getDb()
  const q = db('user_review_cards').where({ user_id: userId }).orderBy('created_at', 'desc')
  if (lang) q.where({ lang })
  const rows = await q
  return rows.map(toRow)
}

export async function getCard(userId: string, id: string): Promise<IReviewCardRow | null> {
  const db = getDb()
  const row = await db('user_review_cards').where({ id, user_id: userId }).first()
  return row ? toRow(row) : null
}

export interface IAddCardInput {
  lang: string
  wordId: string
  courseId: string
  lessonId: number
}

export async function addCard(userId: string, input: IAddCardInput): Promise<IReviewCardRow> {
  const db = getDb()

  // Idempotency: if already in deck, return existing
  const existing = await db('user_review_cards').where({
    user_id: userId,
    lang: input.lang,
    word_id: input.wordId,
    course_id: input.courseId,
    lesson_id: input.lessonId,
  }).first()
  if (existing) return toRow(existing)

  const state = initialSrsState()
  const id = randomUUID()
  const now = new Date()
  await db('user_review_cards').insert({
    id,
    user_id: userId,
    lang: input.lang,
    word_id: input.wordId,
    course_id: input.courseId,
    lesson_id: input.lessonId,
    ease_factor: state.easeFactor,
    interval_days: state.intervalDays,
    repetitions: state.repetitions,
    next_review_at: now,
    last_reviewed_at: null,
  })

  const row = await db('user_review_cards').where({ id }).first()
  return toRow(row!)
}

export async function removeCard(userId: string, id: string): Promise<boolean> {
  const db = getDb()
  const n = await db('user_review_cards').where({ id, user_id: userId }).delete()
  return n > 0
}

/** Apply an SM-2 rating and persist the new state. */
export async function rateCard(userId: string, id: string, quality: number): Promise<IReviewCardRow | null> {
  const db = getDb()
  const existing = await db('user_review_cards').where({ id, user_id: userId }).first()
  if (!existing) return null

  const current: ISrsState = {
    easeFactor: Number(existing.ease_factor),
    intervalDays: Number(existing.interval_days),
    repetitions: Number(existing.repetitions),
  }
  const next = applyRating(current, quality)
  const nextDue = nextReviewDate(next.intervalDays)

  await db('user_review_cards').where({ id }).update({
    ease_factor: next.easeFactor,
    interval_days: next.intervalDays,
    repetitions: next.repetitions,
    next_review_at: nextDue,
    last_reviewed_at: new Date(),
    updated_at: new Date(),
  })

  const row = await db('user_review_cards').where({ id }).first()
  return toRow(row!)
}
