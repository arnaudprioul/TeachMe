import { getCourse, listLessons } from '../../../repositories/lesson.repository'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'course id required' })

  const course = await getCourse(id)
  if (!course) throw createError({ statusCode: 404, statusMessage: 'course not found' })

  course.lessons = await listLessons(id)

  return { data: course }
})
