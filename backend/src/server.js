import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import mainRouter from "./routes/index.js";
import { sendError } from "./utils/responseHandler.js";
import { addStartingCategories } from "./utils/seedCategories.js";

const app = express();
const PORT = process.env.PORT || 3000;

// only the frontend may call this API
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// lets us read the JSON that is sent to us
app.use(express.json());

// all the API routes live in one main router
app.use("/api", mainRouter);

// nothing matched this address
app.use((req, res) => {
  sendError(res, "Route not found", "NOT_FOUND", 404);
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
