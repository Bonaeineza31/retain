import { Router } from "express";
import {
  listNotifications,
  markAllRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, listNotifications);
router.put("/read", protect, markAllRead);

export default router;
