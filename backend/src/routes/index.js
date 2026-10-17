import { Router } from "express";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import expenseRoutes from "./expenseRoutes.js";

// the main router: every part of the API is added here
const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/expenses", expenseRoutes);

export default router;
