import { upsertLessonProgress } from '../../../repositories/progress.repository'

export default defineEventHandler(async (event) => {
  const user = event.context.user as { id: string } | undefined
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody<{
    courseKey?: string
    lessonId?: number
    completed?: boolean
    bestScore?: number
    attempts?: number
  }>(event)

  if (!body?.courseKey || typeof body?.lessonId !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'courseKey, lessonId required' })
  }

  const row = await upsertLessonProgress(user.id, body.courseKey, String(body.lessonId), {
    completed: body.completed,
    bestScore: body.bestScore,
    attempts: body.attempts,
  })

  return { data: row }
})
