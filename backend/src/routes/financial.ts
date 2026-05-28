import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import Transaction from '../models/Transaction.js'
import logger from '../utils/logger.js'

const router = Router()

/**
 * Get Financial Analysis
 */
router.get('/analysis', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { period = '30d' } = req.query

    // Calculate spending statistics
    const now = new Date()
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const transactions = await Transaction.find({
      userId: req.userId,
      transactionDate: { $gte: startDate },
    })

    const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0)
    const avgTransaction = transactions.length > 0 ? totalSpending / transactions.length : 0

    res.json({
      totalSpending,
      avgTransaction,
      transactionCount: transactions.length,
      period,
      timestamp: new Date(),
    })
  } catch (error) {
    logger.error('Financial analysis error:', error)
    res.status(500).json({ error: 'Failed to get financial analysis' })
  }
})

/**
 * Get Spending Patterns
 */
router.get('/spending', authMiddleware, async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ transactionDate: -1 })
      .limit(100)

    const byCategory = transactions.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>
    )

    res.json({
      byCategory,
      transactions: transactions.map((t) => ({
        amount: t.amount,
        category: t.category,
        date: t.transactionDate,
      })),
    })
  } catch (error) {
    logger.error('Spending patterns error:', error)
    res.status(500).json({ error: 'Failed to get spending patterns' })
  }
})

/**
 * Get Predictions
 */
router.get('/predictions', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Mock predictions
    const predictions = {
      predictedMonthlySpending: 5200,
      savingsGoalRisk: 'medium',
      anomalyProbability: 0.35,
      predictedBalance: 3450,
      recommendations: [
        'Cancel unused subscription ($15/month)',
        'Reduce dining expenses (trending +45%)',
        'Increase savings allocation',
      ],
    }

    res.json(predictions)
  } catch (error) {
    logger.error('Predictions error:', error)
    res.status(500).json({ error: 'Failed to get predictions' })
  }
})

export default router
