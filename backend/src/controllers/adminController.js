import Category from "../models/Category.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";

// adds up the amounts of a list of expenses
function sumAmounts(expenses) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// for each category, counts its expenses and adds up the money
function buildCategoryStats(categories, expenses) {
  return categories.map((category) => {
    const used = expenses.filter(
      (expense) => String(expense.categoryId) === String(category._id),
    );
    return {
      categoryId: category._id,
      name: category.name,
      count: used.length,
      total: sumAmounts(used),
    };
  });
}

// gives the numbers for the admin dashboard
export async function getInsights(req, res) {
  try {
    const allUsers = await User.find();
    const expenses = await Expense.find();
    const categories = await Category.find();

    // "registered users" means normal accounts, so admins are left out
    const normalUsers = allUsers.filter((user) => user.role === "user");

    // this month, like 2026-10
    const thisMonth = new Date().toISOString().slice(0, 7);

    const stats = buildCategoryStats(categories, expenses);

    // most used first. when two are tied, the one with more money comes first
    const mostUsedFirst = [...stats].sort(
      (a, b) => b.count - a.count || b.total - a.total,
    );
    const leastUsedFirst = [...stats].sort(
      (a, b) => a.count - b.count || a.total - b.total,
    );

    // the person's name goes next to each recent expense
    const userNames = {};
    for (const user of allUsers) {
      userNames[String(user._id)] = user.name;
    }
    const recentExpenses = [...expenses]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((expense) => ({
        ...expense.toObject(),
        userName: userNames[String(expense.userId)] || "Unknown user",
      }));

    const recentUsers = [...normalUsers]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    sendSuccess(
      res,
      {
        totalUsers: normalUsers.length,
        totalExpenses: expenses.length,
        totalValue: sumAmounts(expenses),
        expensesThisMonth: expenses.filter((expense) =>
          expense.date.startsWith(thisMonth),
        ).length,
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
