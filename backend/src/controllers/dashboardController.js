import Expense from "../models/Expense.js";
import {
  buildBudgetSummary,
  getExpensesInMonth,
} from "../utils/budgetHelpers.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import { validateBudgetMonth } from "../utils/validators.js";

// finds the most expensive expense in a list, or null when the list is empty
function findHighest(expenses) {
  let highest = null;
  for (const expense of expenses) {
    if (!highest || expense.amount > highest.amount) {
      highest = expense;
    }
  }
  return highest;
}

// adds up the spending of each category, biggest first
function totalsByCategory(expenses) {
  const totals = {};
  for (const expense of expenses) {
    const id = String(expense.categoryId);
    totals[id] = (totals[id] || 0) + expense.amount;
  }

  return Object.entries(totals)
    .map(([categoryId, total]) => ({ categoryId, total }))
    .sort((a, b) => b.total - a.total);
}

// gives everything the user dashboard shows for one month
export async function getDashboard(req, res) {
  const month = req.query.month;

  const monthError = validateBudgetMonth(month);
  if (monthError) {
    return sendError(res, "Please fix the errors", "VALIDATION_ERROR", 400, {
      month: monthError,
    });
  }

  try {
    const userId = req.user._id;
    const monthExpenses = await getExpensesInMonth(userId, month);

    // the latest expenses overall, not only from this month. newest first
    const recentExpenses = await Expense.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(5);

    sendSuccess(
      res,
      {
        summary: await buildBudgetSummary(userId, month),
        highestExpense: findHighest(monthExpenses),
        spendingByCategory: totalsByCategory(monthExpenses),
        recentExpenses,
      },
      "Dashboard loaded",
    );
  } catch (error) {
    console.error("Loading the dashboard failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}
