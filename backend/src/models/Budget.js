import mongoose from "mongoose";

const { model, Schema } = mongoose;

const budgetSchema = new Schema(
  {
    // the person who owns this budget
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // saved as text like 2026-10
    month: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/,
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
  },
  {
    // saves when the budget was created and last changed. no extra __v field
    timestamps: true,
    versionKey: false,
  },
);

// a user can only have one budget for each month
budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

// Export the model
const Budget = model("Budget", budgetSchema);
export default Budget;
