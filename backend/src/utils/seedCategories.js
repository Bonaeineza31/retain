import Category from "../models/Category.js";

// the first one is the main category. expenses move to it when their category is deleted
const names = [
  "Uncategorized",
  "Food",
  "Transport",
  "Rent",
  "Airtime & Data",
  "Health",
  "Entertainment",
  "Education",
];

// saves these categories, but only when there are none yet
export async function addStartingCategories() {
  const count = await Category.countDocuments();
  if (count > 0) {
    return;
  }

  for (const name of names) {
    await Category.create({ name, isDefault: name === "Uncategorized" });
  }
}
