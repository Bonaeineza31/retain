// each check gives back a message when something is wrong, or null when it is fine

// checks the email looks right: one @, a proper domain and no spaces
export function validateEmail(value) {
  const email = String(value || "").trim();

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
  const password = String(value || "");

  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 64) return "Password must be 64 characters or fewer";
  if (/\s/.test(password)) return "Password cannot contain spaces";
  if (!/[A-Za-z]/.test(password)) return "Password needs at least one letter";
  if (!/\d/.test(password)) return "Password needs at least one number";
  return null;
}

// checks the name is made of letters and is not too short or long
export function validateName(value) {
  const name = String(value || "").trim();

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
  const name = String(value || "").trim();

  if (!name) return "Category name is required";
  if (name.length < 2) return "Category name must be at least 2 characters";
  if (name.length > 30) return "Category name must be 30 characters or fewer";
  return null;
}
