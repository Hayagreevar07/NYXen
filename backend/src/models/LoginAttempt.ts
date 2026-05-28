import mongoose from 'mongoose'

/**
 * Login Attempt Schema
 * Tracks user login attempts for anomaly detection
 */
const loginAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    // Login Details
    email: {
      type: String,
      required: true,
    },
    
    success: {
      type: Boolean,
      required: true,
      default: false,
    },
    
    password: {
      type: String,
      required: true,
    },
    
    // Device & Location Info
    ipAddress: {
      type: String,
      required: true,
    },
    
    userAgent: String,
    
    deviceInfo: {
      type: String,
      browser: String,
      os: String,
      device: String,
    },
    
    geoLocation: {
      country: String,
      state: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
    
    // Anomaly Detection
    isAnomalous: {
      type: Boolean,
      default: false,
    },
    
    anomalyScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    
    anomalyReasons: [String],
    
    // Threat Assessment
    threatLevel: {
      type: String,
      enum: ['safe', 'low', 'medium', 'high', 'critical'],
      default: 'safe',
    },
    
    isSuspicious: Boolean,
    
    // Timestamp
    attemptAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    
    // Elastic Integration
    elasticId: String,
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
loginAttemptSchema.index({ userId: 1, attemptAt: -1 })
loginAttemptSchema.index({ ipAddress: 1 })

export const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema)
export default LoginAttempt
