import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { getDB } from '../config/db.js'

const router = Router()

// GET /api/highscore - Get top 10 players (public)
router.get('/', async (req, res) => {
  try {
    const db = getDB()
    const topPlayers = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .sort({ score: -1 })
      .limit(10)
      .toArray()

    res.json(topPlayers.map(p => ({
      id: p._id.toString(),
      email: p.email,
      score: p.score
    })))
  } catch (err) {
    res.status(500).json({ error: 'Failed to load highscores.' })
  }
})

// GET /api/highscore/rank/:userId - Get user rank (public)
router.get('/rank/:userId', async (req, res) => {
  try {
    const db = getDB()
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.userId) })
    if (!user) return res.status(404).json({ error: 'User not found.' })

    const rank = await db.collection('users').countDocuments({ score: { $gt: user.score } }) + 1

    res.json({
      rank,
      email: user.email,
      score: user.score
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to get rank.' })
  }
})

export default router
