import config from './config/env.js'
import { createApp } from './app.js'
import { connectDatabase } from './config/database.js'
import { initializeElastic } from './config/elastic.js'
import logger from './utils/logger.js'

/**
 * Start Nyxen Backend Server
 */
async function startServer() {
  try {
    logger.info(`🚀 Starting Nyxen backend in ${config.nodeEnv} mode...`)

    // Create Express app
    const app = createApp()

    // Connect to MongoDB
    logger.info('📦 Connecting to MongoDB...')
    await connectDatabase()

    // Initialize Elastic
    logger.info('📊 Initializing Elastic...')
    initializeElastic()

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`✓ Nyxen backend running on http://localhost:${config.port}`)
      logger.info(`✓ Environment: ${config.nodeEnv}`)
      logger.info(`✓ API: http://localhost:${config.port}/api`)
      logger.info(`✓ Health: http://localhost:${config.port}/health`)
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('⏹ Shutting down gracefully...')
      server.close(() => {
        logger.info('✓ Server closed')
        process.exit(0)
      })
    })

    process.on('SIGTERM', async () => {
      logger.info('⏹ Shutting down gracefully...')
      server.close(() => {
        logger.info('✓ Server closed')
        process.exit(0)
      })
    })
  } catch (error) {
    logger.error('✗ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()
