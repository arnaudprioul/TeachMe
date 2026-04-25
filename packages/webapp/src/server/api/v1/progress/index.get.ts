import { getLessonProgress, getExerciseProgress } from '../../../repositories/progress.repository'

export default defineEventHandler(async (event) => {
  const user = event.context.user as { id: string } | undefined
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const { courseKey } = getQuery(event)
  if (typeof courseKey !== 'string' || !courseKey) {
    throw createError({ statusCode: 400, statusMessage: 'courseKey query parameter required' })
  }

  const [lessons, exercises] = await Promise.all([
    getLessonProgress(user.id, courseKey),
    getExerciseProgress(user.id, courseKey),
  ])

  return { data: { lessons, exercises } }
})
