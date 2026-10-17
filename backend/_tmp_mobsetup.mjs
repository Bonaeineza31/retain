// temporary: creates test data for the mobile check, or removes it afterwards
import "dotenv/config";
import fs from "node:fs";
import mongoose from "mongoose";
import Budget from "./src/models/Budget.js";
import Category from "./src/models/Category.js";
import Expense from "./src/models/Expense.js";
import User from "./src/models/User.js";
import { generateToken } from "./src/utils/generateToken.js";

const file = process.argv[3];
await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

if (process.argv[2] === "setup") {
  const tag = "retaintest" + Date.now();
  // write the tag first, so the cleanup can always find what was made, even if this stops halfway
  fs.writeFileSync(file, JSON.stringify({ tag }));
  const short = tag.slice(-6);
  const user = await User.create({ name: "Test Aline Uwase", email: `${tag}@example.com`, password: "x".repeat(60) });
  const admin = await User.create({ name: "Test Admin With A Long Name", email: `${tag}adm@example.com`, password: "x".repeat(60), role: "admin" });
  const cats = {};
  for (const c of await Category.find()) cats[c.name] = c._id;
  const longCat = await Category.create({ name: ("ZZ test " + short + " long category name").slice(0, 30) });
  const month = new Date().toISOString().slice(0, 7);
  const rows = [
    ["Monthly rent for the apartment in Kimironko near the big market", 150000, "Rent", "01", "bank transfer", "Paid late because the landlord was travelling and the transfer took two days to arrive"],
    ["Market vegetables", 12500, "Food", "02", "cash", "Kimironko market"],
    ["Moto to town", 2000, "Transport", "03", "mobile money", ""],
    ["Airtime top-up", 5000, "Airtime & Data", "04", "mobile money", ""],
    ["Lunch with colleagues", 8000, "Food", "06", "card", ""],
    ["Pharmacy", 6500, "Health", "08", "cash", "Malaria test and tablets"],
    ["Cinema tickets", 10000, "Entertainment", "10", "mobile money", ""],
    ["Online course", 25000, "Education", "12", "card", ""],
    ["Gift for a friend", 7000, "Uncategorized", "13", "cash", ""],
    ["Late taxi home", 1000, "Transport", "14", "cash", ""],
    ["Bread", 900, "Food", "14", "cash", ""],
    ["Water bill", 3400, "Rent", "15", "mobile money", ""],
    ["Supercalifragilisticexpialidocious_Supercalifragilistic", 1200, "Food", "15", "cash", ""],
    ["Books", 18000, "Education", "16", "card", ""],
  ];
  const made = [];
  for (const [title, amount, cat, day, paymentMethod, notes] of rows) {
    made.push(await Expense.create({ userId: user._id, title, amount, categoryId: cats[cat], date: `${month}-${day}`, paymentMethod, notes }));
    await new Promise((r) => setTimeout(r, 15));
  }
  await Expense.create({ userId: admin._id, title: "Admin lunch", amount: 4000, categoryId: longCat._id, date: `${month}-05`, paymentMethod: "cash" });
  await Budget.create({ userId: user._id, month, amount: 200000 });
  fs.writeFileSync(file, JSON.stringify({ tag, month, userToken: generateToken(user), adminToken: generateToken(admin), expenseId: String(made[0]._id) }));
  console.log("setup done:", rows.length, "expenses for the user, a budget, a long category name, and an admin");
} else {
  const { tag } = JSON.parse(fs.readFileSync(file, "utf8"));
  const short = tag.slice(-6);
  const users = await User.find({ email: new RegExp("^" + tag) });
  const ids = users.map((u) => u._id);
  const e = await Expense.deleteMany({ userId: { $in: ids } });
  const b = await Budget.deleteMany({ userId: { $in: ids } });
  const c = await Category.deleteMany({ name: new RegExp("^ZZ test " + short, "i") });
  const u = await User.deleteMany({ email: new RegExp("^" + tag) });
  console.log(`cleanup: ${u.deletedCount} test accounts, ${e.deletedCount} expenses, ${b.deletedCount} budgets, ${c.deletedCount} categories | accounts left: ${await User.countDocuments()} (not mine) | categories left: ${await Category.countDocuments()}`);
  fs.unlinkSync(file);
}
await mongoose.disconnect();
