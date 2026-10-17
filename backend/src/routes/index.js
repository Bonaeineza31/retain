import { Router } from "express";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";

// the main router: every part of the API is added here
const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);

export default router;
