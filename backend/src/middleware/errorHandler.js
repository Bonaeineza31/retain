import { sendError } from "../utils/responseHandler.js";

// the last stop for any error that nothing else handled
// it needs all four inputs, even next, so Express knows it is an error handler
export function errorHandler(error, req, res, next) {
  // a reply was already started, so we can only pass the error on
  if (res.headersSent) {
    return next(error);
  }

  // broken JSON in the request, like a typo in Postman
  if (error.type === "entity.parse.failed") {
    return sendError(
      res,
      "The request body is not valid JSON",
      "INVALID_JSON",
      400,
    );
  }

  // a request body that is too big
  if (error.type === "entity.too.large") {
    return sendError(
      res,
      "The request body is too large",
      "PAYLOAD_TOO_LARGE",
      413,
    );
  }

  // anything else: keep the details in the log, and tell the user nothing private
  console.error("Unexpected error:", error.message);
  sendError(res, "Something went wrong", "SERVER_ERROR", 500);
}
