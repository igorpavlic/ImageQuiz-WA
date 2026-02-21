import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const client = new MongoClient(process.env.MONGO_URI)
let db

const connectDB = async () => {
  try {
    await client.connect()
    db = client.db('image-quiz')
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  }
}

const getDB = () => db

export { connectDB, getDB }
