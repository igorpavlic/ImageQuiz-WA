import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { getDB } from '../config/db.js'
import { auth, adminOnly } from '../middleware/auth.js'

const router = Router()

// POST /api/admin/words - Add words (admin only)
router.post('/words', auth, adminOnly, async (req, res) => {
  try {
    const { words } = req.body
    const db = getDB()

    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ error: 'Words array is required.' })
    }

    const wordDocs = [...new Set(
      words.map(w => w.toLowerCase().trim()).filter(w => w.length > 1)
    )].map(w => ({ word: w, createdAt: new Date() }))

    const result = await db.collection('words').insertMany(wordDocs)
    res.status(201).json({ added: result.insertedCount })
  } catch (err) {
    console.error('Error adding words:', err)
    res.status(500).json({ error: 'Failed to add words.' })
  }
})

// GET /api/admin/words - List all words (admin only)
router.get('/words', auth, adminOnly, async (req, res) => {
  try {
    const db = getDB()
    const words = await db.collection('words').find({}).sort({ createdAt: -1 }).toArray()
    res.json(words.map(w => ({ id: w._id.toString(), word: w.word })))
  } catch (err) {
    res.status(500).json({ error: 'Failed to load words.' })
  }
})

// DELETE /api/admin/words/:id - Delete a word (admin only)
router.delete('/words/:id', auth, adminOnly, async (req, res) => {
  try {
    const db = getDB()
    await db.collection('words').deleteOne({ _id: new ObjectId(req.params.id) })
    res.json({ message: 'Word deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete word.' })
  }
})

export default router
