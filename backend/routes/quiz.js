import { Router } from 'express'
import Word from '../models/Word.js'
import User from '../models/User.js'
import { auth } from '../middleware/auth.js'

const router = Router()

// GET /api/quiz/words - Get all words (protected)
router.get('/words', auth, async (req, res) => {
  try {
    const words = await Word.find({}, 'word')
    res.json(words.map(w => w.word))
  } catch (err) {
    res.status(500).json({ error: 'Failed to load words.' })
  }
})

// PATCH /api/quiz/score - Update user score (protected)
router.patch('/score', auth, async (req, res) => {
  try {
    const { score } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { score },
      { new: true }
    )
    res.json({ score: user.score })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update score.' })
  }
})

// GET /api/quiz/score - Get current user score (protected)
router.get('/score', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, 'score')
    res.json({ score: user?.score || 0 })
  } catch (err) {
    res.status(500).json({ error: 'Failed to load score.' })
  }
})

export default router
