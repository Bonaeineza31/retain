import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import mainRouter from "./routes/index.js";
import { sendError, sendSuccess } from "./utils/responseHandler.js";
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
  sendSuccess(
    res,
    { database: connected ? "connected" : "disconnected" },
    "Server is running",
  );
});

// all the API routes live in one main router
app.use("/api", mainRouter);

// nothing matched this address
app.use((req, res) => {
  sendError(res, "Route not found", "NOT_FOUND", 404);
});

// check the secret, connect to the database, add the starting categories, then start the server
async function start() {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing. Add it to your .env file.");
    process.exit(1);
  }

  await connectDB();
  await addStartingCategories();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
