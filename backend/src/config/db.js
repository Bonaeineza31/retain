import mongoose from 'mongoose'

// connect to MongoDB, or stop with a clear message
export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('MONGODB_URI is missing. Add it to your .env file.')
    process.exit(1)
  }

  try {
    // give up after 10 seconds instead of the default 30
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Could not connect to MongoDB:', error.message)
    process.exit(1)
  }
}
