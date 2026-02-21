import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { getDB } from '../config/db.js'
import { auth } from '../middleware/auth.js'

const router = Router()

// GET /api/quiz/words - Get all words (protected)
router.get('/words', auth, async (req, res) => {
  try {
    const db = getDB()
    const words = await db.collection('words').find({}).toArray()
    res.json(words.map(w => w.word))
  } catch (err) {
    res.status(500).json({ error: 'Failed to load words.' })
  }
})

// GET /api/quiz/score - Get current user score (protected)
router.get('/score', auth, async (req, res) => {
  try {
    const db = getDB()
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.id) })
    res.json({ score: user?.score || 0 })
  } catch (err) {
    res.status(500).json({ error: 'Failed to load score.' })
  }
})

// PATCH /api/quiz/score - Update user score (protected)
router.patch('/score', auth, async (req, res) => {
  try {
    const { score } = req.body
    const db = getDB()
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { score } }
    )
    res.json({ score })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update score.' })
  }
})

export default router
