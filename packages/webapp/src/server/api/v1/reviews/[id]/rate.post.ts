import { rateCard } from '../../../../repositories/review.repository'

export default defineEventHandler(async (event) => {
  const user = event.context.user as { id: string } | undefined
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const body = await readBody<{ quality?: number }>(event)
  if (typeof body?.quality !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'quality (0-5) required' })
  }

  const card = await rateCard(user.id, id, body.quality)
  if (!card) throw createError({ statusCode: 404, statusMessage: 'card not found' })
  return { data: card }
})
