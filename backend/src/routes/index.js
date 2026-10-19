import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import budgetRoutes from "./budgetRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import expenseRoutes from "./expenseRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

// the main router: every part of the API is added here
const router = Router();

router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/budgets", budgetRoutes);
router.use("/categories", categoryRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/expenses", expenseRoutes);
router.use("/notifications", notificationRoutes);

export default router;
