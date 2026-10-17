import mongoose from "mongoose";
import Category from "../models/Category.js";
import Expense, { paymentMethods } from "../models/Expense.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import {
  validateAmount,
  validateDate,
  validateNotes,
  validatePaymentMethod,
  validateTitle,
} from "../utils/validators.js";

// gives back the value only if it is plain text, so lists and objects in the address are ignored
function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

// checks what was sent to create or change an expense. gives a message for each wrong field
function checkBody(body) {
  const checks = {
    title: validateTitle(body.title),
    amount: validateAmount(body.amount),
    date: validateDate(body.date),
    paymentMethod: validatePaymentMethod(body.paymentMethod),
    notes: validateNotes(body.notes),
  };

  const errors = {};
  for (const [field, message] of Object.entries(checks)) {
    if (message) {
      errors[field] = message;
    }
  }

  if (typeof body.categoryId !== "string" || !body.categoryId) {
    errors.categoryId = "Please choose a category";
  } else if (!mongoose.isValidObjectId(body.categoryId)) {
    errors.categoryId = "Category is not valid";
  }

  return errors;
}

// turns what was sent into the data we save
function cleanBody(body) {
  return {
    title: body.title.trim(),
    amount: Number(body.amount),
    categoryId: body.categoryId,
    date: body.date,
    paymentMethod: body.paymentMethod,
    notes: typeof body.notes === "string" ? body.notes.trim() : "",
  };
}

// reads the search, filters, sorting and paging from the address, like ?search=rent&page=2
function readQuery(query, userId) {
  const errors = {};

  // only this user's expenses, always
  const filter = { userId };

  // search in the title and the notes. symbols are escaped so they are read as plain letters
  const search = text(query.search);
  if (search) {
    const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(safeSearch, "i");
    filter.$or = [{ title: pattern }, { notes: pattern }];
  }

  const categoryId = text(query.categoryId);
  if (categoryId) {
    if (mongoose.isValidObjectId(categoryId)) {
      filter.categoryId = categoryId;
    } else {
      errors.categoryId = "Category is not valid";
    }
  }

  const paymentMethod = text(query.paymentMethod);
  if (paymentMethod) {
    if (paymentMethods.includes(paymentMethod)) {
      filter.paymentMethod = paymentMethod;
    } else {
      errors.paymentMethod = "Payment method is not valid";
    }
  }

  // dates are saved as text like 2026-10-14, so they can be compared as text
  const dateFrom = text(query.dateFrom);
  const dateTo = text(query.dateTo);
  const dateShape = /^\d{4}-\d{2}-\d{2}$/;
  if (dateFrom && !dateShape.test(dateFrom)) {
    errors.dateFrom = "Date must be written like 2026-10-14";
  }
  if (dateTo && !dateShape.test(dateTo)) {
    errors.dateTo = "Date must be written like 2026-10-14";
  }
  if (dateFrom && !errors.dateFrom) {
    filter.date = { ...filter.date, $gte: dateFrom };
  }
  if (dateTo && !errors.dateTo) {
    filter.date = { ...filter.date, $lte: dateTo };
  }

  const minAmount = text(query.minAmount);
  const maxAmount = text(query.maxAmount);
  if (minAmount) {
    if (Number.isNaN(Number(minAmount)) || Number(minAmount) < 0) {
      errors.minAmount = "Minimum amount must be a number";
    } else {
      filter.amount = { ...filter.amount, $gte: Number(minAmount) };
    }
  }
  if (maxAmount) {
    if (Number.isNaN(Number(maxAmount)) || Number(maxAmount) < 0) {
      errors.maxAmount = "Maximum amount must be a number";
    } else {
      filter.amount = { ...filter.amount, $lte: Number(maxAmount) };
    }
  }

  // sorting: newest first unless asked otherwise
  const sortBy = text(query.sortBy) || "date";
  const sortOrder = text(query.sortOrder) || "desc";
  if (sortBy !== "date" && sortBy !== "amount") {
    errors.sortBy = "Sort by must be date or amount";
  }
  if (sortOrder !== "asc" && sortOrder !== "desc") {
    errors.sortOrder = "Sort order must be asc or desc";
  }
  const direction = sortOrder === "asc" ? 1 : -1;
  // when two expenses tie, the one added later counts as newer
  const sort =
    sortBy === "amount"
      ? { amount: direction, createdAt: -1 }
      : { date: direction, createdAt: direction };

  // paging: 10 per page unless asked otherwise, at most 100
  const page = text(query.page) ? Number(text(query.page)) : 1;
  const pageSize = text(query.pageSize) ? Number(text(query.pageSize)) : 10;
  if (!Number.isInteger(page) || page < 1) {
    errors.page = "Page must be a whole number from 1";
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    errors.pageSize = "Page size must be a whole number from 1 to 100";
  }

  return { errors, filter, sort, page, pageSize };
}

// gives back one page of the signed in user's expenses
export async function listExpenses(req, res) {
  const { errors, filter, sort, page, pageSize } = readQuery(
    req.query,
    req.user._id,
  );

  if (Object.keys(errors).length > 0) {
    return sendError(
      res,
      "Please fix the errors",
      "VALIDATION_ERROR",
      400,
      errors,
    );
  }

  try {
    const total = await Expense.countDocuments(filter);
    const items = await Expense.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    sendSuccess(res, { items, total, page, pageSize }, "Expenses loaded");
  } catch (error) {
    console.error("Listing expenses failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// gives back one expense, but only if it belongs to the signed in user
export async function getExpense(req, res) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return sendError(res, "Expense not found", "NOT_FOUND", 404);
  }

  try {
    const expense = await Expense.findOne({ _id: id, userId: req.user._id });
    if (!expense) {
      return sendError(res, "Expense not found", "NOT_FOUND", 404);
    }

    sendSuccess(res, expense, "Expense loaded");
  } catch (error) {
    console.error("Loading an expense failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// saves a new expense for the signed in user
export async function createExpense(req, res) {
  const body = req.body || {};

  const errors = checkBody(body);
  if (Object.keys(errors).length > 0) {
    return sendError(
      res,
      "Please fix the errors",
      "VALIDATION_ERROR",
      400,
      errors,
    );
  }

  try {
    const category = await Category.findById(body.categoryId);
    if (!category) {
      return sendError(res, "Please fix the errors", "VALIDATION_ERROR", 400, {
        categoryId: "Category does not exist",
      });
    }

    // the owner is always the signed in user, never something sent in the request
    const expense = await Expense.create({
      ...cleanBody(body),
      userId: req.user._id,
    });

    sendSuccess(res, expense, "Expense created", 201);
  } catch (error) {
    console.error("Creating an expense failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// changes an expense, but only if it belongs to the signed in user
export async function updateExpense(req, res) {
  const { id } = req.params;
  const body = req.body || {};

  if (!mongoose.isValidObjectId(id)) {
    return sendError(res, "Expense not found", "NOT_FOUND", 404);
  }

  const errors = checkBody(body);
  if (Object.keys(errors).length > 0) {
    return sendError(
      res,
      "Please fix the errors",
      "VALIDATION_ERROR",
      400,
      errors,
    );
  }

  try {
    const expense = await Expense.findOne({ _id: id, userId: req.user._id });
    if (!expense) {
      return sendError(res, "Expense not found", "NOT_FOUND", 404);
    }

    const category = await Category.findById(body.categoryId);
    if (!category) {
      return sendError(res, "Please fix the errors", "VALIDATION_ERROR", 400, {
        categoryId: "Category does not exist",
      });
    }

    expense.set(cleanBody(body));
    await expense.save();

    sendSuccess(res, expense, "Expense updated");
  } catch (error) {
    console.error("Updating an expense failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// deletes an expense, but only if it belongs to the signed in user
export async function deleteExpense(req, res) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return sendError(res, "Expense not found", "NOT_FOUND", 404);
  }

  try {
    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!expense) {
      return sendError(res, "Expense not found", "NOT_FOUND", 404);
    }

    sendSuccess(res, {}, "Expense deleted");
  } catch (error) {
    console.error("Deleting an expense failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}
