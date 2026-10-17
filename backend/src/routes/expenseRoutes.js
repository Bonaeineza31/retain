import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpense,
  listExpenses,
  updateExpense,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// every expense route needs a signed in user
router.get("/", protect, listExpenses);
router.post("/", protect, createExpense);
router.get("/:id", protect, getExpense);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

export default router;
