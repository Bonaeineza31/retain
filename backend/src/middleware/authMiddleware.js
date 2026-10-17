import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendError } from "../utils/responseHandler.js";

// lets a request through only if it has a valid login token
export async function protect(req, res, next) {
  // the token is sent in a header that looks like: Authorization: Bearer <token>
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return sendError(res, "Please sign in first", "UNAUTHORIZED", 401);
  }

  // check the token is real and has not expired
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return sendError(
      res,
      "Your session has expired. Please sign in again",
      "UNAUTHORIZED",
      401,
    );
  }

  try {
    // we look the user up again, so a deleted account or a changed role counts straight away
    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(
        res,
        "This account no longer exists",
        "UNAUTHORIZED",
        401,
      );
    }

    // the routes after this one can read who is asking from req.user
    req.user = user;
    next();
  } catch (error) {
    console.error("Checking the user failed:", error.message);
    sendError(res, "Something went wrong", "SERVER_ERROR", 500);
  }
}

// lets only admins through. always use it after protect
export function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return sendError(res, "Only admins can do this", "FORBIDDEN", 403);
  }
  next();
}
