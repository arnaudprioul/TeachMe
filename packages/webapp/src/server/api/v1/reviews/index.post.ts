import { addCard } from '../../../repositories/review.repository'

export default defineEventHandler(async (event) => {
  const user = event.context.user as { id: string } | undefined
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody<{ lang?: string; wordId?: string; courseId?: string; lessonId?: number }>(event)
  if (!body?.lang || !body?.wordId || !body?.courseId || typeof body?.lessonId !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'lang, wordId, courseId, lessonId required' })
  }

  const card = await addCard(user.id, {
    lang: body.lang, wordId: body.wordId,
    courseId: body.courseId, lessonId: body.lessonId,
  })
  return { data: card }
})
