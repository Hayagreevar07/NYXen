import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import {
  analyzeThreat,
  explainThreat,
  generateRecommendations,
} from '../services/geminiService.js'
import logger from '../utils/logger.js'

const router = Router()

/**
 * Analyze Threats
 */
router.post('/analyze-threats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { threats } = req.body

    if (!threats || !Array.isArray(threats)) {
      return res.status(400).json({ error: 'Invalid threats data' })
    }

    const analyses = await Promise.all(
      threats.map((threat) =>
        analyzeThreat({
          type: threat.type,
          description: threat.description,
          context: threat.context || {},
        })
      )
    )

    logger.info('Threats analyzed with Gemini', { userId: req.userId, count: threats.length })

    res.json(analyses.filter((a) => a !== null))
  } catch (error) {
    logger.error('Threat analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze threats' })
  }
})

/**
 * Explain Threat
 */
router.post('/explain/:threatId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { threatId } = req.params
    const { threatDetails } = req.body

    if (!threatDetails) {
      return res.status(400).json({ error: 'Threat details required' })
    }

    const explanation = await explainThreat(threatId, threatDetails)

    if (!explanation) {
      return res.status(500).json({ error: 'Failed to explain threat' })
    }

    logger.info('Threat explained with Gemini', { threatId })

    res.json({ explanation })
  } catch (error) {
    logger.error('Threat explanation error:', error)
    res.status(500).json({ error: 'Failed to explain threat' })
  }
})

/**
 * Generate Recommendations
 */
router.post('/recommendations/:threatId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { threatType } = req.body

    if (!threatType) {
      return res.status(400).json({ error: 'Threat type required' })
    }

    const recommendations = await generateRecommendations(threatType, {
      userId: req.userId,
      timestamp: new Date(),
    })

    if (!recommendations) {
      return res.status(500).json({ error: 'Failed to generate recommendations' })
    }

    logger.info('Recommendations generated with Gemini', { threatType })

    res.json(recommendations)
  } catch (error) {
    logger.error('Recommendation generation error:', error)
    res.status(500).json({ error: 'Failed to generate recommendations' })
  }
})

export default router
