import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { buildBudgetSummary } from "./budgetHelpers.js";

// 200000 -> "200,000 RWF"
function money(amount) {
  return amount.toLocaleString("en-US") + " RWF";
}

// "2026-10" -> "October 2026"
function monthName(month) {
  return new Date(`${month}-01T00:00:00Z`).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// a notification must never break what the person was doing, so a failure is only logged
async function safely(work) {
  try {
    await work();
  } catch (error) {
    console.error("Saving a notification failed:", error.message);
  }
}

// tells one person something
export function notifyUser(userId, type, message) {
  return safely(() => Notification.create({ userId, type, message }));
}

// tells every admin that a new person registered
export function notifyAdminsOfNewUser(newUser) {
  return safely(async () => {
    const admins = await User.find({ role: "admin" });
    const message = `New user registered: ${newUser.name} (${newUser.email})`;
    await Notification.insertMany(
      admins.map((admin) => ({
        userId: admin._id,
        type: "new_user",
        message,
      })),
    );
  });
}

// tells the person their budget was set or changed
export function notifyBudgetSet(userId, month, amount, wasChanged) {
  const what = wasChanged ? "changed to" : "set to";
  return notifyUser(
    userId,
    "budget_set",
    `Your budget for ${monthName(month)} was ${what} ${money(amount)}.`,
  );
}

// within is the best, then approaching, then over
const rank = { within: 0, approaching: 1, over: 2 };

// what the status of a month is now. "none" when there is no budget yet
export async function getStatusOf(userId, month) {
  const summary = await buildBudgetSummary(userId, month);
  return summary.budget ? summary.status : "none";
}

// warns the person when a month went from a better status to approaching or over
// "before" is what getStatusOf gave before the change
export function warnIfWorse(userId, month, before) {
  return safely(async () => {
    const summary = await buildBudgetSummary(userId, month);
    if (!summary.budget || summary.status === "within") {
      return;
    }
    // no warning when it was already this bad (or worse) before the change
    if (before !== "none" && rank[summary.status] <= rank[before]) {
      return;
    }

    const budgetAmount = summary.budget.amount;
    const name = monthName(month);
    if (summary.status === "over") {
      await notifyUser(
        userId,
        "budget_warning",
        `You are over your ${name} budget by ${money(-summary.remaining)}.`,
      );
    } else {
      const percent = Math.round((summary.spent * 100) / budgetAmount);
      await notifyUser(
        userId,
        "budget_warning",
        `You are approaching your ${name} budget: ${percent}% spent (${money(summary.spent)} of ${money(budgetAmount)}).`,
      );
    }
  });
}
