import Budget from "../models/Budget.js";
import { buildBudgetSummary } from "../utils/budgetHelpers.js";
import {
  getStatusOf,
  notifyBudgetSet,
  warnIfWorse,
} from "../utils/notify.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import {
  validateBudgetAmount,
  validateBudgetMonth,
} from "../utils/validators.js";

// gives the budget of a month, how much was spent, what is left, and the status
export async function getBudgetSummary(req, res) {
  const month = req.query.month;

  const monthError = validateBudgetMonth(month);
  if (monthError) {
    return sendError(res, "Please fix the errors", "VALIDATION_ERROR", 400, {
      month: monthError,
    });
  }

  try {
    const summary = await buildBudgetSummary(req.user._id, month);
    sendSuccess(res, summary, "Budget summary loaded");
  } catch (error) {
    console.error("Loading the budget summary failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// sets the budget of a month. it creates it, or changes it if it already exists
export async function setBudget(req, res) {
  const { month, amount } = req.body || {};

  const errors = {};
  const monthError = validateBudgetMonth(month);
  const amountError = validateBudgetAmount(amount);
  if (monthError) errors.month = monthError;
  if (amountError) errors.amount = amountError;

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
    // each user has one budget per month
    const existing = await Budget.findOne({ userId: req.user._id, month });
    // how the month looked before this change, to know if it got worse
    const before = await getStatusOf(req.user._id, month);

    if (existing) {
      existing.amount = Number(amount);
      await existing.save();
      await notifyBudgetSet(req.user._id, month, existing.amount, true);
      await warnIfWorse(req.user._id, month, before);
      return sendSuccess(res, existing, "Budget updated");
    }

    const budget = await Budget.create({
      userId: req.user._id,
      month,
      amount: Number(amount),
    });
    await notifyBudgetSet(req.user._id, month, budget.amount, false);
    await warnIfWorse(req.user._id, month, before);
    sendSuccess(res, budget, "Budget created", 201);
  } catch (error) {
    console.error("Setting the budget failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}
