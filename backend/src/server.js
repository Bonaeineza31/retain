import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 4000

// Starts the server and waits for requests.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
