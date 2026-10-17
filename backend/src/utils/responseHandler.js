// every good reply has the same shape: success, message, data and meta
export function sendSuccess(
  res,
  data = {},
  message = "Success",
  statusCode = 200,
) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: { timestamp: new Date().toISOString() },
  });
}

// every error reply has the same shape too
// code is a short name for the error. fields says what is wrong in each form field
export function sendError(
  res,
  message,
  code = "SERVER_ERROR",
  statusCode = 500,
  fields,
) {
  const error = { code, message };
  if (fields) {
    error.fields = fields;
  }

  res.status(statusCode).json({
    success: false,
    error,
    meta: { timestamp: new Date().toISOString() },
  });
}
