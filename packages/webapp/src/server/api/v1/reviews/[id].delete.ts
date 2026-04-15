import { removeCard } from '../../../repositories/review.repository'

export default defineEventHandler(async (event) => {
  const user = event.context.user as { id: string } | undefined
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id required' })

  const ok = await removeCard(user.id, id)
  if (!ok) throw createError({ statusCode: 404, statusMessage: 'card not found' })
  return { data: { removed: true } }
})
