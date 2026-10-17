import { paymentMethods } from "../models/Expense.js";

// each check gives back a message when something is wrong, or null when it is fine
// anything that is not plain text (a list, an object) is refused straight away

// checks the email looks right: one @, a proper domain and no spaces
export function validateEmail(value) {
  if (typeof value !== "string") return "Email is required";
  const email = value.trim();

  if (!email) return "Email is required";
  if (email.length > 254) return "Email is too long";
  if (/\s/.test(email)) return "Email cannot contain spaces";

  const parts = email.split("@");
  if (parts.length < 2) return "Email must contain an @";
  if (parts.length > 2) return "Email can only contain one @";

  const [local, domain] = parts;
  if (!local) return "Email is missing the part before the @";
  if (local.length > 64) return "The part before the @ is too long";
  if (!domain) return "Email is missing the domain after the @";

  if (local.startsWith(".") || local.endsWith(".")) {
    return "Email cannot start or end with a dot before the @";
  }
  if (email.includes("..")) return "Email cannot contain two dots in a row";
  if (!/^[A-Za-z0-9._%+-]+$/.test(local)) {
    return "Email contains a character that is not allowed";
  }

  if (!domain.includes(".")) {
    return "Email domain must contain a dot, like gmail.com";
  }
  const labels = domain.split(".");
  for (const label of labels) {
    if (!label) return "Email domain is not valid";
    if (!/^[A-Za-z0-9-]+$/.test(label)) return "Email domain is not valid";
    if (label.startsWith("-") || label.endsWith("-")) {
      return "Email domain is not valid";
    }
  }
  const ending = labels[labels.length - 1];
  if (ending.length < 2 || /\d/.test(ending)) {
    return "Email must end with a valid domain like .com or .rw";
  }

  return null;
}

// checks the password is long enough and has a letter and a number
export function validatePassword(value) {
  if (typeof value !== "string" || !value) return "Password is required";

  if (value.length < 8) return "Password must be at least 8 characters";
  if (value.length > 64) return "Password must be 64 characters or fewer";
  if (/\s/.test(value)) return "Password cannot contain spaces";
  if (!/[A-Za-z]/.test(value)) return "Password needs at least one letter";
  if (!/\d/.test(value)) return "Password needs at least one number";
  return null;
}

// checks the name is made of letters and is not too short or long
export function validateName(value) {
  if (typeof value !== "string") return "Name is required";
  const name = value.trim();

  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name must be 50 characters or fewer";
  if (!/^\p{L}[\p{L}\s'.-]*$/u.test(name)) {
    return "Name can only contain letters, spaces, apostrophes, dots and hyphens";
  }
  return null;
}

// checks the category name is not empty and not too short or long
export function validateCategoryName(value) {
  if (typeof value !== "string") return "Category name is required";
  const name = value.trim();

  if (!name) return "Category name is required";
  if (name.length < 2) return "Category name must be at least 2 characters";
  if (name.length > 30) return "Category name must be 30 characters or fewer";
  return null;
}

// checks the expense title is not empty and not too long
export function validateTitle(value) {
  if (typeof value !== "string") return "Title is required";
  const title = value.trim();

  if (!title) return "Title is required";
  if (title.length < 2) return "Title must be at least 2 characters";
  if (title.length > 80) return "Title must be 80 characters or fewer";
  return null;
}

// checks the amount is a whole number of RWF above zero
export function validateAmount(value) {
  if (typeof value !== "number" && typeof value !== "string") {
    return "Amount is required";
  }
  if (String(value).trim() === "") return "Amount is required";

  const amount = Number(value);
  if (Number.isNaN(amount)) return "Amount must be a number";
  if (amount <= 0) return "Amount must be greater than 0";
  if (!Number.isInteger(amount)) return "Amount must be a whole number of RWF";
  if (amount > 1000000000) return "Amount is too large";
  return null;
}

// checks the date is real, written like 2026-10-14, and not in the future
export function validateDate(value) {
  if (typeof value !== "string" || !value) return "Date is required";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Date must be written like 2026-10-14";
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  if (!isRealDate) return "That date does not exist";

  if (year < 2000) return "Date is too far in the past";

  // one extra day is allowed, because in other time zones it can already be tomorrow
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  if (value > tomorrow) return "Date cannot be in the future";
  return null;
}

// checks a payment method was picked and it is one we know
export function validatePaymentMethod(value) {
  if (typeof value !== "string" || !value) return "Payment method is required";
  if (!paymentMethods.includes(value)) return "Payment method is not valid";
  return null;
}

// checks the notes are not too long. notes are optional
export function validateNotes(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return "Notes must be text";
  if (value.length > 300) return "Notes must be 300 characters or fewer";
  return null;
}

// checks the month is written like 2026-10, with a month from 01 to 12
export function validateBudgetMonth(value) {
  if (typeof value !== "string" || !value) return "Month is required";
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    return "Month must be written like 2026-10";
  }
  return null;
}

// checks the budget is a whole number of RWF above zero
export function validateBudgetAmount(value) {
  if (typeof value !== "number" && typeof value !== "string") {
    return "Budget amount is required";
  }
  if (String(value).trim() === "") return "Budget amount is required";

  const amount = Number(value);
  if (Number.isNaN(amount)) return "Budget must be a number";
  if (amount <= 0) return "Budget must be greater than 0";
  if (!Number.isInteger(amount)) return "Budget must be a whole number of RWF";
  if (amount > 1000000000) return "Budget is too large";
  return null;
}
