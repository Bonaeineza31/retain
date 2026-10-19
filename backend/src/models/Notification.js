import mongoose from "mongoose";

const { model, Schema } = mongoose;

const notificationSchema = new Schema(
  {
    // the person who sees this notification
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["new_user", "budget_set", "budget_warning"],
    },
    message: {
      type: String,
      required: true,
    },
    // false until the person marks their notifications as read
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    // saves when the notification was made. no extra __v field
    timestamps: true,
    versionKey: false,
  },
);

// finding the latest notifications of one person is the main use
notificationSchema.index({ userId: 1, createdAt: -1 });

// Export the model
const Notification = model("Notification", notificationSchema);
export default Notification;
