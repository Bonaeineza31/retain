import jwt from "jsonwebtoken";

// makes the login token. it holds the user's id and role, and stops working after 7 days
export function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
