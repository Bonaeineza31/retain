import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { publicUser } from "../utils/publicUser.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validators.js";

// creates a new account
export async function register(req, res) {
  const { name, email, password } = req.body || {};

  // check what was sent, and collect a message for each field that is wrong
  const errors = {};
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (nameError) errors.name = nameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

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
    const cleanEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return sendError(
        res,
        "An account with this email already exists",
        "EMAIL_TAKEN",
        409,
      );
    }

    // scramble the password. 10 is how much work the scrambling does
    const hashedPassword = await bcrypt.hash(password, 10);

    // the role is never taken from the request, so nobody can make themselves admin
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
    });

    const result = publicUser(user);

    // for testing only: shows the scrambled password when this is set in .env
    if (process.env.SHOW_HASH_IN_RESPONSE === "true") {
      result.passwordHash = hashedPassword;
    }

    sendSuccess(res, result, "Account created", 201);
  } catch (error) {
    console.error("Register failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}
