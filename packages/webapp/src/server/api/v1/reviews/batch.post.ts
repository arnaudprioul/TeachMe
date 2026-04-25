import { addCard } from '../../../repositories/review.repository'

export default defineEventHandler(async (event) => {
  const user = event.context.user as { id: string } | undefined
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody<{ items?: Array<{ lang: string; wordId: string; courseId: string; lessonId: number }> }>(event)
  if (!body?.items?.length) {
    throw createError({ statusCode: 400, statusMessage: 'items array required' })
  }

  const results = []
  for (const item of body.items) {
    if (!item.lang || !item.wordId || !item.courseId || typeof item.lessonId !== 'number') continue
    try {
      const card = await addCard(user.id, item)
      results.push(card)
    } catch (err: any) {
      // Skip duplicates (unique constraint), log others
      if (!err?.message?.includes('UNIQUE constraint')) {
        console.warn('[reviews/batch] addCard failed for', item.wordId, err?.message)
      }
    }
  }

  return { data: results }
})
