import { getDb } from '../../../db/connection'
import { hashPassword } from '../../../utils/auth'
import { createOtp, isOnCooldown } from '../../../utils/otp'
import { sendOtpEmail } from '../../../utils/mailer'
import { sendOtpSms } from '../../../utils/sms'

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  const visible = local.length > 2 ? local.slice(0, 2) : local[0]
  return `${visible}***@${domain}`
}

function maskPhone(phone: string): string {
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4)
}

export default defineEventHandler(async (event) => {
  const { identifier, username, password } = await readBody(event)
  console.log('[register] →', { identifier, username, hasPassword: !!password })

  if (!identifier || !username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'identifier, username and password are required' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' })
  }

  const isEmail = identifier.includes('@')
  const channel: 'email' | 'sms' = isEmail ? 'email' : 'sms'
  console.log('[register] channel:', channel)

  let db: ReturnType<typeof getDb>
  try {
    db = getDb()
    console.log('[register] DB ok')
  } catch (e) {
    console.error('[register] DB not ready:', e)
    throw createError({ statusCode: 503, statusMessage: 'Database not ready' })
  }

  // Check if identifier or username already exists
  const existing = isEmail
    ? await db('users').where({ email: identifier }).first()
    : await db('users').where({ phone: identifier }).first()
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'This identifier is already registered' })
  }
  const existingUsername = await db('users').where({ username }).first()
  if (existingUsername) {
    throw createError({ statusCode: 409, statusMessage: 'Username already taken' })
  }
  console.log('[register] user check ok')

  // Rate-limit: check cooldown
  try {
    if (await isOnCooldown(identifier)) {
      throw createError({ statusCode: 429, statusMessage: 'Please wait before requesting a new code' })
    }
    console.log('[register] cooldown check ok')
  } catch (e: any) {
    if (e.statusCode === 429) throw e
    console.error('[register] Redis error (cooldown):', e)
    throw createError({ statusCode: 503, statusMessage: 'Cache service unavailable' })
  }

  const hashedPassword = await hashPassword(password)
  const masked = isEmail ? maskEmail(identifier) : maskPhone(identifier)

  let otp: string
  try {
    otp = await createOtp(identifier, channel, username, hashedPassword, masked)
    console.log('[register] OTP created in Redis')
  } catch (e) {
    console.error('[register] Redis error (createOtp):', e)
    throw createError({ statusCode: 503, statusMessage: 'Cache service unavailable' })
  }

  // Send OTP
  try {
    if (channel === 'email') {
      await sendOtpEmail(identifier, otp)
      console.log('[register] Email sent to', identifier)
    } else {
      await sendOtpSms(identifier, otp)
      console.log('[register] SMS sent to', identifier)
    }
  } catch (mailErr) {
    console.error('[register] Failed to send OTP:', mailErr)
    throw createError({ statusCode: 503, statusMessage: 'Failed to send verification code. Please try again.' })
  }

  console.log('[register] ✓ success')
  return { success: true, data: { channel, masked } }
})
