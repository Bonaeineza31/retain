import mongoose from "mongoose";
import Category from "../models/Category.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";

// adds up the amounts of a list of expenses
function sumAmounts(expenses) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// for every category, counts its expenses and adds up the money. the database does the counting.
// a category nobody used still gets a line, with 0
async function buildCategoryStats() {
  const categories = await Category.find();

  // "group" puts the expenses of each category together, then counts and adds them up
  const groups = await Expense.aggregate([
    {
      $group: {
        _id: "$categoryId",
        count: { $sum: 1 },
        total: { $sum: "$amount" },
      },
    },
  ]);

  const byCategory = {};
  for (const group of groups) {
    byCategory[String(group._id)] = group;
  }

  return categories.map((category) => {
    const group = byCategory[String(category._id)];
    return {
      categoryId: category._id,
      name: category.name,
      count: group ? group.count : 0,
      total: group ? group.total : 0,
    };
  });
}

// gives the numbers for the admin dashboard
export async function getInsights(req, res) {
  try {
    // this month, like 2026-10. dates are saved as text like 2026-10-14
    const thisMonth = new Date().toISOString().slice(0, 7);

    // "registered users" means normal accounts, so admins are left out
    const totalUsers = await User.countDocuments({ role: "user" });

    const totalExpenses = await Expense.countDocuments();
    const [sum] = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const expensesThisMonth = await Expense.countDocuments({
      date: { $gte: `${thisMonth}-01`, $lte: `${thisMonth}-31` },
    });

    const stats = await buildCategoryStats();

    // most used first. when two are tied, the one with more money comes first
    const mostUsedFirst = [...stats].sort(
      (a, b) => b.count - a.count || b.total - a.total,
    );
    const leastUsedFirst = [...stats].sort(
      (a, b) => a.count - b.count || a.total - b.total,
    );

    // only the 5 newest are fetched. the person's name goes next to each expense
    const newestExpenses = await Expense.find().sort({ createdAt: -1 }).limit(5);
    const owners = await User.find({
      _id: { $in: newestExpenses.map((expense) => expense.userId) },
    });
    const userNames = {};
    for (const owner of owners) {
      userNames[String(owner._id)] = owner.name;
    }
    const recentExpenses = newestExpenses.map((expense) => ({
      ...expense.toObject(),
      userName: userNames[String(expense.userId)] || "Unknown user",
    }));

    const recentUsers = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(5);

    sendSuccess(
      res,
      {
        totalUsers,
        totalExpenses,
        totalValue: sum ? sum.total : 0,
        expensesThisMonth,
        spendingPerCategory: [...stats].sort((a, b) => b.total - a.total),
        topCategories: mostUsedFirst.slice(0, 5),
        bottomCategories: leastUsedFirst.slice(0, 5),
        recentExpenses,
        recentUsers,
      },
      "Insights loaded",
    );
  } catch (error) {
    console.error("Loading the insights failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// reads the page number from the address, like ?page=2. 10 on each page
function readPage(query) {
  const page = typeof query.page === "string" && query.page ? Number(query.page) : 1;
  if (!Number.isInteger(page) || page < 1) {
    return { error: "Page must be a whole number from 1" };
  }
  return { page, pageSize: 10 };
}

// turns the search words into something safe to look for. symbols are read as plain letters
function searchPattern(value) {
  const search = typeof value === "string" ? value.trim() : "";
  if (!search) {
    return null;
  }
  return new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

// gives back one page of the registered users, with how many expenses each has made
export async function listUsers(req, res) {
  const { page, pageSize, error } = readPage(req.query);
  if (error) {
    return sendError(res, "Please fix the errors", "VALIDATION_ERROR", 400, {
      page: error,
    });
  }

  try {
    // admins are left out, like in the insights
    const filter = { role: "user" };
    const pattern = searchPattern(req.query.search);
    if (pattern) {
      filter.$or = [{ name: pattern }, { email: pattern }];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const expenses = await Expense.find({
      userId: { $in: users.map((user) => user._id) },
    });

    const items = users.map((user) => {
      const own = expenses.filter(
        (expense) => String(expense.userId) === String(user._id),
      );
      return {
        ...user.toObject(),
        expenseCount: own.length,
        totalSpent: sumAmounts(own),
      };
    });

    sendSuccess(res, { items, total, page, pageSize }, "Users loaded");
  } catch (error) {
    console.error("Listing users failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// gives back one page of the expenses of all users, newest first
export async function listAllExpenses(req, res) {
  const { page, pageSize, error } = readPage(req.query);
  const errors = {};
  if (error) {
    errors.page = error;
  }

  const filter = {};
  const pattern = searchPattern(req.query.search);
  if (pattern) {
    filter.$or = [{ title: pattern }, { notes: pattern }];
  }

  const categoryId = req.query.categoryId;
  if (typeof categoryId === "string" && categoryId) {
    if (mongoose.isValidObjectId(categoryId)) {
      filter.categoryId = categoryId;
    } else {
      errors.categoryId = "Category is not valid";
    }
  }

  if (Object.keys(errors).length > 0) {
    return sendError(res, "Please fix the errors", "VALIDATION_ERROR", 400, errors);
  }

  try {
    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    // the person's name goes next to each expense
    const users = await User.find({
      _id: { $in: expenses.map((expense) => expense.userId) },
    });
    const userNames = {};
    for (const user of users) {
      userNames[String(user._id)] = user.name;
    }

    const items = expenses.map((expense) => ({
      ...expense.toObject(),
      userName: userNames[String(expense.userId)] || "Unknown user",
    }));

    sendSuccess(res, { items, total, page, pageSize }, "Expenses loaded");
  } catch (error) {
    console.error("Listing all expenses failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}
