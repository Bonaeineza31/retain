import mongoose from "mongoose";
import Category from "../models/Category.js";
import Expense from "../models/Expense.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import { validateCategoryName } from "../utils/validators.js";

// checks if another category already has this name, ignoring capital letters
async function nameIsTaken(name, ignoreId) {
  const all = await Category.find();
  return all.some(
    (category) =>
      category._id.toString() !== ignoreId &&
      category.name.toLowerCase() === name.toLowerCase(),
  );
}

// gives back every category, the default one first, then A to Z
export async function listCategories(req, res) {
  try {
    const categories = await Category.find().sort({ isDefault: -1, name: 1 });
    sendSuccess(res, categories, "Categories loaded");
  } catch (error) {
    console.error("Listing categories failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// creates a new category (admin only)
export async function createCategory(req, res) {
  const { name } = req.body || {};

  const nameError = validateCategoryName(name);
  if (nameError) {
    return sendError(res, "Please fix the errors", "VALIDATION_ERROR", 400, {
      name: nameError,
    });
  }

  try {
    const cleanName = name.trim();

    if (await nameIsTaken(cleanName)) {
      return sendError(
        res,
        "A category with this name already exists",
        "CATEGORY_EXISTS",
        409,
      );
    }

    const category = await Category.create({ name: cleanName });
    sendSuccess(res, category, "Category created", 201);
  } catch (error) {
    console.error("Creating a category failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// changes the name of a category (admin only)
export async function renameCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body || {};

  if (!mongoose.isValidObjectId(id)) {
    return sendError(res, "Category not found", "NOT_FOUND", 404);
  }

  const nameError = validateCategoryName(name);
  if (nameError) {
    return sendError(res, "Please fix the errors", "VALIDATION_ERROR", 400, {
      name: nameError,
    });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return sendError(res, "Category not found", "NOT_FOUND", 404);
    }

    if (category.isDefault) {
      return sendError(
        res,
        "The default category cannot be renamed",
        "DEFAULT_CATEGORY",
        400,
      );
    }

    const cleanName = name.trim();

    // the category's own name does not count as taken
    if (await nameIsTaken(cleanName, id)) {
      return sendError(
        res,
        "A category with this name already exists",
        "CATEGORY_EXISTS",
        409,
      );
    }

    category.name = cleanName;
    await category.save();
    sendSuccess(res, category, "Category renamed");
  } catch (error) {
    console.error("Renaming a category failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// deletes a category and moves its expenses to the default category (admin only)
export async function deleteCategory(req, res) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return sendError(res, "Category not found", "NOT_FOUND", 404);
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return sendError(res, "Category not found", "NOT_FOUND", 404);
    }

    if (category.isDefault) {
      return sendError(
        res,
        "The default category cannot be deleted",
        "DEFAULT_CATEGORY",
        400,
      );
    }

    const defaultCategory = await Category.findOne({ isDefault: true });
    if (!defaultCategory) {
      return sendError(
        res,
        "There is no default category to move the expenses to",
        "SERVER_ERROR",
        500,
      );
    }

    // move the expenses first, so none of them is left without a category
    const moved = await Expense.updateMany(
      { categoryId: id },
      { categoryId: defaultCategory._id },
    );

    await category.deleteOne();

    sendSuccess(
      res,
      { movedExpenses: moved.modifiedCount },
      "Category deleted",
    );
  } catch (error) {
    console.error("Deleting a category failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}
