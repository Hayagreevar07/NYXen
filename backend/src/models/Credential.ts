import mongoose from 'mongoose'

/**
 * Credential Schema
 * Tracks user credentials and breach status
 */
const credentialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    // Service Info
    service: {
      type: String,
      required: true,
    },
    
    email: String,
    username: String,
    
    // Credential Status
    isExposed: {
      type: Boolean,
      default: false,
    },
    
    exposureDate: Date,
    breachName: String,
    
    // Security
    mfaEnabled: Boolean,
    passwordLastChanged: Date,
    passwordStrength: {
      type: String,
      enum: ['weak', 'fair', 'good', 'strong'],
    },
    
    // Recommendations
    recommendedActions: [String],
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Timestamp
    checkedAt: Date,
    
    // Elastic Integration
    elasticId: String,
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
credentialSchema.index({ userId: 1, isExposed: 1 })

export const Credential = mongoose.model('Credential', credentialSchema)
export default Credential
