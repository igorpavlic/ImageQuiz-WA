import mongoose from 'mongoose'

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  }
}, { timestamps: true })

export default mongoose.model('Word', wordSchema)
