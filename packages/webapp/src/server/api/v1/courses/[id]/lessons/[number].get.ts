import { getLesson } from '../../../../../repositories/lesson.repository'

export default defineEventHandler(async (event) => {
  const courseId = getRouterParam(event, 'id')
  const numberStr = getRouterParam(event, 'number')
  if (!courseId || !numberStr) throw createError({ statusCode: 400, statusMessage: 'course id and lesson number required' })

  const lessonNumber = Number(numberStr)
  if (!Number.isFinite(lessonNumber)) throw createError({ statusCode: 400, statusMessage: 'invalid lesson number' })

  const lesson = await getLesson(courseId, lessonNumber)
  if (!lesson) throw createError({ statusCode: 404, statusMessage: 'lesson not found' })

  return { data: lesson }
})
