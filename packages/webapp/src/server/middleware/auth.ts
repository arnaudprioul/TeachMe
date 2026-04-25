import { verifyToken } from '../utils/auth'

const PROTECTED = ['/api/v1/quiz', '/api/v1/reviews', '/api/v1/progress']

export default defineEventHandler((event) => {
  if (!PROTECTED.some((p) => event.path.startsWith(p))) return
  const header = getHeader(event, 'authorization')
  if (!header?.startsWith('Bearer ')) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  try {
    event.context.user = verifyToken(header.slice(7))
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
