import { Router } from "express";
import {
  getInsights,
  listAllExpenses,
  listUsers,
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/insights", protect, adminOnly, getInsights);
router.get("/users", protect, adminOnly, listUsers);
router.get("/expenses", protect, adminOnly, listAllExpenses);

export default router;
