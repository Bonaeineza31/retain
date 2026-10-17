import { Router } from "express";
import mongoose from "mongoose";
import { sendSuccess } from "../utils/responseHandler.js";
import authRoutes from "./authRoutes.js";

// the main router: every part of the API is added here
const router = Router();

// shows if the server and the database are working
router.get("/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  sendSuccess(
    res,
    { database: connected ? "connected" : "disconnected" },
    "Server is running",
  );
});

router.use("/auth", authRoutes);

export default router;
