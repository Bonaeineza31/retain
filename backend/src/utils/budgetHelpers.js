import Expense from "../models/Expense.js";

// from this percent of the budget spent, the status is "approaching"
const APPROACHING_PERCENT = 80;

// decides if the person is within, approaching or over the budget
export function getBudgetStatus(spent, budgetAmount) {
  if (spent > budgetAmount) return "over";
  if (spent * 100 >= budgetAmount * APPROACHING_PERCENT) return "approaching";
  return "within";
}

// adds up what a user spent in one month, like 2026-10
export async function getSpentInMonth(userId, month) {
  // dates are saved as text like 2026-10-14, so the whole month sits between these two
  const expenses = await Expense.find({
    userId,
    date: { $gte: `${month}-01`, $lte: `${month}-31` },
  });

  return expenses.reduce((total, expense) => total + expense.amount, 0);
}
