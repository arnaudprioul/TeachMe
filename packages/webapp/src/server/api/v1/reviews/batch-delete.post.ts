import { getDb } from '../../../db/connection'

export default defineEventHandler(async (event) => {
  const user = event.context.user as { id: string } | undefined
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody<{ ids?: string[] }>(event)
  if (!body?.ids?.length) {
    throw createError({ statusCode: 400, statusMessage: 'ids array required' })
  }

  const db = getDb()
  await db('user_review_cards')
    .where('user_id', user.id)
    .whereIn('id', body.ids)
    .delete()

  return { data: { deleted: body.ids.length } }
})
