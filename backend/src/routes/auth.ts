import { Router, Request, Response } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import User from '../models/User.js'
import { createToken } from '../utils/jwt.js'
import logger from '../utils/logger.js'

const router = Router()

/**
 * Register Route
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Create user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
    })

    await user.save()

    // Create JWT token
    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
    })

    logger.info('User registered successfully', { email })

    res.status(201).json({
      user: user.toJSON(),
      token,
    })
  } catch (error) {
    logger.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

/**
 * Login Route
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    // Find user
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Compare password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Create JWT token
    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
    })

    logger.info('User logged in', { email })

    res.json({
      user: user.toJSON(),
      token,
    })
  } catch (error) {
    logger.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

/**
 * Get Current User
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user.toJSON())
  } catch (error) {
    logger.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
})

/**
 * Logout Route
 */
router.post('/logout', authMiddleware, (req: Request, res: Response) => {
  // JWT is stateless, but we can blacklist tokens if needed
  logger.info('User logged out', { userId: req.userId })
  res.json({ message: 'Logged out successfully' })
})

export default router
