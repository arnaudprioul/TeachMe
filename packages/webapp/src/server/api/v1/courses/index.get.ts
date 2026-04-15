import { listCourses } from '../../../repositories/lesson.repository'

export default defineEventHandler(async (event) => {
  const { lang } = getQuery(event)
  const courses = await listCourses(typeof lang === 'string' ? lang : undefined)
  return { data: courses }
})
