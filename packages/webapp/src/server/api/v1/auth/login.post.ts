import { getDb } from '../../../db/connection'
import { comparePassword, signToken } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const { identifier, password } = await readBody(event)

  if (!identifier || !password) {
    throw createError({ statusCode: 400, statusMessage: 'identifier and password are required' })
  }

  const db = getDb()
  const isEmail = identifier.includes('@')

  const user = isEmail
    ? await db('users').where({ email: identifier }).first()
    : await db('users').where({ phone: identifier }).first()

  if (!user || !(await comparePassword(password, user.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  if (!user.verified) {
    throw createError({ statusCode: 403, statusMessage: 'Account not verified' })
  }

  const token = signToken({ id: user.id, email: user.email ?? '', username: user.username })
  return {
    success: true,
    data: { user: { id: user.id, email: user.email, username: user.username }, token },
  }
})
