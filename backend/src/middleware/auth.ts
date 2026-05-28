import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt.js'
import logger from '../utils/logger.js'

/**
 * Authentication Middleware
 * Verify JWT token and attach user to request
 */

declare global {
  namespace Express {
    interface Request {
      userId?: string
      userEmail?: string
      token?: string
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.userId = payload.userId
    req.userEmail = payload.email
    req.token = token

    next()
  } catch (error) {
    logger.error('Authentication middleware error:', error)
    res.status(401).json({ error: 'Authentication failed' })
  }
}

/**
 * Optional Auth Middleware
 * Attach user if token is provided, but don't fail if not
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = verifyToken(token)

      if (payload) {
        req.userId = payload.userId
        req.userEmail = payload.email
        req.token = token
      }
    }

    next()
  } catch (error) {
    logger.debug('Optional auth middleware error:', error)
    next()
  }
}

/**
 * Error Handler Middleware
 */
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Unhandled error:', error)

  const status = error.status || 500
  const message = error.message || 'Internal server error'

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  })
}

/**
 * CORS Configuration
 */
export const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}
