import 'dotenv/config'
import cors from 'cors'
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

// only the frontend may call this API
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))

// read JSON sent in requests
app.use(express.json())

// check the server is up
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// no route matched
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
