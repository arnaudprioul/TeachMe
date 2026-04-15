import { listLanguages } from '../../../repositories/lesson.repository'

export default defineEventHandler(async () => {
  const languages = await listLanguages()
  return { data: languages }
})
