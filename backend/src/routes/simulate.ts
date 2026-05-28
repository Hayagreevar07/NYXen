import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import logger from '../utils/logger.js'

const router = Router()

/**
 * Simulate Phishing Attack
 */
router.post('/phishing', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { config } = req.body

    logger.info('Phishing simulation started', { userId: req.userId })

    // Simulate phishing detection
    const simulationResult = {
      id: 'sim-' + Date.now(),
      type: 'phishing',
      status: 'completed',
      threatDetected: true,
      detectionTime: 250, // milliseconds
      confidence: 98,
      reasoning:
        'Email matched known phishing patterns: suspicious sender, urgent language, fake links',
      recommendations: [
        'Mark as spam',
        'Enable email filtering',
        'Enable 2FA on email account',
      ],
    }

    res.json(simulationResult)
  } catch (error) {
    logger.error('Phishing simulation error:', error)
    res.status(500).json({ error: 'Simulation failed' })
  }
})

/**
 * Simulate Account Takeover
 */
router.post('/account-takeover', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { config } = req.body

    logger.info('Account takeover simulation started', { userId: req.userId })

    const simulationResult = {
      id: 'sim-' + Date.now(),
      type: 'account_takeover',
      status: 'completed',
      threatDetected: true,
      detectionTime: 180,
      confidence: 94,
      reasoning: 'Multiple anomalies detected: new location, device change, behavioral shift',
      recommendations: [
        'Revoke all sessions',
        'Reset password',
        'Review recent account activity',
        'Enable MFA',
      ],
    }

    res.json(simulationResult)
  } catch (error) {
    logger.error('Account takeover simulation error:', error)
    res.status(500).json({ error: 'Simulation failed' })
  }
})

/**
 * Simulate Financial Fraud
 */
router.post('/financial-fraud', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { config } = req.body

    logger.info('Financial fraud simulation started', { userId: req.userId })

    const simulationResult = {
      id: 'sim-' + Date.now(),
      type: 'financial_fraud',
      status: 'completed',
      threatDetected: true,
      detectionTime: 420,
      confidence: 87,
      reasoning:
        'Unusual spending patterns detected: high transaction volume, foreign location, uncommon merchant',
      recommendations: [
        'Freeze card',
        'Dispute transactions',
        'Contact bank',
        'Monitor account closely',
      ],
    }

    res.json(simulationResult)
  } catch (error) {
    logger.error('Financial fraud simulation error:', error)
    res.status(500).json({ error: 'Simulation failed' })
  }
})

export default router
