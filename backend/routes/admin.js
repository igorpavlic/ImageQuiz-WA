import { Router } from 'express'
import Word from '../models/Word.js'
import { auth, adminOnly } from '../middleware/auth.js'

const router = Router()

// POST /api/admin/words - Add words (admin only)
router.post('/words', auth, adminOnly, async (req, res) => {
  try {
    const { words } = req.body

    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Words array is required.' })
    }

    const wordDocs = words
      .map(w => w.toLowerCase().trim())
      .filter(w => w.length > 1)
      .map(w => ({ word: w }))

    // Remove duplicates
    const uniqueWords = [...new Map(wordDocs.map(w => [w.word, w])).values()]

    const inserted = await Word.insertMany(uniqueWords, { ordered: false })
    res.status(201).json({ added: inserted.length })
  } catch (err) {
    // Handle duplicate key errors gracefully
    if (err.code === 11000) {
      res.json({ added: err.insertedDocs?.length || 0, message: 'Some words already existed.' })
    } else {
      res.status(500).json({ error: 'Failed to add words.' })
    }
  }
})

// GET /api/admin/words - List all words (admin only)
router.get('/words', auth, adminOnly, async (req, res) => {
  try {
    const words = await Word.find({}).sort({ createdAt: -1 })
    res.json(words)
  } catch (err) {
    res.status(500).json({ error: 'Failed to load words.' })
  }
})

// DELETE /api/admin/words/:id - Delete a word (admin only)
router.delete('/words/:id', auth, adminOnly, async (req, res) => {
  try {
    await Word.findByIdAndDelete(req.params.id)
    res.json({ message: 'Word deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete word.' })
  }
})

export default router
