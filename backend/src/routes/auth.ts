/**
 * Auth Routes
 * POST /api/auth/login — Authenticate user and return JWT token
 */

import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import ENV from '../config/env';

const router = Router();

// Demo users with pre-hashed passwords
const DEMO_USERS = [
  {
    id: 'user-001',
    username: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 10),
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@mbook.ai',
    role: 'Admin',
  },
  {
    id: 'user-002',
    username: 'engineer',
    passwordHash: bcrypt.hashSync('eng123', 10),
    name: 'Vikram Reddy',
    email: 'vikram.reddy@mbook.ai',
    role: 'Engineer',
  },
  {
    id: 'user-003',
    username: 'auditor',
    passwordHash: bcrypt.hashSync('audit123', 10),
    name: 'Meera Nair',
    email: 'meera.nair@mbook.ai',
    role: 'Auditor',
  },
];

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: { token, user }
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    const user = DEMO_USERS.find((u) => u.username === username);
    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRY as any }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
