import mongoose from 'mongoose'

/**
 * Financial Transaction Schema
 * Tracks user financial activities
 */
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    // Transaction Details
    amount: {
      type: Number,
      required: true,
    },
    
    currency: {
      type: String,
      default: 'USD',
    },
    
    category: {
      type: String,
      enum: [
        'groceries',
        'dining',
        'entertainment',
        'transportation',
        'shopping',
        'subscription',
        'utilities',
        'health',
        'education',
        'other',
      ],
    },
    
    merchant: String,
    description: String,
    
    // Transaction Metadata
    transactionDate: {
      type: Date,
      required: true,
      index: true,
    },
    
    transactionType: {
      type: String,
      enum: ['debit', 'credit', 'transfer'],
      required: true,
    },
    
    // Risk Analysis
    flagged: {
      type: Boolean,
      default: false,
    },
    
    anomalyScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    
    riskFactors: [String],
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
transactionSchema.index({ userId: 1, transactionDate: -1 })

export const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction
