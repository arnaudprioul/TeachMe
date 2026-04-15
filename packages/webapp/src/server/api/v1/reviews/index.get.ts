import { listCards } from '../../../repositories/review.repository'

export default defineEventHandler(async (event) => {
  const user = event.context.user as { id: string } | undefined
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const { lang } = getQuery(event)
  const cards = await listCards(user.id, typeof lang === 'string' ? lang : undefined)
  return { data: cards }
})
