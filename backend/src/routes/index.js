import { Router } from "express";
import authRoutes from "./authRoutes.js";

// the main router: every area of the API is added here
const router = Router();

router.use("/auth", authRoutes);

export default router;
