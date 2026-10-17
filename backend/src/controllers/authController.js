import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { publicUser } from "../utils/publicUser.js";
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
    return res.status(400).json({ message: "Please fix the errors", errors });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
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

    res.status(201).json(result);
  } catch (error) {
    console.error("Register failed:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
}
