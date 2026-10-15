import cors from 'cors'
import express from 'express'

const app = express()

// Only the frontend is allowed to call this API from a browser.
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))

// Lets the routes read JSON sent in the body of a request.
app.use(express.json())

// A simple route to check that the server is running.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Any address that no route above handled.
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

export default app
