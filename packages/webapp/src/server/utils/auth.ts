import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret_change_in_prod'

export interface ITokenPayload { id: string; email: string; username: string }

export function signToken(user: ITokenPayload): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' } as jwt.SignOptions)
}

export function verifyToken(token: string): ITokenPayload {
  return jwt.verify(token, JWT_SECRET) as ITokenPayload
}

export const hashPassword = (p: string) => bcrypt.hash(p, 12)
export const comparePassword = (p: string, h: string) => bcrypt.compare(p, h)
