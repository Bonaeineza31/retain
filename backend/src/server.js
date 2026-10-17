import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'

const app = express()
const PORT = process.env.PORT || 3000

// only the frontend may call this API
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))

// read JSON sent in requests
app.use(express.json())

// check the server and database are up
app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1
  res.json({ status: 'ok', database: connected ? 'connected' : 'disconnected' })
})

// no route matched
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// connect to the database first, then start listening
async function start() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
