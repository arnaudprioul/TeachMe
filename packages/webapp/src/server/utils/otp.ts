import { randomInt } from 'node:crypto'
import { getRedis } from './redis'

const TTL = Number(process.env.OTP_TTL_SECONDS ?? 600)
const RESEND_COOLDOWN = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS ?? 60)

const pendingKey = (id: string) => `otp:pending:${id}`
const cooldownKey = (id: string) => `otp:cooldown:${id}`

export interface IPendingRegistration {
  otp: string
  identifier: string
  channel: 'email' | 'sms'
  username: string
  password: string
  masked: string
}

/** Store a pending registration + OTP in Redis. Returns the 6-digit code. */
export async function createOtp(
  identifier: string,
  channel: 'email' | 'sms',
  username: string,
  hashedPassword: string,
  masked: string,
): Promise<string> {
  const redis = getRedis()
  const otp = String(randomInt(100000, 999999))
  const payload: IPendingRegistration = { otp, identifier, channel, username, password: hashedPassword, masked }
  await redis.set(pendingKey(identifier), JSON.stringify(payload), 'EX', TTL)
  await redis.set(cooldownKey(identifier), '1', 'EX', RESEND_COOLDOWN)
  return otp
}

/** Verify an OTP. Returns the pending payload on success, throws otherwise. */
export async function verifyOtp(identifier: string, code: string): Promise<IPendingRegistration> {
  const redis = getRedis()
  const raw = await redis.get(pendingKey(identifier))
  if (!raw) throw new Error('OTP expired or not found')
  const payload: IPendingRegistration = JSON.parse(raw)
  if (payload.otp !== code.trim()) throw new Error('Invalid OTP')
  await redis.del(pendingKey(identifier))
  return payload
}

/** Returns true if a resend cooldown is active for this identifier. */
export async function isOnCooldown(identifier: string): Promise<boolean> {
  const redis = getRedis()
  return (await redis.exists(cooldownKey(identifier))) === 1
}

/** Reset the cooldown (e.g. when re-sending). */
export async function resetCooldown(identifier: string): Promise<void> {
  const redis = getRedis()
  await redis.set(cooldownKey(identifier), '1', 'EX', RESEND_COOLDOWN)
}

/** Delete pending registration (e.g. on too many failed attempts). */
export async function deletePending(identifier: string): Promise<void> {
  const redis = getRedis()
  await redis.del(pendingKey(identifier))
}
