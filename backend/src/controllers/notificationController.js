import Notification from "../models/Notification.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";

// gives back the latest 20 notifications of the signed in user, and how many are unread
export async function listNotifications(req, res) {
  try {
    const items = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      read: false,
    });

    sendSuccess(res, { items, unreadCount }, "Notifications loaded");
  } catch (error) {
    console.error("Listing notifications failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// marks all the notifications of the signed in user as read
export async function markAllRead(req, res) {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true },
    );

    sendSuccess(res, {}, "Notifications marked as read");
  } catch (error) {
    console.error("Marking notifications as read failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}
