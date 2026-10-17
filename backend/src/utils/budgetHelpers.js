import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";

// from this percent of the budget spent, the status is "approaching"
const APPROACHING_PERCENT = 80;

// decides if the person is within, approaching or over the budget
export function getBudgetStatus(spent, budgetAmount) {
  if (spent > budgetAmount) return "over";
  if (spent * 100 >= budgetAmount * APPROACHING_PERCENT) return "approaching";
  return "within";
}

// gets what a user spent in one month, like 2026-10
export async function getExpensesInMonth(userId, month) {
  // dates are saved as text like 2026-10-14, so the whole month sits between these two
  return Expense.find({
    userId,
    date: { $gte: `${month}-01`, $lte: `${month}-31` },
  });
}

// builds the budget summary of a month: the budget, what was spent, what is left, the status
export async function buildBudgetSummary(userId, month) {
  const budget = await Budget.findOne({ userId, month });
  const expenses = await getExpensesInMonth(userId, month);
  const spent = expenses.reduce((total, expense) => total + expense.amount, 0);

  // no budget set yet for this month
  if (!budget) {
    return { budget: null, spent, remaining: 0, status: "within" };
  }

  return {
    budget,
    spent,
    remaining: budget.amount - spent,
    status: getBudgetStatus(spent, budget.amount),
  };
}
