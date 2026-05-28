import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import LoginAttempt from '../models/LoginAttempt.js'
import Credential from '../models/Credential.js'
import logger from '../utils/logger.js'

const router = Router()

/**
 * Get Login Attempts
 */
router.get('/login-attempts', authMiddleware, async (req: Request, res: Response) => {
  try {
    const attempts = await LoginAttempt.find({ userId: req.userId })
      .sort({ attemptAt: -1 })
      .limit(50)

    res.json(attempts)
  } catch (error) {
    logger.error('Get login attempts error:', error)
    res.status(500).json({ error: 'Failed to get login attempts' })
  }
})

/**
 * Get Device Behavior
 */
router.get('/devices', authMiddleware, async (req: Request, res: Response) => {
  try {
    const attempts = await LoginAttempt.find({ userId: req.userId })
      .distinct('deviceInfo')

    // Mock device data
    const devices = [
      {
        id: 'dev-1',
        name: 'MacBook Pro',
        type: 'desktop',
        browser: 'Chrome',
        lastActive: new Date(),
        riskLevel: 'low',
      },
      {
        id: 'dev-2',
        name: 'iPhone 14',
        type: 'mobile',
        browser: 'Safari',
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
        riskLevel: 'low',
      },
    ]

    res.json(devices)
  } catch (error) {
    logger.error('Get devices error:', error)
    res.status(500).json({ error: 'Failed to get devices' })
  }
})

/**
 * Get Credential Status
 */
router.get('/credentials', authMiddleware, async (req: Request, res: Response) => {
  try {
    const credentials = await Credential.find({ userId: req.userId })

    res.json(credentials)
  } catch (error) {
    logger.error('Get credentials error:', error)
    res.status(500).json({ error: 'Failed to get credentials' })
  }
})

/**
 * Report Suspicious Activity
 */
router.post('/report-suspicious', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { activity, details } = req.body

    logger.warn('Suspicious activity reported', {
      userId: req.userId,
      activity,
      details,
    })

    res.json({
      message: 'Activity reported successfully',
      status: 'investigating',
    })
  } catch (error) {
    logger.error('Report suspicious activity error:', error)
    res.status(500).json({ error: 'Failed to report activity' })
  }
})

export default router
