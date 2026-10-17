import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import mainRouter from "./routes/index.js";
import { addStartingCategories } from "./utils/seedCategories.js";

const app = express();
const PORT = process.env.PORT || 3000;

// only the frontend may call this API
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// lets us read the JSON that is sent to us
app.use(express.json());

// shows if the server and the database are working
app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.json({
    status: "ok",
    database: connected ? "connected" : "disconnected",
  });
});

// all the API routes
app.use("/api", mainRouter);

// nothing matched this address
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// connect to the database, add the starting categories, then start the server
async function start() {
  await connectDB();
  await addStartingCategories();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
