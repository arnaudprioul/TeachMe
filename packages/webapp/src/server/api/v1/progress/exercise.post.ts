import { upsertExerciseProgress } from '../../../repositories/progress.repository'

export default defineEventHandler(async (event) => {
  const user = event.context.user as { id: string } | undefined
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody<{
    courseKey?: string
    lessonId?: number
    difficulty?: string
    bestScore?: number
    bestStreak?: number
  }>(event)

  if (!body?.courseKey || typeof body?.lessonId !== 'number' || !body?.difficulty) {
    throw createError({ statusCode: 400, statusMessage: 'courseKey, lessonId, difficulty required' })
  }

  if (!['easy', 'medium', 'hard'].includes(body.difficulty)) {
    throw createError({ statusCode: 400, statusMessage: 'difficulty must be easy, medium, or hard' })
  }

  const row = await upsertExerciseProgress(user.id, body.courseKey, String(body.lessonId), body.difficulty, {
    bestScore: body.bestScore,
    bestStreak: body.bestStreak,
  })

  return { data: row }
})
