import { Router } from "express";
import {
  getBudgetSummary,
  setBudget,
} from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/summary", protect, getBudgetSummary);
router.put("/", protect, setBudget);

export default router;
