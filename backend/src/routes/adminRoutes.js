import { Router } from "express";
import { getInsights } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/insights", protect, adminOnly, getInsights);

export default router;
