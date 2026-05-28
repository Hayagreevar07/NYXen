import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import { connectDatabase } from './config/database.js'
import { initializeElastic } from './config/elastic.js'
import { authMiddleware, errorHandler, corsOptions } from './middleware/auth.js'
import logger from './utils/logger.js'

// Routes
import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import geminiRoutes from './routes/gemini.js'
import elasticRoutes from './routes/elastic.js'
import financialRoutes from './routes/financial.js'
import identityRoutes from './routes/identity.js'
import simulateRoutes from './routes/simulate.js'

/**
 * Express Application Setup
 */
export function createApp(): Express {
  const app = express()

  // Security Middleware
  app.use(helmet())
  app.use(cors(corsOptions))

  // Request Middleware
  app.use(compression())
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ limit: '10mb', extended: true }))

  // Health Check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date() })
  })

  // API Version
  app.get('/api/version', (req: Request, res: Response) => {
    res.json({ version: '1.0.0', platform: 'Nyxen' })
  })

  // Routes
  app.use('/api/auth', authRoutes)
  app.use('/api', dashboardRoutes)
  app.use('/api/gemini', geminiRoutes)
  app.use('/api/elastic', elasticRoutes)
  app.use('/api/financial', financialRoutes)
  app.use('/api/identity', identityRoutes)
  app.use('/api/simulate', simulateRoutes)

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not found',
      path: req.path,
      method: req.method,
    })
  })

  // Error Handler
  app.use(errorHandler)

  return app
}

export default createApp
