import { getRedis } from '../../../utils/redis'
import { createOtp, isOnCooldown, resetCooldown } from '../../../utils/otp'
import { sendOtpEmail } from '../../../utils/mailer'
import { sendOtpSms } from '../../../utils/sms'

export default defineEventHandler(async (event) => {
  const { identifier } = await readBody(event)

  if (!identifier) {
    throw createError({ statusCode: 400, statusMessage: 'identifier is required' })
  }

  if (await isOnCooldown(identifier)) {
    throw createError({ statusCode: 429, statusMessage: 'Please wait before requesting a new code' })
  }

  // Check that a pending registration exists
  const redis = getRedis()
  const raw = await redis.get(`otp:pending:${identifier}`)
  if (!raw) {
    throw createError({ statusCode: 404, statusMessage: 'No pending registration found. Please register again.' })
  }

  const pending = JSON.parse(raw)
  const newOtp = await createOtp(
    pending.identifier,
    pending.channel,
    pending.username,
    pending.password,
    pending.masked,
  )

  if (pending.channel === 'email') {
    await sendOtpEmail(pending.identifier, newOtp)
  } else {
    await sendOtpSms(pending.identifier, newOtp)
  }

  return { success: true, data: { channel: pending.channel, masked: pending.masked } }
})
