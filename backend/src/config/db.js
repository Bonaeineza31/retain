import mongoose from "mongoose";

// connects to MongoDB
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is missing. Add it to your .env file.");
    process.exit(1);
  }

  try {
    // stop trying after 10 seconds (the normal wait is 30)
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}
