import mongoose from "mongoose";

const { model, Schema } = mongoose;

const expenseSchema = new Schema(
  {
    // the person who owns this expense
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    // in RWF, a whole number above zero
    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Amount must be a whole number",
      },
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // saved as text like 2026-10-14, so the frontend can compare dates easily
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "mobile money", "card", "bank transfer"],
    },
    notes: {
      type: String,
      required: false,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  {
    // saves when the expense was created and last changed. no extra __v field
    timestamps: true,
    versionKey: false,
  },
);

// Export the model
const Expense = model("Expense", expenseSchema);
export default Expense;
