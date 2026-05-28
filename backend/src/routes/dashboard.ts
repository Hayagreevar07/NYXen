import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getDashboardData } from '../services/elasticService.js'
import User from '../models/User.js'
import Threat from '../models/Threat.js'
import logger from '../utils/logger.js'

const router = Router()

/**
 * Get Dashboard Data
 */
router.get('/dashboard', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Get user
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get recent threats
    const threats = await Threat.find({ userId: req.userId })
      .sort({ detectedAt: -1 })
      .limit(10)

    // Get dashboard data from Elastic
    const elasticData = await getDashboardData(req.userId!)

    res.json({
      user: user.toJSON(),
      risks: {
        overall: user.riskScore,
        identity: user.identityScore,
        financial: user.financialRiskScore,
      },
      threats: threats.map((t) => ({
        id: t._id,
        type: t.type,
        severity: t.severity,
        description: t.description,
        detectedAt: t.detectedAt,
        confidence: t.confidence,
        status: t.status,
      })),
      elastic: elasticData,
    })
  } catch (error) {
    logger.error('Dashboard error:', error)
    res.status(500).json({ error: 'Failed to get dashboard data' })
  }
})

/**
 * Get Threats
 */
router.get('/threats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { type, severity, status } = req.query

    const query: any = { userId: req.userId }
    if (type) query.type = type
    if (severity) query.severity = severity
    if (status) query.status = status

    const threats = await Threat.find(query)
      .sort({ detectedAt: -1 })
      .limit(100)

    res.json(threats)
  } catch (error) {
    logger.error('Get threats error:', error)
    res.status(500).json({ error: 'Failed to get threats' })
  }
})

/**
 * Get Risk Scores
 */
router.get('/risk-scores', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      overall: user.riskScore,
      identity: user.identityScore,
      financial: user.financialRiskScore,
      lastUpdated: user.updatedAt,
    })
  } catch (error) {
    logger.error('Get risk scores error:', error)
    res.status(500).json({ error: 'Failed to get risk scores' })
  }
})

/**
 * Get Anomalies
 */
router.get('/anomalies', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Mock anomalies data
    const anomalies = [
      {
        id: 'anom-1',
        type: 'login',
        score: 78,
        description: 'Unusual login location',
        timestamp: new Date(),
      },
      {
        id: 'anom-2',
        type: 'spending',
        score: 62,
        description: 'Spending pattern change',
        timestamp: new Date(),
      },
    ]

    res.json(anomalies)
  } catch (error) {
    logger.error('Get anomalies error:', error)
    res.status(500).json({ error: 'Failed to get anomalies' })
  }
})

export default router
