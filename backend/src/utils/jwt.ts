import jwt from 'jsonwebtoken'
import config from '../config/env.js'
import logger from './logger.js'

/**
 * JWT Token Utility
 * Create and verify JWT tokens
 */

export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

/**
 * Create JWT Token
 */
export function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  try {
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpire,
    })
    return token
  } catch (error) {
    logger.error('Failed to create JWT token:', error)
    throw error
  }
}

/**
 * Verify JWT Token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload
    return decoded
  } catch (error) {
    logger.debug('JWT verification failed:', error)
    return null
  }
}

/**
 * Decode Token (without verification)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload
    return decoded
  } catch (error) {
    logger.debug('JWT decode failed:', error)
    return null
  }
}

/**
 * Refresh Token
 */
export function refreshToken(oldToken: string): string | null {
  const payload = decodeToken(oldToken)
  if (!payload) return null

  return createToken({
    userId: payload.userId,
    email: payload.email,
  })
}

export { jwt }
