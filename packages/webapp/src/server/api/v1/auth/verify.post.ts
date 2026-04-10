import { randomUUID } from 'node:crypto'
import { getDb } from '../../../db/connection'
import { signToken } from '../../../utils/auth'
import { verifyOtp } from '../../../utils/otp'

export default defineEventHandler(async (event) => {
  const { identifier, code } = await readBody(event)

  if (!identifier || !code) {
    throw createError({ statusCode: 400, statusMessage: 'identifier and code are required' })
  }

  let pending
  try {
    pending = await verifyOtp(identifier, code)
  } catch (err: any) {
    throw createError({ statusCode: 400, statusMessage: err.message ?? 'Invalid or expired code' })
  }

  const db = getDb()
  const isEmail = pending.channel === 'email'
  const id = randomUUID()

  await db('users').insert({
    id,
    email: isEmail ? pending.identifier : null,
    phone: isEmail ? null : pending.identifier,
    username: pending.username,
    password: pending.password,
    verified: true,
  })

  const user = { id, email: isEmail ? pending.identifier : null, username: pending.username }
  const token = signToken({ id, email: user.email ?? '', username: user.username })

  return { success: true, data: { user, token } }
})
