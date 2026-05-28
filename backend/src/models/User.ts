import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

/**
 * User Schema
 * Stores user account information and authentication data
 */
const userSchema = new mongoose.Schema(
  {
    // Personal Info
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: String,
    lastName: String,
    
    // Authentication
    password: {
      type: String,
      required: true,
      select: false,
    },
    firebaseUid: String,
    
    // Subscription
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    subscription: {
      active: Boolean,
      startDate: Date,
      endDate: Date,
    },
    
    // Settings
    settings: {
      twoFactorEnabled: { type: Boolean, default: false },
      notificationsEnabled: { type: Boolean, default: true },
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    },
    
    // Risk Scores
    riskScore: { type: Number, default: 0, min: 0, max: 100 },
    identityScore: { type: Number, default: 100, min: 0, max: 100 },
    financialRiskScore: { type: Number, default: 0, min: 0, max: 100 },
    
    // Tracking
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as any)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (password: string) {
  return bcryptjs.compare(password, this.password)
}

// Exclude sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

export const User = mongoose.model('User', userSchema)
export default User
