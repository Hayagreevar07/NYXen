import mongoose from 'mongoose'
import config from './env.js'
import logger from '../utils/logger.js'

/**
 * Database Connection
 * Initializes MongoDB connection with error handling
 */
export async function connectDatabase() {
  try {
    await mongoose.connect(config.mongoUri, {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    logger.info('✓ MongoDB connected successfully')
    return mongoose.connection
  } catch (error) {
    logger.error('✗ MongoDB connection failed:', error)
    // Retry connection after 5 seconds
    setTimeout(connectDatabase, 5000)
  }
}

/**
 * Disconnect Database
 */
export async function disconnectDatabase() {
  try {
    await mongoose.disconnect()
    logger.info('✓ MongoDB disconnected')
  } catch (error) {
    logger.error('✗ MongoDB disconnection error:', error)
  }
}

export default mongoose
