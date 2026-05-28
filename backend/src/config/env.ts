import dotenv from 'dotenv'

dotenv.config()

/**
 * Environment Configuration
 * Centralized configuration from environment variables
 */
export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000'),
  
  // Database
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nyxen',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // Gemini
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
  
  // Elastic
  elasticHost: process.env.ELASTIC_HOST || 'https://localhost:9200',
  elasticUsername: process.env.ELASTIC_USERNAME || 'elastic',
  elasticPassword: process.env.ELASTIC_PASSWORD || '',
  elasticIndexPrefix: process.env.ELASTIC_INDEX_PREFIX || 'nyxen',
  
  // Firebase
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  
  // Features
  enableElasticLogging: process.env.ENABLE_ELASTIC_LOGGING === 'true',
  enableGeminiAnalysis: process.env.ENABLE_GEMINI_ANALYSIS === 'true',
  enableAutonomousResponse: process.env.ENABLE_AUTONOMOUS_RESPONSE === 'true',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFormat: process.env.LOG_FORMAT || 'json',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

export default config
