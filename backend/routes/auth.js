import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getDB } from '../config/db.js'

const router = Router()

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    const db = getDB()

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })
    }

    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await db.collection('users').insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      score: 0,
      role: 'user',
      createdAt: new Date()
    })

    const token = jwt.sign(
      { id: result.insertedId.toString(), email: email.toLowerCase(), role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: { id: result.insertedId.toString(), email: email.toLowerCase(), role: 'user', score: 0 }
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Registration failed.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const db = getDB()

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' })
    }

    const user = await db.collection('users').findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user._id.toString(), email: user.email, role: user.role, score: user.score }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed.' })
  }
})

export default router
