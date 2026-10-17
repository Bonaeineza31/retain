import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  listCategories,
  renameCategory,
} from "../controllers/categoryController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

// anyone signed in can read the categories
router.get("/", protect, listCategories);

// only admins can change them
router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, renameCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
