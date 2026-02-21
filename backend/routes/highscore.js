import { Router } from 'express'
import User from '../models/User.js'

const router = Router()

// GET /api/highscore - Get top 10 players (public)
router.get('/', async (req, res) => {
  try {
    const topPlayers = await User.find({}, 'email score')
      .sort({ score: -1 })
      .limit(10)

    res.json(topPlayers.map(p => ({
      id: p._id,
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
    const user = await User.findById(req.params.userId, 'score email')
    if (!user) return res.status(404).json({ error: 'User not found.' })

    const rank = await User.countDocuments({ score: { $gt: user.score } }) + 1

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
