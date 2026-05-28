import mongoose from 'mongoose'

/**
 * Threat Schema
 * Tracks detected security threats
 */
const threatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    // Threat Details
    type: {
      type: String,
      enum: [
        'phishing',
        'account_takeover',
        'financial_fraud',
        'credential_leak',
        'suspicious_login',
        'device_anomaly',
        'behavioral_drift',
        'identity_theft',
        'subscription_leak',
        'impersonation',
      ],
      required: true,
      index: true,
    },
    
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      required: true,
      index: true,
    },
    
    description: String,
    details: mongoose.Schema.Types.Mixed,
    
    // Detection
    detectedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    
    // AI Analysis
    gemminiAnalysis: {
      reasoning: String,
      predictedImpact: String,
      recommendedActions: [String],
      alternativeExplanations: [String],
    },
    
    // Response
    status: {
      type: String,
      enum: ['detected', 'acknowledged', 'resolved', 'false_positive'],
      default: 'detected',
      index: true,
    },
    
    resolvedAt: Date,
    resolvedBy: String,
    
    // Correlation
    correlatedThreats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Threat',
      },
    ],
    
    // Evidence
    evidence: {
      ipAddresses: [String],
      devices: [String],
      locations: [String],
      behaviors: [String],
    },
    
    // Elastic Integration
    elasticId: String,
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
threatSchema.index({ userId: 1, createdAt: -1 })
threatSchema.index({ severity: 1, status: 1 })

export const Threat = mongoose.model('Threat', threatSchema)
export default Threat
