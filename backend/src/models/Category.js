import mongoose from "mongoose";

const { model, Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    // true for Uncategorized, the main category. it cannot be renamed or deleted
    isDefault: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    // saves when the category was created and last changed. no extra __v field
    timestamps: true,
    versionKey: false,
  },
);

// Export the model
const Category = model("Category", categorySchema);
export default Category;
